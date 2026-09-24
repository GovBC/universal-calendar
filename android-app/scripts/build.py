#!/usr/bin/env python3
"""Build APK or AAB from local official Android SDK tools, without downloads."""
import argparse
import json
import shutil
import subprocess
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path


def run(*command):
    subprocess.run([str(part) for part in command], check=True)


p = argparse.ArgumentParser()
p.add_argument('--sdk', required=True)
p.add_argument('--format', choices=['apk', 'aab'], default='apk')
p.add_argument('--build-tools', default='36.0.0')
p.add_argument('--aapt2')
p.add_argument('--bundletool')
p.add_argument('--keystore')
p.add_argument('--password-file')
p.add_argument('--alias', default='calendar')
p.add_argument('--compiler-jar')
args = p.parse_args()
if args.keystore and not args.password_file:
    p.error('--password-file is required for signing')
if args.format == 'aab' and not args.bundletool:
    p.error('--bundletool is required for AAB builds')

root = Path(__file__).resolve().parents[1]
site = root.parent
out = root / 'build' / args.format
sdk = Path(args.sdk).resolve()
manifest = root / 'app/src/main/AndroidManifest.xml'
ns = '{http://schemas.android.com/apk/res/android}'
document = ET.parse(manifest).getroot()
sdk_spec = document.find('uses-sdk')
target = sdk_spec.attrib[ns + 'targetSdkVersion']
minimum = sdk_spec.attrib[ns + 'minSdkVersion']
version = document.attrib[ns + 'versionName']
tools = sdk / 'build-tools' / args.build_tools
android = sdk / 'platforms' / ('android-' + target) / 'android.jar'
aapt2 = Path(args.aapt2).resolve() if args.aapt2 else tools / 'aapt2'
required = [aapt2, tools / 'd8', android]
if args.format == 'apk':
    required += [tools / 'zipalign', tools / 'apksigner']
else:
    required.append(Path(args.bundletool).resolve())
for path in required:
    if not path.is_file():
        raise SystemExit('Required tool missing: ' + str(path))

if out.exists():
    shutil.rmtree(out)
for name in ['assets', 'generated', 'classes', 'dex']:
    (out / name).mkdir(parents=True)
shutil.copytree(site / 'dist', out / 'assets', dirs_exist_ok=True)
for file in (root / 'web').iterdir():
    shutil.copy2(file, out / 'assets' / file.name)
# Adapt only the packaged copy, and exclude the downloadable Android binary.
shutil.rmtree(out / 'assets/downloads', ignore_errors=True)
index = out / 'assets/index.html'
text = index.read_text()
text = text.replace('</head>', '<link rel="stylesheet" href="./android.css" />\n</head>')
marker = '<script src="./live-app.js"></script>'
if text.count(marker) != 1:
    raise SystemExit('Expected one live-app script to attach the native bridge')
text = text.replace(marker, '<script>CalendarCore.save("calendar.notifications",false);</script>\n'
                    + marker + '\n<script src="./android.js"></script>')
index.write_text(text)
live = out / 'assets/live-app.js'
text = live.read_text()
start = text.index('const swReady=')
end = text.index('\n', start)
text = text[:start] + 'const swReady=Promise.resolve(null);' + text[end:]
text = text.replace('function paintAlerts(){', 'function paintAlerts(){if(window.AndroidCalendar)return;')
text = text.replace('حُفظ التنبيه؛ يتطلب تشغيل التنبيهات وإبقاء التطبيق مفتوحًا', 'حُفظ إعداد التنبيه على الهاتف')
live.write_text(text)
(out / 'assets/sw.js').unlink(missing_ok=True)

run(aapt2, 'compile', '--dir', root / 'app/src/main/res', '-o', out / 'resources.zip')
link = [aapt2, 'link', '-o', out / 'resources.apk', '-I', android,
        '--manifest', manifest, '--java', out / 'generated', '-0', 'm4a',
        '-A', out / 'assets', out / 'resources.zip']
if args.format == 'aab':
    link.append('--proto-format')
run(*link)
sources = sorted((root / 'app/src/main/java').rglob('*.java'))
sources += sorted((out / 'generated').rglob('*.java'))
if args.compiler_jar:
    compiler = ['java', '-jar', Path(args.compiler_jar).resolve(), '-1.8']
else:
    compiler = ['java', '--module', 'jdk.compiler/com.sun.tools.javac.Main', '--release', '8']
run(*compiler, '-encoding', 'UTF-8', '-classpath', android, '-d', out / 'classes', *sources)
run(tools / 'd8', '--release', '--min-api', minimum, '--lib', android,
    '--output', out / 'dex', *sorted((out / 'classes').rglob('*.class')))

if args.format == 'aab':
    base = out / 'base.zip'
    with zipfile.ZipFile(out / 'resources.apk') as resources, \
            zipfile.ZipFile(base, 'w', compression=zipfile.ZIP_DEFLATED) as module:
        if 'resources.pb' not in resources.namelist():
            raise SystemExit('AAB resources must be in protobuf format')
        for name in resources.namelist():
            if name == 'AndroidManifest.xml':
                module.writestr('manifest/AndroidManifest.xml', resources.read(name))
            elif name == 'resources.pb' or name.startswith(('res/', 'assets/', 'lib/')):
                module.writestr(name, resources.read(name))
        for dex in sorted((out / 'dex').glob('*.dex')):
            module.write(dex, 'dex/' + dex.name)
    # Android openFd requires uncompressed audio in Google-generated APKs.
    config = out / 'BundleConfig.json'
    config.write_text(json.dumps({'compression': {'uncompressedGlob': ['**.m4a']}}))
    bundletool = Path(args.bundletool).resolve()
    unsigned = out / 'unsigned.aab'
    run('java', '-jar', bundletool, 'build-bundle', '--modules=' + str(base),
        '--output=' + str(unsigned), '--config=' + str(config))
    result = unsigned
    if args.keystore:
        result = out / ('universal-calendar-play-' + version + '.aab')
        run('java', '--module', 'jdk.jartool/sun.security.tools.jarsigner.Main',
            '-keystore', Path(args.keystore).resolve(), '-storepass:file',
            Path(args.password_file).resolve(), '-sigalg', 'SHA256withRSA',
            '-digestalg', 'SHA-256', '-signedjar', result, unsigned, args.alias)
        run('java', '--module', 'jdk.jartool/sun.security.tools.jarsigner.Main',
            '-verify', result)
    run('java', '-jar', bundletool, 'validate', '--bundle=' + str(result))
else:
    shutil.copy2(out / 'resources.apk', out / 'unaligned.apk')
    with zipfile.ZipFile(out / 'unaligned.apk', 'a', compression=zipfile.ZIP_DEFLATED) as apk:
        for file in sorted((out / 'dex').glob('*.dex')):
            apk.write(file, file.name)
    run(tools / 'zipalign', '-f', '4', out / 'unaligned.apk', out / 'unsigned.apk')
    result = out / 'unsigned.apk'
    if args.keystore:
        result = out / 'universal-calendar-android.apk'
        run(tools / 'apksigner', 'sign', '--ks', Path(args.keystore).resolve(),
            '--ks-key-alias', args.alias, '--ks-pass', 'file:' + str(Path(args.password_file).resolve()),
            '--out', result, out / 'unsigned.apk')
        run(tools / 'apksigner', 'verify', '--verbose', result)
print(result)
