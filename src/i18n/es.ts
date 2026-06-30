/** Español */

import type { Resources } from './en';

const es: Resources = {
  common: {
    cancel: 'Cancelar',
    save: 'Guardar',
    done: 'Listo',
    okay: 'Vale',
    delete: 'Eliminar',
    tryAgain: 'Reintentar',
    refresh: 'Actualizar',
    regenerate: 'Regenerar',
    footer: 'Throughline · v{version}',
  },

  tabs: {
    today: 'Hoy',
    timeline: 'Cronología',
    insights: 'Análisis',
    you: 'Tú',
  },

  date: {
    morning: 'Buenos días',
    afternoon: 'Buenas tardes',
    evening: 'Buenas noches',
    today: 'Hoy',
    yesterday: 'Ayer',
  },

  mood: {
    rough: 'Difícil',
    low: 'Bajo',
    okay: 'Normal',
    good: 'Bien',
    great: 'Genial',
    question: '¿Cómo te sentiste hoy?',
  },

  streak: {
    startToday: 'EMPIEZA HOY',
    days: { one: '{count} DÍA', other: '{count} DÍAS' },
  },

  prompt: {
    eyebrow: 'Tema de hoy',
    cta: 'Escribir sobre esto',
    items: {
      p01: '¿Qué fue lo que más llamó tu atención hoy, y por qué eso?',
      p02: 'Nombra una cosa que decidiste hoy. ¿Qué estabas sopesando?',
      p03: '¿Dónde te sentiste más tú mismo hoy?',
      p04: '¿Qué te agotó, y qué valió la pena?',
      p05: '¿Qué le dirías a quien fuiste esta mañana, sabiendo cómo fue el día?',
      p06: 'Algo pequeño que salió mejor de lo esperado.',
      p07: '¿Qué estás evitando, y de qué te protege?',
      p08: '¿Quién pasó por tu mente hoy y no contactaste?',
      p09: '¿Qué te enseñó hoy que ayer no?',
      p10: 'Si hoy fuera una sola frase, ¿cuál sería?',
      p11: '¿Qué sentiste más pesado de lo que debería? Detente en el porqué.',
      p12: 'Un momento que querrías recordar dentro de un año.',
      p13: '¿A qué le diste tu energía, y fue a propósito?',
      p14: '¿En qué cambiaste de opinión, aunque sea un poco?',
    },
  },

  today: {
    weekStrand: 'TU HILO · ÚLTIMOS 7 DÍAS',
    quickCheckIn: 'Un registro rápido',
    write: 'Escribir una entrada',
    readEyebrow: 'Lectura de hoy',
    readingDay: 'Leyendo tu día…',
    unlockTitle: 'Desbloquea la lectura de hoy',
    unlockBody: 'Una lectura de tu día — y el hilo que lleva a él — con Premium.',
    recentEyebrow: 'Más reciente',
    recentTitle: 'Última entrada',
  },

  timeline: {
    title: 'Cronología',
    entriesEyebrow: { one: '{count} entrada', other: '{count} entradas' },
    all: 'Todo',
    emptyFiltered: 'Ninguna entrada con la etiqueta «{tag}».',
    empty: 'Tu cronología comienza con una entrada.',
    writeFirst: 'Escribir la primera',
    clearFilter: 'Quitar filtro',
  },

  insights: {
    title: 'Análisis',
    avgMoodWith: 'ánimo medio · {mood}',
    avgMood30: 'ánimo medio · 30d',
    daysWritten30: 'días escritos · 30d',
    dayStreak: 'días seguidos',
    trendEyebrow: 'Últimos 30 días',
    trendTitle: 'Ánimo a lo largo del tiempo',
    themesEyebrow: 'Sobre qué escribes',
    themesTitle: 'Temas recurrentes',
    disclaimer: 'Las observaciones son reflexiones, no consejos.',

    weeklyEyebrow: 'Lectura de esta semana',
    weeklyEmpty:
      'Escribe unas cuantas veces más esta semana y tu lectura semanal gratuita aparecerá aquí.',
    weeklyReading: 'Leyendo tu semana…',
    weeklyError: 'No se pudo generar la lectura.',

    lifetimeEyebrow: 'Desde el inicio',
    lifetimeTitle: 'Toda tu historia',
    lifetimeEntries: 'entradas',
    lifetimeDays: 'días escritos',
    lifetimeLongest: 'racha más larga',
    lifetimeMood: 'Ánimo desde que empezaste',
    lifetimeAvg: 'media {value} · {mood}',
  },

  daily: {
    headerSuffix: 'LECTURA DE HOY',
    premium: 'PREMIUM',
    statsEntries: { one: '{count} entrada', other: '{count} entradas' },
    empty:
      'Escribe hoy y tu lectura aparecerá aquí — el día reunido y el hilo que llega a él desde los días anteriores.',
    reading: 'Leyendo tu día…',
    throughline: 'El hilo',
    focus: 'Vale la pena reflexionar',
    generated: 'Generado a partir de tus entradas · una reflexión, no un consejo.',
    error: 'No se pudo generar la lectura de hoy.',
  },

  correlations: {
    eyebrow: 'Patrones',
    title: 'Qué mueve tu ánimo',
    empty:
      'Etiqueta unas cuantas entradas más y los temas que te animan — y los que pesan en silencio — aparecerán aquí.',
    lifts: 'Te anima',
    weighs: 'Te pesa',
    note: 'Ánimo medio con cada tema frente a tu media general · tamaño de muestra tras el punto.',
  },

  upsell: {
    eyebrow: 'Throughline Premium',
    title: 'Ten la lectura de cada día',
    body: 'La escritura diaria es tuya, gratis. Premium la convierte en la imagen a largo plazo que no puedes ver un día a la vez — empezando por tu primera entrada.',
    bullet1: 'Lectura de hoy — el día reunido, cada día',
    bullet2: 'Patrones — qué temas te animan y cuáles pesan en silencio',
    bullet3: 'Análisis de todo tu historial',
    bullet4: 'Exporta todo en JSON',
    cta: 'Desbloquear Premium',
  },

  you: {
    eyebrow: 'Tu práctica',
    title: 'Tú',
    entries: 'entradas',
    dayStreak: 'días seguidos',
    since: 'desde',

    premiumTitle: 'Throughline Premium',
    active: 'ACTIVO',
    premiumBodyActive:
      'Tus lecturas diarias, las correlaciones de ánimo × tema, el análisis histórico y la exportación están desbloqueados. Gracias por apoyar el trabajo.',
    premiumBodyInactive:
      'Una lectura para cada día desde tu primera entrada, correlaciones de ánimo × tema, análisis histórico y exportación.',
    manage: 'Gestionar suscripción',
    seeInside: 'Ver qué incluye',

    overrideTitle: 'Forzar Premium',
    overrideDev: 'DEV',
    overrideNote:
      'Fuerza el acceso Premium localmente (guardado en el dispositivo). «Auto» sigue a RevenueCat, que ahora indica {status}.',
    overrideActive: 'activo',
    overrideInactive: 'inactivo',
    overrideAuto: 'Auto',
    overridePremium: 'Premium',
    overrideFree: 'Gratis',
  },

  language: {
    title: 'Idioma',
    detail: 'Elige el idioma de la app',
  },

  settings: {
    appearance: 'Apariencia',
    appearanceDetail: 'Sigue la configuración del sistema',
    reminder: 'Recordatorio diario',
    reminderDetail: 'Un empujón para escribir cada noche',
    privacy: 'Privacidad y datos',
    privacyDetail: 'Cifrado en el dispositivo · nunca usado para entrenamiento',
    privacyTitle: 'Privacidad y datos',
    privacyBody:
      'Tus entradas permanecen en tu dispositivo y se cifran en reposo. Cuando se generan análisis, el contenido se procesa con proveedores configurados para no entrenar con tus datos.',
    export: 'Exportar entradas',
    exportDetail: 'Descarga todo en JSON',
    exportDetailPremium: 'Descarga todo en JSON · Premium',
    restore: 'Restaurar compras',
    restoreDetail: '¿Ya tienes suscripción? Restáurala en este dispositivo',
    clear: 'Borrar todas las entradas',

    restoredTitle: 'Compras restauradas',
    restoredBody: 'Throughline Premium está activo en esta cuenta.',
    nothingRestoreTitle: 'Nada que restaurar',
    nothingRestoreBody: 'No encontramos una compra anterior en esta cuenta.',
    nothingExportTitle: 'Nada que exportar',
    nothingExportBody: 'Escribe una entrada primero y estará aquí para exportar.',
    exportShareTitle: 'Exportación de Throughline',
    clearTitle: '¿Borrar todas las entradas?',
    clearBody: 'Esto elimina permanentemente todas las entradas de este dispositivo. No se puede deshacer.',
    clearConfirm: 'Borrar todo',
  },

  compose: {
    title: 'Nueva entrada',
    respondingTo: 'En respuesta a',
    moodLabel: '¿Cómo te sentiste hoy?',
    entryLabel: 'Tu entrada',
    entryPlaceholder: 'Escribe libremente…',
    tagsLabel: 'Etiquetas',
    addTag: 'Añadir etiqueta',
    saveEntry: 'Guardar entrada',
    defaultTags: ['trabajo', 'familia', 'amigos', 'salud', 'enfoque', 'cansancio', 'logro', 'mañana'],
  },

  entry: {
    deleteTitle: '¿Eliminar entrada?',
    deleteBody: 'No se puede deshacer.',
    gone: 'Esta entrada ya no está aquí.',
    inResponseTo: 'En respuesta a',
    insight: 'Análisis',
    reading: 'Leyendo esta entrada…',
    insightError: 'No se pudo generar el análisis.',
    reflectionNote: 'Una reflexión, no un consejo.',
  },

  notFound: {
    stackTitle: 'No encontrado',
    title: 'Perdiste el hilo',
    body: 'Esta página no existe.',
    back: 'Volver a Hoy',
  },

  paywall: {
    restore: 'Restaurar',
    restoring: 'Restaurando…',
    eyebrow: 'Throughline Premium',
    heroTitle: 'Una lectura cada día, no una vez al mes',
    heroBody:
      'La escritura es tuya, gratis. Premium te devuelve cada día en forma de lectura — empezando por tu primera entrada, así que está ahí desde el momento en que te suscribes.',

    feature1Title: 'Una lectura para hoy',
    feature1Detail:
      'Cada día que escribes, una reflexión de modelo de vanguardia sobre ese día — lista desde el momento en que te suscribes, desde tu primera entrada.',
    feature2Title: 'Qué te anima, qué te agota',
    feature2Detail:
      'Correlaciones de ánimo × tema en tu historial — los patrones que no percibes un día a la vez.',
    feature3Title: 'Análisis de todo el historial',
    feature3Detail:
      'Tu tendencia de ánimo de siempre, tu racha más larga y el largo arco — no solo los últimos 30 días.',
    feature4Title: 'Exporta todo',
    feature4Detail: 'Tu diario completo, tuyo para conservar, cuando quieras.',

    loadingPlans: 'Cargando planes…',
    noPlans: 'Los planes no están disponibles ahora.',
    perMonth: '{price} / mes',
    save: 'ahorra {pct}%',
    perPeriod: '/ {period}',
    startTrial: 'Empezar prueba gratis de {days} días',
    subscribe: 'Suscribirse',
    trialNote: '{days} días gratis, luego {price} / {period}. Cancela cuando quieras.',
    noTrialNote: '{price} / {period}. Cancela cuando quieras.',
    disclosure:
      'El pago se cobra a tu cuenta de la tienda al confirmar. Las suscripciones se renuevan automáticamente salvo que se cancelen al menos 24 horas antes de que termine el periodo.',
    terms: 'Términos',
    privacy: 'Privacidad',

    memberAllSetTitle: 'Todo listo',
    memberTitle: 'Eres miembro',
    memberAllSetBody: 'Bienvenido a Throughline Premium. Tu lectura de hoy está lista en Análisis.',
    memberBody: 'Throughline Premium está activo en esta cuenta. Gracias por apoyar el trabajo.',
  },

  plans: {
    annual: 'Anual',
    sixMonth: '6 meses',
    threeMonth: '3 meses',
    twoMonth: '2 meses',
    monthly: 'Mensual',
    weekly: 'Semanal',
    lifetime: 'De por vida',
    subscription: 'Suscripción',
    bestValue: 'Mejor valor',

    periodYear: 'año',
    periodSixMonth: '6 m',
    periodThreeMonth: '3 m',
    periodTwoMonth: '2 m',
    periodMonth: 'mes',
    periodWeek: 'semana',
    periodLifetime: 'único',
  },

  crisis: {
    title: 'No tienes que cargar con esto solo',
    message:
      'Parte de lo que escribiste suena pesado. Si estás pasando por algo doloroso, considera contactar a una línea de ayuda local o a alguien de confianza — hablar con una persona puede ayudar. Tu entrada se ha guardado.',
    heavyDay: 'Un día pesado',
  },

  errors: {
    noKey: 'Añade tu clave de OpenRouter al .env para generar análisis.',
    generateRead: 'No se pudo generar la lectura.',
    generateInsight: 'No se pudo generar el análisis.',
    loadPlans: 'No se pudieron cargar los planes',
    purchaseFailed: 'Falló la compra',
    restoreFailed: 'Falló la restauración',
    planUnavailable: 'Este plan no está disponible ahora.',
  },

  ai: {
    yourDay: 'Tu día',
  },
};

export default es;
