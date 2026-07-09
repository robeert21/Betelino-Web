export type DailyQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  reference: string;
};

export function dayIndexFromDateKey(dateKey: string): number {
  const [year, month, day] = dateKey.split("-").map(Number);
  const startOfYear = Date.UTC(year, 0, 0);
  return Math.floor((Date.UTC(year, month - 1, day) - startOfYear) / 86_400_000);
}

export const DAILY_QUESTIONS: DailyQuestion[] = [
  {
    question: "Cine a construit arca pentru a scăpa de potop?",
    options: ["Avraam", "Noe", "Moise", "Iosif"],
    correctIndex: 1,
    reference: "Geneza 6:14",
  },
  {
    question: "Câți ucenici a ales Isus?",
    options: ["7", "10", "12", "14"],
    correctIndex: 2,
    reference: "Matei 10:1-4",
  },
  {
    question: "Cine l-a învins pe Goliat?",
    options: ["Saul", "Ionatan", "David", "Samuel"],
    correctIndex: 2,
    reference: "1 Samuel 17",
  },
  {
    question: "În ce oraș s-a născut Isus?",
    options: ["Nazaret", "Betleem", "Ierusalim", "Capernaum"],
    correctIndex: 1,
    reference: "Luca 2:4-7",
  },
  {
    question: "Cine a fost aruncat în groapa cu lei?",
    options: ["Daniel", "Ezechiel", "Ieremia", "Iona"],
    correctIndex: 0,
    reference: "Daniel 6",
  },
  {
    question: "Câte zile și nopți a plouat în timpul potopului?",
    options: ["7", "12", "40", "100"],
    correctIndex: 2,
    reference: "Geneza 7:12",
  },
  {
    question: "Cine a fost înghițit de un pește mare?",
    options: ["Iona", "Petru", "Pavel", "Ilie"],
    correctIndex: 0,
    reference: "Iona 1:17",
  },
  {
    question: "Câte porunci a primit Moise pe Muntele Sinai?",
    options: ["5", "8", "10", "12"],
    correctIndex: 2,
    reference: "Exod 20",
  },
  {
    question: "Cine a fost mama lui Isus?",
    options: ["Elisabeta", "Maria", "Marta", "Ana"],
    correctIndex: 1,
    reference: "Luca 1:26-31",
  },
  {
    question: "Cine l-a trădat pe Isus pentru 30 de arginți?",
    options: ["Toma", "Petru", "Iuda Iscarioteanul", "Matei"],
    correctIndex: 2,
    reference: "Matei 26:14-16",
  },
  {
    question: "Ce a creat Dumnezeu în prima zi?",
    options: ["Uscatul", "Lumina", "Animalele", "Omul"],
    correctIndex: 1,
    reference: "Geneza 1:3-5",
  },
  {
    question: "Cine a despărțit apele Mării Roșii?",
    options: ["Iosua", "Aaron", "Moise", "David"],
    correctIndex: 2,
    reference: "Exod 14:21",
  },
  {
    question: "Câți frați avea Iosif (cel cu haina colorată)?",
    options: ["7", "9", "11", "12"],
    correctIndex: 2,
    reference: "Geneza 37",
  },
  {
    question: "Cine a fost cel mai puternic om, cunoscut pentru părul lui?",
    options: ["Ghedeon", "Samson", "Boaz", "Iair"],
    correctIndex: 1,
    reference: "Judecători 16",
  },
  {
    question: "Ce a transformat Isus în vin la nunta din Cana?",
    options: ["Lapte", "Apă", "Suc de rodii", "Ulei"],
    correctIndex: 1,
    reference: "Ioan 2:1-11",
  },
  {
    question: "Cine a condus poporul Israel după moartea lui Moise?",
    options: ["Iosua", "Caleb", "Ghedeon", "Samuel"],
    correctIndex: 0,
    reference: "Iosua 1:1-2",
  },
  {
    question: "Câți pești și pâini a folosit Isus pentru a hrăni 5000 de oameni?",
    options: ["2 pești, 5 pâini", "5 pești, 2 pâini", "3 pești, 3 pâini", "7 pești, 7 pâini"],
    correctIndex: 1,
    reference: "Matei 14:17-21",
  },
  {
    question: "Cine a fost primul om creat de Dumnezeu?",
    options: ["Cain", "Abel", "Adam", "Set"],
    correctIndex: 2,
    reference: "Geneza 2:7",
  },
  {
    question: "Ce oraș a înconjurat israeliții de 7 ori pentru a-i dărâma zidurile?",
    options: ["Ierihon", "Ai", "Betel", "Silo"],
    correctIndex: 0,
    reference: "Iosua 6",
  },
  {
    question: "Cine a fost primul martir creștin, ucis cu pietre?",
    options: ["Ioan", "Ștefan", "Iacov", "Barnaba"],
    correctIndex: 1,
    reference: "Faptele Apostolilor 7:59-60",
  },
  {
    question: "Câți ani a rătăcit poporul Israel prin pustiu?",
    options: ["10", "20", "40", "70"],
    correctIndex: 2,
    reference: "Numeri 14:33-34",
  },
  {
    question: "Cine a scris cea mai mare parte a Noului Testament, prin epistolele sale?",
    options: ["Petru", "Ioan", "Pavel", "Iacov"],
    correctIndex: 2,
    reference: "Faptele Apostolilor 9",
  },
  {
    question: "Ce fruct interzis a mâncat Adam și Eva, potrivit tradiției?",
    options: ["Smochină", "Rodie", "Un fruct nespecificat", "Strugure"],
    correctIndex: 2,
    reference: "Geneza 3:6",
  },
  {
    question: "Cine a fost regele înțelept care a cerut înțelepciune de la Dumnezeu?",
    options: ["David", "Solomon", "Saul", "Roboam"],
    correctIndex: 1,
    reference: "1 Împărați 3:9",
  },
  {
    question: "Câți ani a domnit David ca rege peste Israel?",
    options: ["20", "30", "40", "50"],
    correctIndex: 2,
    reference: "1 Împărați 2:11",
  },
  {
    question: "Cine l-a botezat pe Isus în râul Iordan?",
    options: ["Petru", "Ioan Botezătorul", "Andrei", "Filip"],
    correctIndex: 1,
    reference: "Matei 3:13-17",
  },
  {
    question: "Ce le-a promis Dumnezeu lui Noe prin curcubeu?",
    options: [
      "Că nu va mai trimite foamete",
      "Că nu va mai distruge pământul prin potop",
      "Că va trimite un mântuitor",
      "Că va binecuvânta toate animalele",
    ],
    correctIndex: 1,
    reference: "Geneza 9:12-15",
  },
  {
    question: "Cine a fost soția lui Avraam?",
    options: ["Rebeca", "Rahela", "Sara", "Lea"],
    correctIndex: 2,
    reference: "Geneza 17:15",
  },
  {
    question: "În câte zile a creat Dumnezeu lumea, odihnindu-se apoi?",
    options: ["5", "6", "7", "8"],
    correctIndex: 1,
    reference: "Geneza 2:2",
  },
  {
    question: "Cine a fost aruncat de frații săi într-o groapă și vândut ca sclav?",
    options: ["Beniamin", "Iosif", "Ruben", "Iuda"],
    correctIndex: 1,
    reference: "Geneza 37:23-28",
  },
];
