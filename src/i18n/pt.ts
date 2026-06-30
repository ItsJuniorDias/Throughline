/** Português (Brasil) */

import type { Resources } from './en';

const pt: Resources = {
  common: {
    cancel: 'Cancelar',
    save: 'Salvar',
    done: 'Concluir',
    okay: 'Ok',
    delete: 'Excluir',
    tryAgain: 'Tentar de novo',
    refresh: 'Atualizar',
    regenerate: 'Gerar de novo',
    footer: 'Throughline · v{version}',
  },

  tabs: {
    today: 'Hoje',
    timeline: 'Linha do tempo',
    insights: 'Insights',
    you: 'Você',
  },

  date: {
    morning: 'Bom dia',
    afternoon: 'Boa tarde',
    evening: 'Boa noite',
    today: 'Hoje',
    yesterday: 'Ontem',
  },

  mood: {
    rough: 'Difícil',
    low: 'Baixo',
    okay: 'Ok',
    good: 'Bom',
    great: 'Ótimo',
    question: 'Como foi o seu dia?',
  },

  streak: {
    startToday: 'COMECE HOJE',
    days: { one: '{count} DIA', other: '{count} DIAS' },
  },

  prompt: {
    eyebrow: 'Tema de hoje',
    cta: 'Escrever sobre isso',
    items: {
      p01: 'O que mais puxou sua atenção hoje, e por que isso?',
      p02: 'Cite uma coisa que você decidiu hoje. O que estava pesando?',
      p03: 'Onde você mais se sentiu você mesmo hoje?',
      p04: 'O que te esgotou, e o que valeu o custo?',
      p05: 'O que você diria para si mesmo desta manhã, sabendo como o dia foi?',
      p06: 'Algo pequeno que saiu melhor do que o esperado.',
      p07: 'O que você está evitando, e do que isso está te protegendo?',
      p08: 'Quem passou pela sua cabeça hoje e você não procurou?',
      p09: 'O que hoje te ensinou que ontem não tinha ensinado?',
      p10: 'Se hoje fosse uma única frase, qual seria?',
      p11: 'O que pareceu mais pesado do que deveria? Reflita sobre o porquê.',
      p12: 'Um momento que você gostaria de lembrar daqui a um ano.',
      p13: 'A que você deu sua energia, e foi de propósito?',
      p14: 'Onde você mudou de ideia, mesmo que um pouco?',
    },
  },

  today: {
    weekStrand: 'SUA LINHA · ÚLTIMOS 7 DIAS',
    quickCheckIn: 'Um check-in rápido',
    write: 'Escrever uma entrada',
    readEyebrow: 'Leitura de hoje',
    readingDay: 'Lendo o seu dia…',
    unlockTitle: 'Desbloqueie a leitura de hoje',
    unlockBody: 'Uma leitura do seu dia — e a linha que leva até ele — com o Premium.',
    recentEyebrow: 'Mais recente',
    recentTitle: 'Última entrada',
  },

  timeline: {
    title: 'Linha do tempo',
    entriesEyebrow: { one: '{count} entrada', other: '{count} entradas' },
    all: 'Tudo',
    emptyFiltered: 'Nenhuma entrada marcada com “{tag}”.',
    empty: 'Sua linha do tempo começa com uma entrada.',
    writeFirst: 'Escrever a primeira',
    clearFilter: 'Limpar filtro',
  },

  insights: {
    title: 'Insights',
    avgMoodWith: 'humor médio · {mood}',
    avgMood30: 'humor médio · 30d',
    daysWritten30: 'dias escritos · 30d',
    dayStreak: 'dias seguidos',
    trendEyebrow: 'Últimos 30 dias',
    trendTitle: 'Humor ao longo do tempo',
    themesEyebrow: 'Sobre o que você escreve',
    themesTitle: 'Temas recorrentes',
    disclaimer: 'Observações são reflexões, não conselhos.',

    weeklyEyebrow: 'Leitura desta semana',
    weeklyEmpty:
      'Escreva mais algumas vezes esta semana e sua leitura semanal gratuita aparecerá aqui.',
    weeklyReading: 'Lendo a sua semana…',
    weeklyError: 'Não foi possível gerar a leitura.',

    lifetimeEyebrow: 'Desde o início',
    lifetimeTitle: 'Toda a sua história',
    lifetimeEntries: 'entradas',
    lifetimeDays: 'dias escritos',
    lifetimeLongest: 'maior sequência',
    lifetimeMood: 'Humor desde que você começou',
    lifetimeAvg: 'média {value} · {mood}',
  },

  daily: {
    headerSuffix: 'LEITURA DE HOJE',
    premium: 'PREMIUM',
    statsEntries: { one: '{count} entrada', other: '{count} entradas' },
    empty:
      'Escreva hoje e sua leitura aparece aqui — o dia reunido, e a linha que chega até ele vinda dos dias anteriores.',
    reading: 'Lendo o seu dia…',
    throughline: 'A linha',
    focus: 'Vale a pena refletir',
    generated: 'Gerado a partir das suas entradas · uma reflexão, não um conselho.',
    error: 'Não foi possível gerar a leitura de hoje.',
  },

  correlations: {
    eyebrow: 'Padrões',
    title: 'O que mexe com o seu humor',
    empty:
      'Marque mais algumas entradas e os temas que te animam — e os que pesam em silêncio — vão aparecer aqui.',
    lifts: 'Te anima',
    weighs: 'Pesa em você',
    note: 'Humor médio com cada tema vs. sua média geral · número de amostras após o ponto.',
  },

  upsell: {
    eyebrow: 'Throughline Premium',
    title: 'Tenha a leitura de todos os dias',
    body: 'A escrita diária é sua, de graça. O Premium transforma isso no panorama de longo prazo que você não enxerga um dia de cada vez — começando pela sua primeira entrada.',
    bullet1: 'Leitura de hoje — o dia reunido, todos os dias',
    bullet2: 'Padrões — quais temas te animam e quais pesam em silêncio',
    bullet3: 'Análises de todo o histórico',
    bullet4: 'Exporte tudo em JSON',
    cta: 'Desbloquear Premium',
  },

  you: {
    eyebrow: 'Sua prática',
    title: 'Você',
    entries: 'entradas',
    dayStreak: 'dias seguidos',
    since: 'desde',

    premiumTitle: 'Throughline Premium',
    active: 'ATIVO',
    premiumBodyActive:
      'Suas leituras diárias, correlações de humor × tema, análises de todo o histórico e exportação estão liberadas. Obrigado por apoiar o trabalho.',
    premiumBodyInactive:
      'Uma leitura para cada dia desde a sua primeira entrada, correlações de humor × tema, análises de todo o histórico e exportação.',
    manage: 'Gerenciar assinatura',
    seeInside: 'Ver o que tem dentro',

    overrideTitle: 'Forçar Premium',
    overrideDev: 'DEV',
    overrideNote:
      'Força o acesso Premium localmente (salvo no dispositivo). “Auto” segue o RevenueCat, que no momento indica {status}.',
    overrideActive: 'ativo',
    overrideInactive: 'inativo',
    overrideAuto: 'Auto',
    overridePremium: 'Premium',
    overrideFree: 'Grátis',
  },

  language: {
    title: 'Idioma',
    detail: 'Escolha o idioma do app',
  },

  settings: {
    appearance: 'Aparência',
    appearanceDetail: 'Segue a configuração do sistema',
    reminder: 'Lembrete diário',
    reminderDetail: 'Um empurrãozinho para escrever toda noite',
    privacy: 'Privacidade e dados',
    privacyDetail: 'Criptografado no dispositivo · nunca usado para treinamento',
    privacyTitle: 'Privacidade e dados',
    privacyBody:
      'Suas entradas ficam no seu dispositivo e são criptografadas em repouso. Quando insights são gerados, o conteúdo é processado por provedores configurados para não treinar com os seus dados.',
    export: 'Exportar entradas',
    exportDetail: 'Baixe tudo em JSON',
    exportDetailPremium: 'Baixe tudo em JSON · Premium',
    restore: 'Restaurar compras',
    restoreDetail: 'Já assinou? Restaure neste dispositivo',
    clear: 'Apagar todas as entradas',

    restoredTitle: 'Compras restauradas',
    restoredBody: 'O Throughline Premium está ativo nesta conta.',
    nothingRestoreTitle: 'Nada para restaurar',
    nothingRestoreBody: 'Não encontramos uma compra anterior nesta conta.',
    nothingExportTitle: 'Nada para exportar',
    nothingExportBody: 'Escreva uma entrada primeiro e ela estará aqui para exportar.',
    exportShareTitle: 'Exportação do Throughline',
    clearTitle: 'Apagar todas as entradas?',
    clearBody: 'Isso exclui permanentemente todas as entradas neste dispositivo. Não dá para desfazer.',
    clearConfirm: 'Apagar tudo',
  },

  compose: {
    title: 'Nova entrada',
    respondingTo: 'Respondendo a',
    moodLabel: 'Como foi o seu dia?',
    entryLabel: 'Sua entrada',
    entryPlaceholder: 'Escreva livremente…',
    tagsLabel: 'Marcadores',
    addTag: 'Adicionar marcador',
    saveEntry: 'Salvar entrada',
    defaultTags: ['trabalho', 'família', 'amigos', 'saúde', 'foco', 'cansado', 'vitória', 'manhã'],
  },

  entry: {
    deleteTitle: 'Excluir entrada?',
    deleteBody: 'Não dá para desfazer.',
    gone: 'Esta entrada não está mais aqui.',
    inResponseTo: 'Em resposta a',
    insight: 'Insight',
    reading: 'Lendo esta entrada…',
    insightError: 'Não foi possível gerar um insight.',
    reflectionNote: 'Uma reflexão, não um conselho.',
  },

  notFound: {
    stackTitle: 'Não encontrado',
    title: 'Perdeu a linha',
    body: 'Esta página não existe.',
    back: 'Voltar para Hoje',
  },

  paywall: {
    restore: 'Restaurar',
    restoring: 'Restaurando…',
    eyebrow: 'Throughline Premium',
    heroTitle: 'Uma leitura todo dia, não uma vez por mês',
    heroBody:
      'A escrita é sua, de graça. O Premium lê cada dia de volta para você — começando pela sua primeira entrada, então já está aqui no momento em que você assina.',

    feature1Title: 'Uma leitura para hoje',
    feature1Detail:
      'Todo dia em que você escreve, uma reflexão de modelo de ponta sobre aquele dia — pronta no momento em que você assina, desde a sua primeira entrada.',
    feature2Title: 'O que te anima, o que te esgota',
    feature2Detail:
      'Correlações de humor × tema ao longo do seu histórico — os padrões que você não sente um dia de cada vez.',
    feature3Title: 'Análises de todo o histórico',
    feature3Detail:
      'Sua tendência de humor de sempre, sua maior sequência e o longo arco — não só os últimos 30 dias.',
    feature4Title: 'Exporte tudo',
    feature4Detail: 'Seu diário completo, seu para guardar, quando quiser.',

    loadingPlans: 'Carregando planos…',
    noPlans: 'Os planos não estão disponíveis agora.',
    perMonth: '{price} / mês',
    save: 'economize {pct}%',
    perPeriod: '/ {period}',
    startTrial: 'Iniciar teste grátis de {days} dias',
    subscribe: 'Assinar',
    trialNote: '{days} dias grátis, depois {price} / {period}. Cancele quando quiser.',
    noTrialNote: '{price} / {period}. Cancele quando quiser.',
    disclosure:
      'O pagamento é cobrado na sua conta da loja na confirmação. As assinaturas são renovadas automaticamente, a menos que sejam canceladas pelo menos 24 horas antes do fim do período.',
    terms: 'Termos',
    privacy: 'Privacidade',

    memberAllSetTitle: 'Tudo pronto',
    memberTitle: 'Você é membro',
    memberAllSetBody: 'Bem-vindo ao Throughline Premium. Sua leitura de hoje está pronta em Insights.',
    memberBody: 'O Throughline Premium está ativo nesta conta. Obrigado por apoiar o trabalho.',
  },

  plans: {
    annual: 'Anual',
    sixMonth: '6 meses',
    threeMonth: '3 meses',
    twoMonth: '2 meses',
    monthly: 'Mensal',
    weekly: 'Semanal',
    lifetime: 'Vitalício',
    subscription: 'Assinatura',
    bestValue: 'Melhor valor',

    periodYear: 'ano',
    periodSixMonth: '6 m',
    periodThreeMonth: '3 m',
    periodTwoMonth: '2 m',
    periodMonth: 'mês',
    periodWeek: 'semana',
    periodLifetime: 'única',
  },

  crisis: {
    title: 'Você não precisa carregar isso sozinho',
    message:
      'Parte do que você escreveu parece pesado. Se você está passando por algo doloroso, considere procurar uma linha de apoio local ou alguém em quem confia — conversar com uma pessoa pode ajudar. Sua entrada foi salva.',
    heavyDay: 'Um dia pesado',
  },

  errors: {
    noKey: 'Adicione sua chave do OpenRouter no .env para gerar insights.',
    generateRead: 'Não foi possível gerar a leitura.',
    generateInsight: 'Não foi possível gerar o insight.',
    loadPlans: 'Não foi possível carregar os planos',
    purchaseFailed: 'Falha na compra',
    restoreFailed: 'Falha ao restaurar',
    planUnavailable: 'Este plano não está disponível agora.',
  },

  ai: {
    yourDay: 'O seu dia',
  },
};

export default pt;
