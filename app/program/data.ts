export type ScheduleItem = {
  time: string;
  activity: string;
  location?: string;
  optional?: boolean;
};

export type ScheduleDay = {
  slug: string;
  label: string;
  date: string;
  dateISO: string;
  items: ScheduleItem[];
};

export const SCHEDULE: ScheduleDay[] = [
  {
    slug: "ziua-1",
    label: "Ziua 1",
    date: "Luni, 13.07.2026",
    dateISO: "2026-07-13",
    items: [
      { time: "11:30", activity: "Sosire în tabără" },
      { time: "11:30 – 13:00", activity: "Cazare și jocuri libere" },
      { time: "13:00 – 13:30", activity: "Prânzul", location: "Sala de mese" },
      { time: "13:30 – 14:30", activity: "Timp liber și odihnă" },
      {
        time: "14:30 – 16:00",
        activity: "Întâlnire plenară – deschidere oficială",
        location: "Sala de mese",
      },
      { time: "16:00 – 16:30", activity: "Gustare" },
      { time: "16:30 – 19:00", activity: "Timp liber și jocuri" },
      { time: "19:00 – 20:00", activity: "Cina", location: "Sala de mese" },
      { time: "20:00 – 21:00", activity: "Părtășie", location: "Sala de mese" },
      {
        time: "21:00 – 22:00",
        activity: "Magazin, jocuri de interior și exterior, socializare",
      },
      {
        time: "22:00 – 00:00",
        activity: "Filmul DAVID",
        location: "Sala de mese",
        optional: true,
      },
      {
        time: "00:00 – 02:00",
        activity: "Stingerea (discuții în cameră, jocuri în cameră, igienă, odihnă)",
      },
    ],
  },
];
