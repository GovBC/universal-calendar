/* Localization controller scoped to the Today and Calendar pages. */
(() => {
  'use strict';

  const STORAGE_KEY = 'calendar.language';
  const supported = new Set(['ar', 'ml', 'en']);
  const catalog = globalThis.TodayLocalization || {messages:{ar:{}, ml:{}}, exact:{}, terms:{}};
  const englishCatalog = globalThis.EnglishLocalization || {messages:{}, exact:{}, terms:{}};
  const messages = Object.assign({ar:{}, ml:{}, en:{}}, catalog.messages || {});
  messages.en = englishCatalog.messages?.en || messages.en || {};
  const exactMaps = {
    ml: catalog.exact?.ml || catalog.exact || Object.create(null),
    en: englishCatalog.exact?.en || englishCatalog.exact || Object.create(null)
  };
  const termMaps = {
    ml: catalog.terms?.ml || catalog.terms || Object.create(null),
    en: englishCatalog.terms?.en || englishCatalog.terms || Object.create(null)
  };

  const localizable = /[\u0621-\u063a\u0641-\u064a\u066e-\u066f\u0671-\u06d3\u06fa-\u06ff٠-٩۰-۹٪٫]/;
  const arabicWords = /[\u0621-\u063a\u0641-\u065f\u066e-\u066f\u0671-\u06d3\u06fa-\u06ff]+/g;
  const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  const sourceText = new WeakMap();
  const sourceAttributes = new WeakMap();

  const transliteration = {
    'ا':'അ','أ':'അ','إ':'ഇ','آ':'ആ','ٱ':'അ','ب':'ബ','ت':'ത','ث':'ഥ','ج':'ജ','ح':'ഹ','خ':'ഖ',
    'د':'ദ','ذ':'ദ്','ر':'റ','ز':'സ്','س':'സ','ش':'ഷ','ص':'സ','ض':'ദ','ط':'ത','ظ':'ദ','ع':'അ',
    'غ':'ഗ','ف':'ഫ','ق':'ഖ','ك':'ക','ک':'ക','ل':'ല','م':'മ','ن':'ന','ه':'ഹ','ة':'ത്','و':'വ',
    'ؤ':'വ','ي':'യ','ی':'യ','ى':'അ','ئ':'യ','ء':'','پ':'പ','چ':'ച','ژ':'ഴ','گ':'ഗ','ڤ':'വ'
  };
  const latinTransliteration = {
    'ا':'a','أ':'a','إ':'i','آ':'aa','ٱ':'a','ب':'b','ت':'t','ث':'th','ج':'j','ح':'h','خ':'kh',
    'د':'d','ذ':'dh','ر':'r','ز':'z','س':'s','ش':'sh','ص':'s','ض':'d','ط':'t','ظ':'z','ع':'a',
    'غ':'gh','ف':'f','ق':'q','ك':'k','ک':'k','ل':'l','م':'m','ن':'n','ه':'h','ة':'a','و':'w',
    'ؤ':'w','ي':'y','ی':'y','ى':'a','ئ':'y','ء':'','پ':'p','چ':'ch','ژ':'zh','گ':'g','ڤ':'v'
  };

  const normalizeNumerals = value => String(value)
    .replace(/[٠-٩]/g, digit => String(arabicDigits.indexOf(digit)))
    .replace(/[۰-۹]/g, digit => String(persianDigits.indexOf(digit)))
    .replace(/٪/g, '%')
    .replace(/٫/g, '.');

  const bareWord = value => value.replace(/[\u0640\u064b-\u065f\u0670]/g, '');
  const mapForLanguage = language => language === 'en' ? latinTransliteration : transliteration;
  const exactFor = language => exactMaps[language] || Object.create(null);
  const termsFor = language => termMaps[language] || Object.create(null);
  const transliterateWord = (word, language) => {
    const map = mapForLanguage(language);
    return [...bareWord(word)].map(letter => map[letter] ?? letter).join('');
  };
  const translateWord = (word, language) => {
    const terms = termsFor(language);
    if (terms[word]) return terms[word];
    const bare = bareWord(word);
    if (terms[bare]) return terms[bare];
    if (bare.length > 4 && bare.startsWith('ال') && terms[bare.slice(2)]) return terms[bare.slice(2)];
    return transliterateWord(bare, language);
  };

  const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const phraseCache = new Map();
  const phrasePatterns = language => {
    if (!phraseCache.has(language)) {
      phraseCache.set(language, Object.entries(Object.assign(Object.create(null), exactFor(language), termsFor(language)))
        .filter(([source]) => /\s/.test(source))
        .sort(([a], [b]) => b.length - a.length)
        .map(([source, target]) => [new RegExp(escapeRegExp(source), 'g'), target]));
    }
    return phraseCache.get(language);
  };
  const renderFor = (renderers, match, language) => (renderers[language] || renderers.ml)(match, language);

  const dynamicTranslations = [
    [/^أفق حي محسوب من الموقع والوقت الحاليين؛ الشمس ([-+٠-٩۰-۹\d.,٫]+) درجة، والقمر ([-+٠-٩۰-۹\d.,٫]+) درجة\.?$/u,
      {
        ml: match => `നിലവിലെ സ്ഥലവും സമയവും ഉപയോഗിച്ച് കണക്കാക്കിയ തത്സമയ ക്ഷിതിജം; സൂര്യന്റെ ഉയരം ${normalizeNumerals(match[1])} ഡിഗ്രിയും ചന്ദ്രന്റെ ഉയരം ${normalizeNumerals(match[2])} ഡിഗ്രിയുമാണ്.`,
        en: match => `Live horizon calculated from current location and time; Sun altitude ${normalizeNumerals(match[1])} degrees and Moon altitude ${normalizeNumerals(match[2])} degrees.`
      }],
    [/^فجر (.+)° • عصر (.+)× • عشاء (.+) دقيقة$/u,
      {
        ml: match => `ഫജർ ${normalizeNumerals(match[1])}° • അസർ ${normalizeNumerals(match[2])}× • ഇശാ ${normalizeNumerals(match[3])} മിനിറ്റ്`,
        en: match => `Fajr ${normalizeNumerals(match[1])}° • Asr ${normalizeNumerals(match[2])}× • Isha ${normalizeNumerals(match[3])} minutes`
      }],
    [/^الأسبوع ([٠-٩۰-۹\d]+) • اليوم ([٠-٩۰-۹\d]+)$/u,
      {
        ml: match => `ആഴ്ച ${normalizeNumerals(match[1])} • ദിവസം ${normalizeNumerals(match[2])}`,
        en: match => `Week ${normalizeNumerals(match[1])} • Day ${normalizeNumerals(match[2])}`
      }],
    [/^نظام عرض الوقت ([٠-٩۰-۹\d]+) ساعة؛ اضغط للتبديل$/u,
      {
        ml: match => `${normalizeNumerals(match[1])}-മണിക്കൂർ സമയരീതി; മാറ്റാൻ അമർത്തുക`,
        en: match => `${normalizeNumerals(match[1])}-hour time display; tap to switch`
      }],
    [/^تم اعتماد نظام ([٠-٩۰-۹\d]+) ساعة$/u,
      {
        ml: match => `${normalizeNumerals(match[1])}-മണിക്കൂർ സമയരീതി സ്വീകരിച്ചു`,
        en: match => `${normalizeNumerals(match[1])}-hour format selected`
      }],
    [/^تم تطبيق نظام ([٠-٩۰-۹\d]+) ساعة لهذه الجلسة$/u,
      {
        ml: match => `ഈ സെഷനിൽ ${normalizeNumerals(match[1])}-മണിക്കൂർ സമയരീതി പ്രയോഗിച്ചു`,
        en: match => `${normalizeNumerals(match[1])}-hour format applied for this session`
      }],
    [/^سيظهر تقويم (.+?) في صفحة اليوم$/u,
      {
        ml: (match, language) => `${translateValue(match[1], language)} കലണ്ടർ ഇന്നത്തെ പേജിൽ കാണിക്കും`,
        en: (match, language) => `${translateValue(match[1], language)} calendar will be shown on the Today page`
      }],
    [/^(.+?) — (.+?) حسب الموقع المحدد$/u,
      {
        ml: (match, language) => `${translateValue(match[1], language)} — ${translateValue(match[2], language)}, തിരഞ്ഞെടുത്ത സ്ഥലം അനുസരിച്ച്`,
        en: (match, language) => `${translateValue(match[1], language)} — ${translateValue(match[2], language)}, based on the selected location`
      }],
    [/^الموافق (.+?)؛ تتغير جميع البطاقات مع التاريخ المختار\.?$/u,
      {
        ml: (match, language) => `തുല്യം ${translateValue(match[1], language)}; തിരഞ്ഞെടുത്ത തീയതിയോടൊപ്പം എല്ലാ കാർഡുകളും മാറും.`,
        en: (match, language) => `Corresponding to ${translateValue(match[1], language)}; all cards change with the selected date.`
      }],
    [/^الشهر ([٠-٩۰-۹\d]+) يومًا • السنة (كبيسة|غير كبيسة)$/u,
      {
        ml: match => `മാസം ${normalizeNumerals(match[1])} ദിവസം • ${match[2] === 'كبيسة' ? 'അധിവർഷം' : 'അധിവർഷമല്ല'}`,
        en: match => `Month: ${normalizeNumerals(match[1])} days • ${match[2] === 'كبيسة' ? 'leap year' : 'not a leap year'}`
      }],
    [/^(.+?) الموقع الحالي: (.+?)\.?$/u,
      {
        ml: (match, language) => `${translateValue(match[1], language)} നിലവിലെ സ്ഥലം: ${translateValue(match[2], language)}.`,
        en: (match, language) => `${translateValue(match[1], language)} Current location: ${translateValue(match[2], language)}.`
      }],
    [/^(.+?): (ذروة|جيد|متوسط|أقل نشاطًا|لا بيانات)، (.+?) من ١٠٠$/u,
      {
        ml: (match, language) => `${translateValue(match[1], language)}: ${translateValue(match[2], language)}, ${normalizeNumerals(match[3])} / 100`,
        en: (match, language) => `${translateValue(match[1], language)}: ${translateValue(match[2], language)}, ${normalizeNumerals(match[3])} out of 100`
      }],
    [/^أفضل الفرص الإرشادية هذا الشهر: (.+?)\. راقب الطقس والمد والجزر وتعليمات الصيد المحلية\.?$/u,
      {
        ml: (match, language) => `ഈ മാസത്തിലെ മികച്ച മാർഗ്ഗനിർദ്ദേശ അവസരങ്ങൾ: ${translateValue(match[1], language)}. കാലാവസ്ഥ, തിരമാലയേറ്റം-ഇറക്കം, പ്രാദേശിക മത്സ്യബന്ധന നിർദ്ദേശങ്ങൾ ശ്രദ്ധിക്കുക.`,
        en: (match, language) => `Best indicative opportunities this month: ${translateValue(match[1], language)}. Watch the weather, tides, and local fishing rules.`
      }],
    [/^([٠-٩۰-۹\d]+) أنواع إرشادية$/u,
      {
        ml: match => `${normalizeNumerals(match[1])} മാർഗ്ഗനിർദ്ദേശ ജാതികൾ`,
        en: match => `${normalizeNumerals(match[1])} indicative species`
      }],
    [/^([٠-٩۰-۹\d]+) محاصيل في نافذتها$/u,
      {
        ml: match => `${normalizeNumerals(match[1])} വിളകൾ ജാലകത്തിലാണ്`,
        en: match => `${normalizeNumerals(match[1])} crops in their window`
      }],
    [/^([٠-٩۰-۹\d]+) محاصيل$/u,
      {
        ml: match => `${normalizeNumerals(match[1])} വിളകൾ`,
        en: match => `${normalizeNumerals(match[1])} crops`
      }],
    [/^(.+?) — (فاكهة|خضراوات)$/u,
      {
        ml: (match, language) => `${translateValue(match[1], language)} — ${translateValue(match[2], language)}`,
        en: (match, language) => `${translateValue(match[1], language)} — ${translateValue(match[2], language)}`
      }],
    [/^(.+?): الزراعة (.+?) • الحصاد (.+)$/u,
      {
        ml: (match, language) => `${translateValue(match[1], language)}: നടൽ ${translateValue(match[2], language)} • വിളവെടുപ്പ് ${translateValue(match[3], language)}`,
        en: (match, language) => `${translateValue(match[1], language)}: planting ${translateValue(match[2], language)} • harvest ${translateValue(match[3], language)}`
      }],
    [/^تفاصيل (.+)$/u,
      {
        ml: (match, language) => `${translateValue(match[1], language)} വിശദാംശങ്ങൾ`,
        en: (match, language) => `${translateValue(match[1], language)} details`
      }],
    [/^الزراعة: (.+)$/u,
      {
        ml: (match, language) => `നടൽ: ${translateValue(match[1], language)}`,
        en: (match, language) => `Planting: ${translateValue(match[1], language)}`
      }],
    [/^الحصاد: (.+)$/u,
      {
        ml: (match, language) => `വിളവെടുപ്പ്: ${translateValue(match[1], language)}`,
        en: (match, language) => `Harvest: ${translateValue(match[1], language)}`
      }],
    [/^الذروة: (.+)$/u,
      {
        ml: (match, language) => `ഉച്ചസ്ഥിതി: ${translateValue(match[1], language)}`,
        en: (match, language) => `Peak: ${translateValue(match[1], language)}`
      }],
    [/^(.+?): (ذروة|حصاد|زراعة|—)$/u,
      {
        ml: (match, language) => `${translateValue(match[1], language)}: ${translateValue(match[2], language)}`,
        en: (match, language) => `${translateValue(match[1], language)}: ${translateValue(match[2], language)}`
      }],
    [/^سنة (.+?) (الخشبي|الناري|الترابي|المعدني|المائي)$/u,
      {
        ml: (match, language) => `${translateValue(match[1], language)} ${translateValue(match[2], language)} വർഷം`,
        en: (match, language) => `Year of the ${translateValue(match[1], language)}, ${translateValue(match[2], language)}`
      }],
    [/^سنة (.+?)، عنصر (.+)$/u,
      {
        ml: (match, language) => `${translateValue(match[1], language)} വർഷം, മൂലകം ${translateValue(match[2], language)}`,
        en: (match, language) => `Year of the ${translateValue(match[1], language)}, element ${translateValue(match[2], language)}`
      }],
    [/^([٠-٩۰-۹\d]+)\/([٠-٩۰-۹\d]+)\((.+?)\)\/([٠-٩۰-۹\d]+)(?: \((سنة .+?)\))?$/u,
      {
        ml: (match, language) => `${normalizeNumerals(match[1])}/${normalizeNumerals(match[2])}(${translateValue(match[3], language)})/${normalizeNumerals(match[4])}${match[5] ? ` (${translateValue(match[5], language)})` : ''}`,
        en: (match, language) => `${normalizeNumerals(match[1])}/${normalizeNumerals(match[2])}(${translateValue(match[3], language)})/${normalizeNumerals(match[4])}${match[5] ? ` (${translateValue(match[5], language)})` : ''}`
      }],
    [/^(.+?) من الشهر (.+?) الكبيس • سنة (.+?)، عنصر (.+)$/u,
      {
        ml: (match, language) => `${normalizeNumerals(match[1])}, ലീപ് മാസം ${normalizeNumerals(match[2])} • ${translateValue(match[3], language)} വർഷം, ഘടകം ${translateValue(match[4], language)}`,
        en: (match, language) => `${normalizeNumerals(match[1])} of leap month ${normalizeNumerals(match[2])} • Year of the ${translateValue(match[3], language)}, element ${translateValue(match[4], language)}`
      }],
    [/^(.+?) من الشهر (.+?) • سنة (.+?)، عنصر (.+)$/u,
      {
        ml: (match, language) => `${normalizeNumerals(match[1])}, മാസം ${normalizeNumerals(match[2])} • ${translateValue(match[3], language)} വർഷം, ഘടകം ${translateValue(match[4], language)}`,
        en: (match, language) => `${normalizeNumerals(match[1])} of month ${normalizeNumerals(match[2])} • Year of the ${translateValue(match[3], language)}, element ${translateValue(match[4], language)}`
      }],
    [/^اليوم (.+?) من أيام الهاء • (.+?) ب\.إ$/u,
      {
        ml: match => `ഹാ ദിവസങ്ങളിൽ ${normalizeNumerals(match[1])}-ാം ദിവസം • ${normalizeNumerals(match[2])} B.E.`,
        en: match => `Day ${normalizeNumerals(match[1])} of Ayyam-i-Ha • ${normalizeNumerals(match[2])} B.E.`
      }],
    [/^⌖\s*(.+?)\s*⌄$/u, {
      ml: (match, language) => `⌖ ${translateValue(match[1], language)} ⌄`,
      en: (match, language) => `⌖ ${translateValue(match[1], language)} ⌄`
    }],
    [/^(.+?)\s+دقيقة$/u, {
      ml: (match, language) => `${normalizeNumerals(translateValue(match[1], language))} മിനിറ്റ്`,
      en: (match, language) => `${normalizeNumerals(translateValue(match[1], language))} minutes`
    }],
    [/^(.+?)\s+ساعة$/u, {
      ml: (match, language) => `${normalizeNumerals(translateValue(match[1], language))} മണിക്കൂർ`,
      en: (match, language) => `${normalizeNumerals(translateValue(match[1], language))} hours`
    }],
    [/^(.+?)\s+هـ$/u, {
      ml: (match, language) => `${normalizeNumerals(translateValue(match[1], language))} ഹി.`,
      en: (match, language) => `${normalizeNumerals(translateValue(match[1], language))} AH`
    }]
  ];

  function translateValue(input, language = readLanguage()) {
    const value = String(input ?? '').replace(/\s+/g, ' ').trim();
    if (!value) return value;
    if (language === 'ar') return value;
    const exact = exactFor(language);
    if (exact[value]) return normalizeNumerals(exact[value]);
    for (const [pattern, renderers] of dynamicTranslations) {
      const match = value.match(pattern);
      if (match) return normalizeNumerals(renderFor(renderers, match, language));
    }
    if (value.includes(' • ')) return value.split(' • ').map(part => translateValue(part, language)).join(' • ');
    let output = value
      .replace(/([٠-٩۰-۹\d][٠-٩۰-۹\d:٫.,]*)\s*ص(?=$|\s|[•،,؛])/g, '$1 AM')
      .replace(/([٠-٩۰-۹\d][٠-٩۰-۹\d:٫.,]*)\s*م(?=$|\s|[•،,؛])/g, '$1 PM');
    phrasePatterns(language).forEach(([pattern, target]) => { output = output.replace(pattern, target); });
    output = output.replace(arabicWords, word => translateWord(word, language));
    return normalizeNumerals(output).replace(/،/g, ',').replace(/؛/g, ';');
  }

  const readLanguage = () => {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return supported.has(value) ? value : 'ar';
    } catch {
      return 'ar';
    }
  };

  const replaceText = node => {
    if (!node || node.nodeType !== Node.TEXT_NODE) return;
    const raw = node.nodeValue || '';
    const compact = raw.replace(/\s+/g, ' ').trim();
    if (!compact || !localizable.test(compact)) return;
    sourceText.set(node, raw);
    const translated = translateValue(compact);
    if (!translated || translated === compact) return;
    const leading = raw.match(/^\s*/)?.[0] || '';
    const trailing = raw.match(/\s*$/)?.[0] || '';
    node.nodeValue = `${leading}${translated}${trailing}`;
  };

  const translatedAttributes = ['aria-label', 'aria-description', 'title', 'placeholder', 'alt'];
  const translateAttributes = element => {
    if (!(element instanceof Element)) return;
    translatedAttributes.forEach(name => {
      const value = element.getAttribute(name);
      if (!value || !localizable.test(value)) return;
      let originals = sourceAttributes.get(element);
      if (!originals) { originals = new Map(); sourceAttributes.set(element, originals); }
      originals.set(name, value);
      const translated = translateValue(value);
      if (translated && translated !== value) element.setAttribute(name, translated);
    });
    if (element instanceof HTMLInputElement && /^(button|submit|reset)$/.test(element.type) && localizable.test(element.value || '')) {
      const translated = translateValue(element.value);
      if (translated) element.value = translated;
    }
  };

  const translateTree = root => {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) { replaceText(root); return; }
    if (root.nodeType !== Node.ELEMENT_NODE) return;
    translateAttributes(root);
    if (/^(SCRIPT|STYLE|TEXTAREA)$/.test(root.tagName)) return;
    root.childNodes.forEach(translateTree);
  };

  const restoreTree = root => {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      if (sourceText.has(root)) root.nodeValue = sourceText.get(root);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE) return;
    const originals = sourceAttributes.get(root);
    if (originals) originals.forEach((value, name) => root.setAttribute(name, value));
    root.childNodes.forEach(restoreTree);
  };

  const get = id => document.getElementById(id);
  const localizedRouteKeys = ['today', 'calendar'];
  const activeLocalizedPage = () => localizedRouteKeys.map(get).find(page => page?.classList.contains('active')) || null;
  const activeLocalizedRoute = () => activeLocalizedPage()?.id || '';
  const contains = (root, node) => {
    if (!root || !node) return false;
    const element = node.nodeType === Node.TEXT_NODE ? node.parentNode : node;
    return root === element || (typeof root.contains === 'function' && root.contains(element));
  };
  const activeRoots = () => [activeLocalizedPage(), document.querySelector('.topbar'), document.querySelector('.sample-banner'), get('appToast')].filter(Boolean);
  const alwaysRoots = () => [get('languageButton'), get('languageDialog')].filter(Boolean);
  const inLocalizedScope = node => alwaysRoots().some(root => contains(root, node)) || (activeLocalizedPage() && activeRoots().some(root => contains(root, node)));

  const markScope = (root, language) => {
    if (!root) return;
    if (language && language !== 'ar') {
      root.setAttribute('lang', language);
      root.setAttribute('dir', 'ltr');
    } else {
      root.removeAttribute('lang');
      root.removeAttribute('dir');
    }
  };

  const syncOptions = language => {
    document.querySelectorAll('[data-language-choice]').forEach(button => {
      button.setAttribute('aria-checked', String(button.dataset.languageChoice === language));
    });
  };

  const syncRouteScope = () => {
    const language = readLanguage();
    const translated = language !== 'ar';
    const route = activeLocalizedRoute();
    const active = translated && Boolean(route);
    const topbar = document.querySelector('.topbar');
    const topActions = document.querySelector('.top-actions');
    const banner = document.querySelector('.sample-banner');
    const localizedPages = localizedRouteKeys.map(get).filter(Boolean);
    document.documentElement.lang = active ? language : 'ar';
    document.documentElement.dir = 'rtl';
    document.body?.classList.remove('is-malayalam');
    localizedPages.forEach(page => markScope(page, translated ? language : 'ar'));
    markScope(topbar, active ? language : 'ar');
    markScope(banner, active ? language : 'ar');
    markScope(get('languageDialog'), translated ? language : 'ar');
    markScope(get('languageButton'), translated ? language : 'ar');
    if (translated) {
      alwaysRoots().forEach(translateTree);
      if (active) activeRoots().forEach(translateTree);
      else {
        restoreTree(topActions);
        restoreTree(banner);
        localizedPages.forEach(restoreTree);
        alwaysRoots().forEach(translateTree);
      }
    } else {
      localizedPages.forEach(restoreTree);
      restoreTree(topActions);
      restoreTree(banner);
    }
    const titleKey = active ? `${route}.document.title` : 'today.document.title';
    document.title = active ? (messages[language]?.[titleKey] || messages[language]?.['today.document.title'] || messages.ar?.['today.document.title'] || 'التقويم العالمي الشامل') : (messages.ar?.['today.document.title'] || 'التقويم العالمي الشامل');
    const description = document.querySelector('meta[name="description"]');
    const descriptionKey = active ? `${route}.document.description` : 'today.document.description';
    const descriptionLanguage = active ? language : 'ar';
    if (description && messages[descriptionLanguage]?.[descriptionKey]) {
      description.content = messages[descriptionLanguage][descriptionKey];
    }
    syncOptions(language);
  };

  const setLanguage = language => {
    if (!supported.has(language)) return;
    try { localStorage.setItem(STORAGE_KEY, language); } catch {}
    window.location.reload();
  };

  const button = get('languageButton');
  const dialog = get('languageDialog');
  const close = get('closeLanguage');
  if (button && dialog) button.addEventListener('click', () => { syncOptions(readLanguage()); dialog.showModal(); });
  if (close && dialog) close.addEventListener('click', () => dialog.close());
  if (dialog) dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  document.querySelectorAll('[data-language-choice]').forEach(option => option.addEventListener('click', () => setLanguage(option.dataset.languageChoice)));

  syncRouteScope();

  if (readLanguage() !== 'ar' && document.body) {
    const observer = new MutationObserver(records => {
      let routeChanged = false;
      records.forEach(record => {
        if (record.type === 'attributes' && record.attributeName === 'class' && record.target instanceof Element && record.target.classList.contains('page')) routeChanged = true;
        if (record.type === 'characterData' && inLocalizedScope(record.target)) replaceText(record.target);
        if (record.type === 'attributes' && record.attributeName !== 'class' && inLocalizedScope(record.target)) translateAttributes(record.target);
        record.addedNodes?.forEach(node => { if (inLocalizedScope(record.target) || inLocalizedScope(node)) translateTree(node); });
      });
      if (routeChanged) syncRouteScope();
    });
    observer.observe(document.body, {subtree:true, childList:true, characterData:true, attributes:true, attributeFilter:['class', ...translatedAttributes]});
  }

  window.CalendarLanguage = {
    get: readLanguage,
    set: setLanguage,
    message: (key, language = readLanguage()) => messages[language]?.[key] || messages.ar?.[key] || key,
    translate: translateValue,
    apply: syncRouteScope,
    scope: 'today,calendar'
  };
})();
