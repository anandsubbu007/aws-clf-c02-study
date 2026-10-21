import { describe, expect, it } from 'vitest';
import { LESSON_BY_ID } from '../content';
import { TRAPS } from '../content/traps';
import { CHECKLIST } from '../content/checklist';

describe('curated study aids reference real lessons', () => {
  it('trap lessons exist', () => {
    for (const t of TRAPS) for (const id of t.lessons) expect(LESSON_BY_ID.has(id), `${t.id} -> ${id}`).toBe(true);
  });
  it('checklist lessons exist and ids are unique', () => {
    const ids = CHECKLIST.flatMap((g) => g.items.map((i) => i.id));
    expect(new Set(ids).size).toBe(ids.length);
    for (const g of CHECKLIST) for (const i of g.items) if (i.lessonId) expect(LESSON_BY_ID.has(i.lessonId), `${i.id} -> ${i.lessonId}`).toBe(true);
  });
});
