import type { ScheduleDay, ScheduleItem } from "./data";

export type ItemStatus = "past" | "current" | "upcoming";
export type DayStatus = "before" | "live" | "after";

// Late-night items (e.g. 00:00 – 02:00) belong to the schedule day even
// though the wall clock has rolled into the next calendar date.
const WRAP_LIMIT_MINUTES = 26 * 60;

function toMinutes(hm: string): number {
  const [h, m] = hm.trim().split(":").map(Number);
  return h * 60 + m;
}

function itemBounds(items: ScheduleItem[]): { start: number; end: number }[] {
  const rawStarts = items.map((item) => toMinutes(item.time.split("–")[0]));
  const bounds: { start: number; end: number }[] = [];
  let offset = 0;

  items.forEach((item, index) => {
    const raw = rawStarts[index];
    if (index > 0 && raw < rawStarts[index - 1]) offset += 24 * 60;
    const start = raw + offset;

    const parts = item.time.split("–");
    let end: number;
    if (parts.length > 1) {
      end = toMinutes(parts[1]) + offset;
      if (end < start) end += 24 * 60;
    } else if (index + 1 < items.length) {
      const nextRaw = rawStarts[index + 1];
      const nextOffset = nextRaw < raw ? offset + 24 * 60 : offset;
      end = nextRaw + nextOffset;
    } else {
      end = start + 30;
    }
    bounds.push({ start, end });
  });

  return bounds;
}

export type ScheduleSnapshot = {
  dayStatus: DayStatus;
  currentIndex: number | null;
  nextIndex: number | null;
  daysUntil: number;
  statuses: ItemStatus[];
};

export function getScheduleSnapshot(day: ScheduleDay, now: Date): ScheduleSnapshot {
  const dayStart = new Date(`${day.dateISO}T00:00:00`);
  const minutesSinceDayStart = (now.getTime() - dayStart.getTime()) / 60000;

  if (minutesSinceDayStart < 0) {
    return {
      dayStatus: "before",
      currentIndex: null,
      nextIndex: 0,
      daysUntil: Math.ceil(-minutesSinceDayStart / 1440),
      statuses: day.items.map(() => "upcoming"),
    };
  }

  if (minutesSinceDayStart > WRAP_LIMIT_MINUTES) {
    return {
      dayStatus: "after",
      currentIndex: null,
      nextIndex: null,
      daysUntil: 0,
      statuses: day.items.map(() => "past"),
    };
  }

  const bounds = itemBounds(day.items);
  const currentIndex = bounds.findIndex(
    (b) => minutesSinceDayStart >= b.start && minutesSinceDayStart < b.end,
  );
  const resolvedCurrent = currentIndex === -1 ? null : currentIndex;
  const nextIndex = bounds.findIndex((b) => b.start > minutesSinceDayStart);

  return {
    dayStatus: "live",
    currentIndex: resolvedCurrent,
    nextIndex: nextIndex === -1 ? null : nextIndex,
    daysUntil: 0,
    statuses: day.items.map((_, i) => {
      if (resolvedCurrent === null) return i < (nextIndex === -1 ? day.items.length : nextIndex) ? "past" : "upcoming";
      if (i < resolvedCurrent) return "past";
      if (i === resolvedCurrent) return "current";
      return "upcoming";
    }),
  };
}
