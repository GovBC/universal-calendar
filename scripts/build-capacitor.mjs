import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { build } from 'esbuild';

const root = resolve(import.meta.dirname, '..');
const source = join(root, 'dist');
const output = join(root, '.capacitor-web');
if (!existsSync(join(source, 'index.html'))) throw new Error('The published site is missing dist/index.html');

// The published PWA is authoritative. Only the native copy receives a bridge;
// building the mobile apps never changes the files deployed at universalcalendar.org.
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
cpSync(source, output, { recursive: true });

const indexPath = join(output, 'index.html');
let index = readFileSync(indexPath, 'utf8');
const marker = '<script src="./live-app.js"></script>';
if (index.split(marker).length !== 2) throw new Error('Unable to locate the site bootstrap in dist/index.html');
index = index.replace(marker, '<script src="./native-bridge.js"></script>\n    ' + marker);
writeFileSync(indexPath, index);
cpSync(join(root, 'native', 'adhan_alert.wav'), join(output, 'adhan_alert.wav'));

const livePath = join(output, 'live-app.js');
let live = readFileSync(livePath, 'utf8');
const replaceOnce = (before, after) => {
  if (live.split(before).length !== 2) throw new Error(`Native adaptation marker changed: ${before}`);
  live = live.replace(before, after);
};
replaceOnce(
  "const swReady='serviceWorker' in navigator?navigator.serviceWorker.register('./sw.js?build=dates-countries-20260911-1').catch(()=>null):Promise.resolve(null);",
  'const swReady=Promise.resolve(null);'
);
replaceOnce('if(enabled)for(const e of scheduled)', 'if(enabled&&!window.CalendarNative)for(const e of scheduled)');
replaceOnce("function paintAlerts(){enabled=enabled&&typeof Notification!=='undefined'", "function paintAlerts(){enabled=C.read('calendar.notifications',false)&&typeof Notification!=='undefined'");
replaceOnce("window.addEventListener('pageshow',()=>{paintAlerts();refresh();tick();});", "window.addEventListener('pageshow',()=>{paintAlerts();refresh();tick();});window.addEventListener('calendar-native-permission',paintAlerts);");
live = live.replaceAll('navigator.geolocation', 'window.CalendarNative.geolocation');
live = live.replace('التنبيهات أثناء فتح التطبيق', 'تنبيهات الجهاز');
live = live.replace('أثناء فتح التطبيق فقط', 'تنبيهات الجهاز بعد السماح بها');
live = live.replace('يتطلب تشغيل التنبيهات وإبقاء التطبيق مفتوحًا', 'يعمل بتنبيهات الجهاز بعد السماح بها');
live = live.replace('فعّل تنبيهات الويب الخلفية لتصل إشعارات الصلوات والسنن حتى بعد إغلاق صفحة الموقع. قد يؤخرها اتصال الهاتف أو توفير البطارية، أما تطبيق أندرويد فيستخدم منبه النظام المحلي.', 'فعّل تنبيهات الجهاز المحلية لتصل المواعيد بعد إغلاق التطبيق. تُجدَّد المواعيد عند فتح التطبيق، وقد تؤثر إعدادات توفير الطاقة في وقت وصولها.');
live = live.replace('سيحفظ الموقع مواعيدك القادمة في Supabase لهذا الجهاز والموقع الحالي.', 'سيحفظ الجهاز المواعيد القادمة محليًا لهذا الموقع.');
live = live.replace('أعد التفعيل بعد تغيير الموقع أو إعدادات التنبيه أو انتهاء المدة.', 'افتح التطبيق دوريًا لتجديد المواعيد، وبعد تغيير الموقع أو إعدادات التنبيه.');
live = live.replace('جارٍ حفظ مواعيد الشهر القادم في خدمة التنبيهات…', 'جارٍ حفظ المواعيد القادمة على الجهاز…');
const download = 'function download(blob,name){';
if (live.split(download).length !== 2) throw new Error('Unable to locate calendar export in live-app.js');
live = live.replace(download, download + 'if(window.CalendarNative){window.CalendarNative.shareFile(blob,name).catch(error=>showToast(error.message||"تعذّر حفظ الملف"));return;}');
writeFileSync(livePath, live);

await build({
  entryPoints: [join(root, 'native', 'bridge.js')],
  outfile: join(output, 'native-bridge.js'),
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: 'es2022',
  legalComments: 'none'
});
console.log('Prepared the unchanged site with a native bridge in .capacitor-web/');
