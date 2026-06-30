/**
 * Core domain types.
 *
 * NOTE ON THE INSIGHT ARCHITECTURE (why `summary` exists on Entry):
 * the longitudinal value of this product depends on being able to roll entries
 * up over months without ever feeding the entire corpus to a model. The plan is
 * to extract small structured metadata per entry at write time (mood, themes,
 * entities) with a cheap model, then roll those summaries → daily → weekly.
 * The field is scaffolded here so the data layer is shaped for that from day one.
 */

export type Mood = 1 | 2 | 3 | 4 | 5;

export interface EntrySummary {
  /** short themes/tags extracted from the entry (e.g. "work", "family") */
  themes: string[];
  /** optional one-line gist, cheap-model generated */
  gist?: string;
  /** per-entry reflection shown to the user (generated on save) */
  reflection?: string;
}

export interface Entry {
  id: string;
  /** ISO timestamp */
  createdAt: string;
  text: string;
  mood: Mood;
  /** user-applied tags */
  tags: string[];
  /** the prompt this entry answered, if any */
  promptId?: string;
  /** derived metadata for rollups (see note above). Optional/lazy. */
  summary?: EntrySummary;
}

export type DraftEntry = Pick<Entry, 'text' | 'mood' | 'tags' | 'promptId'>;
