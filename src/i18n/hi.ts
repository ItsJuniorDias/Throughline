/** हिन्दी */

import type { Resources } from './en';

const hi: Resources = {
  common: {
    cancel: 'रद्द करें',
    save: 'सहेजें',
    done: 'हो गया',
    okay: 'ठीक है',
    delete: 'हटाएँ',
    tryAgain: 'फिर कोशिश करें',
    refresh: 'ताज़ा करें',
    regenerate: 'फिर से बनाएँ',
    footer: 'Throughline · v{version}',
  },

  tabs: {
    today: 'आज',
    timeline: 'टाइमलाइन',
    insights: 'अंतर्दृष्टि',
    you: 'आप',
  },

  date: {
    morning: 'सुप्रभात',
    afternoon: 'नमस्कार',
    evening: 'शुभ संध्या',
    today: 'आज',
    yesterday: 'कल',
  },

  mood: {
    rough: 'मुश्किल',
    low: 'उदास',
    okay: 'ठीक-ठाक',
    good: 'अच्छा',
    great: 'शानदार',
    question: 'आज कैसा महसूस हुआ?',
  },

  streak: {
    startToday: 'आज से शुरू करें',
    days: { one: '{count} दिन', other: '{count} दिन' },
  },

  prompt: {
    eyebrow: 'आज का विषय',
    cta: 'इस पर लिखें',
  },

  today: {
    weekStrand: 'आपकी कड़ी · पिछले 7 दिन',
    quickCheckIn: 'एक झटपट जाँच',
    write: 'एक प्रविष्टि लिखें',
    readEyebrow: 'आज की पड़ताल',
    readingDay: 'आपका दिन पढ़ रहे हैं…',
    unlockTitle: 'आज की पड़ताल अनलॉक करें',
    unlockBody: 'आपके दिन की एक पड़ताल — और उस तक जाने वाली कड़ी — Premium के साथ।',
    recentEyebrow: 'सबसे हाल का',
    recentTitle: 'नवीनतम प्रविष्टि',
  },

  timeline: {
    title: 'टाइमलाइन',
    entriesEyebrow: { one: '{count} प्रविष्टि', other: '{count} प्रविष्टियाँ' },
    all: 'सभी',
    emptyFiltered: '“{tag}” टैग वाली कोई प्रविष्टि नहीं।',
    empty: 'आपकी टाइमलाइन एक प्रविष्टि से शुरू होती है।',
    writeFirst: 'पहली लिखें',
    clearFilter: 'फ़िल्टर हटाएँ',
  },

  insights: {
    title: 'अंतर्दृष्टि',
    avgMoodWith: 'औसत मनोदशा · {mood}',
    avgMood30: 'औसत मनोदशा · 30 दिन',
    daysWritten30: 'लिखे गए दिन · 30 दिन',
    dayStreak: 'लगातार दिन',
    trendEyebrow: 'पिछले 30 दिन',
    trendTitle: 'समय के साथ मनोदशा',
    themesEyebrow: 'आप किस बारे में लिखते हैं',
    themesTitle: 'बार-बार आने वाले विषय',
    disclaimer: 'ये टिप्पणियाँ चिंतन हैं, सलाह नहीं।',

    weeklyEyebrow: 'इस सप्ताह की पड़ताल',
    weeklyEmpty: 'इस सप्ताह कुछ और बार लिखें और आपकी मुफ़्त साप्ताहिक पड़ताल यहाँ दिखेगी।',
    weeklyReading: 'आपका सप्ताह पढ़ रहे हैं…',
    weeklyError: 'पड़ताल नहीं बनाई जा सकी।',

    lifetimeEyebrow: 'अब तक',
    lifetimeTitle: 'आपका पूरा इतिहास',
    lifetimeEntries: 'प्रविष्टियाँ',
    lifetimeDays: 'लिखे गए दिन',
    lifetimeLongest: 'सबसे लंबी कड़ी',
    lifetimeMood: 'शुरुआत से अब तक की मनोदशा',
    lifetimeAvg: 'औसत {value} · {mood}',
  },

  daily: {
    headerSuffix: 'आज की पड़ताल',
    premium: 'PREMIUM',
    statsEntries: { one: '{count} प्रविष्टि', other: '{count} प्रविष्टियाँ' },
    empty:
      'आज लिखें और आपकी पड़ताल यहाँ दिखेगी — पूरा दिन एक साथ, और पिछले दिनों से उस तक आती हुई कड़ी।',
    reading: 'आपका दिन पढ़ रहे हैं…',
    throughline: 'कड़ी',
    focus: 'जिस पर ठहरना ठीक है',
    generated: 'आपकी प्रविष्टियों से बनाया गया · एक चिंतन, सलाह नहीं।',
    error: 'आज की पड़ताल नहीं बनाई जा सकी।',
  },

  correlations: {
    eyebrow: 'पैटर्न',
    title: 'आपकी मनोदशा को क्या हिलाता है',
    empty:
      'कुछ और प्रविष्टियों पर टैग लगाएँ और जो विषय आपको उठाते हैं — और जो चुपचाप बोझ डालते हैं — यहाँ दिखेंगे।',
    lifts: 'आपको उठाता है',
    weighs: 'आप पर बोझ डालता है',
    note: 'हर विषय के साथ औसत मनोदशा बनाम आपका कुल औसत · बिंदु के बाद नमूना संख्या।',
  },

  upsell: {
    eyebrow: 'Throughline Premium',
    title: 'हर दिन की पड़ताल पाएँ',
    body: 'रोज़ का लेखन आपके लिए मुफ़्त है। Premium इसे उस दीर्घकालिक तस्वीर में बदल देता है जिसे आप एक दिन में नहीं देख सकते — आपकी पहली प्रविष्टि से शुरू।',
    bullet1: 'आज की पड़ताल — हर दिन, पूरा दिन एक साथ',
    bullet2: 'पैटर्न — कौन से विषय उठाते हैं और कौन चुपचाप बोझ डालते हैं',
    bullet3: 'आपके पूरे इतिहास का विश्लेषण',
    bullet4: 'सब कुछ JSON में निर्यात करें',
    cta: 'Premium अनलॉक करें',
  },

  you: {
    eyebrow: 'आपका अभ्यास',
    title: 'आप',
    entries: 'प्रविष्टियाँ',
    dayStreak: 'लगातार दिन',
    since: 'से',

    premiumTitle: 'Throughline Premium',
    active: 'सक्रिय',
    premiumBodyActive:
      'आपकी रोज़ की पड़ताल, मनोदशा × विषय संबंध, पूरे इतिहास का विश्लेषण और निर्यात अनलॉक हैं। साथ देने के लिए धन्यवाद।',
    premiumBodyInactive:
      'आपकी पहली प्रविष्टि से हर दिन की पड़ताल, मनोदशा × विषय संबंध, पूरे इतिहास का विश्लेषण और निर्यात।',
    manage: 'सदस्यता प्रबंधित करें',
    seeInside: 'अंदर क्या है देखें',

    overrideTitle: 'Premium बाध्य करें',
    overrideDev: 'DEV',
    overrideNote:
      'स्थानीय रूप से Premium बाध्य करता है (डिवाइस पर सहेजा गया)। “ऑटो” RevenueCat का अनुसरण करता है, जो अभी {status} दिखा रहा है।',
    overrideActive: 'सक्रिय',
    overrideInactive: 'निष्क्रिय',
    overrideAuto: 'ऑटो',
    overridePremium: 'Premium',
    overrideFree: 'मुफ़्त',
  },

  language: {
    title: 'भाषा',
    detail: 'ऐप की भाषा चुनें',
  },

  settings: {
    appearance: 'रूप',
    appearanceDetail: 'आपकी सिस्टम सेटिंग के अनुसार',
    reminder: 'रोज़ का रिमाइंडर',
    reminderDetail: 'हर शाम लिखने का एक संकेत',
    privacy: 'गोपनीयता और डेटा',
    privacyDetail: 'डिवाइस पर एन्क्रिप्टेड · प्रशिक्षण के लिए कभी इस्तेमाल नहीं',
    privacyTitle: 'गोपनीयता और डेटा',
    privacyBody:
      'आपकी प्रविष्टियाँ आपके डिवाइस पर रहती हैं और एन्क्रिप्टेड रहती हैं। जब अंतर्दृष्टि बनाई जाती है, तो सामग्री ऐसे प्रदाताओं द्वारा संसाधित होती है जो आपके डेटा पर प्रशिक्षण न करने के लिए सेट हैं।',
    export: 'प्रविष्टियाँ निर्यात करें',
    exportDetail: 'सब कुछ JSON में डाउनलोड करें',
    exportDetailPremium: 'सब कुछ JSON में डाउनलोड करें · Premium',
    restore: 'खरीद बहाल करें',
    restoreDetail: 'पहले से सदस्य हैं? इस डिवाइस पर बहाल करें',
    clear: 'सभी प्रविष्टियाँ मिटाएँ',

    restoredTitle: 'खरीद बहाल हुई',
    restoredBody: 'इस खाते पर Throughline Premium सक्रिय है।',
    nothingRestoreTitle: 'बहाल करने के लिए कुछ नहीं',
    nothingRestoreBody: 'इस खाते पर हमें पिछली खरीद नहीं मिली।',
    nothingExportTitle: 'निर्यात के लिए कुछ नहीं',
    nothingExportBody: 'पहले एक प्रविष्टि लिखें, फिर वह यहाँ निर्यात के लिए होगी।',
    exportShareTitle: 'Throughline निर्यात',
    clearTitle: 'सभी प्रविष्टियाँ मिटाएँ?',
    clearBody: 'यह इस डिवाइस की हर प्रविष्टि को स्थायी रूप से हटा देता है। इसे पूर्ववत नहीं किया जा सकता।',
    clearConfirm: 'सब कुछ मिटाएँ',
  },

  compose: {
    title: 'नई प्रविष्टि',
    respondingTo: 'इसके जवाब में',
    moodLabel: 'आज कैसा महसूस हुआ?',
    entryLabel: 'आपकी प्रविष्टि',
    entryPlaceholder: 'खुलकर लिखें…',
    tagsLabel: 'टैग',
    addTag: 'टैग जोड़ें',
    saveEntry: 'प्रविष्टि सहेजें',
    defaultTags: ['काम', 'परिवार', 'दोस्त', 'सेहत', 'फोकस', 'थकान', 'जीत', 'सुबह'],
  },

  entry: {
    deleteTitle: 'प्रविष्टि हटाएँ?',
    deleteBody: 'इसे पूर्ववत नहीं किया जा सकता।',
    gone: 'यह प्रविष्टि अब यहाँ नहीं है।',
    inResponseTo: 'इसके जवाब में',
    insight: 'अंतर्दृष्टि',
    reading: 'यह प्रविष्टि पढ़ रहे हैं…',
    insightError: 'अंतर्दृष्टि नहीं बनाई जा सकी।',
    reflectionNote: 'एक चिंतन, सलाह नहीं।',
  },

  notFound: {
    stackTitle: 'नहीं मिला',
    title: 'कड़ी छूट गई',
    body: 'यह पेज मौजूद नहीं है।',
    back: 'आज पर वापस जाएँ',
  },

  paywall: {
    restore: 'बहाल करें',
    restoring: 'बहाल किया जा रहा है…',
    eyebrow: 'Throughline Premium',
    heroTitle: 'हर दिन एक पड़ताल, महीने में एक बार नहीं',
    heroBody:
      'लेखन आपके लिए मुफ़्त है। Premium हर दिन को आपके सामने पढ़कर रखता है — आपकी पहली प्रविष्टि से शुरू, इसलिए सदस्यता लेते ही यह यहाँ होता है।',

    feature1Title: 'आज के लिए एक पड़ताल',
    feature1Detail:
      'जिस दिन आप लिखते हैं, उस दिन पर एक अग्रणी-मॉडल चिंतन — सदस्यता लेते ही तैयार, आपकी पहली प्रविष्टि से।',
    feature2Title: 'क्या आपको उठाता है, क्या थकाता है',
    feature2Detail:
      'आपके इतिहास भर में मनोदशा × विषय संबंध — वे पैटर्न जिन्हें आप एक दिन में महसूस नहीं कर पाते।',
    feature3Title: 'पूरे इतिहास का विश्लेषण',
    feature3Detail:
      'आपकी आजीवन मनोदशा-प्रवृत्ति, सबसे लंबी कड़ी और लंबा सफ़र — सिर्फ़ पिछले 30 दिन नहीं।',
    feature4Title: 'सब कुछ निर्यात करें',
    feature4Detail: 'आपकी पूरी डायरी, जब चाहें अपने पास रखने के लिए।',

    loadingPlans: 'प्लान लोड हो रहे हैं…',
    noPlans: 'अभी प्लान उपलब्ध नहीं हैं।',
    perMonth: '{price} / माह',
    save: '{pct}% बचाएँ',
    perPeriod: '/ {period}',
    startTrial: '{days} दिन का मुफ़्त ट्रायल शुरू करें',
    subscribe: 'सदस्यता लें',
    trialNote: '{days} दिन मुफ़्त, फिर {price} / {period}। कभी भी रद्द करें।',
    noTrialNote: '{price} / {period}। कभी भी रद्द करें।',
    disclosure:
      'पुष्टि पर आपके स्टोर खाते से भुगतान लिया जाता है। अवधि समाप्त होने से कम-से-कम 24 घंटे पहले रद्द न करने पर सदस्यता स्वतः नवीनीकृत हो जाती है।',
    terms: 'शर्तें',
    privacy: 'गोपनीयता',

    memberAllSetTitle: 'सब तैयार है',
    memberTitle: 'आप सदस्य हैं',
    memberAllSetBody: 'Throughline Premium में आपका स्वागत है। आज की आपकी पड़ताल “अंतर्दृष्टि” में तैयार है।',
    memberBody: 'इस खाते पर Throughline Premium सक्रिय है। साथ देने के लिए धन्यवाद।',
  },

  plans: {
    annual: 'वार्षिक',
    sixMonth: '6 माह',
    threeMonth: '3 माह',
    twoMonth: '2 माह',
    monthly: 'मासिक',
    weekly: 'साप्ताहिक',
    lifetime: 'आजीवन',
    subscription: 'सदस्यता',
    bestValue: 'सबसे किफ़ायती',

    periodYear: 'वर्ष',
    periodSixMonth: '6 माह',
    periodThreeMonth: '3 माह',
    periodTwoMonth: '2 माह',
    periodMonth: 'माह',
    periodWeek: 'सप्ताह',
    periodLifetime: 'एक बार',
  },

  crisis: {
    title: 'यह बोझ आपको अकेले नहीं उठाना है',
    message:
      'आपने जो लिखा उसका कुछ हिस्सा भारी लगता है। अगर आप किसी पीड़ा से गुज़र रहे हैं, तो कृपया किसी स्थानीय हेल्पलाइन या किसी भरोसेमंद व्यक्ति से बात करने पर विचार करें — किसी से बात करना मदद कर सकता है। आपकी प्रविष्टि सहेज ली गई है।',
    heavyDay: 'एक भारी दिन',
  },

  errors: {
    noKey: 'अंतर्दृष्टि बनाने के लिए .env में अपनी OpenRouter कुंजी जोड़ें।',
    generateRead: 'पड़ताल नहीं बनाई जा सकी।',
    generateInsight: 'अंतर्दृष्टि नहीं बनाई जा सकी।',
    loadPlans: 'प्लान लोड नहीं हो सके',
    purchaseFailed: 'खरीद विफल',
    restoreFailed: 'बहाली विफल',
    planUnavailable: 'यह प्लान अभी उपलब्ध नहीं है।',
  },

  ai: {
    yourDay: 'आपका दिन',
  },
};

export default hi;
