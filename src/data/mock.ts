/**
 * Seed entries. Dates are computed relative to "now" so a fresh install always
 * looks recently used. Tuned to produce an interesting timeline: a current
 * streak, a couple of gaps, a few multi-entry days, and a full mood range.
 */

import type { Entry, Mood } from './types';

interface Seed {
  daysAgo: number;
  hour: number;
  mood: Mood;
  tags: string[];
  promptId?: string;
  text: string;
}

const SEEDS: Seed[] = [
  {
    daysAgo: 0,
    hour: 21,
    mood: 4,
    tags: ['work', 'focus'],
    promptId: 'p02',
    text: 'Shipped the thing I’d been circling for a week. The decision that unblocked it was small — just picking the boring option instead of the clever one. Noting that, because I keep relearning it.',
  },
  {
    daysAgo: 1,
    hour: 8,
    mood: 3,
    tags: ['morning'],
    text: 'Slow start. Coffee, no agenda yet. Trying to let the morning be quiet before the noise.',
  },
  {
    daysAgo: 1,
    hour: 22,
    mood: 4,
    tags: ['friends'],
    promptId: 'p08',
    text: 'Long call with M. Hadn’t realized how much I’d been holding until I said it out loud. Lighter after.',
  },
  {
    daysAgo: 2,
    hour: 19,
    mood: 2,
    tags: ['tired', 'work'],
    promptId: 'p04',
    text: 'Drained today. Too many meetings, none of them mine. The cost wasn’t worth it and I knew it by 2pm but kept saying yes anyway.',
  },
  {
    daysAgo: 3,
    hour: 20,
    mood: 5,
    tags: ['family', 'good-day'],
    promptId: 'p12',
    text: 'Dinner ran late and nobody checked their phone. One of those nights I’d trade a lot of other days for.',
  },
  {
    daysAgo: 4,
    hour: 18,
    mood: 3,
    tags: ['work'],
    text: 'Steady. Not much to report, which is its own kind of fine.',
  },
  {
    daysAgo: 6,
    hour: 23,
    mood: 2,
    tags: ['anxious'],
    promptId: 'p07',
    text: 'Avoided the email again. It’s not the email — it’s what saying yes would commit me to. Naming that helped a little.',
  },
  {
    daysAgo: 7,
    hour: 9,
    mood: 4,
    tags: ['running', 'morning'],
    text: 'Ran before anyone was awake. The city is honest at that hour. Came back clearer than I left.',
  },
  {
    daysAgo: 9,
    hour: 21,
    mood: 3,
    tags: ['reading'],
    promptId: 'p09',
    text: 'Finished the chapter I kept rereading. The idea finally landed: most of what I call procrastination is just unmade decisions.',
  },
  {
    daysAgo: 11,
    hour: 20,
    mood: 4,
    tags: ['work', 'win'],
    promptId: 'p06',
    text: 'The demo went better than I’d braced for. I’d written off the whole approach two weeks ago. Glad I didn’t.',
  },
  {
    daysAgo: 12,
    hour: 22,
    mood: 1,
    tags: ['low'],
    text: 'Hard one. No single reason, which makes it harder to argue with. Writing it down so tomorrow-me knows it passed.',
  },
  {
    daysAgo: 14,
    hour: 19,
    mood: 3,
    tags: ['family'],
    promptId: 'p03',
    text: 'Felt most like myself cooking, oddly. Hands busy, mind off. Should make more room for that.',
  },
  {
    daysAgo: 17,
    hour: 18,
    mood: 5,
    tags: ['travel', 'good-day'],
    promptId: 'p10',
    text: 'If today had a sentence: got lost on purpose and it was the best part.',
  },
  {
    daysAgo: 19,
    hour: 21,
    mood: 4,
    tags: ['work', 'focus'],
    text: 'Two hours of real, uninterrupted focus. Forgot how good that feels. Protecting that block tomorrow.',
  },
];

function makeId(daysAgo: number, hour: number): string {
  return `seed-${daysAgo}-${hour}-${Math.random().toString(36).slice(2, 7)}`;
}

export function buildSeedEntries(): Entry[] {
  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;
  return SEEDS.map((s) => {
    const d = new Date(now - s.daysAgo * DAY);
    d.setHours(s.hour, Math.floor(Math.random() * 50), 0, 0);
    return {
      id: makeId(s.daysAgo, s.hour),
      createdAt: d.toISOString(),
      text: s.text,
      mood: s.mood,
      tags: s.tags,
      promptId: s.promptId,
      summary: { themes: s.tags },
    };
  }).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}
