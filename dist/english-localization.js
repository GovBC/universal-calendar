/* English localization strings for the Today and Calendar pages plus shared language controls. */
(() => {
  'use strict';

  const messages = {en: Object.create(null)};
  const exact = Object.create(null);
  const terms = Object.create(null);
  const splitRow = row => row.split(/\t|\\t/);
  const add = rows => rows.trim().split('\n').forEach(row => {
    const [key, ar, en] = splitRow(row);
    if (!key || !ar || !en) return;
    messages.en[key.trim()] = en.trim();
    exact[ar.trim()] = en.trim();
  });
  const addTerms = rows => rows.trim().split('\n').forEach(row => {
    const [source, target] = splitRow(row);
    if (source && target) terms[source.trim()] = target.trim();
  });

  add(`
today.document.title\tالتقويم العالمي الشامل\tUniversal Comprehensive Calendar
today.document.description\tتقويمات ومواقيت صلاة ومواضع أجرام محسوبة حسب موقعك، مع استكشاف السماء والمتابعات.\tCalendars, prayer times, and celestial positions calculated for your location, with sky exploration and follow-ups.
today.header.default_date\tالجمعة، ٤ سبتمبر ٢٠٢٦\tFriday, September 4, 2026
today.header.evening\tمساء الخير\tGood evening
today.header.welcome\tأهلًا بك\tWelcome
today.header.hour\tساعة\tHour
today.header.font_size\tحجم الخط\tFont size
today.header.language\tاللغة\tLanguage
today.header.download\tتنزيل التطبيق\tDownload app
today.header.download_aria\tتنزيل تطبيق التقويم العالمي الشامل لأندرويد\tDownload the Universal Comprehensive Calendar app for Android
today.header.android\tأندرويد\tAndroid
today.header.location\tمكة المكرمة\tMakkah
today.header.change_location\tتغيير الموقع\tChange location
today.header.change_theme\tتغيير لون الخلفية\tChange background color
today.header.device_settings\tإعدادات الجهاز\tDevice settings
today.header.night_mode\tالوضع الليلي مفعّل؛ التبديل إلى الوضع الصباحي\tNight mode is on; switch to day mode
today.header.day_mode\tالوضع الصباحي مفعّل؛ التبديل إلى الوضع الليلي\tDay mode is on; switch to night mode
today.header.switch_day\tالتبديل إلى الوضع الصباحي\tSwitch to day mode
today.header.switch_night\tالتبديل إلى الوضع الليلي\tSwitch to night mode
today.header.banner\tحسابات فلكية حسب الموقع • التواريخ الهجرية حسابية وتخضع للإعلان الرسمي\tLocation-based astronomical calculations • Hijri dates are calculated and subject to official announcement
today.date.hijri_lunar\tالهجري القمري • أم القرى\tLunar Hijri • Umm al-Qura
today.date.hijri_solar\tالهجري الشمسي\tSolar Hijri
today.date.gregorian\tالميلادي\tGregorian
today.date.persian_calendar\tالتقويم الفارسي الشمسي\tPersian solar calendar
today.date.alternate_choice\tاختيار التقويم المعروض بدل الهجري الشمسي في صفحة اليوم\tChoose the calendar shown instead of Solar Hijri on the Today page
today.date.open_calendar\tفتح التقويم\tOpen calendar
today.date.rabi_awwal\tربيع الأول\tRabi al-Awwal
today.date.hijri_suffix\tهـ\tAH
today.date.sample_persian\t١٣ شهريور ١٤٠٥\t13 Shahrivar 1405
today.date.sample_persian_year\tسال ۱۴۰۵ هجری خورشیدی\tSolar Hijri year 1405
today.date.sample_gregorian\t٤ سبتمبر ٢٠٢٦\tSeptember 4, 2026
today.sky.now\tالسماء الآن\tSky now
today.sky.western_horizon\tالأفق الغربي\tWestern horizon
today.sky.full_view\tالمشهد الكامل ↗\tFull view ↗
today.sky.north\tشمال\tNorth
today.sky.east\tشرق\tEast
today.sky.south\tجنوب\tSouth
today.sky.west\tغرب\tWest
today.sky.sun\tالشمس\tSun
today.sky.moon\tالقمر\tMoon
today.sky.calculating\tجارٍ الحساب…\tCalculating…
today.sky.live_horizon\tأفق حي محسوب من الموقع والوقت الحاليين\tLive horizon calculated from the current location and time
today.sky.live_altitudes\tارتفاع الشمس والقمر الآن\tCurrent Sun and Moon altitude
today.prayer.next\tالصلاة التالية\tNext prayer
today.prayer.after\tبعد\tAfter
today.prayer.fajr\tالفجر\tFajr
today.prayer.sunrise\tالشروق\tSunrise
today.prayer.dhuhr\tالظهر\tDhuhr
today.prayer.asr\tالعصر\tAsr
today.prayer.maghrib\tالمغرب\tMaghrib
today.prayer.isha\tالعشاء\tIsha
today.prayer.times_label\tأوقات الصلاة المحسوبة\tCalculated prayer times
today.prayer.method\tطريقة الحساب: أم القرى\tCalculation method: Umm al-Qura
today.prayer.method_zubarah\tروزنامة الزبارة والبحرين\tAl Zubarah and Bahrain Calendar
today.prayer.method_zubarah_summary\tروزنامة الزبارة والبحرين • فجر وعشاء ١٨° • توقيت البحرين الرسمي\tAl Zubarah and Bahrain Calendar • Fajr and Isha 18° • Official Bahrain time
today.prayer.alerts\tالتنبيهات والسنن\tAlerts and Sunnah prayers
today.prayer.verify_sun\tتحقق بموضع الشمس\tVerify with the Sun position
today.prayer.no_time\tلا وقت متاح\tNo time available
today.moon.heading\tالقمر والهلال\tMoon and crescent
today.moon.visibility\tفرصة الرؤية الليلة\tTonight's visibility chance
today.moon.difficult\tممكن بصعوبة\tPossible with difficulty
today.moon.score\tمن ١٠٠\tout of 100
today.moon.lag\tالمكث\tLag time
today.moon.elongation\tالاستطالة\tElongation
today.moon.age\tعمر القمر\tMoon age
today.moon.details\tافتح محاكاة الأفق والتفاصيل ←\tOpen horizon simulation and details ←
today.moon.tonight\tحالة القمر الليلة\tMoon status tonight
today.moon.open_details\tافتح تفاصيل الرؤية\tOpen visibility details
today.moon.illumination\tإضاءة ٪\tIllumination %
today.moon.no_lag\tلا مكث بعد الغروب\tNo lag after sunset
today.moon.no_sunset\tلا يوجد غروب للشمس في هذا اليوم المحلي\tNo sunset occurs on this local day
today.moon.no_sunset_reason\tقد تكون الشمس فوق الأفق أو تحته طوال اليوم في العروض العالية؛ لا يُطبّق معيار الهلال المسائي.\tAt high latitudes the Sun may stay above or below the horizon all day; the evening crescent criterion does not apply.
today.moon.waning\tالقمر متناقص؛ ليس هلالًا مسائيًا متزايدًا\tThe Moon is waning; it is not a waxing evening crescent
today.moon.waning_reason\tتتبّع موضعه خلال اليوم أو قبل شروق الشمس. معيار عودة هنا مخصص للهلال المسائي.\tTrack its position during the day or before sunrise. The Odeh criterion here is for the evening crescent.
today.moon.below_horizon\tالقمر تحت الأفق عند غروب الشمس\tThe Moon is below the horizon at sunset
today.moon.no_evening_window\tلا تتوفر فترة رصد مسائية بعد غروب الشمس.\tNo evening observation window is available after sunset.
today.moon.no_set_24h\tلا يغرب القمر خلال ٢٤ ساعة بعد غروب الشمس\tThe Moon does not set within 24 hours after sunset
today.moon.no_finite_lag\tلا يتوفر مكث محدود لحساب وقت تقييم الهلال في هذا الموقع.\tNo finite lag time is available to calculate the crescent evaluation time at this location.
today.moon.too_wide\tالقمر تجاوز نطاق الهلال الرفيع في هذا الراصد\tThe Moon has passed the thin crescent range for this observer
today.moon.too_wide_reason\tيقتصر تطبيق معيار الهلال هنا على أول ٣٠° من زاوية الطور المتزايد؛ استخدم الارتفاع والطور لتتبّع القمر في بقية الشهر.\tThe crescent criterion here applies only to the first 30° of waxing phase angle; use altitude and phase to track the Moon for the rest of the month.
today.moon.unsuitable_window\tلا تتوفر فترة مناسبة لتطبيق معيار الهلال هنا\tNo suitable window is available to apply the crescent criterion here
today.moon.unsuitable_reason\tالمكث خارج نطاق الرصد المسائي القصير المعتمد في هذه الواجهة.\tThe lag time is outside the short evening observation range used in this interface.
today.moon.zone_a\tمتوقّع بالعين المجردة وفق معيار عودة\tExpected to be visible to the naked eye under the Odeh criterion
today.moon.zone_b\tمتوقّع بأداة بصرية؛ وقد يُرى بالعين\tExpected with optical aid; may be visible to the eye
today.moon.zone_c\tمتوقّع بأداة بصرية فقط وفق المعيار\tExpected only with optical aid under the criterion
today.moon.zone_d\tغير متوقّع حتى بأداة بصرية وفق المعيار\tNot expected even with optical aid under the criterion
today.moon.estimate_note\tتقدير حسابي يتأثر بصفاء الجو وخبرة الراصد؛ الطقس غير متصل بهذا الحساب.\tA calculated estimate affected by sky clarity and observer experience; weather is not connected to this calculation.
today.assistant.kicker\tالمساعد العلمي\tScientific assistant
today.assistant.title\tاسأل السماء\tAsk the sky
today.assistant.description\tيمكنني شرح النتيجة وتحريك الزمن والمشهد أثناء الإجابة.\tI can explain the result and move time and the scene while answering.
today.assistant.local_description\tإجابات محلية عن الموعد والتاريخ وموضع القمر، من الحسابات المعروضة.\tLocal answers about time, date, and Moon position from the displayed calculations.
today.assistant.where_moon\tأين يظهر القمر؟\tWhere does the Moon appear?
today.assistant.check_noon\tتحقق من وقت الظهر\tCheck Dhuhr time
today.assistant.question_label\tاكتب سؤالك\tWrite your question
today.assistant.placeholder\tمثال: لماذا يصعب رؤية الهلال؟\tExample: Why is the crescent hard to see?
today.assistant.send\tإرسال السؤال\tSend question
today.language.interface\tواجهة التطبيق\tApp interface
today.language.title\tاختيار اللغة\tChoose language
today.language.description\tاختر لغة الواجهة. سيُحفظ اختيارك على هذا الجهاز.\tChoose the interface language. Your choice will be saved on this device.
today.language.group\tلغات الواجهة\tInterface languages
today.language.arabic\tالعربية\tArabic
today.language.arabic_direction\tالعربية • من اليمين إلى اليسار\tArabic • right to left
today.language.note\tيمكنك تغيير اللغة في أي وقت من الزر العلوي.\tYou can change the language anytime from the top button.
today.common.close\tإغلاق\tClose
today.common.minute\tدقيقة\tminute
today.common.hour\tساعة\thour
today.common.selected_location\tحسب الموقع المحدد\tbased on the selected location
today.common.no_event\tلا يحدث في هذا اليوم\tDoes not occur on this day
calendar.document.title\tمحول التقويمات — التقويم العالمي الشامل\tCalendar Converter — Universal Comprehensive Calendar
calendar.document.description\tحوّل التاريخ بين أهم التقاويم الحية، واستعرض المواسم السمكية والزراعية حسب الموقع.\tConvert dates among major living calendars, and view fishing and agriculture seasons by location.
calendar.intro.kicker\tأهم التقاويم الحيّة في عرض واحد\tMajor living calendars in one view
calendar.intro.title\tمحول التقويمات\tCalendar Converter
calendar.intro.description\tاختر تاريخًا لترى مقابله في التقاويم الأوسع استعمالًا، مع فصل التقاويم المدنية عن الدينية والثقافية.\tChoose a date to see its equivalent in widely used calendars, with civil calendars separated from religious and cultural ones.
calendar.intro.settings\tإعدادات التقويم\tCalendar settings
calendar.intro.today_preference_button\tتقويم صفحة اليوم\tToday page calendar
calendar.today.preference_kicker\tصفحة اليوم\tToday page
calendar.today.preference_title\tالتقويم البديل في بطاقة اليوم\tAlternate calendar in the Today card
calendar.today.preference_description\tاختر من تقاويم هذه الصفحة ما يظهر بدل الهجري الشمسي.\tChoose which calendar from this page appears instead of Solar Hijri.
calendar.today.preference_label\tالتقويم المعروض\tDisplayed calendar
calendar.today.preference_aria\tاختيار التقويم المعروض في بطاقة صفحة اليوم\tChoose the calendar displayed in the Today page card
calendar.today.preference_badge\tمعروض في صفحة اليوم\tShown on Today page
calendar.tabs.label\tتبويبات صفحة التقويم\tCalendar page tabs
calendar.tabs.dates\tالتقاويم والتاريخ\tCalendars and date
calendar.tabs.fishing\tالتقويم السمكي\tFishing calendar
calendar.tabs.agriculture\tالتقويم الزراعي\tAgriculture calendar
calendar.tabs.honey\tتقويم العسل\tHoney calendar
calendar.tabs.hunting\tتقويم الصيد\tHunting calendar
calendar.honey.kicker\tمرعى النحل على مدار العام\tYear-round bee forage
calendar.honey.title\tأفضل مواسم مصادر العسل\tBest seasons for honey sources
calendar.honey.description\tتقويم إرشادي يفرّق بين رحيق الورود والنباتات المزهرة، وأزهار الأشجار، والندوة العسلية، ويتغير بحسب الموقع والنطاق البيئي.\tAn indicative calendar distinguishing flowering plants, tree blossom, and honeydew, adjusted by location and ecological zone.
calendar.honey.location\tالموقع المستخدم\tLocation used
calendar.honey.zone\tالنطاق البيئي\tEcological zone
calendar.honey.auto\tتلقائي حسب الموقع\tAutomatic by location
calendar.honey.category\tمصدر العسل\tHoney source
calendar.honey.all\tجميع المصادر\tAll sources
calendar.honey.flow\tقوة المرعى الإرشادية\tIndicative forage strength
calendar.honey.flow_map\tخريطة تدفق المرعى السنوي\tAnnual forage flow map
calendar.honey.sources\tأفضل المصادر في النطاق المختار\tBest sources in the selected zone
calendar.honey.flower\tالورود والنباتات المزهرة\tFlowers and flowering plants
calendar.honey.tree\tأزهار الأشجار\tTree blossom
calendar.honey.honeydew\tالندوة العسلية\tHoneydew
calendar.honey.peak\tذروة\tPeak
calendar.honey.flow_state\tتدفق\tFlow
calendar.honey.conditional\tفرصة مشروطة\tConditional chance
calendar.honey.quiet\tهدوء\tQuiet
calendar.honey.read\tكيف تقرأ التقويم؟\tHow to read the calendar
calendar.honey.not_flowering\tالندوة العسلية ليست إزهارًا\tHoneydew is not blossom
calendar.date.hijri_lunar\tالهجري القمري\tLunar Hijri
calendar.date.rabi_awwal\tربيع الأول ١٤٤٨\tRabi al-Awwal 1448
calendar.date.umalqura\tأم القرى\tUmm al-Qura
calendar.date.hijri_solar\tالهجري الشمسي\tSolar Hijri
calendar.date.shahrivar\tشهريور ١٤٠٥\tShahrivar 1405
calendar.date.solar\tشمسي\tSolar
calendar.date.gregorian\tالميلادي\tGregorian
calendar.date.september_2026\tسبتمبر ٢٠٢٦\tSeptember 2026
calendar.date.gregorian_label\tغريغوري\tGregorian
calendar.converter.kicker\tتحويل سريع\tQuick conversion
calendar.converter.title\tأدخل التاريخ\tEnter date
calendar.converter.source\tالتقويم المصدر\tSource calendar
calendar.converter.hijri_umalqura\tالهجري القمري — أم القرى\tLunar Hijri — Umm al-Qura
calendar.converter.persian\tالهجري الشمسي الفارسي\tPersian Solar Hijri
calendar.converter.hebrew\tالعبري\tHebrew
calendar.converter.indian\tالهندي الوطني — ساكا\tIndian National — Saka
calendar.converter.ethiopic\tالإثيوبي\tEthiopic
calendar.converter.coptic\tالقبطي\tCoptic
calendar.converter.buddhist\tالبوذي التايلندي\tThai Buddhist
calendar.converter.day\tاليوم\tDay
calendar.converter.month\tالشهر\tMonth
calendar.converter.year\tالسنة\tYear
calendar.converter.convert\tتحويل التاريخ\tConvert date
calendar.converter.updated_below\tحُدّثت جميع التقاويم أدناه\tAll calendars below were updated
calendar.converter.updated_selected\tحُدّثت جميع التقاويم للتاريخ المختار\tAll calendars were updated for the selected date
calendar.nav.prev\t→ الشهر السابق\t→ Previous month
calendar.nav.jump\tانتقل إلى تاريخ\tGo to a date
calendar.nav.today\tاليوم\tToday
calendar.nav.next\tالشهر التالي ←\tNext month ←
calendar.nav.range_error\tالعرض المشترك يبدأ من ١٩ يوليو ٦٢٢ لأن التقاويم الهجرية لم تبدأ قبل ذلك.\tThe shared view starts on July 19, 622 because the Hijri calendars had not started before then.
calendar.equivalents.kicker\tالتاريخ نفسه عبر العالم\tThe same date around the world
calendar.equivalents.title\tأهم التقاويم الحيّة\tMajor living calendars
calendar.equivalents.hint\tتُحدّث البطاقات عند اختيار أي تاريخ.\tCards update when any date is selected.
calendar.equivalents.count\t١٤ تقويمًا\t14 calendars
calendar.equivalents.note\tيبدأ اليوم عند الغروب في بعض التقاويم الدينية؛ لذلك قد يتغير التاريخ مساءً قبل منتصف الليل. التقويم الصيني والبهائي والبيزنطي معروضة هنا بحسب اليوم المدني المختار.\tIn some religious calendars the day begins at sunset, so the date may change in the evening before midnight. The Chinese, Baha'i, and Byzantine calendars are shown here according to the selected civil day.
calendar.equivalents.matching\tالموافق\tCorresponding to
calendar.equivalents.cards_change\tتتغير جميع البطاقات مع التاريخ المختار.\tAll cards change with the selected date.
calendar.equivalents.region_global\tعالمي\tGlobal
calendar.equivalents.region_islamic\tالسعودية والعالم الإسلامي\tSaudi Arabia and the Islamic world
calendar.equivalents.region_persian\tإيران وأفغانستان\tIran and Afghanistan
calendar.equivalents.region_hebrew\tاليهود وإسرائيل\tJews and Israel
calendar.equivalents.region_chinese\tالصين وشرق آسيا\tChina and East Asia
calendar.equivalents.region_india\tالهند\tIndia
calendar.equivalents.region_ethiopia\tإثيوبيا وإريتريا\tEthiopia and Eritrea
calendar.equivalents.region_coptic\tالكنيسة القبطية\tCoptic Church
calendar.equivalents.region_thailand\tتايلند\tThailand
calendar.equivalents.region_japan\tاليابان\tJapan
calendar.equivalents.region_taiwan\tتايوان\tTaiwan
calendar.equivalents.region_orthodox\tكنائس أرثوذكسية\tOrthodox churches
calendar.equivalents.region_athos\tجبل آثوس وتقليد أرثوذكسي\tMount Athos and Orthodox tradition
calendar.equivalents.region_bahai\tالبهائيون عالميًا\tBaha'is worldwide
calendar.equivalents.kind_solar\tشمسي\tSolar
calendar.equivalents.kind_lunar\tقمري\tLunar
calendar.equivalents.kind_astronomical_solar\tشمسي فلكي\tAstronomical solar
calendar.equivalents.kind_lunisolar\tقمري شمسي\tLunisolar
calendar.equivalents.kind_imperial_solar\tشمسي إمبراطوري\tImperial solar
calendar.equivalents.kind_republic_solar\tشمسي جمهوري\tRepublican solar
calendar.equivalents.kind_julian\tيولياني\tJulian
calendar.equivalents.name_chinese\tالصيني التقليدي\tTraditional Chinese
calendar.equivalents.name_japanese\tالعصر الياباني\tJapanese era
calendar.equivalents.name_roc\tمينغوو\tMinguo
calendar.equivalents.name_julian\tاليولياني\tJulian
calendar.equivalents.name_byzantine\tالبيزنطي منذ خلق العالم\tByzantine since Creation
calendar.equivalents.name_bahai\tالبهائي — البديع\tBaha'i — Badí'
calendar.equivalents.origin_gregorian\tالحقبة الميلادية • إصلاح ١٥٨٢م\tCommon Era • 1582 reform
calendar.equivalents.origin_hijri\tالهجرة النبوية • تقويم أم القرى\tProphetic Hijra • Umm al-Qura calendar
calendar.equivalents.origin_persian\tالهجرة النبوية • يبدأ بالنوروز\tProphetic Hijra • begins at Nowruz
calendar.equivalents.origin_hebrew\tخلق العالم بحسب الحساب العبري\tCreation of the world according to Hebrew reckoning
calendar.equivalents.origin_chinese\tأشهر قمرية • دورة ستينية\tLunar months • sexagenary cycle
calendar.equivalents.origin_indian\tحقبة ساكا • ٧٨م\tSaka era • 78 CE
calendar.equivalents.origin_ethiopic\t١٣ شهرًا • الحقبة الإثيوبية\t13 months • Ethiopic era
calendar.equivalents.origin_coptic\tعصر الشهداء • ٢٨٤م\tEra of the Martyrs • 284 CE
calendar.equivalents.origin_buddhist\tالحقبة البوذية التايلندية\tThai Buddhist era
calendar.equivalents.origin_japanese\tترقيم السنوات بحسب عهد الإمبراطور\tYears numbered by the emperor's reign
calendar.equivalents.origin_roc\tتأسيس جمهورية الصين • ١٩١٢م\tFounding of the Republic of China • 1912 CE
calendar.equivalents.origin_julian\tإصلاح يوليوس قيصر • ٤٥ق.م\tJulius Caesar's reform • 45 BCE
calendar.equivalents.origin_byzantine\tخلق العالم تقليديًا • ٥٥٠٩ق.م\tTraditional Creation of the world • 5509 BCE
calendar.equivalents.origin_bahai\tإعلان الباب • ١٨٤٤م\tDeclaration of the Bab • 1844 CE
calendar.fishing.kicker\tرزنامة موسمية للصيد\tSeasonal fishing calendar
calendar.fishing.title\tأفضل مواسم صيد الأسماك والربيان\tBest seasons for fish and shrimp
calendar.fishing.summary\tمواسم إرشادية تتغير مع البحر والموقع ودرجة حرارة الماء.\tIndicative seasons that change with the sea, location, and water temperature.
calendar.fishing.region\tالمنطقة البحرية\tMarine region
calendar.fishing.red_sea\tالبحر الأحمر\tRed Sea
calendar.fishing.arabian_gulf\tالخليج العربي\tArabian Gulf
calendar.fishing.arabian_sea\tبحر العرب وخليج عُمان\tArabian Sea and Gulf of Oman
calendar.fishing.mediterranean\tالبحر المتوسط\tMediterranean Sea
calendar.fishing.global\tعرض عام عالمي\tGlobal overview
calendar.fishing.type\tنوع الصيد\tFishing type
calendar.fishing.all\tالأسماك والربيان\tFish and shrimp
calendar.fishing.fish_only\tالأسماك فقط\tFish only
calendar.fishing.shrimp_only\tالربيان فقط\tShrimp only
calendar.fishing.current_month\tالشهر الحالي في موقعك\tCurrent month at your location
calendar.fishing.loading\tجارٍ تحديد الموسم…\tFinding season…
calendar.fishing.activity_index\tمؤشر النشاط الاسترشادي\tIndicative activity index
calendar.fishing.year_kicker\tمن يناير إلى ديسمبر\tJanuary to December
calendar.fishing.year_title\tخريطة الموسم السنوي\tAnnual season map
calendar.fishing.year_description\tالألوان تقارن النشاط المحتمل داخل المنطقة المختارة، ولا تعني السماح القانوني بالصيد.\tColors compare potential activity within the selected region and do not mean fishing is legally permitted.
calendar.fishing.legend_label\tدليل ألوان المواسم\tSeason color guide
calendar.fishing.peak\tذروة\tPeak
calendar.fishing.good\tجيد\tGood
calendar.fishing.fair\tمتوسط\tModerate
calendar.fishing.low\tأقل نشاطًا\tLower activity
calendar.fishing.targets\tالأهداف الشائعة\tCommon targets
calendar.fishing.best_by_type\tأفضل المواسم بحسب النوع\tBest seasons by type
calendar.fishing.before_sea\tقبل الخروج للبحر\tBefore going to sea
calendar.fishing.check_rules\tتحقق من الظروف واللوائح\tCheck conditions and regulations
calendar.fishing.guidance_weather\tاتبع نشرة الطقس والرياح وحالة الموج والمد والجزر.\tFollow weather, wind, wave, and tide bulletins.
calendar.fishing.guidance_rules\tتحقق من المقاسات والأدوات والمناطق المحمية قبل الصيد.\tCheck sizes, gear, and protected areas before fishing.
calendar.fishing.guidance_species\tتزداد فرص الصيد عادة مع نشاط النوع واعتدال الرياح، لا مع الشهر وحده.\tFishing opportunities usually improve with species activity and moderate winds, not with the month alone.
calendar.fishing.important\tمهم\tImportant
calendar.fishing.regulation_note\tفترات السماح والمنع الرسمية مقدَّمة على هذا التقويم الإرشادي.\tOfficial permission and closure periods override this indicative calendar.
calendar.fishing.source_agency\tمراجعة تعليمات وكالة الثروة السمكية ↗\tReview Fisheries Agency instructions ↗
calendar.fishing.method_summary\tكيف أُعدَّت المواسم؟\tHow were the seasons prepared?
calendar.fishing.method_text\tيجمع العرض بين أنماط موسمية إرشادية للهجرة والتغذية وتكاثر الأنواع واعتدال البحر. لا يقدّم توقعًا يوميًا ولا بديلًا عن قرار الجهة المنظمة أو بيانات المصيد المحلية؛ فالنوع نفسه قد يختلف موسمه بين خليج وآخر وبين ساحل وآخر.\tThis view combines indicative seasonal patterns for migration, feeding, reproduction, and calmer seas. It is not a daily forecast and does not replace regulator decisions or local catch data; the same species may vary between gulfs and coasts.
calendar.fishing.source_shrimp\tإعلان وزارة البيئة عن موسم الربيان في المنطقة الشرقية ↗\tEnvironment Ministry announcement for Eastern Province shrimp season ↗
calendar.fishing.source_saudi_fao\tمراجعة منظمة الأغذية والزراعة لمصايد السعودية ↗\tFAO review of Saudi fisheries ↗
calendar.fishing.source_gulf_fao\tورشة منظمة الأغذية والزراعة عن مصايد الخليج ↗\tFAO workshop on Gulf fisheries ↗
calendar.fishing.no_data\tلا بيانات\tNo data
calendar.fishing.now\tالآن\tNow
calendar.fishing.no_peak_month\tلا ذروة واضحة في هذا الشهر\tNo clear peak this month
calendar.fishing.no_peak_selected\tلا تظهر ذروة واضحة في هذا الشهر ضمن المجموعة المختارة؛ قد يظل الصيد ممكنًا بحسب الموقع والظروف اليومية.\tNo clear peak appears this month within the selected group; fishing may still be possible depending on location and daily conditions.
calendar.fishing.species_count\tأنواع إرشادية\tindicative species
calendar.fishing.fish\tأسماك\tFish
calendar.fishing.shrimp\tربيان\tShrimp
calendar.agriculture.kicker\tالتقويم الزراعي العالمي\tGlobal agriculture calendar
calendar.agriculture.title\tأفضل مواسم الفاكهة والخضراوات\tBest seasons for fruits and vegetables
calendar.agriculture.description\tنوافذ إرشادية للزراعة والحصاد تتغير بحسب موقعك ومناخك، وتبقى التربة والصنف والري عوامل حاسمة.\tIndicative planting and harvest windows that change with your location and climate; soil, variety, and irrigation remain decisive.
calendar.agriculture.location_used\tالموقع المستخدم\tLocation used
calendar.agriculture.hot_arid\tمناخ حار جاف\tHot arid climate
calendar.agriculture.group\tالمجموعة\tGroup
calendar.agriculture.fruits_vegetables\tالفاكهة والخضراوات\tFruits and vegetables
calendar.agriculture.fruit\tالفاكهة\tFruit
calendar.agriculture.vegetables\tالخضراوات\tVegetables
calendar.agriculture.crop\tالمحصول\tCrop
calendar.agriculture.all_crops\tكل المحاصيل\tAll crops
calendar.agriculture.selected_month\tالشهر المحدد في التقويم\tSelected month in the calendar
calendar.agriculture.month_help\tاختر شهرًا من المخطط لرؤية النوافذ المناسبة له.\tChoose a month from the chart to see suitable windows.
calendar.agriculture.calculating\tجارٍ حساب الموسم\tCalculating season
calendar.agriculture.estimate\tتقدير إرشادي للموقع الحالي\tIndicative estimate for the current location
calendar.agriculture.planting_now\tالزراعة الآن\tPlanting now
calendar.agriculture.harvest_now\tالحصاد الآن\tHarvest now
calendar.agriculture.peak_supply\tذروة التوفر\tPeak availability
calendar.agriculture.water_care\tالماء والعناية\tWater and care
calendar.agriculture.choose_crop\tاختر محصولًا\tChoose a crop
calendar.agriculture.year_path\tالمسار السنوي\tAnnual path
calendar.agriculture.when_season\tمتى يبدأ الموسم؟\tWhen does the season start?
calendar.agriculture.path_label\tزراعة • حصاد • ذروة\tPlanting • Harvest • Peak
calendar.agriculture.months_label\tأشهر التقويم الزراعي\tAgriculture calendar months
calendar.agriculture.planting\tزراعة\tPlanting
calendar.agriculture.harvest\tحصاد\tHarvest
calendar.agriculture.outside\tخارج النافذة\tOutside the window
calendar.agriculture.best_season\tأفضل المحاصيل لهذا الموسم\tBest crops for this season
calendar.agriculture.best_crops\tالمحاصيل الأفضل في هذا الموسم\tBest crops in this season
calendar.agriculture.best_description\tهذه المحاصيل هي الأفضل في الموسم الحالي وفق موقعك ومناخك؛ لأنها في الذروة أو الحصاد أو نافذة الزراعة.\tThese crops are best for the current season based on your location and climate because they are at peak, harvest, or planting window.
calendar.agriculture.crop_database\tقاعدة المحاصيل\tCrop database
calendar.agriculture.crops_by_season\tالفاكهة والخضراوات حسب الموسم\tFruits and vegetables by season
calendar.agriculture.note\tهذه نوافذ مناخية إرشادية وليست موعدًا ملزمًا. داخل المنطقة الواحدة قد يتغير الموعد بسبب الارتفاع، موجات الحر والبرد، البيوت المحمية، نوع الصنف، التربة، توفر الماء والأمراض؛ راجع مرشدًا زراعيًا محليًا قبل القرارات التجارية أو الكبيرة.\tThese are indicative climate windows, not binding dates. Within one region, timing may change because of elevation, heat and cold waves, greenhouses, variety, soil, water availability, and disease; consult a local agricultural advisor before commercial or major decisions.
calendar.agriculture.warm\tمناخ دافئ\tWarm climate
calendar.agriculture.temperate\tمناخ معتدل\tTemperate climate
calendar.agriculture.tropical\tمناخ مداري\tTropical climate
calendar.agriculture.cool\tمناخ بارد\tCool climate
calendar.agriculture.changes_location\tيتغير مع الموقع المحدد\tChanges with the selected location
calendar.agriculture.no_planting\tلا توجد نافذة مفضلة\tNo preferred window
calendar.agriculture.no_harvest\tلا يوجد حصاد مفضل\tNo preferred harvest
calendar.agriculture.no_peak\tلا توجد ذروة واضحة\tNo clear peak
calendar.agriculture.choose_detail\tاختر محصولًا للتفصيل\tChoose a crop for details
calendar.agriculture.peak_season\tذروة الموسم\tPeak season
calendar.agriculture.harvest_season\tموسم الحصاد\tHarvest season
calendar.agriculture.planting_window\tنافذة الزراعة\tPlanting window
calendar.agriculture.outside_preferred\tخارج النافذة المفضلة\tOutside the preferred window
calendar.agriculture.transition_month\tشهر انتقالي\tTransitional month
calendar.agriculture.priority_note\tتظهر المحاصيل الأسبق في الذروة ثم الحصاد ثم الزراعة.\tCrops are ordered by peak first, then harvest, then planting.
calendar.agriculture.choose_other\tاختر شهرًا آخر أو محصولًا مختلفًا لرؤية نافذة أوضح.\tChoose another month or crop to see a clearer window.
calendar.agriculture.no_clear_window\tلا توجد نافذة مفضلة واضحة لهذا الشهر في هذا النطاق المناخي.\tNo clear preferred window for this month in this climate range.
calendar.agriculture.details_section\tيعرض هذا القسم نافذة الزراعة والحصاد والذروة للمحصول المحدد.\tThis section shows the planting, harvest, and peak windows for the selected crop.
calendar.agriculture.planting_label\tالزراعة:\tPlanting:
calendar.agriculture.harvest_label\tالحصاد:\tHarvest:
calendar.agriculture.peak_label\tالذروة:\tPeak:
calendar.agriculture.crops_word\tمحاصيل\tcrops
  `);

  addTerms(`
مكة المكرمة\tMakkah
موقعي الحالي\tMy current location
جدة\tJeddah
المدينة المنورة\tMadinah
الرياض\tRiyadh
الطائف\tTaif
الدمام\tDammam
أبها\tAbha
تبوك\tTabuk
مسقط\tMuscat
الدوحة\tDoha
القاهرة\tCairo
لندن\tLondon
نيويورك\tNew York
جاكرتا\tJakarta
سيدني\tSydney
دقيقة\tminute
ساعة\thour
درجة\tdegree
إضاءة\tillumination
يناير\tJanuary
فبراير\tFebruary
مارس\tMarch
أبريل\tApril
مايو\tMay
يونيو\tJune
يوليو\tJuly
أغسطس\tAugust
سبتمبر\tSeptember
أكتوبر\tOctober
نوفمبر\tNovember
ديسمبر\tDecember
محرم\tMuharram
صفر\tSafar
ربيع الأول\tRabi al-Awwal
ربيع الآخر\tRabi al-Thani
جمادى الأولى\tJumada al-Awwal
جمادى الآخرة\tJumada al-Thani
رجب\tRajab
شعبان\tSha'ban
رمضان\tRamadan
شوال\tShawwal
ذو القعدة\tDhu al-Qa'dah
ذو الحجة\tDhu al-Hijjah
شهريور\tShahrivar
فروردين\tFarvardin
أرديبهشت\tOrdibehesht
خرداد\tKhordad
تير\tTir
مرداد\tMordad
مهر\tMehr
آبان\tAban
آذر\tAzar
دي\tDey
بهمن\tBahman
إسفند\tEsfand
تشايترا\tChaitra
فايشاخا\tVaisakha
جيايشثا\tJyeshtha
آشادا\tAshadha
شرافانا\tShravana
بهادرا\tBhadra
أشفينا\tAshvina
كارتيكا\tKartika
أغراهايانا\tAgrahayana
باوشا\tPausha
ماغا\tMagha
فالغونا\tPhalguna
مسكرم\tMeskerem
تيكمت\tTikimt
هدار\tHidar
تحساس\tTahsas
طير\tTir
يكاتيت\tYekatit
مجابيت\tMegabit
ميازيا\tMiyazya
جينبوت\tGinbot
سيني\tSene
حملي\tHamle
نهسي\tNehase
باغومن\tPagume
توت\tTout
بابه\tBaba
هاتور\tHator
كيهك\tKiahk
طوبه\tToba
أمشير\tMeshir
برمهات\tParemhat
برموده\tParmouti
بشنس\tPashons
بؤونه\tPaoni
أبيب\tEpip
مسرى\tMesori
النسيء\tPi Kogi Enavot
أيلول\tElul
تشري\tTishrei
حشفان\tCheshvan
كسلو\tKislev
طيفت\tTevet
شباط\tShevat
أدار\tAdar
نيسان\tNisan
أيار\tIyar
سيوان\tSivan
تموز\tTammuz
آب\tAv
عبري\tHebrew
بوذية\tBuddhist
مينغوو\tMinguo
منذ خلق العالم\tsince Creation
ب.إ\tB.E.
اليوم\tday
من أيام الهاء\tof Ayyam-i-Ha
البهاء\tBaha
الجلال\tJalal
الجمال\tJamal
العظمة\tAzamat
النور\tNur
الرحمة\tRahmat
الكلمات\tKalimat
الكمال\tKamal
الأسماء\tAsma
العزة\tIzzat
المشيئة\tMashiyyat
العلم\tIlm
القدرة\tQudrat
القول\tQawl
المسائل\tMasa'il
الشرف\tSharaf
السلطان\tSultan
المُلك\tMulk
العلاء\tAla
الفأر\tRat
الثور\tOx
النمر\tTiger
الأرنب\tRabbit
التنين\tDragon
الأفعى\tSnake
الحصان\tHorse
الماعز\tGoat
القرد\tMonkey
الديك\tRooster
الكلب\tDog
الخنزير\tPig
الخشب\tWood
النار\tFire
التراب\tEarth
المعدن\tMetal
الماء\tWater
الشهر الكبيس\tleap month
اختيار التقويم المعروض بدل الهجري الشمسي في صفحة اليوم\tChoose the calendar shown instead of Solar Hijri on the Today page
سنة\tYear
عنصر\telement
الخشبي\tWood
الناري\tFire
الترابي\tEarth
المعدني\tMetal
المائي\tWater
الهجري القمري\tLunar Hijri
الهجري الشمسي\tSolar Hijri
التقويم الفارسي الشمسي\tPersian solar calendar
التقويم المصدر\tSource calendar
التاريخ المختار\tselected date
الحقبة الميلادية\tCommon Era
إصلاح\treform
الهجرة النبوية\tProphetic Hijra
تقويم أم القرى\tUmm al-Qura calendar
يبدأ بالنوروز\tbegins at Nowruz
خلق العالم بحسب الحساب العبري\tCreation of the world according to Hebrew reckoning
أشهر قمرية\tlunar months
دورة ستينية\tsexagenary cycle
حقبة ساكا\tSaka era
الحقبة الإثيوبية\tEthiopic era
عصر الشهداء\tEra of the Martyrs
الحقبة البوذية التايلندية\tThai Buddhist era
ترقيم السنوات بحسب عهد الإمبراطور\tyears numbered by the emperor's reign
تأسيس جمهورية الصين\tfounding of the Republic of China
إصلاح يوليوس قيصر\tJulius Caesar's reform
خلق العالم تقليديًا\ttraditional Creation of the world
إعلان الباب\tDeclaration of the Bab
الفراولة\tstrawberry
البطيخ\twatermelon
الشمام\tcantaloupe
العنب\tgrapes
الحمضيات\tcitrus
التمور\tdates
الرمان\tpomegranate
المانجو\tmango
التين\tfig
الموز\tbanana
الطماطم\ttomato
الخيار\tcucumber
الفلفل\tpepper
الباذنجان\teggplant
الكوسا\tzucchini
البامية\tokra
الخس والورقيات\tlettuce and leafy greens
الجزر\tcarrot
البطاطس\tpotato
البصل والثوم\tonion and garlic
القرنبيط والبروكلي\tcauliflower and broccoli
فاكهة\tfruit
خضراوات\tvegetables
محاصيل\tcrops
ري منتظم\tregular irrigation
صرف ممتاز\texcellent drainage
شمس كاملة\tfull sun
ري عميق متباعد\tdeep spaced irrigation
لا تُغرق الجذور\tdo not waterlog the roots
تقليم جيد\tgood pruning
تهوية حول العناقيد\tairflow around clusters
حماية من الصقيع\tfrost protection
شمس قوية\tstrong sun
تلقيح وخفّ مناسب\tproper pollination and thinning
تقليل الرطوبة وقت النضج\treduce humidity during ripening
حرارة دافئة\twarm temperature
صرف جيد\tgood drainage
تهوية وتقليل البلل\tairflow and reduced wetness
حرارة ورطوبة\twarmth and humidity
ري وتصريف متوازنان\tbalanced watering and drainage
دعم وتهوية\tsupport and airflow
قطف متكرر\tfrequent picking
دفء معتدل\tmoderate warmth
تغذية متوازنة\tbalanced feeding
حصاد مستمر\tcontinuous harvest
قطف صغير متكرر\tfrequent small picking
قطف يومي أو شبه يومي\tdaily or near-daily picking
جو بارد نسبيًا\trelatively cool weather
ري خفيف متقارب\tlight frequent watering
تربة مفككة\tloose soil
إزالة الحجارة\tremove stones
تربة جيدة الصرف\twell-drained soil
تجنب الغمر\tavoid waterlogging
ري منتظم ثم تجفيف قبل التخزين\tregular irrigation, then drying before storage
جو بارد\tcool weather
تغذية منتظمة\tregular feeding
تنجح في الجو المعتدل وتحتاج حماية من الحر الشديد.\tSucceeds in mild weather and needs protection from severe heat.
يحتاج موسمًا دافئًا طويلًا ومساحة جيدة للامتداد.\tNeeds a long warm season and good room to spread.
تتشابه نافذته مع البطيخ ويُفضّل حصاده قبل اشتداد الرطوبة.\tIts window is similar to watermelon and it is best harvested before humidity intensifies.
يحتاج شتاءً معتدلًا وصيفًا مشمسًا لجودة السكر والنضج.\tNeeds a mild winter and sunny summer for sugar quality and ripening.
تشمل البرتقال والليمون واليوسفي، وتختلف الذروة بحسب النوع.\tIncludes oranges, lemons, and mandarins; the peak varies by type.
المحصول التجاري يمر بمراحل الخلال والرطب والتمر قبل الحصاد الكامل.\tThe commercial crop passes through khalal, rutab, and tamr stages before full harvest.
تتحسن الجودة مع صيف دافئ وفترة نضج جافة نسبيًا.\tQuality improves with a warm summer and relatively dry ripening period.
محصول دافئ؛ قد تتقدم مواعيده أو تتأخر بحسب الصنف والارتفاع.\tA warm-season crop; timing may move earlier or later by variety and elevation.
ينضج على دفعات؛ راقب الثمار سريعًا لأن نافذة الجودة قصيرة.\tRipens in waves; monitor fruit quickly because the quality window is short.
يمكن أن يعطي على مدار العام في المناطق المناسبة أو داخل بيئة محمية.\tCan produce year-round in suitable regions or protected environments.
في المناطق الحارة يُفضّل تجنب ذروة القيظ في الزراعة المكشوفة.\tIn hot regions, avoid the peak heat period in open-field planting.
سريع النمو ويعطي أفضل جودة مع انتظام الري والقطف.\tFast-growing and gives best quality with regular watering and picking.
تتأثر العقد بالحر الشديد؛ البيوت المحمية توسع نافذة الإنتاج.\tFruit set is affected by severe heat; greenhouses expand the production window.
يحتاج دفئًا مستقرًا؛ راقب الآفات مع ارتفاع الرطوبة.\tNeeds stable warmth; watch pests as humidity rises.
تفضّل الجو المعتدل وتزداد الجودة بالقطف المبكر.\tPrefers mild weather and improves with early picking.
تتحمل الحر أكثر من محاصيل كثيرة، لكنها تتوقف مع البرد.\tTolerates heat more than many crops, but stops in cold weather.
تشمل الخس والجرجير والسبانخ والكزبرة بحسب الصنف والمنطقة.\tMay include lettuce, arugula, spinach, and coriander depending on variety and region.
جودة الجذر تتحسن في الجو المعتدل والتربة العميقة جيدة الصرف.\tRoot quality improves in mild weather and deep well-drained soil.
تختلف نافذته بين العروة الربيعية والخريفية بحسب المناخ.\tIts window varies between spring and autumn seasons by climate.
تحتاج فترة نمو ثم جفافًا نسبيًا عند اكتمال النضج والتخزين.\tNeeds a growth period followed by relative dryness at full maturity and storage.
أفضلها في الموسم البارد، وقد تتأثر الرؤوس بالحرارة العالية.\tBest in the cool season; heads may be affected by high heat.
البحر الأحمر\tRed Sea
الخليج العربي\tArabian Gulf
بحر العرب وخليج عُمان\tArabian Sea and Gulf of Oman
البحر المتوسط\tMediterranean Sea
عرض عام عالمي\tGlobal overview
مناسب لسواحل المملكة الغربية واليمن ومصر والسودان، مع اختلاف واضح بين الساحل المفتوح والخلجان والشعاب.\tSuitable for the western Saudi coast, Yemen, Egypt, and Sudan, with clear differences between open coast, bays, and reefs.
في السعودية تتغير فترات السماح والمنع والمقاسات والأدوات بقرارات رسمية؛ لا تُعد هذه الخريطة تصريحًا بالصيد، وخصوصًا في مواسم حماية الربيان والأنواع المتكاثرة.\tIn Saudi Arabia, permission and closure periods, sizes, and gear change by official decisions; this map is not a fishing permit, especially during shrimp and breeding-species protection seasons.
تعليمات وكالة الثروة السمكية السعودية\tSaudi Fisheries Agency instructions
مناسب لسواحل المنطقة الشرقية ودول الخليج، حيث تتغير الفرص مع حرارة المياه والرياح الشمالية ومواسم الربيان.\tSuitable for the Eastern Province coast and Gulf countries, where opportunities change with water temperature, northern winds, and shrimp seasons.
أعلنت الجهات السعودية في أعوام سابقة مواسم موسمية للربيان، كما فُرضت فترات حماية لبعض الأسماك مثل الكنعد؛ راجع القرار المنشور للسنة والموقع قبل الخروج.\tSaudi authorities have announced seasonal shrimp seasons in past years, and protection periods have been imposed for some fish such as kingfish; check the published decision for the year and location before going out.
إعلان وزارة البيئة عن موسم الربيان في المنطقة الشرقية\tEnvironment Ministry announcement for Eastern Province shrimp season
مواسم واسعة تتأثر بالرياح الموسمية والتيارات، وتختلف بين خليج عُمان وسواحل بحر العرب المفتوحة.\tBroad seasons affected by monsoon winds and currents, differing between the Gulf of Oman and open Arabian Sea coasts.
تُحدَّد الرخص وفترات المنع والمعدات المسموحة محليًا في كل دولة وساحل؛ استخدم هذا العرض للمقارنة الموسمية فقط.\tLicenses, closure periods, and permitted equipment are set locally in each country and coast; use this view only for seasonal comparison.
مرجع إقليمي لمنظمة الأغذية والزراعة\tFAO regional reference
عرض عام لسواحل المتوسط؛ يلزم اختيار الدولة والخلجان المحلية للحصول على جدول أدق ومحدث قانونيًا.\tGeneral view for Mediterranean coasts; choose the country and local bays for a more accurate legally updated table.
تختلف فترات المنع والمقاسات ومناطق الحماية بين دول المتوسط؛ راجع الجهة البحرية المحلية قبل أي رحلة صيد.\tClosure periods, sizes, and protected areas vary between Mediterranean countries; check the local marine authority before any fishing trip.
إحصاءات ومراجع مصايد منظمة الأغذية والزراعة\tFAO fisheries statistics and references
نمط مقارن عام للمواسم البحرية؛ لا يحدد نوعًا أو بلدًا بعينه، ولذلك لا يغني عن بيانات الساحل المحلي.\tGeneral comparative pattern for marine seasons; it does not identify a specific species or country, so it does not replace local coast data.
الأنظمة والمواسم الرسمية محلية. استخدم هذا العرض لفهم فكرة الموسم فقط، ثم راجع الجهة المختصة في بلدك.\tRegulations and official seasons are local. Use this view only to understand the idea of seasonality, then check the competent authority in your country.
مراجع المصايد العالمية — منظمة الأغذية والزراعة\tGlobal fisheries references — FAO
الأسماك الشعابية\treef fish
الأسماك السطحية المهاجرة\tmigratory pelagic fish
الحبار والأسماك الساحلية\tsquid and coastal fish
الربيان الساحلي\tcoastal shrimp
الكنعد والأسماك السطحية\tkingfish and pelagic fish
الهامور والشعري\thammour and shaari
الصافي والبدح والأسماك الساحلية\tsafi, badah, and coastal fish
الربيان\tshrimp
الكنعد والتونة الساحلية\tkingfish and coastal tuna
أسماك الشعاب والقاع\treef and bottom fish
الحبار\tsquid
الدنيس والقاروص\tsea bream and sea bass
السردين والماكريل\tsardines and mackerel
أسماك سطحية مهاجرة\tmigratory pelagic fish
أسماك قاعية وشعابية\tbottom and reef fish
هامور\thammour
شعري\tshaari
أسماك القاع\tbottom fish
كنعد\tkingfish
تونة ساحلية\tcoastal tuna
أنواع مهاجرة\tmigratory species
حبار\tsquid
باراكودا\tbarracuda
أسماك شاطئية\tshore fish
ربيان البحر الأحمر\tRed Sea shrimp
ربيان الخليج العربي\tArabian Gulf shrimp
صافي\tsafi
أسماك ضحلة\tshallow-water fish
أنواع ساحلية\tcoastal species
مصايد الربيان الساحلية\tcoastal shrimp fisheries
أنواع شعابية\treef species
حبار وأصناف قريبة\tsquid and related types
أسماك ساحلية وقاعية\tcoastal and bottom fish
أسماك سطحية أسرابية\tschooling pelagic fish
ربيان ساحلي\tcoastal shrimp
حبار وأصناف رأسيات الأرجل\tsquid and cephalopods
أنواع أسرابية واسعة الانتشار\twidely distributed schooling species
أنواع قاعية وساحلية\tbottom and coastal species
أنواع ربيان ساحلية\tcoastal shrimp species
رأسيات الأرجل\tcephalopods
تزداد الفرص الإرشادية مع اعتدال حرارة الماء واستقرار البحر حول الشعاب.\tIndicative opportunities increase with moderate water temperature and stable seas around reefs.
تتأثر بالتيارات والحرارة وتجمعات الطُعم أكثر من تأثرها بالشهر وحده.\tAffected more by currents, temperature, and bait concentrations than by the month alone.
قد تتحسن الفرص عند الفجر والغروب وفي المياه الهادئة نسبيًا.\tOpportunities may improve at dawn and sunset and in relatively calm waters.
الموسم الإرشادي مرتبط بدورة الربيان، لكن تاريخ الفتح والمنع الرسمي يتغير بحسب القرار الساري.\tThe indicative season follows the shrimp cycle, but official opening and closure dates change by the current decision.
تظهر الذروة الإرشادية بعد بداية الموسم المفتوح عادةً، لكن التواريخ القانونية سنوية.\tThe indicative peak usually appears after the open season begins, but legal dates are annual.
تتحسن الفرص مع مرور الأسراب واستقرار الرياح والتيارات.\tOpportunities improve as schools pass and winds and currents stabilize.
المياه الأبرد نسبيًا تساعد على نشاط الصيد في كثير من المواقع.\tRelatively cooler water helps fishing activity in many locations.
تختلف الفرص كثيرًا بحسب عمق الموقع والقاع والمد والجزر.\tOpportunities vary greatly by site depth, bottom, and tides.
يميل النشاط الإرشادي إلى الخريف في بعض سواحل خليج عُمان، مع اختلاف الموقع واللوائح.\tIndicative activity tends toward autumn on some Gulf of Oman coasts, with differences by location and rules.
التيارات الموسمية وتجمعات الطُعم من أهم محددات النجاح.\tSeasonal currents and bait concentrations are among the most important success factors.
تتحسن الفرص عادةً مع البحر الأهدأ واعتدال الحرارة.\tOpportunities usually improve with calmer seas and moderate temperatures.
الفجر والليل والمد والجزر قد تغير النتيجة اليومية بصورة كبيرة.\tDawn, night, and tides can greatly change the daily result.
الربيع والخريف يقدمان نافذتين إرشاديتين شائعتين، مع اختلاف السواحل.\tSpring and autumn provide two common indicative windows, with coastal differences.
تتبع الأسراب حرارة الماء وتوفر الغذاء والتيارات.\tSchools follow water temperature, food availability, and currents.
يتغير موسم الذروة باختلاف الحوض والعمق والحماية المحلية.\tPeak season changes by basin, depth, and local protection.
يُراعى الصيد المسؤول أثناء فترات التكاثر ومناطق الحضانة.\tResponsible fishing should be observed during breeding periods and nursery areas.
الهجرة مرتبطة بالتيارات والحرارة والغذاء.\tMigration is linked to currents, temperature, and food.
العمق، القاع، حرارة الماء والطقس عوامل حاسمة.\tDepth, bottom, water temperature, and weather are decisive factors.
الموسم القانوني ودورة التكاثر يختلفان بين المصايد.\tThe legal season and reproduction cycle vary between fisheries.
تؤثر الإضاءة والمد والجزر والعمق في النشاط اليومي.\tLight, tides, and depth affect daily activity.
  `);

  window.EnglishLocalization = {messages, exact: {en: exact}, terms: {en: terms}};
})();
