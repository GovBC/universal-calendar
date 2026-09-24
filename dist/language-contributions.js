(() => {
  'use strict';

  const STORAGE_PREFIX = 'calendar.localizationDraft.';
  const EMPTY_DRAFT_CODE = 'new-language';
  const fallbackRows = [
    ['today.header.language', 'الرأس العلوي', 'اللغة'],
    ['today.header.download', 'الرأس العلوي', 'تنزيل التطبيق'],
    ['today.date.gregorian', 'بطاقات التاريخ', 'الميلادي'],
    ['today.sky.now', 'السماء الآن', 'السماء الآن'],
    ['today.prayer.next', 'الصلاة', 'الصلاة التالية'],
    ['today.moon.heading', 'القمر والهلال', 'القمر والهلال'],
    ['calendar.intro.title', 'مقدمة التقويم', 'محول التقويمات'],
    ['calendar.tabs.fishing', 'تبويبات التقويم', 'التقويم السمكي']
  ];

  const sectionLabels = {
    today: {
      document: 'بيانات الصفحة',
      header: 'الرأس العلوي',
      date: 'بطاقات التاريخ',
      sky: 'السماء الآن',
      prayer: 'الصلاة',
      moon: 'القمر والهلال',
      assistant: 'المساعد العلمي',
      language: 'نافذة اختيار اللغة',
      common: 'مشترك'
    },
    calendar: {
      document: 'بيانات الصفحة',
      intro: 'مقدمة التقويم',
      tabs: 'تبويبات التقويم',
      date: 'التقاويم والتاريخ',
      converter: 'تحويل التاريخ',
      nav: 'تنقل الشهور',
      equivalents: 'التقاويم الحية',
      fishing: 'التقويم السمكي',
      agriculture: 'التقويم الزراعي'
    }
  };

  const pageLabels = {
    today: 'صفحة اليوم',
    calendar: 'صفحة التقويم'
  };

  const get = id => document.getElementById(id);
  const notify = message => {
    if (typeof globalThis.showToast === 'function') globalThis.showToast(message);
  };
  const arDigits = value => String(value).replace(/\d/g, digit => '٠١٢٣٤٥٦٧٨٩'[digit]);
  const normalize = value => String(value || '').replace(/\s+/g, ' ').trim();
  const escapeHtml = value => String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const normalizeCode = value => String(value || '')
    .trim()
    .replace(/_/g, '-')
    .replace(/[^A-Za-z0-9-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();

  const readRows = () => {
    const messages = globalThis.TodayLocalization?.messages?.ar || {};
    const source = Object.entries(messages).filter(([key, value]) => /^(today|calendar)\./.test(key) && normalize(value));
    const rows = source.length ? source.map(([key, ar], index) => {
      const [pageKey, part = 'common'] = key.split('.');
      return {
        index: index + 1,
        page: pageLabels[pageKey] || pageKey,
        section: sectionLabels[pageKey]?.[part] || part,
        key,
        ar: normalize(ar)
      };
    }) : fallbackRows.map(([key, section, ar], index) => ({index: index + 1, page: key.startsWith('calendar.') ? 'صفحة التقويم' : 'صفحة اليوم', section, key, ar}));
    return rows;
  };

  const elements = {
    total: get('localizationTotal'),
    form: get('languageDraftForm'),
    name: get('draftLanguageName'),
    nativeName: get('draftNativeName'),
    code: get('draftLanguageCode'),
    direction: get('draftDirection'),
    translator: get('draftTranslatorName'),
    pageScope: get('draftPageScope'),
    badge: get('languageDraftBadge'),
    progressRing: get('translationProgressRing'),
    percent: get('translationPercent'),
    translated: get('translatedCount'),
    missing: get('missingCount'),
    activeLanguage: get('activeDraftLanguage'),
    search: get('translationSearch'),
    filter: get('translationFilter'),
    rows: get('translationRows'),
    empty: get('translationEmpty'),
    column: get('newLanguageColumn'),
    copyTsv: get('copyTsv'),
    downloadJson: get('downloadJson'),
    copyReview: get('copyReviewMessage')
  };

  if (!elements.form || !elements.rows) return;

  const rows = readRows();
  let activeCode = normalizeCode(elements.code?.value) || EMPTY_DRAFT_CODE;
  let draft = {
    code: activeCode,
    name: '',
    nativeName: '',
    direction: 'ltr',
    translator: '',
    pageScope: 'today-calendar',
    values: Object.create(null),
    updatedAt: new Date().toISOString()
  };

  const storageKey = code => STORAGE_PREFIX + (normalizeCode(code) || EMPTY_DRAFT_CODE);

  const loadDraft = code => {
    const cleanCode = normalizeCode(code) || EMPTY_DRAFT_CODE;
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey(cleanCode)) || 'null');
      if (saved && typeof saved === 'object') {
        return {
          code: cleanCode,
          name: saved.name || '',
          nativeName: saved.nativeName || '',
          direction: saved.direction === 'rtl' ? 'rtl' : 'ltr',
          translator: saved.translator || '',
          pageScope: saved.pageScope === 'today' ? 'today' : 'today-calendar',
          values: Object.assign(Object.create(null), saved.values || {}),
          updatedAt: saved.updatedAt || new Date().toISOString()
        };
      }
    } catch {}
    return {
      code: cleanCode,
      name: '',
      nativeName: '',
      direction: 'ltr',
      translator: '',
      pageScope: 'today-calendar',
      values: Object.create(null),
      updatedAt: new Date().toISOString()
    };
  };

  const saveDraft = () => {
    draft.updatedAt = new Date().toISOString();
    try { localStorage.setItem(storageKey(draft.code), JSON.stringify(draft)); } catch {}
  };

  const syncForm = () => {
    elements.name.value = draft.name;
    elements.nativeName.value = draft.nativeName;
    elements.code.value = draft.code === EMPTY_DRAFT_CODE ? '' : draft.code;
    elements.direction.value = draft.direction;
    elements.translator.value = draft.translator;
    elements.pageScope.value = 'today-calendar';
  };

  const readFormIntoDraft = () => {
    const nextCode = normalizeCode(elements.code.value) || EMPTY_DRAFT_CODE;
    if (nextCode !== draft.code) {
      const previous = draft;
      draft = loadDraft(nextCode);
      draft.name ||= previous.name;
      draft.nativeName ||= previous.nativeName;
      draft.translator ||= previous.translator;
      activeCode = nextCode;
    }
    draft.name = normalize(elements.name.value);
    draft.nativeName = normalize(elements.nativeName.value);
    draft.code = nextCode;
    draft.direction = elements.direction.value === 'rtl' ? 'rtl' : 'ltr';
    draft.translator = normalize(elements.translator.value);
    draft.pageScope = 'today-calendar';
  };

  const visibleRows = () => {
    const query = normalize(elements.search.value).toLowerCase();
    const filter = elements.filter.value;
    return rows.filter(row => {
      const translated = normalize(draft.values[row.key]);
      if (filter === 'missing' && translated) return false;
      if (filter === 'done' && !translated) return false;
      if (!query) return true;
      return `${row.section} ${row.key} ${row.ar} ${translated}`.toLowerCase().includes(query);
    });
  };

  const updateStats = () => {
    const translated = rows.filter(row => normalize(draft.values[row.key])).length;
    const missing = Math.max(0, rows.length - translated);
    const percent = rows.length ? Math.round(translated / rows.length * 100) : 0;
    elements.total.textContent = arDigits(rows.length);
    elements.translated.textContent = arDigits(translated);
    elements.missing.textContent = arDigits(missing);
    elements.percent.textContent = arDigits(percent) + '٪';
    elements.progressRing.style.setProperty('--progress', percent);
    const languageName = draft.nativeName || draft.name || (draft.code !== EMPTY_DRAFT_CODE ? draft.code : 'لم تُنشأ بعد');
    elements.activeLanguage.textContent = languageName;
    elements.column.textContent = draft.code !== EMPTY_DRAFT_CODE ? `ترجمة ${languageName}` : 'اللغة الجديدة';
    elements.badge.textContent = draft.code !== EMPTY_DRAFT_CODE ? `مسودة ${draft.code}` : 'مسودة محلية';
  };

  const render = () => {
    updateStats();
    const listed = visibleRows();
    elements.rows.innerHTML = listed.map(row => {
      const value = draft.values[row.key] || '';
      const done = normalize(value).length > 0;
      return `<tr>
        <td>${arDigits(row.index)}</td>
        <td><span class="translation-place">${row.page}</span><small>${row.section}</small></td>
        <td><code>${row.key}</code></td>
        <td>${escapeHtml(row.ar)}</td>
        <td><textarea data-translation-key="${row.key}" rows="2" dir="${draft.direction}" placeholder="اكتب الترجمة هنا…">${escapeHtml(value)}</textarea></td>
        <td><span class="translation-state ${done ? 'done' : 'missing'}">${done ? 'مترجم' : 'ناقص'}</span></td>
      </tr>`;
    }).join('');
    elements.empty.hidden = listed.length > 0;
  };

  const toTsv = () => {
    const languageColumn = draft.code !== EMPTY_DRAFT_CODE ? draft.code : 'new_language';
    const clean = value => normalize(value).replace(/\t/g, ' ').replace(/\n/g, ' ');
    return [
      ['page', 'section', 'key', 'ar', languageColumn].join('\t'),
      ...rows.map(row => [row.page, row.section, row.key, row.ar, draft.values[row.key] || ''].map(clean).join('\t'))
    ].join('\n');
  };

  const makePayload = () => ({
    type: 'calendar-language-contribution',
    version: 1,
    page: 'today-calendar',
    language: {
      code: draft.code !== EMPTY_DRAFT_CODE ? draft.code : '',
      name_ar: draft.name,
      native_name: draft.nativeName,
      direction: draft.direction,
      translator: draft.translator
    },
    updated_at: draft.updatedAt,
    strings: rows.map(row => ({
      page: row.page,
      section: row.section,
      key: row.key,
      ar: row.ar,
      translation: draft.values[row.key] || ''
    }))
  });

  const copyText = async (value, fallbackName) => {
    try {
      await navigator.clipboard.writeText(value);
      notify('تم النسخ');
      return;
    } catch {}
    const blob = new Blob([value], {type: 'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fallbackName;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    notify('تم تنزيل الملف');
  };

  const downloadJson = () => {
    const payload = JSON.stringify(makePayload(), null, 2);
    const code = draft.code !== EMPTY_DRAFT_CODE ? draft.code : 'language';
    const blob = new Blob([payload], {type: 'application/json;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `calendar-${code}-today-calendar-strings.json`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    notify('تم تنزيل ملف اللغة');
  };

  elements.form.addEventListener('submit', event => {
    event.preventDefault();
    readFormIntoDraft();
    saveDraft();
    syncForm();
    render();
    notify('تم إنشاء مسودة اللغة');
  });

  [elements.name, elements.nativeName, elements.code, elements.direction, elements.translator].forEach(input => {
    input.addEventListener('change', () => {
      readFormIntoDraft();
      saveDraft();
      syncForm();
      render();
    });
  });

  elements.rows.addEventListener('input', event => {
    const textarea = event.target.closest('[data-translation-key]');
    if (!textarea) return;
    draft.values[textarea.dataset.translationKey] = textarea.value;
    saveDraft();
    updateStats();
    const state = textarea.closest('tr')?.querySelector('.translation-state');
    const done = normalize(textarea.value).length > 0;
    if (state) {
      state.textContent = done ? 'مترجم' : 'ناقص';
      state.className = `translation-state ${done ? 'done' : 'missing'}`;
    }
  });

  [elements.search, elements.filter].forEach(control => control.addEventListener(control === elements.search ? 'input' : 'change', render));
  elements.copyTsv.addEventListener('click', () => copyText(toTsv(), 'calendar-language-strings.tsv'));
  elements.downloadJson.addEventListener('click', downloadJson);
  elements.copyReview.addEventListener('click', () => {
    const payload = makePayload();
    const translated = payload.strings.filter(item => normalize(item.translation)).length;
    const message = `أرغب بمراجعة ودمج لغة جديدة في التقويم العالمي الشامل:
اللغة: ${payload.language.native_name || payload.language.name_ar || payload.language.code || 'غير محددة'}
الرمز: ${payload.language.code || 'غير محدد'}
الاتجاه: ${payload.language.direction}
الصفحة: صفحة اليوم والتقويم
الاكتمال: ${translated}/${payload.strings.length}

سأرفق ملف JSON أو جدول TSV من صفحة إضافة لغة.`;
    copyText(message, 'calendar-language-review-message.txt');
  });

  draft = loadDraft(activeCode);
  syncForm();
  render();
})();
