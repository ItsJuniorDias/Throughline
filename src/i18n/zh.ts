/** 中文（简体） */

import type { Resources } from './en';

const zh: Resources = {
  common: {
    cancel: '取消',
    save: '保存',
    done: '完成',
    okay: '好的',
    delete: '删除',
    tryAgain: '重试',
    refresh: '刷新',
    regenerate: '重新生成',
    footer: 'Throughline · v{version}',
  },

  tabs: {
    today: '今天',
    timeline: '时间线',
    insights: '洞察',
    you: '我的',
  },

  date: {
    morning: '早上好',
    afternoon: '下午好',
    evening: '晚上好',
    today: '今天',
    yesterday: '昨天',
  },

  mood: {
    rough: '糟糕',
    low: '低落',
    okay: '一般',
    good: '不错',
    great: '很好',
    question: '今天感觉如何？',
  },

  streak: {
    startToday: '从今天开始',
    days: { one: '{count} 天', other: '{count} 天' },
  },

  prompt: {
    eyebrow: '今日主题',
    cta: '就此书写',
    items: {
      p01: '今天最吸引你注意的是什么，为什么是它？',
      p02: '说出今天你做的一个决定。你在权衡什么？',
      p03: '今天在哪一刻你最像自己？',
      p04: '什么消耗了你？又有什么值得这份代价？',
      p05: '知道这一天是怎么过的，你会对今早的自己说什么？',
      p06: '一件比预期顺利的小事。',
      p07: '你在回避什么？它又在保护你免于什么？',
      p08: '今天有谁浮现在你脑海，你却没有联系？',
      p09: '今天教会了你什么，是昨天没有的？',
      p10: '如果今天只能用一句话，会是什么？',
      p11: '什么比它本该有的更沉重？停下来想想为什么。',
      p12: '一个一年后你仍想记得的瞬间。',
      p13: '你把精力给了什么？那是有意为之吗？',
      p14: '你在哪里改变了想法，哪怕只是一点点？',
    },
  },

  today: {
    weekStrand: '你的脉络 · 最近 7 天',
    quickCheckIn: '快速记录',
    write: '写一篇',
    readEyebrow: '今日解读',
    readingDay: '正在解读你的一天…',
    unlockTitle: '解锁今日解读',
    unlockBody: '一份对你这一天的解读，以及通向它的那条脉络 —— 尽在 Premium。',
    recentEyebrow: '最新',
    recentTitle: '最近一篇',
  },

  timeline: {
    title: '时间线',
    entriesEyebrow: { one: '{count} 篇', other: '{count} 篇' },
    all: '全部',
    emptyFiltered: '没有带「{tag}」标签的记录。',
    empty: '你的时间线从第一篇开始。',
    writeFirst: '写下第一篇',
    clearFilter: '清除筛选',
  },

  insights: {
    title: '洞察',
    avgMoodWith: '平均心情 · {mood}',
    avgMood30: '平均心情 · 30天',
    daysWritten30: '书写天数 · 30天',
    dayStreak: '连续天数',
    trendEyebrow: '最近 30 天',
    trendTitle: '心情随时间变化',
    themesEyebrow: '你都写些什么',
    themesTitle: '反复出现的主题',
    disclaimer: '这些观察是反思，而非建议。',

    weeklyEyebrow: '本周解读',
    weeklyEmpty: '本周再多写几次，你的免费每周解读就会出现在这里。',
    weeklyReading: '正在解读你的一周…',
    weeklyError: '无法生成解读。',

    lifetimeEyebrow: '全部时间',
    lifetimeTitle: '你的全部历程',
    lifetimeEntries: '篇',
    lifetimeDays: '书写天数',
    lifetimeLongest: '最长连续',
    lifetimeMood: '自你开始以来的心情',
    lifetimeAvg: '平均 {value} · {mood}',
  },

  daily: {
    headerSuffix: '今日解读',
    premium: 'PREMIUM',
    statsEntries: { one: '{count} 篇', other: '{count} 篇' },
    empty: '写下今天，你的解读就会出现在这里 —— 这一天被串联起来，以及从过往日子延伸而来的那条脉络。',
    reading: '正在解读你的一天…',
    throughline: '脉络',
    focus: '值得细想',
    generated: '根据你的记录生成 · 一份反思，而非建议。',
    error: '无法生成今日解读。',
  },

  correlations: {
    eyebrow: '规律',
    title: '什么在牵动你的心情',
    empty: '再给几篇记录加上标签，那些让你振奋的主题 —— 以及那些悄悄拖累你的 —— 就会出现在这里。',
    lifts: '让你振奋',
    weighs: '让你低落',
    note: '每个主题的平均心情与你的总体平均之比 · 圆点后为样本数。',
  },

  upsell: {
    eyebrow: 'Throughline Premium',
    title: '获得每一天的解读',
    body: '每日书写永久免费。Premium 把它变成你无法一天一天看清的长期图景 —— 从你的第一篇记录开始。',
    bullet1: '今日解读 —— 每天，把这一天串联起来',
    bullet2: '规律 —— 哪些主题让你振奋，哪些悄悄拖累你',
    bullet3: '覆盖全部历程的分析',
    bullet4: '以 JSON 导出全部内容',
    cta: '解锁 Premium',
  },

  you: {
    eyebrow: '你的练习',
    title: '我的',
    entries: '篇',
    dayStreak: '连续天数',
    since: '始于',

    premiumTitle: 'Throughline Premium',
    active: '已开通',
    premiumBodyActive: '你的每日解读、心情 × 主题关联、全部历程分析与导出均已解锁。感谢你的支持。',
    premiumBodyInactive: '从第一篇记录起每天一份解读、心情 × 主题关联、全部历程分析与导出。',
    manage: '管理订阅',
    seeInside: '看看包含什么',

    overrideTitle: '强制 Premium',
    overrideDev: 'DEV',
    overrideNote: '在本地强制开启 Premium（保存在设备上）。「自动」跟随 RevenueCat，目前显示为{status}。',
    overrideActive: '已开通',
    overrideInactive: '未开通',
    overrideAuto: '自动',
    overridePremium: 'Premium',
    overrideFree: '免费',
  },

  language: {
    title: '语言',
    detail: '选择应用语言',
  },

  settings: {
    appearance: '外观',
    appearanceDetail: '跟随系统设置',
    reminder: '每日提醒',
    reminderDetail: '每晚提醒你写一写',
    privacy: '隐私与数据',
    privacyDetail: '在设备上加密 · 绝不用于训练',
    privacyTitle: '隐私与数据',
    privacyBody:
      '你的记录保存在设备上并加密存储。生成洞察时，内容会交由已设置为不使用你的数据进行训练的提供商处理。',
    export: '导出记录',
    exportDetail: '以 JSON 导出全部',
    exportDetailPremium: '以 JSON 导出全部 · Premium',
    restore: '恢复购买',
    restoreDetail: '已订阅？在此设备恢复',
    clear: '清除所有记录',

    restoredTitle: '购买已恢复',
    restoredBody: '此账户的 Throughline Premium 已激活。',
    nothingRestoreTitle: '没有可恢复的内容',
    nothingRestoreBody: '我们在此账户上找不到之前的购买记录。',
    nothingExportTitle: '没有可导出的内容',
    nothingExportBody: '先写一篇，它就会出现在这里供你导出。',
    exportShareTitle: 'Throughline 导出',
    clearTitle: '清除所有记录？',
    clearBody: '这将永久删除此设备上的所有记录，且无法撤销。',
    clearConfirm: '全部删除',
  },

  compose: {
    title: '新记录',
    respondingTo: '回应',
    moodLabel: '今天感觉如何？',
    entryLabel: '你的记录',
    entryPlaceholder: '自由书写…',
    tagsLabel: '标签',
    addTag: '添加标签',
    saveEntry: '保存记录',
    defaultTags: ['工作', '家人', '朋友', '健康', '专注', '疲惫', '收获', '清晨'],
  },

  entry: {
    deleteTitle: '删除这篇记录？',
    deleteBody: '此操作无法撤销。',
    gone: '这篇记录已不在了。',
    inResponseTo: '回应',
    insight: '洞察',
    reading: '正在解读这篇记录…',
    insightError: '无法生成洞察。',
    reflectionNote: '一份反思，而非建议。',
  },

  notFound: {
    stackTitle: '未找到',
    title: '线索断了',
    body: '此页面不存在。',
    back: '回到今天',
  },

  paywall: {
    restore: '恢复',
    restoring: '正在恢复…',
    eyebrow: 'Throughline Premium',
    heroTitle: '每天一份解读，而非每月一次',
    heroBody:
      '书写永久免费。Premium 把每一天解读给你听 —— 从你的第一篇记录开始，所以你订阅的那一刻它就在这里。',

    feature1Title: '为今天准备的解读',
    feature1Detail: '你每写一天，便有一份前沿模型对那一天的反思 —— 订阅即得，从你的第一篇记录开始。',
    feature2Title: '什么让你振奋，什么让你疲惫',
    feature2Detail: '贯穿你历程的心情 × 主题关联 —— 那些你无法一天一天感受到的规律。',
    feature3Title: '覆盖全部历程的分析',
    feature3Detail: '你的全程心情趋势、最长连续记录与漫长的轨迹 —— 而不仅是最近 30 天。',
    feature4Title: '导出全部',
    feature4Detail: '你的完整日记，随时归你保存。',

    loadingPlans: '正在加载方案…',
    noPlans: '当前没有可用的方案。',
    perMonth: '{price} / 月',
    save: '省 {pct}%',
    perPeriod: '/ {period}',
    startTrial: '开始 {days} 天免费试用',
    subscribe: '订阅',
    trialNote: '{days} 天免费，之后 {price} / {period}。可随时取消。',
    noTrialNote: '{price} / {period}。可随时取消。',
    disclosure:
      '确认时将从你的商店账户扣款。除非在周期结束前至少 24 小时取消，否则订阅将自动续费。',
    terms: '条款',
    privacy: '隐私',

    memberAllSetTitle: '一切就绪',
    memberTitle: '你已是会员',
    memberAllSetBody: '欢迎加入 Throughline Premium。你今天的解读已在「洞察」中准备好。',
    memberBody: '此账户的 Throughline Premium 已激活。感谢你的支持。',
  },

  plans: {
    annual: '年付',
    sixMonth: '6 个月',
    threeMonth: '3 个月',
    twoMonth: '2 个月',
    monthly: '月付',
    weekly: '周付',
    lifetime: '永久',
    subscription: '订阅',
    bestValue: '最划算',

    periodYear: '年',
    periodSixMonth: '6 个月',
    periodThreeMonth: '3 个月',
    periodTwoMonth: '2 个月',
    periodMonth: '月',
    periodWeek: '周',
    periodLifetime: '一次性',
  },

  crisis: {
    title: '你不必独自承受这一切',
    message:
      '你写下的一些内容听起来很沉重。如果你正经历痛苦，请考虑联系当地的危机热线或你信任的人 —— 与人交谈会有帮助。你的记录已保存。',
    heavyDay: '沉重的一天',
  },

  errors: {
    noKey: '在 .env 中添加你的 OpenRouter 密钥以生成洞察。',
    generateRead: '无法生成解读。',
    generateInsight: '无法生成洞察。',
    loadPlans: '无法加载方案',
    purchaseFailed: '购买失败',
    restoreFailed: '恢复失败',
    planUnavailable: '此方案当前不可用。',
  },

  ai: {
    yourDay: '你的这一天',
  },
};

export default zh;
