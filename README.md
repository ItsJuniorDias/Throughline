# Throughline

App de **journaling com insights longitudinais** — escrito em inglês (English-first),
construído em **React Native + Expo SDK 56 + TypeScript**, com a **tab bar nativa
liquid glass** do próprio `expo-router`.

A ideia central é o *throughline*: o fio que conecta suas entradas ao longo do
tempo. A captura do dia a dia é commodity (o Apple Journal já faz de graça); o
valor — e o que justifica a monetização — está na **camada de insight
longitudinal** acumulada ao longo de semanas e meses.

---

## Design system (construído primeiro)

Conceito: **"Kintsugi / Dusk Index"**.

- **Neutros cerâmicos frios** (não creme). O app respira calmo e levemente noturno
  em vez de "papel quente". Light = porcelana de manhã; dark = esmalte de
  entardecer.
- **Um único acento precioso: o fio de ouro (kintsugi)** — a costura dourada que
  atravessa os dias acumulados. Usado com parcimônia pra continuar precioso. Os
  botões primários são de alto contraste (tinta sólida); o ouro fica reservado pro
  fio e poucos destaques.
- **Humor como espectro frio → quente**, resolvendo no ouro: dias bons literalmente
  tendem ao fio.

> Deliberadamente **fora do clichê** de IA (creme `#F4F1EA` + Fraunces + terracota):
> serif diferente, acento diferente, conceito diferente, e um elemento-assinatura
> próprio (o fio).

**Tipografia (3 papéis):**

| Papel | Fonte | Onde |
|------|-------|------|
| Voz (serif) | **Newsreader** | prompts, prosa das entradas, títulos de insight |
| Interface (sans) | **Manrope** | botões, labels, navegação |
| Tempo & dados (mono) | **IBM Plex Mono** | timestamps, streaks, números |

Tokens em `src/theme/`: `tokens.ts` (primitivos) → `colors.ts` (semântica
light/dark + escala de humor) → `typography.ts` → `theme.ts` (montagem + shadows +
temas de navegação) → `ThemeProvider.tsx` (`useTheme()`).

---

## Como rodar

**Pré-requisito:** Node `>= 20.19.4`.

```bash
# 1. instalar dependências (versões já fixadas pro SDK 56)
npm install

# 2a. development build no iOS — ESSENCIAL pra ver o liquid glass
npx expo run:ios

# 2b. ou Android
npx expo run:android

# 2c. ou Expo Go / web (funciona, mas SEM liquid glass — ver abaixo)
npx expo start
```

> Opcional: `npx expo install --fix` — deve ser um no-op, porque as versões em
> `package.json` já foram lidas direto do `bundledNativeModules.json` do SDK 56.

### ⚠️ Sobre o liquid glass

A `NativeTabs` renderiza um `UITabBarController` real. O efeito **Liquid Glass**
(conteúdo fluindo atrás da barra translúcida + barra que minimiza no scroll) é
automático **somente no iOS 26, em um app compilado com o Xcode 26**.

- **Não aparece no Expo Go** (ele é compilado com Xcode mais antigo) → você vê a
  tab bar clássica.
- Pra ver de verdade: **development build** num **simulador iOS 26 / Xcode 26**, ou
  device físico no iOS 26.
- No Android é uma tab bar Material 3 nativa; no iOS < 26, a barra clássica.

Detalhes que já estão tratados no código:
- `ScreenScrollView` mantém o `ScrollView` como **primeiro filho** de cada tela
  (requisito pra barra detectar o scroll e fazer o minimize/transparência).
- O `ThemeProvider` do `expo-router` recebe temas com fundo cerâmico → **sem flash
  branco** ao trocar de aba ou de aparência.
- Ícones: `sf` (SF Symbols no iOS, com variantes default/selected) + `md` (Material
  Symbols no Android), sem precisar empacotar assets.

---

## Estrutura

```
app/                        # rotas (expo-router, file-based)
  _layout.tsx               # fontes + splash + ThemeProvider + Stack (modal de compose)
  (tabs)/_layout.tsx        # ← NativeTabs liquid glass (Today · Timeline · Insights · You)
  (tabs)/index.tsx          # Today: saudação, WeekStrand, prompt do dia, check-in, última entrada
  (tabs)/timeline.tsx       # o fio vertical com todas as entradas + filtro por tema
  (tabs)/insights.tsx       # tendência de humor, temas, observação grátis + leitura diária, correlações e all-time (premium)
  (tabs)/you.tsx            # perfil, premium, ajustes, privacidade, limpar dados
  entry/new.tsx             # composer (modal): humor + prosa serif + tags + guardrail de crise
  entry/[id].tsx            # detalhe da entrada
src/
  theme/                    # design system (tokens, cores, tipografia, provider)
  components/ui/            # primitivas (Text, Button, Card, GlassCard, Chip, ScreenScrollView…)
  components/journal/       # Throughline (fio), WeekStrand, EntryCard, MoodPicker, MoodTrendChart, InsightCard…
  data/                     # types, store (zustand + AsyncStorage), seed/mock, seletores (streak, humor/dia)
  lib/                      # date, haptics, mood, safety (crise)
  constants/                # prompts de reflexão
```

Estado em **zustand** com persistência via **AsyncStorage** (`throughline.journal.v1`).
No primeiro boot, semeia entradas de exemplo **após a hidratação** (dados reais
sempre ganham). A `Timeline` usa `map` por simplicidade — troque por `FlatList`
quando o volume crescer.

---

## Arquitetura de insight (por que `Entry.summary` existe)

O valor longitudinal depende de **resumir sem nunca jogar o corpus inteiro no
modelo**. O plano (mesmo padrão de conteúdo estático que você já usou): na escrita,
extrair metadados estruturados por entrada (humor, temas, entidades) com um modelo
barato → reaproveitar esses resumos nos agregados (diário, semanal). O campo
`summary` em `src/data/types.ts` já deixa a camada de dados pronta pra isso.

Funil pensado: captura grátis + prompts diários + observação semanal grátis (modelo
barato) → **paywall vendendo a leitura diária** → pago = uma leitura do dia
(modelo frontier) **já a partir da 1ª entrada**, + correlações humor×tema e
analytics all-time. O gancho mudou de propósito: antes o premium só "acendia"
depois de semanas acumuladas (assina e não vê nada); agora o conteúdo premium
aparece **no instante em que o usuário assina**, porque basta ter 1 entrada na
timeline. O `DailyReportCard` (premium) e o teaser `InsightCard` locked na aba
Insights são esse gancho.

---

## IA / OpenRouter (geração de insights)

As leituras são geradas via **OpenRouter** (API OpenAI-compatível). Sem dependência nova — só `fetch`.

**Setup:** a chave fica em `.env` como `EXPO_PUBLIC_OPENROUTER_API_KEY` (já incluída neste zip pra rodar de imediato; o `.gitignore` ignora `.env`, e há um `.env.example`).

> ⚠️ **Segurança:** variáveis `EXPO_PUBLIC_*` são **embutidas no bundle** — não são secretas. Qualquer um extrai a chave de um build publicado. **Rotacione** a chave e, pra produção, mande as chamadas por um **proxy/backend** guardando a chave de verdade lá.

**Arquivos:**
- `src/lib/openrouter.ts` — cliente (endpoint, headers, timeout de 45s, tratamento de 401/402/429, parse de JSON tolerante a fences/prosa). `MODELS.fast` e `MODELS.report` apontam pro Llama 3.3 70B **grátis**.
- `src/lib/insights.ts` — monta o **digest compacto** (1 linha por entrada: data · humor · tags · gist) e gera a **observação semanal** e a **leitura diária** (JSON estruturado). Os prompts proíbem diagnóstico/conselho — reflexão, não terapia.
- `src/data/insights.ts` — store que **cacheia** o resultado por *assinatura* (qtd de entradas na janela + id da mais recente), então só chama o modelo quando o diário muda; persiste em AsyncStorage; aplica o **guardrail de crise** (não manda conteúdo de autolesão pro modelo).

**Trocar o modelo:** pra uma leitura diária mais forte, troque `MODELS.report` por um frontier pago (ex.: `anthropic/claude-sonnet-4-6` ou `openai/gpt-4.1`). O semanal pode ficar no grátis.

**Free tier:** 20 req/min, 50 req/dia (1000/dia com US$10 em créditos). O cache por assinatura segura o consumo.

**Por nota:** ao salvar, **cada entrada gera seu próprio insight** em background
(`generateEntryInsight` → `{ gist, themes, reflection }`), gravado em
`Entry.summary` e exibido na tela de detalhe — o `gist` aparece também no card da
timeline. Os agregados diário/semanal reaproveitam esses `gist`s (resumir sem
reenviar o texto cru).

**Mínimos:** a leitura **diária** precisa de **≥1 entrada** no dia-alvo (a mais
recente com entradas) — de propósito, pra o premium já valer no primeiro dia; a
observação semanal precisa de ≥3 entradas nos últimos 7 dias (abaixo disso a tela
mostra "escreva mais um pouco").

---

## RevenueCat (paywall)

O paywall puxa **planos, preços, trial e entitlement do RevenueCat** (`src/lib/purchases.ts`).

**Config:**
- Chaves em `REVENUECAT_API_KEYS` (iOS já com a chave do **Test Store** que você usa; Android é placeholder). Dá pra sobrescrever por env: `EXPO_PUBLIC_RC_IOS_KEY` / `EXPO_PUBLIC_RC_ANDROID_KEY`. Chaves públicas do RevenueCat **não são secretas** (vão no bundle por design).
- `ENTITLEMENT_ID` (`'Throughline Pro'`) e os identificadores de package/offering **precisam bater exatamente** com o dashboard do RevenueCat — senão `isPremium` nunca fica `true`.

**Como funciona:** `getOfferings()` → `current.availablePackages` vira `Plan[]` (título, `priceString` localizado, `pricePerMonthString`, trial via `introPrice.price === 0` ou `freePhase` no Android, savings anual×mensal). `purchasePackage` confere `customerInfo.entitlements.active[ENTITLEMENT_ID]`; `restorePurchases`/`getCustomerInfo` idem; um listener (`addCustomerInfoUpdateListener`) mantém o entitlement fresco em renovação/expiração.

**Fallback:** se a chave da plataforma for placeholder (ex.: Android hoje), cai no **provider mock** e o paywall segue funcional. A seleção é automática (`keyLooksReal` em `purchases.ts`).

**Importante:** RevenueCat é módulo nativo → precisa de **development build** (não Expo Go). A chave `test_…` funciona no simulador sem montar produtos na App Store Connect.

### Estado premium: RevenueCat + AsyncStorage (com override de teste)

O entitlement é resolvido em camadas (`src/data/subscription.ts`):

1. **RevenueCat = fonte de verdade.** No `init`, com provider live, busca o status real e registra um listener (renovação/expiração/compra externa). O resultado é espelhado em `isPremium` **e cacheado no AsyncStorage** (`partialize`), então um cold start já mostra o último estado conhecido — sem o flash de "não premium" enquanto o SDK sobe — e corrige assim que o RC responde.
2. **Override manual** (`premiumOverride`, também no AsyncStorage): força premium **on/off** localmente. Serve exatamente pro caso de uma assinatura de sandbox/TestFlight presa ativa — dá pra ver o paywall de novo (Free) ou prever o premium sem assinar (Premium).

O app **sempre** consome o premium *efetivo* via `usePremium()` / `selectIsPremium` (nunca o `isPremium` cru). Efetivo = override (quando setado e permitido), senão o valor do RevenueCat/cache.

O override só é honrado quando `ALLOW_PREMIUM_OVERRIDE` é `true` — **default `__DEV__`**, pra um "force ON" nunca chegar em produção. O controle (Auto / Premium / Free) aparece na aba **You** apenas em dev. Se quiser usar em release/TestFlight, troque a constante pra `true` ciente do risco (quem conseguir setar a flag destrava o premium).

---

## Posicionamento & segurança

- **Journaling / autoconhecimento, nunca terapia.** Sem linguagem clínica, sem
  diagnóstico. As observações são "reflexões, não conselhos".
- **Guardrail de crise** (`src/lib/safety.ts`): se a entrada contém linguagem de
  autolesão, mostramos uma mensagem acolhedora apontando pra apoio real — **sem
  bloquear** a escrita e sem deixar nenhuma camada de IA "aconselhar". Expanda os
  termos e conecte a recursos localizados.
- **Privacidade** como argumento premium: dados no device, criptografados em
  repouso, providers configurados pra **não treinar** com o conteúdo.

---

## Próximos passos sugeridos

1. ✅ **OpenRouter** plugado (observação semanal + leitura diária, com cache e
   guardrail de crise). Próximo passo de escala: extrair `summary.gist` **por
   entrada na escrita** (modelo barato) e fazer o rollup a partir dos resumos, em
   vez de mandar o texto das entradas da janela.
2. ✅ **RevenueCat** + paywall que vende a leitura diária — premium já aparece a
   partir da 1ª entrada (assina e vê valor na hora).
3. Escolher o nicho do insight (decision journal pra builders, ou um nicho de vida)
   e ajustar prompts + copy da leitura diária.
4. Reminder local real (a aba You já tem o toggle) via `expo-notifications`.

---

Throughline · v0.1.0
