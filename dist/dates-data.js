/* Factual catalogue. Source and PDF page are retained per record. No inferred harvest boundaries. */
window.SaudiDatesData = {
  "schemaVersion": 1,
  "reviewedAt": "2026-09-10",
  "regions": {
    "riyadh": "الرياض",
    "eastern": "المنطقة الشرقية",
    "qassim": "القصيم",
    "madina": "المدينة المنورة",
    "makkah": "مكة المكرمة",
    "hail": "حائل",
    "najran": "نجران",
    "northern": "الحدود الشمالية",
    "jouf": "الجوف",
    "tabuk": "تبوك",
    "baha": "الباحة",
    "asir": "عسير",
    "jazan": "جازان"
  },
  "sources": {
    "ncpd2024": {
      "title": "المركز الوطني للنخيل والتمور: أصناف التمور في المملكة العربية السعودية",
      "edition": "الطبعة الثالثة، ٢٠٢٤",
      "url": "https://ncpd.gov.sa/ar/services/80a0a624-55b1-4ced-8ae1-99725937c42c",
      "pdf": "https://ncpd-backup-new2024.oss-me-central-1.aliyuncs.com/Hamed/_%D8%AF%D9%84%D9%8A%D9%84%20%D8%A7%D8%B5%D9%86%D8%A7%D9%81%20%D8%A7%D9%84%D8%AA%D9%85%D9%88%D8%B1.pdf",
      "note": "روابط الصفحات تشير إلى رقم صفحة ملف PDF؛ الرقم المطبوع أقل بصفحتين. استُخدم النص العربي عند اختلاف الترجمة."
    },
    "ministry": {
      "title": "وزارة الزراعة: أصناف التمور المشهورة في المملكة العربية السعودية",
      "edition": "نسخة مصورة من الإصدار السابق",
      "url": "https://iraqi-datepalms.net/المكتبة/كتب-النخيل/اصناف-التمور-المشهورة-بالسعودية/",
      "pdf": "https://iraqi-datepalms.net/wp-content/uploads/2018/11/اصناف-التمور-المشهورة-بالسعودية.pdf",
      "note": "جدول الأسماء التاريخية، الصفحات المطبوعة ٣٤ و٣٦ و٣٧. النسخة المصورة تكرر ص٣٦ وتفتقد ص٣٥؛ لم تُستكمل أسماؤها بالتخمين. ورود اسم قديم لا يثبت استمرار زراعته اليوم."
    },
    "mewaMadina": {
      "title": "وزارة البيئة والمياه والزراعة: بواكير تمور المدينة تنعش الأسواق بـ٥٨ صنفًا",
      "edition": "٢٨ ذو الحجة ١٤٤٦هـ",
      "url": "https://www.mewa.gov.sa/ar/MediaCenter/News/Pages/News12362020.aspx",
      "note": "يذكر أكثر من ٤٠٤ أصناف بالمملكة وموسم حصاد المدينة من يونيو إلى نهاية نوفمبر؛ لا يقدم قائمة وطنية كاملة."
    },
    "mewaRiyadh": {
      "title": "وزارة البيئة والمياه والزراعة: موسم تمور منطقة الرياض",
      "edition": "خبر موسم الحصاد، ١٤٤٧هـ",
      "url": "https://www.mewa.gov.sa/ar/MediaCenter/News/Pages/News12522020.aspx",
      "note": "نافذة عامة للمنطقة من ١ أغسطس حتى نهاية نوفمبر؛ ليست موعد كل صنف."
    },
    "spaSukkari": {
      "title": "وكالة الأنباء السعودية: الخرفة الثانية تجمع الزين والرخيص في تمور بريدة",
      "edition": "٢٠٢٠",
      "url": "https://www.spa.gov.sa/2119465",
      "note": "رصد موسمي تاريخي في بريدة؛ لا يُعامل كتوقع سنوي أو تقويم لكل مناطق المملكة."
    }
  },
  "cultivars": [
    {
      "id": "date-001",
      "name": "سلج",
      "aliases": [],
      "regions": [
        "riyadh",
        "northern",
        "asir"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 41,
          "region": "northern"
        },
        {
          "source": "ncpd2024",
          "page": 42,
          "region": "asir"
        },
        {
          "source": "ncpd2024",
          "page": 205
        },
        {
          "source": "ncpd2024",
          "page": 205,
          "region": "riyadh"
        },
        {
          "source": "ministry",
          "page": 25,
          "serial": 142
        }
      ],
      "maturity": "mid",
      "consumption": [
        "رطب"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 206,
          "shape": "أسطواني",
          "size": "متوسط",
          "color": "أصفر"
        },
        {
          "stage": "رطب",
          "page": 206,
          "shape": "أسطواني",
          "size": "متوسط",
          "color": "أصفر ذهبي"
        },
        {
          "stage": "تمر",
          "page": 206,
          "shape": "أسطواني",
          "size": "متوسط",
          "color": "كهرماني"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 205
      },
      "profilePage": 205,
      "historicalOnly": false
    },
    {
      "id": "date-002",
      "name": "منيفي",
      "aliases": [],
      "regions": [
        "riyadh"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 185
        },
        {
          "source": "ncpd2024",
          "page": 185,
          "region": "riyadh"
        },
        {
          "source": "ministry",
          "page": 27,
          "serial": 254
        }
      ],
      "maturity": "late",
      "consumption": [
        "رطب",
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 186,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "أصفر"
        },
        {
          "stage": "رطب",
          "page": 186,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "بني مشمشي"
        },
        {
          "stage": "تمر",
          "page": 186,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "بني فاتح"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 185
      },
      "profilePage": 185,
      "historicalOnly": false
    },
    {
      "id": "date-003",
      "name": "نبوت سيف",
      "aliases": [
        "نبتة سيف",
        "نبوت سيف",
        "النبوت سيف"
      ],
      "regions": [
        "riyadh",
        "qassim",
        "northern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 36,
          "region": "qassim"
        },
        {
          "source": "ncpd2024",
          "page": 41,
          "region": "northern"
        },
        {
          "source": "ncpd2024",
          "page": 189
        },
        {
          "source": "ncpd2024",
          "page": 189,
          "region": "riyadh"
        },
        {
          "source": "ministry",
          "page": 27,
          "serial": 275
        }
      ],
      "maturity": "mid",
      "consumption": [
        "رطب",
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 190,
          "shape": "بيضوي إلى كروي",
          "size": "متوسط",
          "color": "أصفر"
        },
        {
          "stage": "رطب",
          "page": 190,
          "shape": "بيضوي إلى كروي",
          "size": "متوسط",
          "color": "ذهبي"
        },
        {
          "stage": "تمر",
          "page": 190,
          "shape": "بيضوي إلى كروي",
          "size": "متوسط",
          "color": "بني ذهبي"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 189
      },
      "profilePage": 189,
      "historicalOnly": false
    },
    {
      "id": "date-004",
      "name": "نبتة سلطان",
      "aliases": [
        "نبتــة ســلطان"
      ],
      "regions": [
        "riyadh",
        "northern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 41,
          "region": "northern"
        },
        {
          "source": "ncpd2024",
          "page": 187
        },
        {
          "source": "ncpd2024",
          "page": 187,
          "region": "riyadh"
        },
        {
          "source": "ministry",
          "page": 27,
          "serial": 268
        }
      ],
      "maturity": "late",
      "consumption": [
        "رطب",
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 188,
          "shape": "بيضوي إلى كروي",
          "size": "متوسط",
          "color": "أصفر"
        },
        {
          "stage": "رطب",
          "page": 188,
          "shape": "بيضوي إلى كروي",
          "size": "متوسط",
          "color": "ذهبي"
        },
        {
          "stage": "تمر",
          "page": 188,
          "shape": "بيضوي إلى كروي",
          "size": "متوسط",
          "color": "بني ذهبي"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 187
      },
      "profilePage": 187,
      "historicalOnly": false
    },
    {
      "id": "date-005",
      "name": "خضري",
      "aliases": [
        "الخضري"
      ],
      "regions": [
        "riyadh",
        "qassim",
        "madina",
        "makkah",
        "jazan",
        "asir"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 36,
          "region": "qassim"
        },
        {
          "source": "ncpd2024",
          "page": 37,
          "region": "madina"
        },
        {
          "source": "ncpd2024",
          "page": 38,
          "region": "makkah"
        },
        {
          "source": "ncpd2024",
          "page": 42,
          "region": "jazan"
        },
        {
          "source": "ncpd2024",
          "page": 42,
          "region": "asir"
        },
        {
          "source": "ncpd2024",
          "page": 59
        },
        {
          "source": "ncpd2024",
          "page": 59,
          "region": "riyadh"
        }
      ],
      "maturity": "late",
      "consumption": [
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 60,
          "shape": "أسطواني مستطيل",
          "size": "كبير",
          "color": "أحمر دموي"
        },
        {
          "stage": "رطب",
          "page": 60,
          "shape": "أسطواني مستطيل",
          "size": "كبير",
          "color": "أحمر مسمر"
        },
        {
          "stage": "تمر",
          "page": 60,
          "shape": "أسطواني مستطيل",
          "size": "كبير",
          "color": "بني مسمر"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "ثمرة قليلة الألياف؛ صنف تجاري في عدة مناطق."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 59
      },
      "profilePage": 59,
      "historicalOnly": false
    },
    {
      "id": "date-006",
      "name": "مقفزي",
      "aliases": [],
      "regions": [
        "riyadh"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-007",
      "name": "مسكاني",
      "aliases": [],
      "regions": [
        "riyadh",
        "hail"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 39,
          "region": "hail"
        },
        {
          "source": "ncpd2024",
          "page": 149
        },
        {
          "source": "ncpd2024",
          "page": 149,
          "region": "riyadh"
        },
        {
          "source": "ministry",
          "page": 27,
          "serial": 242
        }
      ],
      "maturity": "mid",
      "consumption": [
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 150,
          "shape": "بيضوي",
          "size": "وسط",
          "color": "أصفر"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "غزير الإنتاج؛ يشبه نبوت سيف في وصف الدليل.",
        "يكرر المرجع اسم أحد الأطوار في بطاقة الثمرة؛ حُذفت الخانة الملتبسة بدل تخمين الطور المقصود."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 149
      },
      "profilePage": 149,
      "historicalOnly": false
    },
    {
      "id": "date-008",
      "name": "دخيني",
      "aliases": [],
      "regions": [
        "riyadh"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 171
        },
        {
          "source": "ncpd2024",
          "page": 171,
          "region": "riyadh"
        }
      ],
      "maturity": "early",
      "consumption": [
        "رطب",
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 172,
          "shape": "محدب مستطيل",
          "size": "متوسط",
          "color": "بني ذهبي"
        },
        {
          "stage": "رطب",
          "page": 172,
          "shape": "محدب مستطيل",
          "size": "متوسط",
          "color": "بني ذهبي"
        },
        {
          "stage": "تمر",
          "page": 172,
          "shape": "محدب مستطيل",
          "size": "متوسط",
          "color": "غير محسوم في نص المرجع",
          "colorUnclear": "بني قابض"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "الوصف اللوني في إحدى الخانات ملتبس في النص العربي؛ لم يعرض بوصفه لونًا مؤكدًا."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 171
      },
      "profilePage": 171,
      "historicalOnly": false
    },
    {
      "id": "date-009",
      "name": "سري",
      "aliases": [
        "السري"
      ],
      "regions": [
        "riyadh",
        "asir"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 42,
          "region": "asir"
        },
        {
          "source": "ncpd2024",
          "page": 203
        },
        {
          "source": "ncpd2024",
          "page": 203,
          "region": "riyadh"
        }
      ],
      "maturity": "early",
      "consumption": [
        "رطب"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 204,
          "shape": "بيضوي مستطيل",
          "size": "متوسط إلى كبير",
          "color": "أحمر مصفر"
        },
        {
          "stage": "رطب",
          "page": 204,
          "shape": "بيضوي مستطيل",
          "size": "متوسط إلى كبير",
          "color": "بني محمر"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "موصوف في الأفلاج ووادي الدواسر."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 203
      },
      "profilePage": 203,
      "historicalOnly": false
    },
    {
      "id": "date-010",
      "name": "صفري",
      "aliases": [
        "الصفري"
      ],
      "regions": [
        "riyadh",
        "makkah",
        "baha",
        "jazan",
        "asir"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 38,
          "region": "makkah"
        },
        {
          "source": "ncpd2024",
          "page": 42,
          "region": "baha"
        },
        {
          "source": "ncpd2024",
          "page": 42,
          "region": "jazan"
        },
        {
          "source": "ncpd2024",
          "page": 42,
          "region": "asir"
        },
        {
          "source": "ncpd2024",
          "page": 143
        },
        {
          "source": "ncpd2024",
          "page": 143,
          "region": "asir"
        },
        {
          "source": "ncpd2024",
          "page": 143,
          "region": "baha"
        },
        {
          "source": "ncpd2024",
          "page": 143,
          "region": "jazan"
        },
        {
          "source": "ncpd2024",
          "page": 143,
          "region": "makkah"
        },
        {
          "source": "ncpd2024",
          "page": 143,
          "region": "riyadh"
        },
        {
          "source": "ministry",
          "page": 25,
          "serial": 173
        }
      ],
      "maturity": "early",
      "consumption": [
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 144,
          "shape": "أسطواني",
          "size": "متوسط",
          "color": "أصفر ذهبي"
        },
        {
          "stage": "رطب",
          "page": 144,
          "shape": "أسطواني",
          "size": "متوسط",
          "color": "بني ذهبي"
        },
        {
          "stage": "تمر",
          "page": 144,
          "shape": "أسطواني",
          "size": "متوسط",
          "color": "بني"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "وصف النضج في النص العربي: مبكر تقريبًا؛ تختلف الترجمة إلى مبكر–متوسط."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 143
      },
      "profilePage": 143,
      "historicalOnly": false
    },
    {
      "id": "date-011",
      "name": "خلاص",
      "aliases": [
        "الخلاص"
      ],
      "regions": [
        "riyadh",
        "eastern",
        "qassim",
        "northern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 35,
          "region": "eastern"
        },
        {
          "source": "ncpd2024",
          "page": 36,
          "region": "qassim"
        },
        {
          "source": "ncpd2024",
          "page": 41,
          "region": "northern"
        },
        {
          "source": "ncpd2024",
          "page": 61
        },
        {
          "source": "ncpd2024",
          "page": 61,
          "region": "eastern"
        }
      ],
      "maturity": "mid",
      "consumption": [
        "بسر",
        "رطب",
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 62,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "أصفر مشمشي"
        },
        {
          "stage": "رطب",
          "page": 62,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "بني أصفر"
        },
        {
          "stage": "تمر",
          "page": 62,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "أحمر داكن"
        }
      ],
      "observations": [
        {
          "kind": "maturity",
          "label": "أغسطس",
          "months": [
            8
          ],
          "region": "eastern",
          "scope": "وصف الدليل المرتبط بالأحساء وانتشار الصنف.",
          "ref": {
            "source": "ncpd2024",
            "page": 61
          }
        }
      ],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "قليل الألياف؛ من أصناف الأحساء التجارية وواسع الانتشار."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 61
      },
      "profilePage": 61,
      "historicalOnly": false
    },
    {
      "id": "date-012",
      "name": "خوار",
      "aliases": [],
      "regions": [
        "riyadh"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 108
        },
        {
          "source": "ncpd2024",
          "page": 108,
          "region": "riyadh"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [
        {
          "stage": "تمر",
          "shape": "أسطواني",
          "size": "متوسط",
          "color": "غير محسوم في نص المرجع",
          "page": 108,
          "colorUnclear": "بني قابض"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "ورد وصف الثمرة في هذا الطور فقط؛ لا تحدد الصفحة موسم النضج أو جميع أطوار الاستهلاك.",
        "الوصف اللوني في إحدى الخانات ملتبس في النص العربي؛ لم يعرض بوصفه لونًا مؤكدًا."
      ],
      "profilePage": 108,
      "historicalOnly": false
    },
    {
      "id": "date-013",
      "name": "برحي",
      "aliases": [
        "البرحي",
        "البارحي",
        "بارحي",
        "بِرحي"
      ],
      "regions": [
        "riyadh",
        "eastern",
        "qassim",
        "madina"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 35,
          "region": "eastern"
        },
        {
          "source": "ncpd2024",
          "page": 36,
          "region": "qassim"
        },
        {
          "source": "ncpd2024",
          "page": 37,
          "region": "madina"
        },
        {
          "source": "ncpd2024",
          "page": 49
        },
        {
          "source": "ncpd2024",
          "page": 49,
          "region": "eastern"
        },
        {
          "source": "ncpd2024",
          "page": 49,
          "region": "qassim"
        },
        {
          "source": "ncpd2024",
          "page": 49,
          "region": "riyadh"
        },
        {
          "source": "ministry",
          "page": 24,
          "serial": 20
        }
      ],
      "maturity": "mid",
      "consumption": [
        "بسر",
        "رطب",
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 50,
          "shape": "بيضوي",
          "size": "متوسط إلى صغير",
          "color": "أصفر"
        },
        {
          "stage": "رطب",
          "page": 50,
          "shape": "بيضوي",
          "size": "متوسط إلى صغير",
          "color": "أصفر مشمشي"
        },
        {
          "stage": "تمر",
          "page": 50,
          "shape": "بيضوي",
          "size": "متوسط إلى صغير",
          "color": "بني فاتح"
        }
      ],
      "observations": [
        {
          "kind": "maturity",
          "label": "أغسطس، في منتصف الموسم",
          "months": [
            8
          ],
          "region": null,
          "scope": "وصف عام للصنف في المملكة؛ يذكر النص الإنجليزي أغسطس/سبتمبر، واعتمد هنا النص العربي دون تحويله إلى حدود للحصاد.",
          "ref": {
            "source": "ncpd2024",
            "page": 49
          }
        }
      ],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "منتشر في معظم مناطق المملكة."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 49
      },
      "profilePage": 49,
      "historicalOnly": false
    },
    {
      "id": "date-014",
      "name": "صقعي",
      "aliases": [
        "الصقعي"
      ],
      "regions": [
        "riyadh",
        "qassim",
        "northern",
        "asir"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 36,
          "region": "qassim"
        },
        {
          "source": "ncpd2024",
          "page": 41,
          "region": "northern"
        },
        {
          "source": "ncpd2024",
          "page": 42,
          "region": "asir"
        },
        {
          "source": "ncpd2024",
          "page": 145
        },
        {
          "source": "ncpd2024",
          "page": 145,
          "region": "riyadh"
        },
        {
          "source": "ministry",
          "page": 25,
          "serial": 176
        }
      ],
      "maturity": "mid",
      "consumption": [
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 146,
          "shape": "أسطواني مستطيل",
          "size": "متوسط إلى كبير",
          "color": "أصفر فاتح"
        },
        {
          "stage": "رطب",
          "page": 146,
          "shape": "أسطواني مستطيل",
          "size": "متوسط إلى كبير",
          "color": "بني مصفر"
        },
        {
          "stage": "تمر",
          "page": 146,
          "shape": "أسطواني مستطيل",
          "size": "متوسط إلى كبير",
          "color": "بني محمر"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "انتشر من منطقة الرياض إلى عدة مناطق."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 145
      },
      "profilePage": 145,
      "historicalOnly": false
    },
    {
      "id": "date-015",
      "name": "سكري",
      "aliases": [],
      "regions": [
        "riyadh",
        "northern",
        "qassim"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 41,
          "region": "northern"
        },
        {
          "source": "ncpd2024",
          "page": 179
        },
        {
          "source": "ncpd2024",
          "page": 179,
          "region": "qassim"
        }
      ],
      "maturity": "mid",
      "consumption": [
        "رطب",
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 180,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "أصفر"
        },
        {
          "stage": "رطب",
          "page": 180,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "بني مصفر"
        },
        {
          "stage": "تمر",
          "page": 180,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "بني"
        }
      ],
      "observations": [
        {
          "kind": "maturity",
          "label": "أغسطس",
          "months": [
            8
          ],
          "region": "qassim",
          "scope": "وصف السكري في القصيم وانتشاره؛ لا يحدد تاريخ الذروة أو نهاية الحصاد.",
          "ref": {
            "source": "ncpd2024",
            "page": 179
          }
        }
      ],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "القصيم ومنتشر في عدة مناطق؛ لا تُسقط بيانات السكري العام على السكري الأحمر أو الأصفر تلقائيًا."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 179
      },
      "profilePage": 179,
      "historicalOnly": false
    },
    {
      "id": "date-016",
      "name": "هلالي",
      "aliases": [],
      "regions": [
        "riyadh",
        "eastern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 35,
          "region": "eastern"
        },
        {
          "source": "ncpd2024",
          "page": 193
        },
        {
          "source": "ncpd2024",
          "page": 193,
          "region": "eastern"
        },
        {
          "source": "ministry",
          "page": 27,
          "serial": 285
        }
      ],
      "maturity": "veryLate",
      "consumption": [
        "رطب"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 194,
          "shape": "بيضوي",
          "size": "كبير",
          "color": "أصفر"
        },
        {
          "stage": "رطب",
          "page": 194,
          "shape": "بيضوي",
          "size": "كبير",
          "color": "بني مصفر"
        },
        {
          "stage": "تمر",
          "page": 194,
          "shape": "بيضوي",
          "size": "كبير",
          "color": "بني"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "ورد طور البسر ناقص حرف في النص العربي؛ تقابله كلمة Bisr في الصفحة نفسها."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 193
      },
      "profilePage": 193,
      "historicalOnly": false
    },
    {
      "id": "date-017",
      "name": "رزيز",
      "aliases": [],
      "regions": [
        "riyadh",
        "eastern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 35,
          "region": "eastern"
        },
        {
          "source": "ncpd2024",
          "page": 71
        },
        {
          "source": "ncpd2024",
          "page": 71,
          "region": "eastern"
        }
      ],
      "maturity": "mid",
      "consumption": [
        "رطب",
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 72,
          "shape": "بيضوي",
          "size": "صغير",
          "color": "أصفر"
        },
        {
          "stage": "رطب",
          "page": 72,
          "shape": "بيضوي",
          "size": "صغير",
          "color": "بني مصفر"
        },
        {
          "stage": "تمر",
          "page": 72,
          "shape": "بيضوي",
          "size": "صغير",
          "color": "بني غامق"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "من أصناف الأحساء واسعة الانتشار وغزيرة الإنتاج."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 71
      },
      "profilePage": 71,
      "historicalOnly": false
    },
    {
      "id": "date-018",
      "name": "شيشي",
      "aliases": [
        "الشيشي"
      ],
      "regions": [
        "riyadh",
        "eastern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 35,
          "region": "eastern"
        },
        {
          "source": "ncpd2024",
          "page": 211
        },
        {
          "source": "ncpd2024",
          "page": 211,
          "region": "eastern"
        },
        {
          "source": "ministry",
          "page": 25,
          "serial": 164
        }
      ],
      "maturity": "mid",
      "consumption": [
        "رطب",
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 212,
          "shape": "أسطواني طويل",
          "size": "متوسط إلى كبير",
          "color": "ذهبي فاتح"
        },
        {
          "stage": "رطب",
          "page": 212,
          "shape": "أسطواني طويل",
          "size": "متوسط إلى كبير",
          "color": "بني مصفر"
        },
        {
          "stage": "تمر",
          "page": 212,
          "shape": "أسطواني طويل",
          "size": "متوسط إلى كبير",
          "color": "بني محمر"
        }
      ],
      "observations": [
        {
          "kind": "maturity",
          "label": "أغسطس",
          "months": [
            8
          ],
          "region": "eastern",
          "scope": "الأحساء",
          "ref": {
            "source": "ncpd2024",
            "page": 211
          }
        }
      ],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "موصوف في الأحساء."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 211
      },
      "profilePage": 211,
      "historicalOnly": false
    },
    {
      "id": "date-019",
      "name": "مكتومي",
      "aliases": [
        "مكتومى"
      ],
      "regions": [
        "riyadh",
        "eastern",
        "qassim",
        "madina",
        "northern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 35,
          "region": "eastern"
        },
        {
          "source": "ncpd2024",
          "page": 36,
          "region": "qassim"
        },
        {
          "source": "ncpd2024",
          "page": 37,
          "region": "madina"
        },
        {
          "source": "ncpd2024",
          "page": 41,
          "region": "northern"
        },
        {
          "source": "ncpd2024",
          "page": 139
        },
        {
          "source": "ncpd2024",
          "page": 139,
          "region": "riyadh"
        },
        {
          "source": "ministry",
          "page": 27,
          "serial": 249
        }
      ],
      "maturity": "mid",
      "consumption": [
        "بسر",
        "رطب",
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 140,
          "shape": "أسطواني",
          "size": "متوسط",
          "color": "أصفر"
        },
        {
          "stage": "رطب",
          "page": 140,
          "shape": "أسطواني",
          "size": "متوسط",
          "color": "أصفر مشمشي"
        },
        {
          "stage": "تمر",
          "page": 140,
          "shape": "أسطواني",
          "size": "متوسط",
          "color": "بني"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "من الأصناف التجارية في وسط المملكة؛ قليل الألياف."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 139
      },
      "profilePage": 139,
      "historicalOnly": false
    },
    {
      "id": "date-020",
      "name": "عسيلة",
      "aliases": [
        "عسيله"
      ],
      "regions": [
        "riyadh",
        "qassim"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 36,
          "region": "qassim"
        },
        {
          "source": "ncpd2024",
          "page": 169
        },
        {
          "source": "ncpd2024",
          "page": 169,
          "region": "qassim"
        },
        {
          "source": "ministry",
          "page": 25,
          "serial": 187
        }
      ],
      "maturity": "mid",
      "consumption": [
        "رطب"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 170,
          "shape": "أسطواني",
          "size": "متوسط",
          "color": "أصفر"
        },
        {
          "stage": "رطب",
          "page": 170,
          "shape": "أسطواني",
          "size": "متوسط",
          "color": "بني مصفر"
        },
        {
          "stage": "تمر",
          "page": 170,
          "shape": "أسطواني",
          "size": "متوسط",
          "color": "بني فاتح"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 169
      },
      "profilePage": 169,
      "historicalOnly": false
    },
    {
      "id": "date-021",
      "name": "غر",
      "aliases": [],
      "regions": [
        "riyadh",
        "eastern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 35,
          "region": "eastern"
        },
        {
          "source": "ncpd2024",
          "page": 153
        },
        {
          "source": "ncpd2024",
          "page": 153,
          "region": "eastern"
        },
        {
          "source": "ministry",
          "page": 25,
          "serial": 195
        }
      ],
      "maturity": "early",
      "consumption": [
        "رطب"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 154,
          "shape": "محدب مستطيل",
          "size": "متوسط",
          "color": "أصفر"
        },
        {
          "stage": "رطب",
          "page": 154,
          "shape": "محدب مستطيل",
          "size": "متوسط",
          "color": "بني مصفر"
        }
      ],
      "observations": [
        {
          "kind": "bisr",
          "label": "النصف الأول من يونيو",
          "months": [
            6
          ],
          "region": "eastern",
          "scope": "الأحساء والقطيف",
          "ref": {
            "source": "ncpd2024",
            "page": 153
          }
        },
        {
          "kind": "rutab",
          "label": "نهاية النصف الثاني من يونيو",
          "months": [
            6
          ],
          "region": "eastern",
          "scope": "الأحساء والقطيف",
          "ref": {
            "source": "ncpd2024",
            "page": 153
          }
        }
      ],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "موصوف في الأحساء والقطيف."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 153
      },
      "profilePage": 153,
      "historicalOnly": false
    },
    {
      "id": "date-022",
      "name": "نبتة علي",
      "aliases": [],
      "regions": [
        "riyadh",
        "qassim"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 36,
          "region": "qassim"
        },
        {
          "source": "ncpd2024",
          "page": 191
        },
        {
          "source": "ncpd2024",
          "page": 191,
          "region": "qassim"
        },
        {
          "source": "ministry",
          "page": 27,
          "serial": 273
        }
      ],
      "maturity": "mid",
      "consumption": [
        "رطب",
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 192,
          "shape": "بيضوي مستطيل",
          "size": "متوسط إلى كبير",
          "color": "أصفر"
        },
        {
          "stage": "رطب",
          "page": 192,
          "shape": "بيضوي مستطيل",
          "size": "متوسط إلى كبير",
          "color": "كهرماني"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "قليل الألياف.",
        "يكرر المرجع اسم أحد الأطوار في بطاقة الثمرة؛ حُذفت الخانة الملتبسة بدل تخمين الطور المقصود."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 191
      },
      "profilePage": 191,
      "historicalOnly": false
    },
    {
      "id": "date-023",
      "name": "روثانة",
      "aliases": [
        "الروثانة",
        "الروثانه"
      ],
      "regions": [
        "riyadh",
        "madina",
        "asir"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 37,
          "region": "madina"
        },
        {
          "source": "ncpd2024",
          "page": 42,
          "region": "asir"
        },
        {
          "source": "ncpd2024",
          "page": 199
        },
        {
          "source": "ncpd2024",
          "page": 199,
          "region": "madina"
        },
        {
          "source": "ncpd2024",
          "page": 199,
          "region": "riyadh"
        }
      ],
      "maturity": "early",
      "consumption": [
        "رطب"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 200,
          "shape": "بيضوي",
          "size": "متوسط",
          "color": "أصفر"
        },
        {
          "stage": "رطب",
          "page": 200,
          "shape": "بيضوي",
          "size": "متوسط إلى كبير",
          "color": "بني أصفر"
        },
        {
          "stage": "تمر",
          "page": 200,
          "shape": "بيضوي",
          "size": "متوسط",
          "color": "بني ذهبي"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 199
      },
      "profilePage": 199,
      "historicalOnly": false
    },
    {
      "id": "date-024",
      "name": "أم الخشب",
      "aliases": [
        "أم خشب"
      ],
      "regions": [
        "riyadh",
        "qassim",
        "madina",
        "northern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 36,
          "region": "qassim"
        },
        {
          "source": "ncpd2024",
          "page": 37,
          "region": "madina"
        },
        {
          "source": "ncpd2024",
          "page": 41,
          "region": "northern"
        },
        {
          "source": "ncpd2024",
          "page": 87
        },
        {
          "source": "ncpd2024",
          "page": 87,
          "region": "qassim"
        },
        {
          "source": "ministry",
          "page": 24,
          "serial": 12
        }
      ],
      "maturity": "mid",
      "consumption": [
        "رطب",
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 88,
          "shape": "بيضوي مستطيل",
          "size": "متوسط إلى كبير",
          "color": "أحمر فاتح"
        },
        {
          "stage": "رطب",
          "page": 88,
          "shape": "بيضوي مستطيل",
          "size": "متوسط إلى كبير",
          "color": "كستنائي"
        },
        {
          "stage": "تمر",
          "page": 88,
          "shape": "بيضوي مستطيل",
          "size": "متوسط إلى كبير",
          "color": "كستنائي"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 87
      },
      "profilePage": 87,
      "historicalOnly": false
    },
    {
      "id": "date-025",
      "name": "حلا",
      "aliases": [],
      "regions": [
        "riyadh"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ministry",
          "page": 24,
          "serial": 59
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-026",
      "name": "أبو منيف",
      "aliases": [],
      "regions": [
        "riyadh"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ministry",
          "page": 24,
          "serial": 4
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-027",
      "name": "حلوة",
      "aliases": [
        "الحلوة",
        "الحلوه"
      ],
      "regions": [
        "riyadh",
        "qassim",
        "madina",
        "hail",
        "northern",
        "jouf",
        "tabuk"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 36,
          "region": "qassim"
        },
        {
          "source": "ncpd2024",
          "page": 37,
          "region": "madina"
        },
        {
          "source": "ncpd2024",
          "page": 39,
          "region": "hail"
        },
        {
          "source": "ncpd2024",
          "page": 41,
          "region": "northern"
        },
        {
          "source": "ncpd2024",
          "page": 42,
          "region": "jouf"
        },
        {
          "source": "ncpd2024",
          "page": 42,
          "region": "tabuk"
        },
        {
          "source": "ncpd2024",
          "page": 55
        },
        {
          "source": "ncpd2024",
          "page": 55,
          "region": "jouf"
        },
        {
          "source": "ncpd2024",
          "page": 55,
          "region": "hail"
        },
        {
          "source": "ncpd2024",
          "page": 55,
          "region": "madina"
        }
      ],
      "maturity": "mid",
      "consumption": [
        "بسر",
        "رطب",
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 56,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "أحمر"
        },
        {
          "stage": "رطب",
          "page": 56,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "أحمر مسمر"
        },
        {
          "stage": "تمر",
          "page": 56,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "مسمر"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "انتشاره الرئيس في الجوف وحائل."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 55
      },
      "profilePage": 55,
      "historicalOnly": false
    },
    {
      "id": "date-028",
      "name": "قطار",
      "aliases": [],
      "regions": [
        "riyadh"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ministry",
          "page": 25,
          "serial": 210
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-029",
      "name": "ذاوي",
      "aliases": [
        "ذاوى"
      ],
      "regions": [
        "riyadh"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 67
        },
        {
          "source": "ncpd2024",
          "page": 67,
          "region": "riyadh"
        }
      ],
      "maturity": "mid",
      "consumption": [
        "رطب",
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 68,
          "shape": "بيضوي مستطيل",
          "size": "كبير",
          "color": "أحمر مسمر"
        },
        {
          "stage": "رطب",
          "page": 68,
          "shape": "بيضوي مستطيل",
          "size": "كبير",
          "color": "غير محسوم في نص المرجع",
          "colorUnclear": "أحمر قابض"
        },
        {
          "stage": "تمر",
          "page": 68,
          "shape": "بيضوي مستطيل",
          "size": "كبير",
          "color": "أحمر مسمر"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "الوصف اللوني في إحدى الخانات ملتبس في النص العربي؛ لم يعرض بوصفه لونًا مؤكدًا."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 67
      },
      "profilePage": 67,
      "historicalOnly": false
    },
    {
      "id": "date-030",
      "name": "حقي",
      "aliases": [
        "حقى"
      ],
      "regions": [
        "riyadh"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ministry",
          "page": 24,
          "serial": 57
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-031",
      "name": "شقراء",
      "aliases": [],
      "regions": [
        "riyadh",
        "qassim"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 36,
          "region": "qassim"
        },
        {
          "source": "ncpd2024",
          "page": 167
        },
        {
          "source": "ncpd2024",
          "page": 167,
          "region": "qassim"
        },
        {
          "source": "ministry",
          "page": 25,
          "serial": 155
        }
      ],
      "maturity": "mid",
      "consumption": [
        "رطب",
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 168,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "أحمر"
        },
        {
          "stage": "رطب",
          "page": 168,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "غير محسوم في نص المرجع",
          "colorUnclear": "أحمر قابض"
        },
        {
          "stage": "تمر",
          "page": 168,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "غير محسوم في نص المرجع",
          "colorUnclear": "بني قابض"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "الوصف اللوني في إحدى الخانات ملتبس في النص العربي؛ لم يعرض بوصفه لونًا مؤكدًا."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 167
      },
      "profilePage": 167,
      "historicalOnly": false
    },
    {
      "id": "date-032",
      "name": "مجلي",
      "aliases": [
        "مجلى"
      ],
      "regions": [
        "riyadh"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 108
        },
        {
          "source": "ncpd2024",
          "page": 108,
          "region": "riyadh"
        },
        {
          "source": "ministry",
          "page": 27,
          "serial": 236
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [
        {
          "stage": "تمر",
          "shape": "إهليلجي",
          "size": "متوسط",
          "color": "بني محمر",
          "page": 108
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "ورد وصف الثمرة في هذا الطور فقط؛ لا تحدد الصفحة موسم النضج أو جميع أطوار الاستهلاك."
      ],
      "profilePage": 108,
      "historicalOnly": false
    },
    {
      "id": "date-033",
      "name": "جفير",
      "aliases": [],
      "regions": [
        "riyadh"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 101
        },
        {
          "source": "ncpd2024",
          "page": 101,
          "region": "riyadh"
        },
        {
          "source": "ministry",
          "page": 24,
          "serial": 45
        }
      ],
      "maturity": "mid",
      "consumption": [
        "رطب",
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 102,
          "shape": "أسطواني",
          "size": "متوسط",
          "color": "بني"
        },
        {
          "stage": "رطب",
          "page": 102,
          "shape": "أسطواني",
          "size": "متوسط",
          "color": "بني"
        },
        {
          "stage": "تمر",
          "page": 102,
          "shape": "أسطواني",
          "size": "متوسط",
          "color": "بني غامق"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 101
      },
      "profilePage": 101,
      "historicalOnly": false
    },
    {
      "id": "date-034",
      "name": "نبتة جلاجل",
      "aliases": [],
      "regions": [
        "riyadh"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ministry",
          "page": 27,
          "serial": 264
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-035",
      "name": "أم الحمام",
      "aliases": [
        "أم حمام"
      ],
      "regions": [
        "riyadh",
        "qassim"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 36,
          "region": "qassim"
        },
        {
          "source": "ministry",
          "page": 24,
          "serial": 11
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-036",
      "name": "حقاقي",
      "aliases": [
        "حقاقى"
      ],
      "regions": [
        "riyadh"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ministry",
          "page": 24,
          "serial": 56
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-037",
      "name": "أم رحيم",
      "aliases": [
        "ام رحيم"
      ],
      "regions": [
        "riyadh",
        "eastern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 35,
          "region": "eastern"
        },
        {
          "source": "ncpd2024",
          "page": 93
        },
        {
          "source": "ncpd2024",
          "page": 93,
          "region": "eastern"
        },
        {
          "source": "ministry",
          "page": 24,
          "serial": 15
        }
      ],
      "maturity": "late",
      "consumption": [
        "بسر",
        "رطب"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 94,
          "shape": "بيضوي",
          "size": "صغير",
          "color": "أصفر فاتح"
        },
        {
          "stage": "رطب",
          "page": 94,
          "shape": "بيضوي",
          "size": "صغير",
          "color": "بني مصفر"
        },
        {
          "stage": "تمر",
          "page": 94,
          "shape": "بيضوي",
          "size": "صغير",
          "color": "بني فاتح"
        }
      ],
      "observations": [
        {
          "kind": "maturity",
          "label": "أواخر أغسطس وأوائل سبتمبر",
          "months": [
            8,
            9
          ],
          "region": "eastern",
          "scope": "الأحساء؛ توقيت نضج موصوف وليس نهاية الجني.",
          "ref": {
            "source": "ncpd2024",
            "page": 93
          }
        }
      ],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "الأحساء؛ جودة التمر أقل من مراحل الاستهلاك المبكرة وفق الدليل."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 93
      },
      "profilePage": 93,
      "historicalOnly": false
    },
    {
      "id": "date-038",
      "name": "حلاوة",
      "aliases": [],
      "regions": [
        "riyadh"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ministry",
          "page": 24,
          "serial": 60
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-039",
      "name": "شهل",
      "aliases": [
        "الشهل"
      ],
      "regions": [
        "riyadh",
        "eastern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 35,
          "region": "eastern"
        },
        {
          "source": "ncpd2024",
          "page": 209
        },
        {
          "source": "ncpd2024",
          "page": 209,
          "region": "eastern"
        },
        {
          "source": "ministry",
          "page": 25,
          "serial": 162
        }
      ],
      "maturity": "late",
      "consumption": [
        "رطب"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 210,
          "shape": "بيضوي",
          "size": "متوسط",
          "color": "أصفر محمر"
        },
        {
          "stage": "رطب",
          "page": 210,
          "shape": "بيضوي",
          "size": "متوسط",
          "color": "أصفر محمر"
        },
        {
          "stage": "تمر",
          "page": 210,
          "shape": "بيضوي",
          "size": "متوسط",
          "color": "محمر"
        }
      ],
      "observations": [
        {
          "kind": "maturity",
          "label": "بداية سبتمبر",
          "months": [
            9
          ],
          "region": "eastern",
          "scope": "الأحساء",
          "ref": {
            "source": "ncpd2024",
            "page": 209
          }
        }
      ],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "الأحساء؛ الرطب أجود من التمر بحسب الدليل."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 209
      },
      "profilePage": 209,
      "historicalOnly": false
    },
    {
      "id": "date-040",
      "name": "سباكة",
      "aliases": [],
      "regions": [
        "riyadh",
        "qassim"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 36,
          "region": "qassim"
        },
        {
          "source": "ncpd2024",
          "page": 201
        },
        {
          "source": "ncpd2024",
          "page": 201,
          "region": "qassim"
        }
      ],
      "maturity": "mid",
      "consumption": [
        "رطب",
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 202,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "أصفر"
        },
        {
          "stage": "رطب",
          "page": 202,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "بني ذهبي"
        },
        {
          "stage": "تمر",
          "page": 202,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "بني فاتح"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 201
      },
      "profilePage": 201,
      "historicalOnly": false
    },
    {
      "id": "date-041",
      "name": "رشودية",
      "aliases": [],
      "regions": [
        "riyadh",
        "qassim"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 36,
          "region": "qassim"
        },
        {
          "source": "ncpd2024",
          "page": 73
        },
        {
          "source": "ncpd2024",
          "page": 73,
          "region": "qassim"
        }
      ],
      "maturity": "mid",
      "consumption": [
        "رطب"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 74,
          "shape": "بيضوي مستطيل",
          "size": "متوسط إلى كبير",
          "color": "أصفر"
        },
        {
          "stage": "رطب",
          "page": 74,
          "shape": "بيضوي مستطيل",
          "size": "متوسط إلى كبير",
          "color": "أصفر ذهبي"
        },
        {
          "stage": "تمر",
          "page": 74,
          "shape": "بيضوي مستطيل",
          "size": "متوسط إلى كبير",
          "color": "بني فاتح"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 73
      },
      "profilePage": 73,
      "historicalOnly": false
    },
    {
      "id": "date-042",
      "name": "أم كبار",
      "aliases": [],
      "regions": [
        "riyadh",
        "qassim",
        "madina"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 36,
          "region": "qassim"
        },
        {
          "source": "ncpd2024",
          "page": 99
        },
        {
          "source": "ncpd2024",
          "page": 99,
          "region": "qassim"
        },
        {
          "source": "ncpd2024",
          "page": 99,
          "region": "madina"
        },
        {
          "source": "ministry",
          "page": 24,
          "serial": 17
        }
      ],
      "maturity": "mid",
      "consumption": [
        "رطب"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 100,
          "shape": "بيضوي",
          "size": "متوسط",
          "color": "غير محسوم في نص المرجع",
          "colorUnclear": "أصفر قابض"
        },
        {
          "stage": "رطب",
          "page": 100,
          "shape": "بيضوي",
          "size": "متوسط",
          "color": "بني مصفر"
        },
        {
          "stage": "تمر",
          "page": 100,
          "shape": "بيضوي",
          "size": "متوسط",
          "color": "غير محسوم في نص المرجع",
          "colorUnclear": "بني قابض"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "الوصف اللوني في إحدى الخانات ملتبس في النص العربي؛ لم يعرض بوصفه لونًا مؤكدًا."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 99
      },
      "profilePage": 99,
      "historicalOnly": false
    },
    {
      "id": "date-043",
      "name": "برني",
      "aliases": [
        "البرني",
        "برنى"
      ],
      "regions": [
        "riyadh",
        "najran",
        "tabuk",
        "asir"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 40,
          "region": "najran"
        },
        {
          "source": "ncpd2024",
          "page": 42,
          "region": "tabuk"
        },
        {
          "source": "ncpd2024",
          "page": 42,
          "region": "asir"
        },
        {
          "source": "ministry",
          "page": 24,
          "serial": 23
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-044",
      "name": "خصاب",
      "aliases": [],
      "regions": [
        "riyadh",
        "eastern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 35,
          "region": "eastern"
        },
        {
          "source": "ncpd2024",
          "page": 57
        },
        {
          "source": "ncpd2024",
          "page": 57,
          "region": "eastern"
        }
      ],
      "maturity": "late",
      "consumption": [
        "رطب"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 58,
          "shape": "بيضوي منعكس",
          "size": "متوسط",
          "color": "أحمر"
        },
        {
          "stage": "رطب",
          "page": 58,
          "shape": "بيضوي منعكس",
          "size": "متوسط",
          "color": "أحمر داكن"
        },
        {
          "stage": "تمر",
          "page": 58,
          "shape": "بيضوي منعكس",
          "size": "متوسط",
          "color": "مسمر"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "يوصف في الدليل ضمن أصناف الأحساء."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 57
      },
      "profilePage": 57,
      "historicalOnly": false
    },
    {
      "id": "date-045",
      "name": "سكرية حمراء",
      "aliases": [],
      "regions": [
        "riyadh"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-046",
      "name": "خشرم",
      "aliases": [],
      "regions": [
        "riyadh"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-047",
      "name": "أم قوز",
      "aliases": [],
      "regions": [
        "riyadh"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ministry",
          "page": 24,
          "serial": 16
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-048",
      "name": "دقل",
      "aliases": [],
      "regions": [
        "riyadh"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-049",
      "name": "أم الذر",
      "aliases": [],
      "regions": [
        "riyadh"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 34,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 121
        },
        {
          "source": "ncpd2024",
          "page": 121,
          "region": "riyadh"
        },
        {
          "source": "ministry",
          "page": 24,
          "serial": 13
        }
      ],
      "maturity": "mid",
      "consumption": [
        "رطب",
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 122,
          "shape": "بيضوي مستطيل",
          "size": "صغير إلى متوسط",
          "color": "بني ذهبي"
        },
        {
          "stage": "رطب",
          "page": 122,
          "shape": "بيضوي مستطيل",
          "size": "صغير إلى متوسط",
          "color": "بني مصفر"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "موصوف في محافظة الأفلاج."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 121
      },
      "profilePage": 121,
      "historicalOnly": false
    },
    {
      "id": "date-050",
      "name": "شبيبي",
      "aliases": [],
      "regions": [
        "eastern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 35,
          "region": "eastern"
        },
        {
          "source": "ncpd2024",
          "page": 207
        },
        {
          "source": "ncpd2024",
          "page": 207,
          "region": "eastern"
        },
        {
          "source": "ministry",
          "page": 25,
          "serial": 153
        }
      ],
      "maturity": "mid",
      "consumption": [
        "رطب",
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 208,
          "shape": "بيضوي",
          "size": "متوسط إلى كبير",
          "color": "أصفر"
        },
        {
          "stage": "رطب",
          "page": 208,
          "shape": "بيضوي",
          "size": "متوسط إلى كبير",
          "color": "كهرماني"
        },
        {
          "stage": "تمر",
          "page": 208,
          "shape": "بيضوي",
          "size": "متوسط إلى كبير",
          "color": "كهرماني غامق"
        }
      ],
      "observations": [
        {
          "kind": "maturity",
          "label": "أغسطس",
          "months": [
            8
          ],
          "region": "eastern",
          "scope": "الأحساء والقطيف",
          "ref": {
            "source": "ncpd2024",
            "page": 207
          }
        }
      ],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "موصوف في الأحساء والقطيف."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 207
      },
      "profilePage": 207,
      "historicalOnly": false
    },
    {
      "id": "date-051",
      "name": "خنيزي",
      "aliases": [],
      "regions": [
        "eastern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 35,
          "region": "eastern"
        },
        {
          "source": "ncpd2024",
          "page": 63
        },
        {
          "source": "ncpd2024",
          "page": 63,
          "region": "eastern"
        }
      ],
      "maturity": "mid",
      "consumption": [
        "بسر",
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 64,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "أحمر"
        },
        {
          "stage": "رطب",
          "page": 64,
          "shape": "بيضوي",
          "size": "متوسط",
          "color": "أحمر داكن"
        },
        {
          "stage": "تمر",
          "page": 64,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "بني داكن"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "الأحساء والقطيف؛ يستخدم البسر في إعداد السلوق بالسلق والتجفيف."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 63
      },
      "profilePage": 63,
      "historicalOnly": false
    },
    {
      "id": "date-052",
      "name": "وصيلي",
      "aliases": [],
      "regions": [
        "eastern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 35,
          "region": "eastern"
        },
        {
          "source": "ncpd2024",
          "page": 111
        },
        {
          "source": "ncpd2024",
          "page": 111,
          "region": "eastern"
        },
        {
          "source": "ministry",
          "page": 27,
          "serial": 286
        }
      ],
      "maturity": "mid",
      "consumption": [
        "رطب",
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 112,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "أحمر"
        },
        {
          "stage": "رطب",
          "page": 112,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "غير محسوم في نص المرجع",
          "colorUnclear": "أحمر قابض"
        },
        {
          "stage": "تمر",
          "page": 112,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "غير محسوم في نص المرجع",
          "colorUnclear": "أحمر قابض"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "الوصف اللوني في إحدى الخانات ملتبس في النص العربي؛ لم يعرض بوصفه لونًا مؤكدًا."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 111
      },
      "profilePage": 111,
      "historicalOnly": false
    },
    {
      "id": "date-053",
      "name": "حاتمي",
      "aliases": [],
      "regions": [
        "eastern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 35,
          "region": "eastern"
        },
        {
          "source": "ncpd2024",
          "page": 91
        },
        {
          "source": "ncpd2024",
          "page": 91,
          "region": "eastern"
        },
        {
          "source": "ministry",
          "page": 24,
          "serial": 50
        }
      ],
      "maturity": "mid",
      "consumption": [
        "رطب"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 92,
          "shape": "بيضوي",
          "size": "متوسط",
          "color": "أصفر"
        },
        {
          "stage": "رطب",
          "page": 92,
          "shape": "بيضوي",
          "size": "متوسط",
          "color": "بني مصفر"
        },
        {
          "stage": "تمر",
          "page": 92,
          "shape": "بيضوي",
          "size": "متوسط",
          "color": "بني"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 91
      },
      "profilePage": 91,
      "historicalOnly": false
    },
    {
      "id": "date-054",
      "name": "طيار",
      "aliases": [],
      "regions": [
        "eastern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 35,
          "region": "eastern"
        },
        {
          "source": "ncpd2024",
          "page": 133
        },
        {
          "source": "ncpd2024",
          "page": 133,
          "region": "eastern"
        },
        {
          "source": "ministry",
          "page": 25,
          "serial": 181
        }
      ],
      "maturity": "early",
      "consumption": [
        "رطب"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 134,
          "shape": "بيضوي مستطيل",
          "size": "صغير",
          "color": "أصفر مخضر"
        },
        {
          "stage": "رطب",
          "page": 134,
          "shape": "بيضوي مستطيل",
          "size": "صغير",
          "color": "بني مصفر"
        },
        {
          "stage": "تمر",
          "page": 134,
          "shape": "بيضوي مستطيل",
          "size": "صغير",
          "color": "غير محسوم في نص المرجع",
          "colorUnclear": "بني قابض"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "موصوف في الأحساء؛ لحم الثمرة قليل.",
        "الوصف اللوني في إحدى الخانات ملتبس في النص العربي؛ لم يعرض بوصفه لونًا مؤكدًا."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 133
      },
      "profilePage": 133,
      "historicalOnly": false
    },
    {
      "id": "date-055",
      "name": "بكيرة",
      "aliases": [
        "بكيره"
      ],
      "regions": [
        "eastern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 35,
          "region": "eastern"
        },
        {
          "source": "ncpd2024",
          "page": 95
        },
        {
          "source": "ncpd2024",
          "page": 95,
          "region": "eastern"
        },
        {
          "source": "ministry",
          "page": 24,
          "serial": 32
        }
      ],
      "maturity": "early",
      "consumption": [
        "رطب"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 96,
          "shape": "بيضوي",
          "size": "متوسط",
          "color": "أصفر ذهبي"
        },
        {
          "stage": "رطب",
          "page": 96,
          "shape": "بيضوي",
          "size": "متوسط",
          "color": "بني مصفر"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "القطيف؛ كبيرة الثمار وقليلة الألياف بحسب وصف الدليل."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 95
      },
      "profilePage": 95,
      "historicalOnly": false
    },
    {
      "id": "date-056",
      "name": "سكري أصفر",
      "aliases": [],
      "regions": [
        "qassim"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 36,
          "region": "qassim"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-057",
      "name": "سكري أحمر",
      "aliases": [],
      "regions": [
        "qassim"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 36,
          "region": "qassim"
        },
        {
          "source": "ncpd2024",
          "page": 161
        },
        {
          "source": "ncpd2024",
          "page": 161,
          "region": "qassim"
        },
        {
          "source": "ministry",
          "page": 25,
          "serial": 139
        }
      ],
      "maturity": "mid",
      "consumption": [
        "رطب",
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 162,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "أصفر محمر"
        },
        {
          "stage": "رطب",
          "page": 162,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "بني محمر"
        },
        {
          "stage": "تمر",
          "page": 162,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "بني"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 161
      },
      "profilePage": 161,
      "historicalOnly": false
    },
    {
      "id": "date-058",
      "name": "روثان",
      "aliases": [],
      "regions": [
        "qassim"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 36,
          "region": "qassim"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-059",
      "name": "نبتة رشيد",
      "aliases": [],
      "regions": [
        "qassim"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 36,
          "region": "qassim"
        },
        {
          "source": "ministry",
          "page": 27,
          "serial": 266
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-060",
      "name": "ونانة",
      "aliases": [
        "ونان",
        "ونانه"
      ],
      "regions": [
        "qassim",
        "madina"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 36,
          "region": "qassim"
        },
        {
          "source": "ncpd2024",
          "page": 37,
          "region": "madina"
        },
        {
          "source": "ncpd2024",
          "page": 195
        },
        {
          "source": "ncpd2024",
          "page": 195,
          "region": "qassim"
        },
        {
          "source": "ministry",
          "page": 27,
          "serial": 287
        }
      ],
      "maturity": "mid",
      "consumption": [
        "رطب",
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 196,
          "shape": "بيضوي مستطيل",
          "size": "كبير",
          "color": "أصفر"
        },
        {
          "stage": "رطب",
          "page": 196,
          "shape": "بيضوي مستطيل",
          "size": "كبير",
          "color": "بني"
        },
        {
          "stage": "تمر",
          "page": 196,
          "shape": "بيضوي مستطيل",
          "size": "كبير",
          "color": "بني غامق"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 195
      },
      "profilePage": 195,
      "historicalOnly": false
    },
    {
      "id": "date-061",
      "name": "لاحمية",
      "aliases": [],
      "regions": [
        "qassim"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 36,
          "region": "qassim"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-062",
      "name": "بريمي",
      "aliases": [],
      "regions": [
        "qassim",
        "eastern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 36,
          "region": "qassim"
        },
        {
          "source": "ncpd2024",
          "page": 89
        },
        {
          "source": "ncpd2024",
          "page": 89,
          "region": "eastern"
        },
        {
          "source": "ministry",
          "page": 24,
          "serial": 30
        }
      ],
      "maturity": "early",
      "consumption": [
        "بسر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 90,
          "shape": "بيضوي مستطيل",
          "size": "متوسط إلى صغير",
          "color": "أصفر أو مشمشي"
        },
        {
          "stage": "رطب",
          "page": 90,
          "shape": "بيضوي مستطيل",
          "size": "متوسط إلى صغير",
          "color": "مشمشي"
        },
        {
          "stage": "تمر",
          "page": 90,
          "shape": "بيضوي مستطيل",
          "size": "متوسط إلى صغير",
          "color": "بني"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "موصوف في القطيف؛ يباع البسر مطبوخًا، مع تساقط مرتفع للثمار عند اكتمال التمر."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 89
      },
      "profilePage": 89,
      "historicalOnly": false
    },
    {
      "id": "date-063",
      "name": "حوشانة",
      "aliases": [],
      "regions": [
        "qassim"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 36,
          "region": "qassim"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-064",
      "name": "منيفي أحمر",
      "aliases": [],
      "regions": [
        "qassim"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 36,
          "region": "qassim"
        },
        {
          "source": "ministry",
          "page": 27,
          "serial": 255
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-065",
      "name": "منيفي أصفر",
      "aliases": [],
      "regions": [
        "qassim"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 36,
          "region": "qassim"
        },
        {
          "source": "ministry",
          "page": 27,
          "serial": 256
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-066",
      "name": "حلوة واسط",
      "aliases": [],
      "regions": [
        "qassim"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 36,
          "region": "qassim"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-067",
      "name": "فنخا",
      "aliases": [],
      "regions": [
        "qassim",
        "northern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 36,
          "region": "qassim"
        },
        {
          "source": "ncpd2024",
          "page": 41,
          "region": "northern"
        },
        {
          "source": "ministry",
          "page": 25,
          "serial": 202
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-068",
      "name": "مطواح",
      "aliases": [],
      "regions": [
        "qassim"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 36,
          "region": "qassim"
        },
        {
          "source": "ministry",
          "page": 27,
          "serial": 246
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-069",
      "name": "قطارة",
      "aliases": [],
      "regions": [
        "qassim",
        "riyadh"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 36,
          "region": "qassim"
        },
        {
          "source": "ncpd2024",
          "page": 181
        },
        {
          "source": "ncpd2024",
          "page": 181,
          "region": "riyadh"
        },
        {
          "source": "ncpd2024",
          "page": 181,
          "region": "qassim"
        },
        {
          "source": "ministry",
          "page": 25,
          "serial": 211
        }
      ],
      "maturity": "mid",
      "consumption": [
        "رطب"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 182,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "أحمر"
        },
        {
          "stage": "رطب",
          "page": 182,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "أحمر مسمر"
        },
        {
          "stage": "تمر",
          "page": 182,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "مسمر"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 181
      },
      "profilePage": 181,
      "historicalOnly": false
    },
    {
      "id": "date-070",
      "name": "سالمية",
      "aliases": [],
      "regions": [
        "qassim"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 36,
          "region": "qassim"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-071",
      "name": "عجوة",
      "aliases": [
        "العجوة"
      ],
      "regions": [
        "madina"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 37,
          "region": "madina"
        },
        {
          "source": "ncpd2024",
          "page": 151
        },
        {
          "source": "ncpd2024",
          "page": 151,
          "region": "madina"
        },
        {
          "source": "ministry",
          "page": 25,
          "serial": 185
        }
      ],
      "maturity": "mid",
      "consumption": [
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 152,
          "shape": "بيضوي",
          "size": "متوسط",
          "color": "أحمر مسمر"
        },
        {
          "stage": "رطب",
          "page": 152,
          "shape": "بيضوي",
          "size": "متوسط",
          "color": "أحمر مسمر"
        },
        {
          "stage": "تمر",
          "page": 152,
          "shape": "بيضوي",
          "size": "متوسط",
          "color": "مسمر"
        }
      ],
      "observations": [
        {
          "kind": "bisr",
          "label": "النصف الثاني من يونيو",
          "months": [
            6
          ],
          "region": "madina",
          "scope": "المدينة المنورة",
          "ref": {
            "source": "ncpd2024",
            "page": 151
          }
        },
        {
          "kind": "tamr",
          "label": "أغسطس",
          "months": [
            8
          ],
          "region": "madina",
          "scope": "المدينة المنورة",
          "ref": {
            "source": "ncpd2024",
            "page": 151
          }
        }
      ],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "تفرق الصفحة بين بلوغ البسر وبلوغ التمر."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 151
      },
      "profilePage": 151,
      "historicalOnly": false
    },
    {
      "id": "date-072",
      "name": "عنبرة",
      "aliases": [],
      "regions": [
        "madina"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 37,
          "region": "madina"
        },
        {
          "source": "ncpd2024",
          "page": 197
        },
        {
          "source": "ncpd2024",
          "page": 197,
          "region": "madina"
        },
        {
          "source": "ministry",
          "page": 25,
          "serial": 191
        }
      ],
      "maturity": "late",
      "consumption": [
        "تمر"
      ],
      "traits": [
        {
          "stage": "تمر",
          "page": 198,
          "shape": "محدب مستطيل",
          "size": "كبير",
          "color": "كستنائي محمر"
        },
        {
          "stage": "رطب",
          "page": 198,
          "shape": "محدب مستطيل",
          "size": "كبير",
          "color": "كستنائي محمر"
        },
        {
          "stage": "بسر",
          "page": 198,
          "shape": "محدب مستطيل",
          "size": "كبير",
          "color": "أحمر"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "محدود الانتشار ومتوسط الإنتاج في وصف الدليل."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 197
      },
      "profilePage": 197,
      "historicalOnly": false
    },
    {
      "id": "date-073",
      "name": "صفاوي",
      "aliases": [
        "الصفاوي"
      ],
      "regions": [
        "madina"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 37,
          "region": "madina"
        },
        {
          "source": "ncpd2024",
          "page": 141
        },
        {
          "source": "ncpd2024",
          "page": 141,
          "region": "madina"
        },
        {
          "source": "ministry",
          "page": 25,
          "serial": 169
        }
      ],
      "maturity": "late",
      "consumption": [
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 142,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "برتقالي محمر"
        },
        {
          "stage": "رطب",
          "page": 142,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "أحمر"
        },
        {
          "stage": "تمر",
          "page": 142,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "أحمر مسمر"
        }
      ],
      "observations": [
        {
          "kind": "bisr",
          "label": "نهاية يونيو",
          "months": [
            6
          ],
          "region": "madina",
          "scope": "المدينة المنورة",
          "ref": {
            "source": "ncpd2024",
            "page": 141
          }
        },
        {
          "kind": "tamr",
          "label": "النصف الثاني من أغسطس",
          "months": [
            8
          ],
          "region": "madina",
          "scope": "المدينة المنورة",
          "ref": {
            "source": "ncpd2024",
            "page": 141
          }
        }
      ],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "غزير الإنتاج بحسب الدليل."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 141
      },
      "profilePage": 141,
      "historicalOnly": false
    },
    {
      "id": "date-074",
      "name": "ربيعة",
      "aliases": [
        "الربيعة",
        "الربيعية",
        "ربيعية"
      ],
      "regions": [
        "madina",
        "makkah"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 37,
          "region": "madina"
        },
        {
          "source": "ncpd2024",
          "page": 38,
          "region": "makkah"
        },
        {
          "source": "ncpd2024",
          "page": 69
        },
        {
          "source": "ncpd2024",
          "page": 69,
          "region": "madina"
        }
      ],
      "maturity": "early",
      "consumption": [
        "رطب",
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 70,
          "shape": "بيضوي مستطيل",
          "size": "كبير",
          "color": "أصفر"
        },
        {
          "stage": "رطب",
          "page": 70,
          "shape": "بيضوي مستطيل",
          "size": "كبير",
          "color": "بني مصفر"
        },
        {
          "stage": "تمر",
          "page": 70,
          "shape": "بيضوي مستطيل",
          "size": "كبير",
          "color": "بني غامق"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 69
      },
      "profilePage": 69,
      "historicalOnly": false
    },
    {
      "id": "date-075",
      "name": "شلبي",
      "aliases": [
        "الشلبي"
      ],
      "regions": [
        "madina"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 37,
          "region": "madina"
        },
        {
          "source": "ncpd2024",
          "page": 127
        },
        {
          "source": "ncpd2024",
          "page": 127,
          "region": "madina"
        },
        {
          "source": "ministry",
          "page": 25,
          "serial": 159
        }
      ],
      "maturity": "mid",
      "consumption": [
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 128,
          "shape": "أسطواني",
          "size": "كبير",
          "color": "برتقالي محمر"
        },
        {
          "stage": "رطب",
          "page": 128,
          "shape": "أسطواني",
          "size": "كبير",
          "color": "غير محسوم في نص المرجع",
          "colorUnclear": "بني قابض"
        },
        {
          "stage": "تمر",
          "page": 128,
          "shape": "أسطواني",
          "size": "كبير",
          "color": "غير محسوم في نص المرجع",
          "colorUnclear": "بني قابض"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "قليل الألياف؛ يستعمل في التجفيف والتعبئة.",
        "الوصف اللوني في إحدى الخانات ملتبس في النص العربي؛ لم يعرض بوصفه لونًا مؤكدًا."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 127
      },
      "profilePage": 127,
      "historicalOnly": false
    },
    {
      "id": "date-076",
      "name": "برني المدينة",
      "aliases": [],
      "regions": [
        "madina"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 37,
          "region": "madina"
        },
        {
          "source": "ncpd2024",
          "page": 51
        },
        {
          "source": "ncpd2024",
          "page": 51,
          "region": "madina"
        },
        {
          "source": "ministry",
          "page": 24,
          "serial": 26
        }
      ],
      "maturity": "late",
      "consumption": [
        "رطب",
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 52,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "أصفر"
        },
        {
          "stage": "رطب",
          "page": 52,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "بني أصفر"
        },
        {
          "stage": "تمر",
          "page": 52,
          "shape": "بيضوي",
          "size": "متوسط",
          "color": "بني"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "لحم نصف جاف؛ يستخدم في التصنيع."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 51
      },
      "profilePage": 51,
      "historicalOnly": false
    },
    {
      "id": "date-077",
      "name": "برني العلا",
      "aliases": [],
      "regions": [
        "madina"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 37,
          "region": "madina"
        },
        {
          "source": "ministry",
          "page": 24,
          "serial": 24
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-078",
      "name": "بيض",
      "aliases": [
        "البيض"
      ],
      "regions": [
        "madina"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 37,
          "region": "madina"
        },
        {
          "source": "ncpd2024",
          "page": 53
        },
        {
          "source": "ncpd2024",
          "page": 53,
          "region": "madina"
        },
        {
          "source": "ministry",
          "page": 24,
          "serial": 37
        }
      ],
      "maturity": "late",
      "consumption": [
        "رطب",
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 54,
          "shape": "بيضوي",
          "size": "متوسط إلى صغير",
          "color": "أصفر"
        },
        {
          "stage": "رطب",
          "page": 54,
          "shape": "بيضوي",
          "size": "متوسط إلى صغير",
          "color": "أصفر مشمشي"
        },
        {
          "stage": "تمر",
          "page": 54,
          "shape": "بيضوي",
          "size": "متوسط إلى صغير",
          "color": "بني فاتح"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "غزير الإنتاج بحسب الدليل."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 53
      },
      "profilePage": 53,
      "historicalOnly": false
    },
    {
      "id": "date-079",
      "name": "برني العيص",
      "aliases": [],
      "regions": [
        "madina",
        "makkah"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 37,
          "region": "madina"
        },
        {
          "source": "ncpd2024",
          "page": 77
        },
        {
          "source": "ncpd2024",
          "page": 77,
          "region": "makkah"
        },
        {
          "source": "ncpd2024",
          "page": 77,
          "region": "madina"
        },
        {
          "source": "ministry",
          "page": 24,
          "serial": 25
        }
      ],
      "maturity": "mid",
      "consumption": [
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 78,
          "shape": "بيضوي مستطيل",
          "size": "كبير",
          "color": "غير محسوم في نص المرجع",
          "colorUnclear": "أصفر قابض"
        },
        {
          "stage": "رطب",
          "page": 78,
          "shape": "بيضوي مستطيل",
          "size": "كبير",
          "color": "بني مصفر"
        },
        {
          "stage": "تمر",
          "page": 78,
          "shape": "بيضوي مستطيل",
          "size": "كبير",
          "color": "بني"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "قوام نصف جاف.",
        "الوصف اللوني في إحدى الخانات ملتبس في النص العربي؛ لم يعرض بوصفه لونًا مؤكدًا."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 77
      },
      "profilePage": 77,
      "historicalOnly": false
    },
    {
      "id": "date-080",
      "name": "روثانة الشرق",
      "aliases": [],
      "regions": [
        "madina"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 37,
          "region": "madina"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-081",
      "name": "سكرة الشرق",
      "aliases": [
        "سكره الشرق"
      ],
      "regions": [
        "madina"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 37,
          "region": "madina"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-082",
      "name": "الحلية",
      "aliases": [],
      "regions": [
        "madina"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 37,
          "region": "madina"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-083",
      "name": "السويدة",
      "aliases": [],
      "regions": [
        "madina"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 37,
          "region": "madina"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-084",
      "name": "مشوك",
      "aliases": [
        "المشوك"
      ],
      "regions": [
        "madina",
        "makkah"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 37,
          "region": "madina"
        },
        {
          "source": "ncpd2024",
          "page": 38,
          "region": "makkah"
        },
        {
          "source": "ministry",
          "page": 27,
          "serial": 245
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-085",
      "name": "متلبن",
      "aliases": [
        "المتلبن"
      ],
      "regions": [
        "madina",
        "makkah"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 37,
          "region": "madina"
        },
        {
          "source": "ncpd2024",
          "page": 38,
          "region": "makkah"
        },
        {
          "source": "ministry",
          "page": 27,
          "serial": 233
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-086",
      "name": "السبع",
      "aliases": [],
      "regions": [
        "madina"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 37,
          "region": "madina"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-087",
      "name": "سكرة البيض",
      "aliases": [],
      "regions": [
        "madina"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 37,
          "region": "madina"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-088",
      "name": "طيبة",
      "aliases": [],
      "regions": [
        "madina"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 37,
          "region": "madina"
        },
        {
          "source": "ministry",
          "page": 25,
          "serial": 182
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-089",
      "name": "أصابع العروس",
      "aliases": [],
      "regions": [
        "madina"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 37,
          "region": "madina"
        },
        {
          "source": "ncpd2024",
          "page": 75
        },
        {
          "source": "ncpd2024",
          "page": 75,
          "region": "madina"
        },
        {
          "source": "ministry",
          "page": 24,
          "serial": 7
        }
      ],
      "maturity": "mid",
      "consumption": [
        "رطب"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 76,
          "shape": "بيضوي مستطيل",
          "size": "متوسط إلى كبير",
          "color": "برتقالي محمر"
        },
        {
          "stage": "رطب",
          "page": 76,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "بني محمر"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "تعتمد منطقة الزراعة هنا على النص العربي؛ الترجمة الإنجليزية في الصفحة تختلف عنه."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 75
      },
      "profilePage": 75,
      "historicalOnly": false
    },
    {
      "id": "date-090",
      "name": "لونة مساعد",
      "aliases": [],
      "regions": [
        "madina"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 37,
          "region": "madina"
        },
        {
          "source": "ministry",
          "page": 27,
          "serial": 229
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-091",
      "name": "سكرة المدينة",
      "aliases": [],
      "regions": [
        "madina"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 37,
          "region": "madina"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-092",
      "name": "الجاوي",
      "aliases": [],
      "regions": [
        "madina"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 37,
          "region": "madina"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-093",
      "name": "الخشيمي",
      "aliases": [],
      "regions": [
        "madina"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 37,
          "region": "madina"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-094",
      "name": "الجعفري",
      "aliases": [],
      "regions": [
        "madina"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 37,
          "region": "madina"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-095",
      "name": "شقري",
      "aliases": [
        "الشقري"
      ],
      "regions": [
        "madina"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 37,
          "region": "madina"
        },
        {
          "source": "ministry",
          "page": 25,
          "serial": 156
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-096",
      "name": "القطارة",
      "aliases": [],
      "regions": [
        "madina"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 37,
          "region": "madina"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-097",
      "name": "لبانة",
      "aliases": [],
      "regions": [
        "madina"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 37,
          "region": "madina"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-098",
      "name": "الجبيلي",
      "aliases": [],
      "regions": [
        "madina"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 37,
          "region": "madina"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-099",
      "name": "حلوة بيضاء",
      "aliases": [],
      "regions": [
        "madina"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 37,
          "region": "madina"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-100",
      "name": "لبان",
      "aliases": [
        "اللبان"
      ],
      "regions": [
        "makkah"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 38,
          "region": "makkah"
        },
        {
          "source": "ministry",
          "page": 27,
          "serial": 226
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-101",
      "name": "حمري",
      "aliases": [
        "الحمري"
      ],
      "regions": [
        "makkah"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 38,
          "region": "makkah"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-102",
      "name": "زعفران",
      "aliases": [],
      "regions": [
        "makkah"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 38,
          "region": "makkah"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-103",
      "name": "الكسبة",
      "aliases": [],
      "regions": [
        "hail"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 39,
          "region": "hail"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-104",
      "name": "الرخيمي",
      "aliases": [],
      "regions": [
        "hail"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 39,
          "region": "hail"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-105",
      "name": "مجهول",
      "aliases": [
        "المجهولة"
      ],
      "regions": [
        "hail",
        "madina"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 39,
          "region": "hail"
        },
        {
          "source": "ncpd2024",
          "page": 147
        },
        {
          "source": "ncpd2024",
          "page": 147,
          "region": "madina"
        },
        {
          "source": "ministry",
          "page": 27,
          "serial": 234
        }
      ],
      "maturity": "early",
      "consumption": [
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 148,
          "shape": "بيضوي مستطيل",
          "size": "كبير،  متوسط،  صغير",
          "color": "أصفر برتقالي"
        },
        {
          "stage": "رطب",
          "page": 148,
          "shape": "بيضوي مستطيل",
          "size": "كبير،  متوسط،  صغير",
          "color": "بني مصفر"
        },
        {
          "stage": "تمر",
          "page": 148,
          "shape": "بيضوي مستطيل",
          "size": "كبير،  متوسط،  صغير",
          "color": "بني محمر"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "صنف تجاري مزروع في المملكة؛ قليل الألياف. تبكير النضج هو وصف هذا الدليل، وليس موعدًا ثابتًا لكل مزرعة."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 147
      },
      "profilePage": 147,
      "historicalOnly": false
    },
    {
      "id": "date-106",
      "name": "حمراء",
      "aliases": [
        "الحمراء"
      ],
      "regions": [
        "hail",
        "najran"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 39,
          "region": "hail"
        },
        {
          "source": "ncpd2024",
          "page": 40,
          "region": "najran"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-107",
      "name": "دقلة حمود",
      "aliases": [],
      "regions": [
        "hail"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 39,
          "region": "hail"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-108",
      "name": "دقلة شويش",
      "aliases": [],
      "regions": [
        "hail"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 39,
          "region": "hail"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-109",
      "name": "دقلة مفتاح",
      "aliases": [],
      "regions": [
        "hail"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 39,
          "region": "hail"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-110",
      "name": "فنخاء",
      "aliases": [],
      "regions": [
        "hail"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 39,
          "region": "hail"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-111",
      "name": "صويرية",
      "aliases": [],
      "regions": [
        "hail"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 39,
          "region": "hail"
        },
        {
          "source": "ministry",
          "page": 25,
          "serial": 177
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-112",
      "name": "هجرية",
      "aliases": [],
      "regions": [
        "hail"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 39,
          "region": "hail"
        },
        {
          "source": "ministry",
          "page": 27,
          "serial": 281
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-113",
      "name": "خديرية",
      "aliases": [],
      "regions": [
        "hail"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 39,
          "region": "hail"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-114",
      "name": "دبية",
      "aliases": [],
      "regions": [
        "hail"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 39,
          "region": "hail"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-115",
      "name": "صفران",
      "aliases": [],
      "regions": [
        "hail"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 39,
          "region": "hail"
        },
        {
          "source": "ministry",
          "page": 25,
          "serial": 172
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-116",
      "name": "بلقاء",
      "aliases": [],
      "regions": [
        "hail"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 39,
          "region": "hail"
        },
        {
          "source": "ministry",
          "page": 24,
          "serial": 33
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-117",
      "name": "شمقاء",
      "aliases": [],
      "regions": [
        "hail"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 39,
          "region": "hail"
        },
        {
          "source": "ministry",
          "page": 25,
          "serial": 161
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-118",
      "name": "صادرة",
      "aliases": [],
      "regions": [
        "hail"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 39,
          "region": "hail"
        },
        {
          "source": "ministry",
          "page": 25,
          "serial": 165
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-119",
      "name": "قرين",
      "aliases": [],
      "regions": [
        "hail",
        "riyadh"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 39,
          "region": "hail"
        },
        {
          "source": "ncpd2024",
          "page": 113
        },
        {
          "source": "ncpd2024",
          "page": 113,
          "region": "riyadh"
        },
        {
          "source": "ministry",
          "page": 25,
          "serial": 207
        }
      ],
      "maturity": "mid",
      "consumption": [
        "رطب"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 114,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "أحمر"
        },
        {
          "stage": "رطب",
          "page": 114,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "غير محسوم في نص المرجع",
          "colorUnclear": "أحمر قابض"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "الوصف اللوني في إحدى الخانات ملتبس في النص العربي؛ لم يعرض بوصفه لونًا مؤكدًا."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 113
      },
      "profilePage": 113,
      "historicalOnly": false
    },
    {
      "id": "date-120",
      "name": "خضرية",
      "aliases": [],
      "regions": [
        "hail"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 39,
          "region": "hail"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-121",
      "name": "بياض",
      "aliases": [],
      "regions": [
        "najran"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 40,
          "region": "najran"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-122",
      "name": "صيغة",
      "aliases": [],
      "regions": [
        "najran"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 40,
          "region": "najran"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-123",
      "name": "رطب",
      "aliases": [],
      "regions": [
        "najran"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 40,
          "region": "najran"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-124",
      "name": "مواكيل",
      "aliases": [],
      "regions": [
        "najran"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 40,
          "region": "najran"
        },
        {
          "source": "ncpd2024",
          "page": 106
        },
        {
          "source": "ncpd2024",
          "page": 106,
          "region": "najran"
        },
        {
          "source": "ministry",
          "page": 27,
          "serial": 257
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [
        {
          "stage": "بسر",
          "shape": "بيضوي",
          "size": "متوسط",
          "color": "أصفر ذهبي",
          "page": 106
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "ورد وصف الثمرة في هذا الطور فقط؛ لا تحدد الصفحة موسم النضج أو جميع أطوار الاستهلاك."
      ],
      "profilePage": 106,
      "historicalOnly": false
    },
    {
      "id": "date-125",
      "name": "صفراء",
      "aliases": [],
      "regions": [
        "najran",
        "northern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 40,
          "region": "najran"
        },
        {
          "source": "ncpd2024",
          "page": 41,
          "region": "northern"
        },
        {
          "source": "ministry",
          "page": 25,
          "serial": 170
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-126",
      "name": "علوق",
      "aliases": [],
      "regions": [
        "najran"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 40,
          "region": "najran"
        },
        {
          "source": "ministry",
          "page": 25,
          "serial": 189
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-127",
      "name": "خضير",
      "aliases": [],
      "regions": [
        "najran"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 40,
          "region": "najran"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-128",
      "name": "دقلة",
      "aliases": [
        "دقله"
      ],
      "regions": [
        "northern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 41,
          "region": "northern"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-129",
      "name": "كسبة",
      "aliases": [
        "الكسبه",
        "كسبه"
      ],
      "regions": [
        "northern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 41,
          "region": "northern"
        },
        {
          "source": "ministry",
          "page": 27,
          "serial": 222
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-130",
      "name": "بويضاء خذماء",
      "aliases": [
        "بويضاء خدماء"
      ],
      "regions": [
        "jouf"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 42,
          "region": "jouf"
        },
        {
          "source": "ministry",
          "page": 24,
          "serial": 34
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-131",
      "name": "حسينية",
      "aliases": [],
      "regions": [
        "jouf"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 42,
          "region": "jouf"
        },
        {
          "source": "ministry",
          "page": 24,
          "serial": 54
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-132",
      "name": "شكل",
      "aliases": [
        "الشكل"
      ],
      "regions": [
        "asir"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 42,
          "region": "asir"
        },
        {
          "source": "ministry",
          "page": 25,
          "serial": 157
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-133",
      "name": "بديرة",
      "aliases": [],
      "regions": [
        "asir"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 42,
          "region": "asir"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-134",
      "name": "دقلة نور",
      "aliases": [],
      "regions": [
        "madina",
        "riyadh"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 65
        },
        {
          "source": "ncpd2024",
          "page": 65,
          "region": "madina"
        },
        {
          "source": "ncpd2024",
          "page": 65,
          "region": "riyadh"
        }
      ],
      "maturity": "late",
      "consumption": [
        "رطب",
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 66,
          "shape": "بيضوي مستطيل",
          "size": "متوسط إلى كبير",
          "color": "أحمر مرجاني"
        },
        {
          "stage": "رطب",
          "page": 66,
          "shape": "بيضوي مستطيل",
          "size": "متوسط إلى كبير",
          "color": "عنبري"
        },
        {
          "stage": "تمر",
          "page": 66,
          "shape": "بيضوي مستطيل",
          "size": "متوسط إلى كبير",
          "color": "غير محسوم في نص المرجع",
          "colorUnclear": "عبري"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "صنف أدخل إلى زراعة المملكة، خاصة المدينة والرياض.",
        "الوصف اللوني في إحدى الخانات ملتبس في النص العربي؛ لم يعرض بوصفه لونًا مؤكدًا."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 65
      },
      "profilePage": 65,
      "historicalOnly": false
    },
    {
      "id": "date-135",
      "name": "تناجيب",
      "aliases": [],
      "regions": [
        "eastern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 79
        },
        {
          "source": "ncpd2024",
          "page": 79,
          "region": "eastern"
        },
        {
          "source": "ministry",
          "page": 24,
          "serial": 38
        }
      ],
      "maturity": "late",
      "consumption": [
        "رطب"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 80,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "أحمر"
        },
        {
          "stage": "رطب",
          "page": 80,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "غير محسوم في نص المرجع",
          "colorUnclear": "أحمر قابض"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "الوصف اللوني في إحدى الخانات ملتبس في النص العربي؛ لم يعرض بوصفه لونًا مؤكدًا."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 79
      },
      "profilePage": 79,
      "historicalOnly": false
    },
    {
      "id": "date-136",
      "name": "أم مجناز",
      "aliases": [],
      "regions": [
        "eastern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 81
        },
        {
          "source": "ncpd2024",
          "page": 81,
          "region": "eastern"
        },
        {
          "source": "ministry",
          "page": 24,
          "serial": 14
        }
      ],
      "maturity": "early",
      "consumption": [
        "بسر",
        "رطب"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 82,
          "shape": "إهليلجي",
          "size": "متوسط",
          "color": "أصفر"
        },
        {
          "stage": "رطب",
          "page": 82,
          "shape": "إهليلجي",
          "size": "متوسط",
          "color": "بني مصفر"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 81
      },
      "profilePage": 81,
      "historicalOnly": false
    },
    {
      "id": "date-137",
      "name": "بريكي",
      "aliases": [],
      "regions": [
        "eastern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 83
        },
        {
          "source": "ncpd2024",
          "page": 83,
          "region": "eastern"
        },
        {
          "source": "ministry",
          "page": 24,
          "serial": 28
        }
      ],
      "maturity": "early",
      "consumption": [
        "بسر",
        "رطب"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 84,
          "shape": "بيضوي",
          "size": "متوسط",
          "color": "أصفر ذهبي"
        },
        {
          "stage": "رطب",
          "page": 84,
          "shape": "بيضوي",
          "size": "متوسط",
          "color": "أصفر ذهبي"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 83
      },
      "profilePage": 83,
      "historicalOnly": false
    },
    {
      "id": "date-138",
      "name": "توري",
      "aliases": [],
      "regions": [
        "qassim"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 85
        },
        {
          "source": "ncpd2024",
          "page": 85,
          "region": "qassim"
        },
        {
          "source": "ministry",
          "page": 24,
          "serial": 39
        }
      ],
      "maturity": "late",
      "consumption": [
        "رطب",
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 86,
          "shape": "بيضوي",
          "size": "كبير",
          "color": "أصفر مشمشي"
        },
        {
          "stage": "رطب",
          "page": 86,
          "shape": "بيضوي",
          "size": "كبير",
          "color": "بني"
        },
        {
          "stage": "تمر",
          "page": 86,
          "shape": "بيضوي",
          "size": "كبير",
          "color": "بني"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 85
      },
      "profilePage": 85,
      "historicalOnly": false
    },
    {
      "id": "date-139",
      "name": "حلاوي أبيض",
      "aliases": [],
      "regions": [
        "eastern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 97
        },
        {
          "source": "ncpd2024",
          "page": 97,
          "region": "eastern"
        },
        {
          "source": "ministry",
          "page": 24,
          "serial": 63
        }
      ],
      "maturity": "late",
      "consumption": [
        "رطب"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 98,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "أصفر محمر"
        },
        {
          "stage": "رطب",
          "page": 98,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "بني"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "صنف قليل الانتشار في القطيف؛ تختلف تسميته الإنجليزية في الصفحة، واعتمد الاسم العربي."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 97
      },
      "profilePage": 97,
      "historicalOnly": false
    },
    {
      "id": "date-140",
      "name": "سندي",
      "aliases": [],
      "regions": [
        "riyadh"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 103
        },
        {
          "source": "ncpd2024",
          "page": 103,
          "region": "riyadh"
        },
        {
          "source": "ministry",
          "page": 25,
          "serial": 149
        }
      ],
      "maturity": "late",
      "consumption": [
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 104,
          "shape": "أسطواني",
          "size": "متوسط",
          "color": "أصفر"
        },
        {
          "stage": "تمر",
          "page": 104,
          "shape": "أسطواني",
          "size": "متوسط",
          "color": "بني فاتح مصفر"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 103
      },
      "profilePage": 103,
      "historicalOnly": false
    },
    {
      "id": "date-141",
      "name": "ماجي",
      "aliases": [],
      "regions": [
        "eastern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 109
        },
        {
          "source": "ncpd2024",
          "page": 109,
          "region": "eastern"
        },
        {
          "source": "ministry",
          "page": 27,
          "serial": 230
        }
      ],
      "maturity": "early",
      "consumption": [
        "رطب"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 110,
          "shape": "إهليلجي",
          "size": "كبير",
          "color": "أحمر"
        },
        {
          "stage": "رطب",
          "page": 110,
          "shape": "إهليلجي",
          "size": "كبير",
          "color": "غير محسوم في نص المرجع",
          "colorUnclear": "أحمر قابض"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "من أبكر أصناف القطيف وفق الدليل.",
        "الوصف اللوني في إحدى الخانات ملتبس في النص العربي؛ لم يعرض بوصفه لونًا مؤكدًا."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 109
      },
      "profilePage": 109,
      "historicalOnly": false
    },
    {
      "id": "date-142",
      "name": "مرزبان",
      "aliases": [],
      "regions": [
        "eastern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 115
        },
        {
          "source": "ncpd2024",
          "page": 115,
          "region": "eastern"
        },
        {
          "source": "ministry",
          "page": 27,
          "serial": 240
        }
      ],
      "maturity": "late",
      "consumption": [
        "رطب",
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 116,
          "shape": "بيضوي مستطيل",
          "size": "كبير إلى متوسط",
          "color": "أصفر"
        },
        {
          "stage": "رطب",
          "page": 116,
          "shape": "بيضوي مستطيل",
          "size": "كبير إلى متوسط",
          "color": "بني فاتح"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "محدود الانتشار في الأحساء والقطيف؛ يميل إلى تفاوت الحمل بين السنوات."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 115
      },
      "profilePage": 115,
      "historicalOnly": false
    },
    {
      "id": "date-143",
      "name": "كسبي",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 117
        },
        {
          "source": "ministry",
          "page": 27,
          "serial": 216
        }
      ],
      "maturity": "early",
      "consumption": [
        "رطب"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 118,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "أصفر"
        },
        {
          "stage": "رطب",
          "page": 118,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "بني مصفر"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "الدليل يذكر زراعته في بعض مناطق المملكة دون تعيينها."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 117
      },
      "profilePage": 117,
      "historicalOnly": false
    },
    {
      "id": "date-144",
      "name": "نبتة سلمى",
      "aliases": [],
      "regions": [
        "qassim"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 119
        },
        {
          "source": "ncpd2024",
          "page": 119,
          "region": "qassim"
        },
        {
          "source": "ministry",
          "page": 27,
          "serial": 269
        }
      ],
      "maturity": "late",
      "consumption": [
        "رطب"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 120,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "أصفر مشمشي"
        },
        {
          "stage": "رطب",
          "page": 120,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "بني ذهبي"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 119
      },
      "profilePage": 119,
      "historicalOnly": false
    },
    {
      "id": "date-145",
      "name": "أم كوز",
      "aliases": [],
      "regions": [
        "riyadh"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 123
        },
        {
          "source": "ncpd2024",
          "page": 123,
          "region": "riyadh"
        }
      ],
      "maturity": "mid",
      "consumption": [
        "رطب",
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 124,
          "shape": "أسطواني",
          "size": "صغير إلى متوسط",
          "color": "أصفر ذهبي"
        },
        {
          "stage": "رطب",
          "page": 124,
          "shape": "أسطواني",
          "size": "صغير إلى متوسط",
          "color": "بني مصفر"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "موصوف في محافظة الأفلاج؛ لم يدمج مع اسم أم قوز لعدم توثيق الترادف في الدليل."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 123
      },
      "profilePage": 123,
      "historicalOnly": false
    },
    {
      "id": "date-146",
      "name": "عوينات",
      "aliases": [],
      "regions": [
        "eastern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 129
        },
        {
          "source": "ncpd2024",
          "page": 129,
          "region": "eastern"
        },
        {
          "source": "ministry",
          "page": 25,
          "serial": 194
        }
      ],
      "maturity": "late",
      "consumption": [
        "رطب"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 130,
          "shape": "بيضوي",
          "size": "متوسط",
          "color": "أحمر"
        },
        {
          "stage": "رطب",
          "page": 130,
          "shape": "بيضوي",
          "size": "متوسط",
          "color": "غير محسوم في نص المرجع",
          "colorUnclear": "أحمر قابض"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "موصوف في القطيف.",
        "الوصف اللوني في إحدى الخانات ملتبس في النص العربي؛ لم يعرض بوصفه لونًا مؤكدًا."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 129
      },
      "profilePage": 129,
      "historicalOnly": false
    },
    {
      "id": "date-147",
      "name": "سكرة ينبع",
      "aliases": [],
      "regions": [
        "madina"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 131
        },
        {
          "source": "ncpd2024",
          "page": 131,
          "region": "madina"
        },
        {
          "source": "mewaMadina",
          "region": "madina"
        }
      ],
      "maturity": "early",
      "consumption": [
        "بسر",
        "رطب",
        "تمر"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 132,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "أصفر"
        },
        {
          "stage": "رطب",
          "page": 132,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "بني مصفر"
        },
        {
          "stage": "تمر",
          "page": 132,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "بني"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "موصوف في ينبع النخل؛ قليل الألياف."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 131
      },
      "profilePage": 131,
      "historicalOnly": false
    },
    {
      "id": "date-148",
      "name": "عيون البقر",
      "aliases": [],
      "regions": [
        "eastern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 135
        },
        {
          "source": "ncpd2024",
          "page": 135,
          "region": "eastern"
        },
        {
          "source": "ministry",
          "page": 25,
          "serial": 193
        }
      ],
      "maturity": "late",
      "consumption": [
        "رطب"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 136,
          "shape": "بيضوي",
          "size": "متوسط",
          "color": "أحمر"
        },
        {
          "stage": "رطب",
          "page": 136,
          "shape": "بيضوي",
          "size": "متوسط",
          "color": "غير محسوم في نص المرجع",
          "colorUnclear": "أحمر قابض"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "قليل الانتشار في القطيف.",
        "الوصف اللوني في إحدى الخانات ملتبس في النص العربي؛ لم يعرض بوصفه لونًا مؤكدًا."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 135
      },
      "profilePage": 135,
      "historicalOnly": false
    },
    {
      "id": "date-149",
      "name": "عيدية",
      "aliases": [],
      "regions": [
        "qassim"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 137
        },
        {
          "source": "ncpd2024",
          "page": 137,
          "region": "qassim"
        },
        {
          "source": "ministry",
          "page": 25,
          "serial": 192
        }
      ],
      "maturity": "mid",
      "consumption": [
        "رطب"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 138,
          "shape": "بيضوي",
          "size": "متوسط",
          "color": "أصفر فاتح"
        },
        {
          "stage": "رطب",
          "page": 138,
          "shape": "بيضوي",
          "size": "متوسط",
          "color": "بني مصفر"
        },
        {
          "stage": "تمر",
          "page": 138,
          "shape": "بيضوي",
          "size": "متوسط",
          "color": "غير محسوم في نص المرجع",
          "colorUnclear": "بني قابض"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "الوصف اللوني في إحدى الخانات ملتبس في النص العربي؛ لم يعرض بوصفه لونًا مؤكدًا."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 137
      },
      "profilePage": 137,
      "historicalOnly": false
    },
    {
      "id": "date-150",
      "name": "حلاوي أحمر",
      "aliases": [],
      "regions": [
        "riyadh"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 155
        },
        {
          "source": "ncpd2024",
          "page": 155,
          "region": "riyadh"
        },
        {
          "source": "ministry",
          "page": 24,
          "serial": 62
        }
      ],
      "maturity": "mid",
      "consumption": [
        "رطب"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 156,
          "shape": "بيضوي مستطيل",
          "size": "كبير",
          "color": "أحمر دموي"
        },
        {
          "stage": "رطب",
          "page": 156,
          "shape": "بيضوي مستطيل",
          "size": "كبير",
          "color": "غير محسوم في نص المرجع",
          "colorUnclear": "أحمر قابض"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "الوصف اللوني في إحدى الخانات ملتبس في النص العربي؛ لم يعرض بوصفه لونًا مؤكدًا."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 155
      },
      "profilePage": 155,
      "historicalOnly": false
    },
    {
      "id": "date-151",
      "name": "حقية",
      "aliases": [],
      "regions": [
        "riyadh"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 157
        },
        {
          "source": "ncpd2024",
          "page": 157,
          "region": "riyadh"
        },
        {
          "source": "ministry",
          "page": 24,
          "serial": 58
        }
      ],
      "maturity": "mid",
      "consumption": [
        "رطب"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 158,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "أحمر"
        },
        {
          "stage": "رطب",
          "page": 158,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "أحمر"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 157
      },
      "profilePage": 157,
      "historicalOnly": false
    },
    {
      "id": "date-152",
      "name": "خصاب عصفور",
      "aliases": [],
      "regions": [
        "eastern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 159
        },
        {
          "source": "ncpd2024",
          "page": 159,
          "region": "eastern"
        }
      ],
      "maturity": "veryLate",
      "consumption": [
        "رطب"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 160,
          "shape": "بيضوي",
          "size": "متوسط",
          "color": "أحمر"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "موصوف في الأحساء والقطيف.",
        "يكرر المرجع اسم أحد الأطوار في بطاقة الثمرة؛ حُذفت الخانة الملتبسة بدل تخمين الطور المقصود."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 159
      },
      "profilePage": 159,
      "historicalOnly": false
    },
    {
      "id": "date-153",
      "name": "عذابي",
      "aliases": [],
      "regions": [
        "eastern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 163
        },
        {
          "source": "ncpd2024",
          "page": 163,
          "region": "eastern"
        },
        {
          "source": "ministry",
          "page": 25,
          "serial": 186
        }
      ],
      "maturity": "mid",
      "consumption": [
        "رطب"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 164,
          "shape": "بيضوي مستطيل",
          "size": "متوسط إلى صغير",
          "color": "بني ذهبي"
        },
        {
          "stage": "رطب",
          "page": 164,
          "shape": "بيضوي مستطيل",
          "size": "متوسط إلى صغير",
          "color": "بني ذهبي"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 163
      },
      "profilePage": 163,
      "historicalOnly": false
    },
    {
      "id": "date-154",
      "name": "خوجي",
      "aliases": [],
      "regions": [
        "eastern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 165
        },
        {
          "source": "ncpd2024",
          "page": 165,
          "region": "eastern"
        }
      ],
      "maturity": "late",
      "consumption": [
        "رطب"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 166,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "أصفر"
        },
        {
          "stage": "رطب",
          "page": 166,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "بني مشمشي"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 165
      },
      "profilePage": 165,
      "historicalOnly": false
    },
    {
      "id": "date-155",
      "name": "شكيري",
      "aliases": [],
      "regions": [
        "eastern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 173
        },
        {
          "source": "ncpd2024",
          "page": 173,
          "region": "eastern"
        },
        {
          "source": "ministry",
          "page": 25,
          "serial": 158
        }
      ],
      "maturity": "early",
      "consumption": [
        "رطب"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 174,
          "shape": "بيضوي مستطيل",
          "size": "متوسط إلى صغير",
          "color": "بني ذهبي"
        },
        {
          "stage": "رطب",
          "page": 174,
          "shape": "بيضوي مستطيل",
          "size": "متوسط إلى صغير",
          "color": "بني مصفر"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "موصوف في الأحساء والقطيف."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 173
      },
      "profilePage": 173,
      "historicalOnly": false
    },
    {
      "id": "date-156",
      "name": "عماري",
      "aliases": [],
      "regions": [
        "eastern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 175
        },
        {
          "source": "ncpd2024",
          "page": 175,
          "region": "eastern"
        },
        {
          "source": "ministry",
          "page": 25,
          "serial": 190
        }
      ],
      "maturity": "mid",
      "consumption": [
        "رطب"
      ],
      "traits": [
        {
          "stage": "رطب",
          "page": 176,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "أصفر ذهبي"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "موصوف في القطيف.",
        "يكرر المرجع اسم أحد الأطوار في بطاقة الثمرة؛ حُذفت الخانة الملتبسة بدل تخمين الطور المقصود."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 175
      },
      "profilePage": 175,
      "historicalOnly": false
    },
    {
      "id": "date-157",
      "name": "زاملي",
      "aliases": [],
      "regions": [
        "eastern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 177
        },
        {
          "source": "ncpd2024",
          "page": 177,
          "region": "eastern"
        }
      ],
      "maturity": "mid",
      "consumption": [
        "رطب"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 178,
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "أصفر"
        },
        {
          "stage": "رطب",
          "page": 178,
          "shape": "بيضوي مستطيل",
          "size": "متوسط إلى كبير",
          "color": "بني مصفر"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "قليل الانتشار في الأحساء."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 177
      },
      "profilePage": 177,
      "historicalOnly": false
    },
    {
      "id": "date-158",
      "name": "مبروم",
      "aliases": [],
      "regions": [
        "madina"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 183
        },
        {
          "source": "ncpd2024",
          "page": 183,
          "region": "madina"
        },
        {
          "source": "ministry",
          "page": 27,
          "serial": 231
        }
      ],
      "maturity": "early",
      "consumption": [
        "رطب"
      ],
      "traits": [
        {
          "stage": "بسر",
          "page": 184,
          "shape": "مستطيل",
          "size": "متوسط إلى كبير",
          "color": "أصفر"
        },
        {
          "stage": "رطب",
          "page": 184,
          "shape": "مستطيل",
          "size": "متوسط إلى كبير",
          "color": "بني مصفر"
        },
        {
          "stage": "تمر",
          "page": 184,
          "shape": "مستطيل",
          "size": "متوسط إلى كبير",
          "color": "بني"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "اعتمد النص العربي لمرحلة الاستهلاك؛ تذكر الترجمة الإنجليزية الرطب والتمر."
      ],
      "maturityRef": {
        "source": "ncpd2024",
        "page": 183
      },
      "profilePage": 183,
      "historicalOnly": false
    },
    {
      "id": "date-159",
      "name": "منيعي",
      "aliases": [],
      "regions": [
        "qassim"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 105
        },
        {
          "source": "ncpd2024",
          "page": 105,
          "region": "qassim"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [
        {
          "stage": "رطب",
          "shape": "إهليلجي",
          "size": "متوسط",
          "color": "بني محمر",
          "page": 105
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "ورد وصف الثمرة في هذا الطور فقط؛ لا تحدد الصفحة موسم النضج أو جميع أطوار الاستهلاك."
      ],
      "profilePage": 105,
      "historicalOnly": false
    },
    {
      "id": "date-160",
      "name": "حريني",
      "aliases": [],
      "regions": [
        "riyadh"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 105
        },
        {
          "source": "ncpd2024",
          "page": 105,
          "region": "riyadh"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [
        {
          "stage": "تمر",
          "shape": "بيضوي",
          "size": "متوسط",
          "color": "غامق",
          "page": 105
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "ورد وصف الثمرة في هذا الطور فقط؛ لا تحدد الصفحة موسم النضج أو جميع أطوار الاستهلاك."
      ],
      "profilePage": 105,
      "historicalOnly": false
    },
    {
      "id": "date-161",
      "name": "صبو",
      "aliases": [],
      "regions": [
        "eastern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 105
        },
        {
          "source": "ncpd2024",
          "page": 105,
          "region": "eastern"
        },
        {
          "source": "ministry",
          "page": 25,
          "serial": 166
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [
        {
          "stage": "بسر",
          "shape": "بيضوي مستطيل",
          "size": "صغير",
          "color": "أصفر",
          "page": 105
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "ورد وصف الثمرة في هذا الطور فقط؛ لا تحدد الصفحة موسم النضج أو جميع أطوار الاستهلاك."
      ],
      "profilePage": 105,
      "historicalOnly": false
    },
    {
      "id": "date-162",
      "name": "فنخة",
      "aliases": [],
      "regions": [
        "qassim",
        "hail",
        "northern"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 106
        },
        {
          "source": "ncpd2024",
          "page": 106,
          "region": "qassim"
        },
        {
          "source": "ncpd2024",
          "page": 106,
          "region": "hail"
        },
        {
          "source": "ncpd2024",
          "page": 106,
          "region": "northern"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [
        {
          "stage": "تمر",
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "بني مصفر",
          "page": 106
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "ورد وصف الثمرة في هذا الطور فقط؛ لا تحدد الصفحة موسم النضج أو جميع أطوار الاستهلاك."
      ],
      "profilePage": 106,
      "historicalOnly": false
    },
    {
      "id": "date-163",
      "name": "نبتة قرين",
      "aliases": [],
      "regions": [
        "riyadh"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 107
        },
        {
          "source": "ncpd2024",
          "page": 107,
          "region": "riyadh"
        },
        {
          "source": "ministry",
          "page": 27,
          "serial": 263
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [
        {
          "stage": "تمر",
          "shape": "بيضوي مستطيل",
          "size": "صغير",
          "color": "غير محسوم في نص المرجع",
          "page": 107,
          "colorUnclear": "بني قابض"
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "ورد وصف الثمرة في هذا الطور فقط؛ لا تحدد الصفحة موسم النضج أو جميع أطوار الاستهلاك.",
        "الوصف اللوني في إحدى الخانات ملتبس في النص العربي؛ لم يعرض بوصفه لونًا مؤكدًا."
      ],
      "profilePage": 107,
      "historicalOnly": false
    },
    {
      "id": "date-164",
      "name": "نجلاء",
      "aliases": [],
      "regions": [
        "riyadh"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 107
        },
        {
          "source": "ncpd2024",
          "page": 107,
          "region": "riyadh"
        },
        {
          "source": "ministry",
          "page": 27,
          "serial": 277
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [
        {
          "stage": "تمر",
          "shape": "إهليلجي",
          "size": "متوسط",
          "color": "بني",
          "page": 107
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "ورد وصف الثمرة في هذا الطور فقط؛ لا تحدد الصفحة موسم النضج أو جميع أطوار الاستهلاك."
      ],
      "profilePage": 107,
      "historicalOnly": false
    },
    {
      "id": "date-165",
      "name": "هرموزي",
      "aliases": [],
      "regions": [
        "madina"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 108
        },
        {
          "source": "ncpd2024",
          "page": 108,
          "region": "madina"
        },
        {
          "source": "ministry",
          "page": 27,
          "serial": 283
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [
        {
          "stage": "بسر",
          "shape": "بيضوي",
          "size": "صغير إلى متوسط",
          "color": "أصفر",
          "page": 108
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "ورد وصف الثمرة في هذا الطور فقط؛ لا تحدد الصفحة موسم النضج أو جميع أطوار الاستهلاك."
      ],
      "profilePage": 108,
      "historicalOnly": false
    },
    {
      "id": "date-166",
      "name": "أفندية",
      "aliases": [],
      "regions": [
        "madina"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 125
        },
        {
          "source": "ncpd2024",
          "page": 125,
          "region": "madina"
        },
        {
          "source": "mewaMadina",
          "region": "madina"
        },
        {
          "source": "ministry",
          "page": 24,
          "serial": 9
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [
        {
          "stage": "تمر",
          "shape": "أسطواني",
          "size": "متوسط",
          "color": "بني",
          "page": 125
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "ورد وصف الثمرة في هذا الطور فقط؛ لا تحدد الصفحة موسم النضج أو جميع أطوار الاستهلاك."
      ],
      "profilePage": 125,
      "historicalOnly": false
    },
    {
      "id": "date-167",
      "name": "بياض نجران",
      "aliases": [],
      "regions": [
        "najran"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 125
        },
        {
          "source": "ncpd2024",
          "page": 125,
          "region": "najran"
        },
        {
          "source": "ministry",
          "page": 24,
          "serial": 35
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [
        {
          "stage": "بسر",
          "shape": "بيضوي",
          "size": "متوسط",
          "color": "أصفر ذهبي",
          "page": 125
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "ورد وصف الثمرة في هذا الطور فقط؛ لا تحدد الصفحة موسم النضج أو جميع أطوار الاستهلاك."
      ],
      "profilePage": 125,
      "historicalOnly": false
    },
    {
      "id": "date-168",
      "name": "سري الخرج",
      "aliases": [],
      "regions": [
        "riyadh"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 126
        },
        {
          "source": "ncpd2024",
          "page": 126,
          "region": "riyadh"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [
        {
          "stage": "رطب",
          "shape": "إهليلجي",
          "size": "صغير",
          "color": "بني",
          "page": 126
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "ورد وصف الثمرة في هذا الطور فقط؛ لا تحدد الصفحة موسم النضج أو جميع أطوار الاستهلاك."
      ],
      "profilePage": 126,
      "historicalOnly": false
    },
    {
      "id": "date-169",
      "name": "منيف",
      "aliases": [],
      "regions": [
        "riyadh"
      ],
      "refs": [
        {
          "source": "ncpd2024",
          "page": 126
        },
        {
          "source": "ncpd2024",
          "page": 126,
          "region": "riyadh"
        },
        {
          "source": "ministry",
          "page": 27,
          "serial": 253
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [
        {
          "stage": "رطب",
          "shape": "بيضوي مستطيل",
          "size": "متوسط",
          "color": "بني",
          "page": 126
        }
      ],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [
        "ورد وصف الثمرة في هذا الطور فقط؛ لا تحدد الصفحة موسم النضج أو جميع أطوار الاستهلاك."
      ],
      "profilePage": 126,
      "historicalOnly": false
    },
    {
      "id": "date-170",
      "name": "رباعي",
      "aliases": [],
      "regions": [
        "madina"
      ],
      "refs": [
        {
          "source": "mewaMadina",
          "region": "madina"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-171",
      "name": "طبرجلي",
      "aliases": [],
      "regions": [
        "madina"
      ],
      "refs": [
        {
          "source": "mewaMadina",
          "region": "madina"
        },
        {
          "source": "ministry",
          "page": 25,
          "serial": 179
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-172",
      "name": "الجوازنة",
      "aliases": [],
      "regions": [
        "madina"
      ],
      "refs": [
        {
          "source": "mewaMadina",
          "region": "madina"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-173",
      "name": "البرقة",
      "aliases": [],
      "regions": [
        "madina"
      ],
      "refs": [
        {
          "source": "mewaMadina",
          "region": "madina"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-174",
      "name": "البرطجي",
      "aliases": [],
      "regions": [
        "madina"
      ],
      "refs": [
        {
          "source": "mewaMadina",
          "region": "madina"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-175",
      "name": "العيص",
      "aliases": [],
      "regions": [
        "madina"
      ],
      "refs": [
        {
          "source": "mewaMadina",
          "region": "madina"
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": false
    },
    {
      "id": "date-176",
      "name": "الصور الأملس",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 24,
          "serial": 1
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-177",
      "name": "أبا سويد",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 24,
          "serial": 3
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-178",
      "name": "أشرسية",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 24,
          "serial": 6
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-179",
      "name": "أصفر",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 24,
          "serial": 8
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-180",
      "name": "أم البيض",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 24,
          "serial": 10
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-181",
      "name": "إيرانية",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 24,
          "serial": 18
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-182",
      "name": "بديري",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 24,
          "serial": 19
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-183",
      "name": "بنت السيد",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 24,
          "serial": 21
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-184",
      "name": "برقة",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 24,
          "serial": 22
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-185",
      "name": "بريدي",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 24,
          "serial": 27
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-186",
      "name": "بريم",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 24,
          "serial": 29
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-187",
      "name": "ثلاثي",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 24,
          "serial": 40
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-188",
      "name": "جاوي",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 24,
          "serial": 41
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-189",
      "name": "جبيلي",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 24,
          "serial": 42
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-190",
      "name": "جعفري",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 24,
          "serial": 44
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-191",
      "name": "جواء",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 24,
          "serial": 47
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-192",
      "name": "جوازنة",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 24,
          "serial": 48
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-193",
      "name": "جوزا",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 24,
          "serial": 49
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-194",
      "name": "حرينية",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 24,
          "serial": 51
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-195",
      "name": "حريدي",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 24,
          "serial": 52
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-196",
      "name": "حريزي",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 24,
          "serial": 53
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-197",
      "name": "حلاوي",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 24,
          "serial": 61
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-198",
      "name": "سلاطين",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 25,
          "serial": 141
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-199",
      "name": "سلطانة",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 25,
          "serial": 143
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-200",
      "name": "سماني",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 25,
          "serial": 144
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-201",
      "name": "سمحه",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 25,
          "serial": 145
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-202",
      "name": "سويداء",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 25,
          "serial": 146
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-203",
      "name": "سويدة",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 25,
          "serial": 147
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-204",
      "name": "سويده",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 25,
          "serial": 148
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-205",
      "name": "سيف",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 25,
          "serial": 151
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-206",
      "name": "سيوي",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 25,
          "serial": 152
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-207",
      "name": "شقر",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 25,
          "serial": 154
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-208",
      "name": "شمشولة",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 25,
          "serial": 160
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-209",
      "name": "شهيلة",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 25,
          "serial": 163
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-210",
      "name": "صبيحة",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 25,
          "serial": 167
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-211",
      "name": "صفراء شرمة",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 25,
          "serial": 171
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-212",
      "name": "صفري المدينة",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 25,
          "serial": 175
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-213",
      "name": "صيغة نجران",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 25,
          "serial": 178
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-214",
      "name": "عبودة",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 25,
          "serial": 184
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-215",
      "name": "غراء",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 25,
          "serial": 196
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-216",
      "name": "غريبية",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 25,
          "serial": 197
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-217",
      "name": "غور",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 25,
          "serial": 198
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-218",
      "name": "فراسية",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 25,
          "serial": 199
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-219",
      "name": "فرخ",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 25,
          "serial": 200
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-220",
      "name": "فياضة",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 25,
          "serial": 203
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-221",
      "name": "قروي",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 25,
          "serial": 206
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-222",
      "name": "قرين خضرية",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 25,
          "serial": 208
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-223",
      "name": "قطارة البيضاء",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 25,
          "serial": 212
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-224",
      "name": "كاسبي",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 25,
          "serial": 213
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-225",
      "name": "كبري القصيم",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 27,
          "serial": 214
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-226",
      "name": "كبكاب",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 27,
          "serial": 215
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-227",
      "name": "كسب أحمر",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 27,
          "serial": 217
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-228",
      "name": "كسب أصفر",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 27,
          "serial": 218
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-229",
      "name": "كسبة سعدون",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 27,
          "serial": 219
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-230",
      "name": "كويري",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 27,
          "serial": 224
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-231",
      "name": "لبق",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 27,
          "serial": 227
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-232",
      "name": "لحمية",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 27,
          "serial": 228
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-233",
      "name": "مجناز",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 27,
          "serial": 237
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-234",
      "name": "مجنون",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 27,
          "serial": 238
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-235",
      "name": "مريعة",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 27,
          "serial": 241
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-236",
      "name": "منيعي أصفر",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 27,
          "serial": 252
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-237",
      "name": "نبات",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 27,
          "serial": 259
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-238",
      "name": "نبتة العبيد",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 27,
          "serial": 262
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-239",
      "name": "نبتة راشد",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 27,
          "serial": 265
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-240",
      "name": "نبتة زاملي",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 27,
          "serial": 267
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-241",
      "name": "نبتة سعيد",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 27,
          "serial": 270
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-242",
      "name": "نبتة شويش",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 27,
          "serial": 271
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-243",
      "name": "نبتة عبدالقادر",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 27,
          "serial": 272
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-244",
      "name": "نبتة ناصر",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 27,
          "serial": 274
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-245",
      "name": "نبوت شبيبي",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 27,
          "serial": 276
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-246",
      "name": "نشيري",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 27,
          "serial": 278
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-247",
      "name": "نفيسة",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 27,
          "serial": 279
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    },
    {
      "id": "date-248",
      "name": "هدباء",
      "aliases": [],
      "regions": [],
      "refs": [
        {
          "source": "ministry",
          "page": 27,
          "serial": 282
        }
      ],
      "maturity": null,
      "consumption": [],
      "traits": [],
      "observations": [],
      "start": null,
      "peak": null,
      "end": null,
      "notes": [],
      "historicalOnly": true
    }
  ],
  "regionalWindows": [
    {
      "region": "madina",
      "start": 6,
      "end": 11,
      "startText": "يونيو",
      "endText": "نهاية نوفمبر",
      "ref": {
        "source": "mewaMadina"
      }
    },
    {
      "region": "riyadh",
      "start": 8,
      "end": 11,
      "startText": "١ أغسطس",
      "endText": "نهاية نوفمبر",
      "ref": {
        "source": "mewaRiyadh"
      }
    }
  ],
  "historicalPeak": {
    "name": "سكري",
    "region": "qassim",
    "month": 8,
    "year": 2020,
    "text": "رصدت واس ذروة السكري في أغسطس ببريدة عام ٢٠٢٠، ثم تراجع جودته في سبتمبر. هذا رصد لسنة ومكان محددين، وليس موعدًا سنويًا مضمونًا.",
    "ref": {
      "source": "spaSukkari"
    }
  }
};
