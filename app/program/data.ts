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
    slug: "ziua-3",
    label: "Ziua 3",
    date: "Miercuri, 15.07.2026",
    dateISO: "2026-07-15",
    items: [
      { time: "08:30", activity: "Deșteptarea!" },
      { time: "08:40 – 09:00", activity: "Înviorarea de dimineață", location: "Teren sport" },
      { time: "09:00 – 09:30", activity: "Curățenie și îngrijire personală" },
      { time: "09:30 – 10:15", activity: "Micul dejun", location: "Sala de mese" },
      { time: "10:15 – 10:30", activity: "Părtășie pe cabane" },
      { time: "10:30 – 11:00", activity: "Timp liber" },
      { time: "11:00 – 13:30", activity: "Lecția nr. 3", location: "Sala de mese" },
      { time: "14:00 – 15:00", activity: "Prânzul", location: "Sala de mese" },
      { time: "15:00 – 16:00", activity: "Timp liber, odihnă sau campionat fotbal" },
      { time: "16:00 – 16:30", activity: "Gustare" },
      { time: "16:30 – 19:00", activity: "Lecția nr. 4", location: "Sala de mese" },
      { time: "19:30 – 20:30", activity: "Cina", location: "Sala de mese" },
      { time: "20:30 – 21:00", activity: "Timp liber" },
      {
        time: "21:00 – 22:00",
        activity: "Magazin, jocuri de interior și exterior, socializare",
      },
      {
        time: "22:00 – 00:30",
        activity: "Semifinala Anglia - Argentina",
        location: "Sala de mese",
        optional: true,
      },
      {
        time: "00:00 – 02:00",
        activity: "Stingerea (discuții în cameră, jocuri, igienă, odihnă)",
      },
    ],
  },
  {
    slug: "ziua-2",
    label: "Ziua 2",
    date: "Marți, 14.07.2026",
    dateISO: "2026-07-14",
    items: [
      { time: "08:30", activity: "Deșteptarea!" },
      { time: "08:40 – 09:00", activity: "Înviorarea de dimineață", location: "Teren sport" },
      { time: "09:00 – 09:30", activity: "Curățenie și îngrijire personală" },
      { time: "09:30 – 10:15", activity: "Micul dejun", location: "Sala de mese" },
      { time: "10:15 – 10:30", activity: "Părtășie pe cabane" },
      { time: "10:30 – 11:00", activity: "Timp liber" },
      { time: "11:00 – 13:30", activity: "Lecția nr. 1", location: "Sala de mese" },
      { time: "13:30 – 14:30", activity: "Prânzul", location: "Sala de mese" },
      { time: "14:30 – 16:00", activity: "Timp liber, odihnă sau campionat fotbal" },
      { time: "16:00 – 16:30", activity: "Gustare" },
      { time: "16:30 – 19:00", activity: "Lecția nr. 2", location: "Sala de mese" },
      { time: "19:30 – 20:30", activity: "Cina", location: "Sala de mese" },
      { time: "20:30 – 21:00", activity: "Timp liber" },
      {
        time: "21:00 – 22:00",
        activity: "Magazin, jocuri de interior și exterior, socializare",
      },
      {
        time: "22:00 – 00:30",
        activity: "Semifinala Franța - Spania",
        location: "Sala de mese",
        optional: true,
      },
      {
        time: "00:00 – 02:00",
        activity: "Stingerea (discuții în cameră, jocuri, igienă, odihnă)",
      },
    ],
  },
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
