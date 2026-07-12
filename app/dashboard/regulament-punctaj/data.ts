export type PointTier = {
  points: string;
  description: string;
};

export type BonusEntry = {
  points: string;
  label: string;
};

export type Station = {
  title: string;
  tiers: PointTier[];
  teamBonus?: BonusEntry;
  howTo: string;
  individualBonuses: BonusEntry[];
};

export const STATIONS: Station[] = [
  {
    title: "Verset",
    tiers: [
      { points: "8-10", description: "Majoritatea echipei (peste 80%) recită versetul corect" },
      { points: "5-7", description: "Jumătate din echipă recită corect, restul cu ezitări" },
      { points: "2-4", description: "Doar câțiva membri recită corect, restul nu știu" },
      { points: "0-1", description: "Aproape nimeni din echipă nu știe versetul" },
    ],
    teamBonus: { points: "+1", label: "echipa explică împreună și înțelesul versetului" },
    howTo:
      "Liderul ascultă 3-4 copii aleși random din echipă; proporția celor care recită corect dă scorul.",
    individualBonuses: [
      { points: "+2", label: "copilul a ajutat un coleg să învețe/memoreze versetul" },
      { points: "+2", label: "copilul a recitat singur, cu încredere, în fața grupului" },
    ],
  },
  {
    title: "Lecție biblică",
    tiers: [
      {
        points: "8-10",
        description: "Echipa răspunde corect la majoritatea întrebărilor, cu implicare de la mai mulți membri",
      },
      { points: "5-7", description: "Echipa răspunde corect la jumătate din întrebări" },
      { points: "2-4", description: "Echipa răspunde corect doar cu ajutorul/indiciile liderului" },
      { points: "0-1", description: "Echipa nu poate răspunde la întrebările de bază" },
    ],
    howTo:
      "Liderul pune 3-5 întrebări despre lecție către echipă; scorul reflectă câte răspunsuri corecte a dat echipa în ansamblu.",
    individualBonuses: [
      { points: "+2", label: "copilul a pus o întrebare relevantă / a fost foarte atent" },
      { points: "+2", label: "copilul a ajutat un coleg să înțeleagă lecția" },
    ],
  },
  {
    title: "Craft",
    tiers: [
      {
        points: "8-10",
        description: "Craft-ul echipei e terminat, creativ, cu contribuție vizibilă de la mai mulți membri",
      },
      {
        points: "5-7",
        description: "Craft-ul e terminat, dar contribuția în echipă e inegală (1-2 copii au făcut cea mai mare parte)",
      },
      { points: "2-4", description: "Craft-ul e neterminat sau contribuția echipei e minimă" },
      { points: "0-1", description: "Echipa nu a participat la craft" },
    ],
    howTo:
      "Liderul observă produsul final și implicarea vizibilă a membrilor în timpul realizării lui.",
    individualBonuses: [
      { points: "+2", label: "copilul a avut cea mai creativă contribuție personală" },
      { points: "+2", label: "copilul a ajutat la curățenia/ordinea după craft" },
    ],
  },
  {
    title: "Jocuri",
    tiers: [
      { points: "10", description: "Locul 1" },
      { points: "7", description: "Locul 2" },
      { points: "5", description: "Locul 3" },
      { points: "3", description: "Locul 4" },
    ],
    teamBonus: { points: "+1", label: "fair-play (la aprecierea liderului)" },
    howTo: "Scorul e dat direct de clasamentul probei/jocului de la stație.",
    individualBonuses: [
      { points: "+2", label: "copilul a avut cel mai bun spirit de fair-play" },
      { points: "+2", label: "copilul și-a încurajat activ echipa" },
    ],
  },
];

export const INDIVIDUAL_POINTS: BonusEntry[] = [
  { points: "+2", label: "Ajutor spontan oferit unui coleg" },
  { points: "+2", label: "Ajutor la organizarea/strângerea mesei" },
  { points: "+2", label: "Curățenie exemplară în cameră" },
  { points: "+2", label: "Comportament exemplar la program spiritual" },
  { points: "+3", label: "Inițiativă la o activitate" },
  { points: "+2", label: "Atitudine pozitivă/încurajatoare" },
  { points: "+3", label: "Curățenie voluntară în exterior" },
  { points: "+3", label: "Rezolvarea unui conflict fără implicarea liderului" },
];

export const PENALTIES: BonusEntry[] = [
  { points: "-5", label: "Abatere minoră (întârziere, gălăgie după stingere)" },
  { points: "-15", label: "Farsă" },
  { points: "-10", label: "Comportament ireverențios față de lider/coleg" },
  { points: "-20", label: "Nerespectarea perimetrului taberei fără voie" },
];

export const LEADER_RULES: string[] = [
  "La Verset, Lecție biblică, Craft și Jocuri: punctajul principal se acordă pe ECHIPĂ (nu pe copil).",
  "La fiecare stație, liderul poate acorda și 1-2 puncte individuale opționale (vezi lista de sub fiecare stație).",
  "Punctele individuale generale (în afara stațiilor) se acordă doar în situații speciale, când e cazul.",
  "Punctele (echipă + individuale) se adună zilnic la totalul echipei din care face parte copilul/copiii.",
  "Notarea se face pe loc, în Dashboard, imediat după acordare.",
  "Punctajul e definitiv odată acordat, nu se renegociază ulterior.",
];
