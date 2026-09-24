# التقويم العالمي الشامل — Android 1.6.0

نسخة أندرويد قابلة للتثبيت، مبنية من ملفات التطبيق الحالي في `../dist` مع غلاف Android WebView ومكوّن أصلي لمنبّه الهاتف. لا تعتمد على Capacitor أو خدمة Push خارجية. تبقى نسخة الموقع مستقلة؛ تُطبق تهيئة أندرويد أثناء النسخ إلى مجلد البناء فقط.

## الاستخدام

1. ثبّت ملف APK على Android 8 أو أحدث، مع إصدار حديث من Android System WebView.
2. افتح إعدادات الموقع وحدد موقعك أو اسمح بتحديد GPS. أذونات الكاميرا والموقع تُطلب عند استخدام الوظيفة.
3. من «تنبيهات العبادات» فعّل المنبّه، ثم افتح «إعداد المنبّه» واسمح بإشعارات التطبيق وبالمنبّهات والتذكيرات الدقيقة.
4. اضغط «اختبار بعد دقيقة»، أغلق التطبيق واقفل الشاشة. راجع صوت قناة «منبّه الصلوات والعبادات» ومستوى صوت المنبّه إذا ظهر الإشعار بلا صوت.

تحفظ النسخة 366 يومًا من المواعيد المحسوبة، مع تجديدها عند فتح التطبيق، وتذكير قبل انتهاء المخزون بأسبوع. بعد السفر أو تغيير إعدادات الحساب افتح التطبيق لتحديث الموقع والمواعيد. المنبّه لا يحتاج الإنترنت؛ الأخبار والروابط والخدمات الخارجية تحتاجه. الإيقاف الإجباري من إعدادات النظام يوقف التنبيهات حتى فتح التطبيق من جديد. قد تحتاج بعض الهواتف إلى استثناء التطبيق من تقييد الخلفية. الصوت نغمة نظام، وليس أذانًا كاملًا.

إعدادات نسخة الويب لا تُنقل تلقائيًا إلى تطبيق أندرويد. لا يجمع التطبيق الموقع في الخلفية. يمكن تغيير بيانات الموقع يدويًا واستخدام الحسابات محليًا.

## البنية

- `MainActivity`: يعرض الملفات المضمّنة من أصل HTTPS محلي، ويطلب أذونات الموقع والكاميرا والتنبيهات، ويحفظ الملفات عبر منتقي مستندات أندرويد.
- لا يُحمّل الجسر الأصلي مواقع خارجية: الروابط الخارجية تُفتح خارج التطبيق، والصفحات الفرعية وملفات الإضافات غير المضمّنة محظورة بسياسة المحتوى.
- `AlarmStore`: يحفظ جدول المواعيد في تخزين التطبيق، ويجدول التنبيه التالي فقط باستخدام `AlarmManager.setAlarmClock` مع أذونات صريحة. يجمع التنبيهات المتزامنة ويمنع إعادة إطلاق التنبيه المسلّم.
- `AlarmReceiver`: يعرض إشعار النظام ويجدول الموعد التالي دون واجهة ويب نشطة.
- `RestoreReceiver`: يعيد جدولة الموعد بعد بدء تشغيل الجهاز أو تحديث الحزمة أو تغيير الساعة/المنطقة الزمنية أو منح إذن المنبّه.
- `web/android.js`: يستخدم نفس `CalendarCore` و`PrayerAlerts` وAstronomy Engine لمواقيت الصلاة والسنن والكسوف والخسوف، ويوقف مؤقّت إشعارات المتصفح في نسخة APK لتجنب الازدواج.
- `AlarmSoundService.java`: يشغّل صوتًا افتراضيًا مختلفًا لكل صلاة أو الملف المسجل والمختار من تبويب «الأصوات»، مع زر لإيقاف الصوت من الإشعار.

الهوية: `com.mohammadalmuhanna.universalcalendar`. الإصدار: 1.6.0 (11). الحد الأدنى API 26، والهدف/البناء API 36. التطبيق غير مفعّل للتصحيح، والنسخ الاحتياطي للنظام معطّل. مفتاح التوقيع الخاص غير موجود في Git؛ يجب الاحتفاظ بنسخته الخاصة لاستخدامها في التحديثات.

## البناء

المتطلبات: Python 3 وJDK 17، وAndroid SDK Platform 36 وBuild Tools 36.0.0. يمكن بدلاً من مترجم JDK استخدام Eclipse ECJ مع JRE 17 عبر `--compiler-jar`.

```sh
python3 scripts/build.py --sdk /path/to/android-sdk --keystore /private/calendar-release.jks --password-file /private/password.txt
```

من جذر مستودع التطبيق، تكون أداة البناء `android-app/scripts/build.py`. تستخدم الأداة `aapt2` ومترجم Java (أو ECJ) و`d8` و`zipalign` و`apksigner`، ولا تُنزّل شيئًا من الشبكة. بدون معاملات التوقيع تنتج `build/apk/unsigned.apk`. لا تنشر الحزمة غير الموقعة.

## تحقق سابق لنسخة APK وحدوده

- نجح تجميع موارد أندرويد والكود الأصلي إلى DEX.
- تحقق توقيع APK بتنسيقي v2 وv3، وصحة معرّف الحزمة والأذونات ونسخة SDK.
- نجحت اختبارات جدول السنة ومطابقة الفجر والوتر للحسابات الحالية، وإيقاف المجموعات، وتفادي التنبيه المبكر/المكرر/القديم.
- لم تُثبّت الحزمة على هاتف أو محاكي في هذه البيئة؛ لا يُعد نجاح البناء تأكيدًا لتجربة الواجهة أو استلام التنبيهات على جهاز فعلي. يلزم اختبار قفل الشاشة، وإعادة التشغيل، وإيقاف الإنترنت، وإلغاء الإذن وإعادته، وتغيير الموقع، والكاميرا، وحفظ الملفات قبل إصدار عام في المتجر.

الاختبارات من جذر المستودع:

```sh
node --test android-app/tests/native-schedule.test.cjs tests/worship.test.cjs
javac -d android-app/build/test-classes android-app/app/src/main/java/com/mohammadalmuhanna/universalcalendar/AlarmQueue.java android-app/tests/AlarmQueueTest.java
java -cp android-app/build/test-classes AlarmQueueTest
```

مراجع التنفيذ: https://developer.android.com/develop/background-work/services/alarms و https://developer.android.com/privacy-and-security/risks/insecure-webview-native-bridges و https://developer.android.com/tools/apksigner .

## Google Play — 1.6.0 (11)

معرّف المتجر: `com.mohammadalmuhanna.universalcalendar`. هذه هوية مستقلة عن APK السابق؛ لا تنتقل إعداداته المحلية تلقائيًا. يدعم زر الرجوع واجهة OnBackInvoked على Android 13 فأحدث.

لبناء AAB، استعمل AAPT2 من Google Maven وBundletool الرسميين:

```sh
python3 android-app/scripts/build.py --format aab \
  --sdk /path/to/android-sdk \
  --aapt2 /path/to/maven/aapt2 \
  --bundletool /path/to/bundletool.jar \
  --keystore /private/universal-calendar-upload.p12 \
  --password-file /private/upload-password.txt \
  --alias calendar-upload
```

النتيجة: `android-app/build/aab/universal-calendar-play-1.6.0.aab`. الأداة تبني موارد protobuf وحزمة base، وتوقّع AAB عبر jarsigner ثم تتحقق منها بـbundletool. ملفات الأذان m4a مضبوطة لتبقى بلا ضغط في حزم Google Play حتى يعمل AssetManager.openFd.

يجب حفظ مفتاح الرفع وكلمة مروره خارج Git، وعدم وضعهما في التطبيق أو الموقع. يُرفع AAB إلى مسار الاختبار الداخلي، ويُفعّل Play App Signing بالمفتاح الذي تديره Google. لا ينشئ هذا المسار APK للنشر ولا يبدّل تنزيل APK الموجود في الموقع.

فحوص هذا البناء: توقيع AAB وبنيته، المعرّف والإصدار وSDK، واختبارات جدولة التنبيهات. لم يُختبر على هاتف أو محاكي؛ يلزم اختبار الرجوع والأذان والشاشة المقفلة والأذونات من مسار Google Play الداخلي.

```sh
ANDROID_BUILD_FORMAT=aab node --test android-app/tests/native-schedule.test.cjs tests/worship.test.cjs
```
