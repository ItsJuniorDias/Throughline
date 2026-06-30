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
  (tabs)/insights.tsx       # tendência de humor, temas, observação grátis + relatório mensal (locked)
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
barato → consolidar em semanal → mensal. O campo `summary` em `src/data/types.ts`
já deixa a camada de dados pronta pra isso.

Funil pensado: captura grátis + prompts diários (modelo barato) → **paywall quando
o primeiro relatório mensal profundo fica pronto** → pago = relatório mensal
(modelo frontier) + analytics de padrões. O card "Monthly report" (locked) na aba
Insights já é esse gancho.

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

1. Plugar o pipeline de **OpenRouter** (extração por entrada → rollup semanal/mensal).
2. **RevenueCat** + paywall acionado quando o primeiro relatório mensal está pronto.
3. Escolher o nicho do insight (decision journal pra builders, ou um nicho de vida)
   e ajustar prompts + copy do relatório.
4. Reminder local real (a aba You já tem o toggle) via `expo-notifications`.

---

Throughline · v0.1.0
