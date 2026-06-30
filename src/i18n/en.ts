/**
 * English — the source dictionary. Its shape defines the `Resources` type that
 * every other language is checked against, so a missing key is a compile error.
 *
 * Conventions:
 *   - Interpolation uses {name} tokens, filled from the params object.
 *   - Plurals are objects { one, other }; pass a `count` param and the resolver
 *     picks the form (then interpolates {count}).
 *   - The app name "Throughline" stays untranslated everywhere (it's the brand).
 */

const en = {
  common: {
    cancel: 'Cancel',
    save: 'Save',
    done: 'Done',
    okay: 'Okay',
    delete: 'Delete',
    tryAgain: 'Try again',
    refresh: 'Refresh',
    regenerate: 'Regenerate',
    footer: 'Throughline · v{version}',
  },

  tabs: {
    today: 'Today',
    timeline: 'Timeline',
    insights: 'Insights',
    you: 'You',
  },

  date: {
    morning: 'Good morning',
    afternoon: 'Good afternoon',
    evening: 'Good evening',
    today: 'Today',
    yesterday: 'Yesterday',
  },

  mood: {
    rough: 'Rough',
    low: 'Low',
    okay: 'Okay',
    good: 'Good',
    great: 'Great',
    question: 'How did today feel?',
  },

  streak: {
    startToday: 'START TODAY',
    days: { one: '{count} DAY', other: '{count} DAYS' },
  },

  prompt: {
    eyebrow: 'Prompt for today',
    cta: 'Write on this',
    // The 14 reflection prompts, keyed by stable id (see src/constants/prompts.ts).
    items: {
      p01: 'What pulled at your attention most today, and why that?',
      p02: 'Name one thing you decided today. What were you weighing?',
      p03: 'Where did you feel most like yourself today?',
      p04: 'What drained you, and what was worth the cost?',
      p05: 'What would you tell yourself from this morning, knowing how the day went?',
      p06: 'Something small that went better than expected.',
      p07: 'What are you avoiding, and what is it protecting you from?',
      p08: 'Who crossed your mind today that you didn’t reach out to?',
      p09: 'What did today teach you that yesterday hadn’t?',
      p10: 'If today had a single sentence, what would it be?',
      p11: 'What felt heavier than it should have? Sit with why.',
      p12: 'A moment you’d want to remember a year from now.',
      p13: 'What did you give your energy to, and was it on purpose?',
      p14: 'Where did you change your mind, even slightly?',
    },
  },

  today: {
    weekStrand: 'YOUR THROUGHLINE · LAST 7 DAYS',
    quickCheckIn: 'A quick check-in',
    write: 'Write an entry',
    readEyebrow: 'Today’s read',
    readingDay: 'Reading your day…',
    unlockTitle: 'Unlock today’s read',
    unlockBody: 'A read of your day — and the line into it — with Premium.',
    recentEyebrow: 'Most recent',
    recentTitle: 'Latest entry',
  },

  timeline: {
    title: 'Timeline',
    entriesEyebrow: { one: '{count} entry', other: '{count} entries' },
    all: 'All',
    emptyFiltered: 'No entries tagged “{tag}”.',
    empty: 'Your timeline starts with one entry.',
    writeFirst: 'Write the first one',
    clearFilter: 'Clear filter',
  },

  insights: {
    title: 'Insights',
    avgMoodWith: 'avg mood · {mood}',
    avgMood30: 'avg mood · 30d',
    daysWritten30: 'days written · 30d',
    dayStreak: 'day streak',
    trendEyebrow: 'Last 30 days',
    trendTitle: 'Mood over time',
    themesEyebrow: 'What you write about',
    themesTitle: 'Recurring themes',
    disclaimer: 'Observations are reflections, not advice.',

    weeklyEyebrow: 'This week’s read',
    weeklyEmpty: 'Write a few more times this week and your free weekly read will appear here.',
    weeklyReading: 'Reading your week…',
    weeklyError: 'Couldn’t generate the read.',

    lifetimeEyebrow: 'All time',
    lifetimeTitle: 'Your whole history',
    lifetimeEntries: 'entries',
    lifetimeDays: 'days written',
    lifetimeLongest: 'longest streak',
    lifetimeMood: 'Mood since you started',
    lifetimeAvg: 'avg {value} · {mood}',
  },

  daily: {
    headerSuffix: 'TODAY’S READ',
    premium: 'PREMIUM',
    statsEntries: { one: '{count} entry', other: '{count} entries' },
    empty:
      'Write today and your read appears here — the day pulled together, and the line running into it from the days before.',
    reading: 'Reading your day…',
    throughline: 'The throughline',
    focus: 'Worth sitting with',
    generated: 'Generated from your entries · a reflection, not advice.',
    error: 'Couldn’t generate today’s read.',
  },

  correlations: {
    eyebrow: 'Patterns',
    title: 'What moves your mood',
    empty:
      'Tag a few more entries and the themes that lift you — and the ones that quietly weigh — will surface here.',
    lifts: 'Lifts you',
    weighs: 'Weighs on you',
    note: 'Average mood with each theme vs. your overall average · sample size after the dot.',
  },

  upsell: {
    eyebrow: 'Throughline Premium',
    title: 'Get the read for every day',
    body: 'The daily writing is yours free. Premium turns it into the longitudinal picture you can’t see one day at a time — starting with your very first entry.',
    bullet1: 'Today’s read — the day pulled together, every day',
    bullet2: 'Patterns — which themes lift you and which quietly weigh',
    bullet3: 'All-time analytics across your whole history',
    bullet4: 'Export everything as JSON',
    cta: 'Unlock Premium',
  },

  you: {
    eyebrow: 'Your practice',
    title: 'You',
    entries: 'entries',
    dayStreak: 'day streak',
    since: 'since',

    premiumTitle: 'Throughline Premium',
    active: 'ACTIVE',
    premiumBodyActive:
      'Your daily reads, mood × theme correlations, all-time analytics, and export are unlocked. Thank you for supporting the work.',
    premiumBodyInactive:
      'A read for each day from your very first entry, mood × theme correlations, all-time analytics, and export.',
    manage: 'Manage subscription',
    seeInside: 'See what’s inside',

    overrideTitle: 'Premium override',
    overrideDev: 'DEV',
    overrideNote:
      'Forces the premium gate locally (saved on device). “Auto” follows RevenueCat, which currently reports {status}.',
    overrideActive: 'active',
    overrideInactive: 'inactive',
    overrideAuto: 'Auto',
    overridePremium: 'Premium',
    overrideFree: 'Free',
  },

  language: {
    title: 'Language',
    detail: 'Choose the app language',
  },

  settings: {
    appearance: 'Appearance',
    appearanceDetail: 'Follows your system setting',
    reminder: 'Daily reminder',
    reminderDetail: 'A nudge to write each evening',
    privacy: 'Privacy & data',
    privacyDetail: 'Encrypted on device · never used for training',
    privacyTitle: 'Privacy & data',
    privacyBody:
      'Your entries stay on your device and are encrypted at rest. When insights are generated, content is processed by providers configured not to train on your data.',
    export: 'Export entries',
    exportDetail: 'Download everything as JSON',
    exportDetailPremium: 'Download everything as JSON · Premium',
    restore: 'Restore purchases',
    restoreDetail: 'Already subscribed? Restore on this device',
    clear: 'Clear all entries',

    restoredTitle: 'Purchases restored',
    restoredBody: 'Throughline Premium is active on this account.',
    nothingRestoreTitle: 'Nothing to restore',
    nothingRestoreBody: 'We couldn’t find a previous purchase on this account.',
    nothingExportTitle: 'Nothing to export',
    nothingExportBody: 'Write an entry first and it’ll be here to export.',
    exportShareTitle: 'Throughline export',
    clearTitle: 'Clear all entries?',
    clearBody: 'This permanently deletes every entry on this device. This can’t be undone.',
    clearConfirm: 'Delete everything',
  },

  compose: {
    title: 'New entry',
    respondingTo: 'Responding to',
    moodLabel: 'How did today feel?',
    entryLabel: 'Your entry',
    entryPlaceholder: 'Write freely…',
    tagsLabel: 'Tags',
    addTag: 'Add a tag',
    saveEntry: 'Save entry',
    // Suggested starter tags. These become the actual tag text on an entry, so
    // they're localized to read naturally in each language.
    defaultTags: ['work', 'family', 'friends', 'health', 'focus', 'tired', 'win', 'morning'],
  },

  entry: {
    deleteTitle: 'Delete entry?',
    deleteBody: 'This can’t be undone.',
    gone: 'This entry is no longer here.',
    inResponseTo: 'In response to',
    insight: 'Insight',
    reading: 'Reading this entry…',
    insightError: 'Couldn’t generate an insight.',
    reflectionNote: 'A reflection, not advice.',
  },

  notFound: {
    stackTitle: 'Not found',
    title: 'Lost the thread',
    body: 'This page doesn’t exist.',
    back: 'Back to Today',
  },

  paywall: {
    restore: 'Restore',
    restoring: 'Restoring…',
    eyebrow: 'Throughline Premium',
    heroTitle: 'A read every day, not once a month',
    heroBody:
      'The writing is yours free. Premium reads each day back to you — starting with your very first entry, so it’s there the moment you subscribe.',

    feature1Title: 'A read for today',
    feature1Detail:
      'Every day you write, a frontier-model reflection on that day — ready the moment you subscribe, from your very first entry.',
    feature2Title: 'What lifts you, what drains you',
    feature2Detail:
      'Mood × theme correlations across your history — the patterns you can’t feel one day at a time.',
    feature3Title: 'All-time analytics',
    feature3Detail:
      'Your lifetime mood trend, longest streak, and the long arc — not just the last 30 days.',
    feature4Title: 'Export everything',
    feature4Detail: 'Your full journal, yours to keep, any time.',

    loadingPlans: 'Loading plans…',
    noPlans: 'Plans aren’t available right now.',
    perMonth: '{price} / mo',
    save: 'save {pct}%',
    perPeriod: '/ {period}',
    startTrial: 'Start {days}-day free trial',
    subscribe: 'Subscribe',
    trialNote: '{days} days free, then {price} / {period}. Cancel anytime.',
    noTrialNote: '{price} / {period}. Cancel anytime.',
    disclosure:
      'Payment is charged to your store account at confirmation. Subscriptions auto-renew unless cancelled at least 24 hours before the period ends.',
    terms: 'Terms',
    privacy: 'Privacy',

    memberAllSetTitle: 'You’re all set',
    memberTitle: 'You’re a member',
    memberAllSetBody: 'Welcome to Throughline Premium. Your read for today is ready in Insights.',
    memberBody: 'Throughline Premium is active on this account. Thank you for supporting the work.',
  },

  plans: {
    annual: 'Annual',
    sixMonth: '6 months',
    threeMonth: '3 months',
    twoMonth: '2 months',
    monthly: 'Monthly',
    weekly: 'Weekly',
    lifetime: 'Lifetime',
    subscription: 'Subscription',
    bestValue: 'Best value',

    periodYear: 'year',
    periodSixMonth: '6 mo',
    periodThreeMonth: '3 mo',
    periodTwoMonth: '2 mo',
    periodMonth: 'month',
    periodWeek: 'week',
    periodLifetime: 'one-time',
  },

  crisis: {
    title: 'You don’t have to carry this alone',
    message:
      'Some of what you wrote sounds heavy. If you’re going through something painful, please consider reaching out to a local crisis line or someone you trust — talking to a person can help. Your entry has been saved.',
    heavyDay: 'A heavy day',
  },

  errors: {
    noKey: 'Add your OpenRouter key to .env to generate insights.',
    generateRead: 'Could not generate the read.',
    generateInsight: 'Could not generate the insight.',
    loadPlans: 'Could not load plans',
    purchaseFailed: 'Purchase failed',
    restoreFailed: 'Restore failed',
    planUnavailable: 'This plan isn’t available right now.',
  },

  // Fallbacks the model normally overwrites (used only when generation fails or
  // is unconfigured), plus the per-entry title fallback.
  ai: {
    yourDay: 'Your {label}',
  },
};

// `Resources` is the *shape* of the dictionary (every key present, values typed
// as string / { one, other } / string[]). It is intentionally NOT `as const`:
// a const-assertion would freeze each value to its English literal and make any
// real translation a type error. This way a missing or misspelled key in any
// language is still a compile error, while the translated text is free.
export type Resources = typeof en;
export default en;
