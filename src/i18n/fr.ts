/** Français */

import type { Resources } from './en';

const fr: Resources = {
  common: {
    cancel: 'Annuler',
    save: 'Enregistrer',
    done: 'Terminé',
    okay: 'OK',
    delete: 'Supprimer',
    tryAgain: 'Réessayer',
    refresh: 'Actualiser',
    regenerate: 'Régénérer',
    footer: 'Throughline · v{version}',
  },

  tabs: {
    today: 'Aujourd’hui',
    timeline: 'Historique',
    insights: 'Analyses',
    you: 'Vous',
  },

  date: {
    morning: 'Bonjour',
    afternoon: 'Bon après-midi',
    evening: 'Bonsoir',
    today: 'Aujourd’hui',
    yesterday: 'Hier',
  },

  mood: {
    rough: 'Difficile',
    low: 'Bas',
    okay: 'Correct',
    good: 'Bien',
    great: 'Très bien',
    question: 'Comment s’est passée votre journée ?',
  },

  streak: {
    startToday: 'COMMENCEZ AUJOURD’HUI',
    days: { one: '{count} JOUR', other: '{count} JOURS' },
  },

  prompt: {
    eyebrow: 'Sujet du jour',
    cta: 'Écrire à ce sujet',
  },

  today: {
    weekStrand: 'VOTRE FIL · 7 DERNIERS JOURS',
    quickCheckIn: 'Un point rapide',
    write: 'Écrire une entrée',
    readEyebrow: 'Lecture du jour',
    readingDay: 'Lecture de votre journée…',
    unlockTitle: 'Débloquez la lecture du jour',
    unlockBody: 'Une lecture de votre journée — et le fil qui y mène — avec Premium.',
    recentEyebrow: 'Plus récent',
    recentTitle: 'Dernière entrée',
  },

  timeline: {
    title: 'Historique',
    entriesEyebrow: { one: '{count} entrée', other: '{count} entrées' },
    all: 'Tout',
    emptyFiltered: 'Aucune entrée avec l’étiquette « {tag} ».',
    empty: 'Votre historique commence par une entrée.',
    writeFirst: 'Écrire la première',
    clearFilter: 'Effacer le filtre',
  },

  insights: {
    title: 'Analyses',
    avgMoodWith: 'humeur moy. · {mood}',
    avgMood30: 'humeur moy. · 30 j',
    daysWritten30: 'jours écrits · 30 j',
    dayStreak: 'jours d’affilée',
    trendEyebrow: '30 derniers jours',
    trendTitle: 'Humeur au fil du temps',
    themesEyebrow: 'Ce sur quoi vous écrivez',
    themesTitle: 'Thèmes récurrents',
    disclaimer: 'Les observations sont des réflexions, pas des conseils.',

    weeklyEyebrow: 'Lecture de la semaine',
    weeklyEmpty:
      'Écrivez encore quelques fois cette semaine et votre lecture hebdomadaire gratuite apparaîtra ici.',
    weeklyReading: 'Lecture de votre semaine…',
    weeklyError: 'Impossible de générer la lecture.',

    lifetimeEyebrow: 'Depuis le début',
    lifetimeTitle: 'Toute votre histoire',
    lifetimeEntries: 'entrées',
    lifetimeDays: 'jours écrits',
    lifetimeLongest: 'plus longue série',
    lifetimeMood: 'Humeur depuis vos débuts',
    lifetimeAvg: 'moy. {value} · {mood}',
  },

  daily: {
    headerSuffix: 'LECTURE DU JOUR',
    premium: 'PREMIUM',
    statsEntries: { one: '{count} entrée', other: '{count} entrées' },
    empty:
      'Écrivez aujourd’hui et votre lecture apparaît ici — la journée rassemblée, et le fil qui y mène depuis les jours précédents.',
    reading: 'Lecture de votre journée…',
    throughline: 'Le fil',
    focus: 'À méditer',
    generated: 'Généré à partir de vos entrées · une réflexion, pas un conseil.',
    error: 'Impossible de générer la lecture du jour.',
  },

  correlations: {
    eyebrow: 'Tendances',
    title: 'Ce qui influence votre humeur',
    empty:
      'Étiquetez encore quelques entrées et les thèmes qui vous portent — et ceux qui pèsent en silence — apparaîtront ici.',
    lifts: 'Vous porte',
    weighs: 'Vous pèse',
    note: 'Humeur moyenne par thème vs votre moyenne globale · taille de l’échantillon après le point.',
  },

  upsell: {
    eyebrow: 'Throughline Premium',
    title: 'Obtenez la lecture de chaque jour',
    body: 'L’écriture quotidienne est gratuite. Premium la transforme en une vue d’ensemble sur la durée, que vous ne pouvez pas voir un jour à la fois — à partir de votre toute première entrée.',
    bullet1: 'Lecture du jour — la journée rassemblée, chaque jour',
    bullet2: 'Tendances — quels thèmes vous portent et lesquels pèsent en silence',
    bullet3: 'Analyses sur tout votre historique',
    bullet4: 'Exportez tout en JSON',
    cta: 'Débloquer Premium',
  },

  you: {
    eyebrow: 'Votre pratique',
    title: 'Vous',
    entries: 'entrées',
    dayStreak: 'jours d’affilée',
    since: 'depuis',

    premiumTitle: 'Throughline Premium',
    active: 'ACTIF',
    premiumBodyActive:
      'Vos lectures quotidiennes, les corrélations humeur × thème, les analyses globales et l’export sont débloqués. Merci de soutenir ce travail.',
    premiumBodyInactive:
      'Une lecture pour chaque jour depuis votre toute première entrée, les corrélations humeur × thème, les analyses globales et l’export.',
    manage: 'Gérer l’abonnement',
    seeInside: 'Voir ce qu’il y a dedans',

    overrideTitle: 'Forcer Premium',
    overrideDev: 'DEV',
    overrideNote:
      'Force l’accès Premium en local (enregistré sur l’appareil). « Auto » suit RevenueCat, qui indique actuellement {status}.',
    overrideActive: 'actif',
    overrideInactive: 'inactif',
    overrideAuto: 'Auto',
    overridePremium: 'Premium',
    overrideFree: 'Gratuit',
  },

  language: {
    title: 'Langue',
    detail: 'Choisissez la langue de l’app',
  },

  settings: {
    appearance: 'Apparence',
    appearanceDetail: 'Suit le réglage de votre système',
    reminder: 'Rappel quotidien',
    reminderDetail: 'Un petit rappel pour écrire chaque soir',
    privacy: 'Confidentialité et données',
    privacyDetail: 'Chiffré sur l’appareil · jamais utilisé pour l’entraînement',
    privacyTitle: 'Confidentialité et données',
    privacyBody:
      'Vos entrées restent sur votre appareil et sont chiffrées au repos. Lorsque des analyses sont générées, le contenu est traité par des fournisseurs configurés pour ne pas s’entraîner sur vos données.',
    export: 'Exporter les entrées',
    exportDetail: 'Tout télécharger en JSON',
    exportDetailPremium: 'Tout télécharger en JSON · Premium',
    restore: 'Restaurer les achats',
    restoreDetail: 'Déjà abonné ? Restaurez sur cet appareil',
    clear: 'Effacer toutes les entrées',

    restoredTitle: 'Achats restaurés',
    restoredBody: 'Throughline Premium est actif sur ce compte.',
    nothingRestoreTitle: 'Rien à restaurer',
    nothingRestoreBody: 'Nous n’avons trouvé aucun achat antérieur sur ce compte.',
    nothingExportTitle: 'Rien à exporter',
    nothingExportBody: 'Écrivez d’abord une entrée et elle sera là pour l’export.',
    exportShareTitle: 'Export Throughline',
    clearTitle: 'Effacer toutes les entrées ?',
    clearBody: 'Cela supprime définitivement toutes les entrées de cet appareil. C’est irréversible.',
    clearConfirm: 'Tout supprimer',
  },

  compose: {
    title: 'Nouvelle entrée',
    respondingTo: 'En réponse à',
    moodLabel: 'Comment s’est passée votre journée ?',
    entryLabel: 'Votre entrée',
    entryPlaceholder: 'Écrivez librement…',
    tagsLabel: 'Étiquettes',
    addTag: 'Ajouter une étiquette',
    saveEntry: 'Enregistrer l’entrée',
    defaultTags: ['travail', 'famille', 'amis', 'santé', 'concentration', 'fatigué', 'victoire', 'matin'],
  },

  entry: {
    deleteTitle: 'Supprimer l’entrée ?',
    deleteBody: 'C’est irréversible.',
    gone: 'Cette entrée n’est plus là.',
    inResponseTo: 'En réponse à',
    insight: 'Analyse',
    reading: 'Lecture de cette entrée…',
    insightError: 'Impossible de générer une analyse.',
    reflectionNote: 'Une réflexion, pas un conseil.',
  },

  notFound: {
    stackTitle: 'Introuvable',
    title: 'Fil perdu',
    body: 'Cette page n’existe pas.',
    back: 'Retour à Aujourd’hui',
  },

  paywall: {
    restore: 'Restaurer',
    restoring: 'Restauration…',
    eyebrow: 'Throughline Premium',
    heroTitle: 'Une lecture chaque jour, pas une fois par mois',
    heroBody:
      'L’écriture est gratuite. Premium vous relit chaque journée — à partir de votre toute première entrée, elle est donc là dès que vous vous abonnez.',

    feature1Title: 'Une lecture pour aujourd’hui',
    feature1Detail:
      'Chaque jour où vous écrivez, une réflexion d’un modèle de pointe sur cette journée — prête dès votre abonnement, depuis votre toute première entrée.',
    feature2Title: 'Ce qui vous porte, ce qui vous épuise',
    feature2Detail:
      'Des corrélations humeur × thème sur tout votre historique — les tendances que vous ne percevez pas un jour à la fois.',
    feature3Title: 'Analyses globales',
    feature3Detail:
      'Votre tendance d’humeur de toujours, votre plus longue série et la longue trajectoire — pas seulement les 30 derniers jours.',
    feature4Title: 'Exportez tout',
    feature4Detail: 'Votre journal complet, à garder, quand vous voulez.',

    loadingPlans: 'Chargement des forfaits…',
    noPlans: 'Les forfaits ne sont pas disponibles pour le moment.',
    perMonth: '{price} / mois',
    save: 'économisez {pct} %',
    perPeriod: '/ {period}',
    startTrial: 'Démarrer l’essai gratuit de {days} jours',
    subscribe: 'S’abonner',
    trialNote: '{days} jours gratuits, puis {price} / {period}. Annulez à tout moment.',
    noTrialNote: '{price} / {period}. Annulez à tout moment.',
    disclosure:
      'Le paiement est débité de votre compte de la boutique à la confirmation. Les abonnements se renouvellent automatiquement sauf annulation au moins 24 heures avant la fin de la période.',
    terms: 'Conditions',
    privacy: 'Confidentialité',

    memberAllSetTitle: 'Tout est prêt',
    memberTitle: 'Vous êtes membre',
    memberAllSetBody: 'Bienvenue dans Throughline Premium. Votre lecture du jour est prête dans Analyses.',
    memberBody: 'Throughline Premium est actif sur ce compte. Merci de soutenir ce travail.',
  },

  plans: {
    annual: 'Annuel',
    sixMonth: '6 mois',
    threeMonth: '3 mois',
    twoMonth: '2 mois',
    monthly: 'Mensuel',
    weekly: 'Hebdomadaire',
    lifetime: 'À vie',
    subscription: 'Abonnement',
    bestValue: 'Meilleure offre',

    periodYear: 'an',
    periodSixMonth: '6 mois',
    periodThreeMonth: '3 mois',
    periodTwoMonth: '2 mois',
    periodMonth: 'mois',
    periodWeek: 'semaine',
    periodLifetime: 'unique',
  },

  crisis: {
    title: 'Vous n’avez pas à porter cela seul',
    message:
      'Une partie de ce que vous avez écrit semble lourde. Si vous traversez quelque chose de douloureux, pensez à contacter une ligne d’écoute locale ou une personne de confiance — parler à quelqu’un peut aider. Votre entrée a été enregistrée.',
    heavyDay: 'Une journée difficile',
  },

  errors: {
    noKey: 'Ajoutez votre clé OpenRouter au fichier .env pour générer des analyses.',
    generateRead: 'Impossible de générer la lecture.',
    generateInsight: 'Impossible de générer l’analyse.',
    loadPlans: 'Impossible de charger les forfaits',
    purchaseFailed: 'Échec de l’achat',
    restoreFailed: 'Échec de la restauration',
    planUnavailable: 'Ce forfait n’est pas disponible pour le moment.',
  },

  ai: {
    yourDay: 'Votre journée',
  },
};

export default fr;
