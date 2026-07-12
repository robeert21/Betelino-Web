export type DailyQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  reference: string;
};

// djb2 string hash, used to deterministically assign each camper a
// different-looking "random" question per day: same camper + same date
// always yields the same index (so reloading doesn't reshuffle it), but
// different campers get different questions on the same day.
function hashString(value: string): number {
  let hash = 5381;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  return hash >>> 0;
}

export function questionIndexFor(dateKey: string, userId: string | null): number {
  const seed = `${dateKey}:${userId ?? "guest"}`;
  return hashString(seed) % DAILY_QUESTIONS.length;
}

export const DAILY_QUESTIONS: DailyQuestion[] = [
  {
    question: "Cine a construit corabia pentru a se salva de potop?",
    options: ["Moise", "Avraam", "Noe", "David"],
    correctIndex: 2,
    reference: "Geneza 6:13-22",
  },
  {
    question: "Care este prima carte a Bibliei?",
    options: ["Exodul", "Geneza", "Matei", "Apocalipsa"],
    correctIndex: 1,
    reference: "Geneza 1:1",
  },
  {
    question: "Cine l-a învins pe uriașul Goliat?",
    options: ["Saul", "Samson", "Solomon", "David"],
    correctIndex: 3,
    reference: "1 Samuel 17:49-50",
  },
  {
    question: "Câți ucenici a avut Isus Hristos?",
    options: ["10", "12", "70", "3"],
    correctIndex: 1,
    reference: "Matei 10:1",
  },
  {
    question: "În ce oraș S-a născut Isus Hristos?",
    options: ["Nazaret", "Ierusalim", "Betleem", "Roma"],
    correctIndex: 2,
    reference: "Matei 2:1",
  },
  {
    question: "Cine a fost trădat pentru 30 de arginți?",
    options: ["Moise", "Iosif", "Isus", "Ioan Botezătorul"],
    correctIndex: 2,
    reference: "Matei 26:15",
  },
  {
    question: "Ce mare a despărțit Moise pentru a trece poporul Israel?",
    options: ["Marea Moartă", "Marea Mediterană", "Marea Galileii", "Marea Roșie"],
    correctIndex: 3,
    reference: "Exodul 14:21-22",
  },
  {
    question: "Care este ultima carte a Bibliei?",
    options: ["Geneza", "Maleahi", "Apocalipsa", "Ioan"],
    correctIndex: 2,
    reference: "Apocalipsa 22:21",
  },
  {
    question: "Cine a primit Cele Zece Porunci pe muntele Sinai?",
    options: ["Avraam", "Aaron", "Moise", "Iosua"],
    correctIndex: 2,
    reference: "Exodul 20:1-17",
  },
  {
    question: "Care a fost primul miracol făcut de Isus în Galileea?",
    options: ["Vindecarea unui orb", "Mersul pe apă", "Înmulțirea pâinilor", "Transformarea apei în vin"],
    correctIndex: 3,
    reference: "Ioan 2:11",
  },
  {
    question: "Cine a fost soția lui Adam?",
    options: ["Sara", "Rahela", "Eva", "Maria"],
    correctIndex: 2,
    reference: "Geneza 2:22-25",
  },
  {
    question: "Ce daruri I-au adus magii pruncului Isus?",
    options: ["Aur, argint și cupru", "Grâu, vin și untdelemn", "Aur, tămâie și smirnă", "Smirnă, aloe și haine"],
    correctIndex: 2,
    reference: "Matei 2:11",
  },
  {
    question: "Cine l-a botezat pe Isus Hristos?",
    options: ["Petru", "Ioan Botezătorul", "Pavel", "Dumnezeu Tatăl"],
    correctIndex: 1,
    reference: "Matei 3:13-17",
  },
  {
    question: "Cine a fost cel mai înțelept rege al Israelului?",
    options: ["Saul", "David", "Solomon", "Irod"],
    correctIndex: 2,
    reference: "1 Împărați 3:12",
  },
  {
    question: "Care a fost cel mai puternic om din Biblie, a cărui putere stătea în părul său?",
    options: ["David", "Samson", "Goliat", "Saul"],
    correctIndex: 1,
    reference: "Judecători 16:17",
  },
  {
    question: "Pe ce munte s-a oprit corabia lui Noe?",
    options: ["Sinai", "Ararat", "Măslinilor", "Tabor"],
    correctIndex: 1,
    reference: "Geneza 8:4",
  },
  {
    question: "Cine a fost fratele lui Abel?",
    options: ["Avraam", "Cain", "Enoh", "Iafet"],
    correctIndex: 1,
    reference: "Geneza 4:1-2",
  },
  {
    question: "În ce râu a fost botezat Isus?",
    options: ["Nil", "Eufrat", "Iordan", "Tigru"],
    correctIndex: 2,
    reference: "Matei 3:13",
  },
  {
    question: "Ce meserie avea Apostolul Petru înainte de a fi chemat de Isus?",
    options: ["Tâmplar", "Vameș", "Pescar", "Păstor"],
    correctIndex: 2,
    reference: "Matei 4:18",
  },
  {
    question: "Cum se numeau părinții lui Ioan Botezătorul?",
    options: ["Avraam și Sara", "Iosif și Maria", "Zaharia și Elisabeta", "Ioachim și Ana"],
    correctIndex: 2,
    reference: "Luca 1:5-13",
  },
  {
    question: "Cine a fost vândut de frații săi ca sclav în Egipt?",
    options: ["Beniamin", "Iacov", "Iosif", "Daniel"],
    correctIndex: 2,
    reference: "Geneza 37:28",
  },
  {
    question: "Din ce a creat-o Dumnezeu pe Eva?",
    options: ["Din țărână", "Dintr-o coastă a lui Adam", "Din suflare de viață", "Dintr-o piatră"],
    correctIndex: 1,
    reference: "Geneza 2:21-22",
  },
  {
    question: "Ce animal a vorbit cu Balaam?",
    options: ["Șarpele", "Măgărița", "Leul", "Porumbelul"],
    correctIndex: 1,
    reference: "Numeri 22:28",
  },
  {
    question: "Cine a fost înviat de Isus după ce fusese mort de patru zile?",
    options: ["Iair", "Lazăr", "Tabita", "Eutih"],
    correctIndex: 1,
    reference: "Ioan 11:39-44",
  },
  {
    question: "Cine a fost trădătorul dintre cei 12 ucenici ai lui Isus?",
    options: ["Petru", "Toma", "Iuda Iscarioteanul", "Iuda Tadeul"],
    correctIndex: 2,
    reference: "Matei 26:14-16",
  },
  {
    question: "Ce a folosit David pentru a-l ucide pe Goliat?",
    options: ["O sabie", "O suliță", "O praștie și o piatră", "Un arc cu săgeți"],
    correctIndex: 2,
    reference: "1 Samuel 17:40-49",
  },
  {
    question: "Ce vârstă a avut cel mai bătrân om menționat în Biblie, Metusala?",
    options: ["120 de ani", "600 de ani", "969 de ani", "1000 de ani"],
    correctIndex: 2,
    reference: "Geneza 5:27",
  },
  {
    question: "Cine a scris epistola către Romani?",
    options: ["Apostolul Petru", "Apostolul Pavel", "Apostolul Ioan", "Apostolul Iacov"],
    correctIndex: 1,
    reference: "Romani 1:1",
  },
  {
    question: "Câte plăgi a trimis Dumnezeu asupra Egiptului?",
    options: ["7", "10", "12", "3"],
    correctIndex: 1,
    reference: "Exodul 7-12",
  },
  {
    question: "Care dintre fiii lui Iacov era cel mai mic?",
    options: ["Iosif", "Beniamin", "Iuda", "Levi"],
    correctIndex: 1,
    reference: "Geneza 35:16-18",
  },
  {
    question: "Cine a fost primul rege al poporului Israel?",
    options: ["David", "Solomon", "Saul", "Samuel"],
    correctIndex: 2,
    reference: "1 Samuel 9:15-17",
  },
  {
    question: "Din ce țară a condus Moise ieșirea poporului evreu?",
    options: ["Babilon", "Egipt", "Canaan", "Siria"],
    correctIndex: 1,
    reference: "Exodul 12:51",
  },
  {
    question: "Pe ce munte a adus Avraam jertfa simbolică a fiului său Isaac?",
    options: ["Sinai", "Moria", "Ararat", "Carmel"],
    correctIndex: 1,
    reference: "Geneza 22:2",
  },
  {
    question: "În ce zi a creației a făcut Dumnezeu soarele, luna și stelele?",
    options: ["Ziua a treia", "Ziua a patra", "Ziua a cincea", "Ziua a șasea"],
    correctIndex: 1,
    reference: "Geneza 1:14-19",
  },
  {
    question: "Care era numele de naștere al Apostolului Pavel?",
    options: ["Simon", "Saul", "Levi", "Matei"],
    correctIndex: 1,
    reference: "Faptele Apostolilor 9:11",
  },
  {
    question: "Pe ce insulă a fost exilat Apostolul Ioan când a scris cartea Apocalipsa?",
    options: ["Creta", "Cipru", "Patmos", "Malta"],
    correctIndex: 2,
    reference: "Apocalipsa 1:9",
  },
  {
    question: "Cine a fost al doilea rege al poporului Israel?",
    options: ["Saul", "David", "Solomon", "Ieroboam"],
    correctIndex: 1,
    reference: "2 Samuel 5:4",
  },
  {
    question: "Cum s-a numit prima capitală a regatului de nord al Israelului?",
    options: ["Ierusalim", "Sihem", "Samaria", "Betel"],
    correctIndex: 1,
    reference: "1 Împărați 12:25",
  },
  {
    question: "Din ce trib al Israelului făcea parte Moise?",
    options: ["Iuda", "Levi", "Beniamin", "Efraim"],
    correctIndex: 1,
    reference: "Exodul 2:1-2",
  },
  {
    question: "Care dintre cele patru evanghelii este cea mai scurtă?",
    options: ["Matei", "Marcu", "Luca", "Ioan"],
    correctIndex: 1,
    reference: "Marcu 1:1",
  },
  {
    question: "Care era numele muntelui unde Ilie a chemat foc din cer pentru a dovedi că Domnul este Dumnezeu?",
    options: ["Sinai", "Carmel", "Ararat", "Tabor"],
    correctIndex: 1,
    reference: "1 Împărați 18:19-39",
  },
  {
    question: "Pe ce munte s-a schimbat Isus la față înaintea ucenicilor Petru, Iacov și Ioan?",
    options: ["Sinai", "Tabor", "Măslinilor", "Carmel"],
    correctIndex: 1,
    reference: "Matei 17:1-2",
  },
  {
    question: "Câți frați (fii ai lui Iacov) a avut Iosif?",
    options: ["10", "11", "12", "7"],
    correctIndex: 1,
    reference: "Geneza 35:22-26",
  },
  {
    question: "Cine a fost mama regelui Solomon?",
    options: ["Sara", "Rut", "Batșeba", "Rahela"],
    correctIndex: 2,
    reference: "2 Samuel 12:24",
  },
  {
    question: "Ce a primit Esau de la fratele său Iacov în schimbul dreptului de întâi născut?",
    options: ["Argint", "O turmă de oi", "O ciorbă de linte", "O haină de preț"],
    correctIndex: 2,
    reference: "Geneza 25:34",
  },
  {
    question: "Cine a scris cartea Faptele Apostolilor?",
    options: ["Petru", "Pavel", "Ioan", "Luca"],
    correctIndex: 3,
    reference: "Faptele Apostolilor 1:1-2",
  },
  {
    question: "Care era profesia lui Luca, scriitorul uneia dintre evanghelii?",
    options: ["Pescar", "Medic", "Vameș", "Tâmplar"],
    correctIndex: 1,
    reference: "Coloseni 4:14",
  },
  {
    question: "Ce animal a ispitit-o pe Eva în Grădina Edenului?",
    options: ["Șarpele", "Leul", "Lupul", "Vulturul"],
    correctIndex: 0,
    reference: "Geneza 3:1-4",
  },
  {
    question: "Câți ani a rătăcit poporul Israel în pustiu înainte de a intra în Canaan?",
    options: ["7 ani", "12 ani", "40 de ani", "70 de ani"],
    correctIndex: 2,
    reference: "Numeri 14:34",
  },
  {
    question: "Cine a fost mușcat de o viperă pe insula Malta, dar nu a pățit nimic?",
    options: ["Petru", "Pavel", "Ștefan", "Luca"],
    correctIndex: 1,
    reference: "Faptele Apostolilor 28:3",
  },
  {
    question: "În ce oraș ucenicii lui Isus au fost numiți „creștini” pentru prima dată?",
    options: ["Ierusalim", "Antiohia", "Roma", "Efes"],
    correctIndex: 1,
    reference: "Faptele Apostolilor 11:26",
  },
  {
    question: "Din ce popor făcea parte Rut, nora lui Naomi?",
    options: ["Filistean", "Moabit", "Edomit", "Egipten"],
    correctIndex: 1,
    reference: "Rut 1:4",
  },
  {
    question: "Care apostol a fost numit necredincios pentru că se îndoia de învierea lui Isus?",
    options: ["Toma", "Petru", "Iacov", "Andrei"],
    correctIndex: 0,
    reference: "Ioan 20:24-25",
  },
  {
    question: "Ce animal a trimis Noe prima dată din corabie pentru a verifica scăderea apelor?",
    options: ["Porumbelul", "Corbul", "Rândunica", "Șoimul"],
    correctIndex: 1,
    reference: "Geneza 8:6-7",
  },
  {
    question: "La ce instrument muzical cânta David pentru a-l liniști pe regele Saul?",
    options: ["Flaut", "Harpa", "Trâmbiță", "Lăută"],
    correctIndex: 1,
    reference: "1 Samuel 16:23",
  },
  {
    question: "Cine a fost prima femeie din Biblie menționată ca judecător al poporului Israel?",
    options: ["Estera", "Rut", "Debora", "Dalila"],
    correctIndex: 2,
    reference: "Judecători 4:4",
  },
  {
    question: "Care este cea mai lungă carte din Biblie (după numărul de capitole)?",
    options: ["Geneza", "Psalmii", "Isaia", "Ieremia"],
    correctIndex: 1,
    reference: "Cartea Psalmilor (150 capitole)",
  },
  {
    question: "Pe ce munte a urcat Moise pentru a muri, după ce a privit spre Țara Promisă?",
    options: ["Sinai", "Nebo", "Tabor", "Ararat"],
    correctIndex: 1,
    reference: "Deuteronomul 34:1-4",
  },
  {
    question: "Cine a fost ales prin tragere la sorți ca apostol în locul lui Iuda Iscarioteanul?",
    options: ["Pavel", "Barnaba", "Matia", "Ștefan"],
    correctIndex: 2,
    reference: "Faptele Apostolilor 1:26",
  },
  {
    question: "Ce râu a trebuit să treacă israeliții conduși de Iosua pentru a intra în Canaan?",
    options: ["Nil", "Eufrat", "Iordan", "Iaboc"],
    correctIndex: 2,
    reference: "Iosua 3:14-17",
  },
  {
    question: "În ce limbă a fost scris în mod predominant Vechiul Testament?",
    options: ["Greacă", "Ebraică", "Arameică", "Latină"],
    correctIndex: 1,
    reference: "Istoria textului biblic",
  },
  {
    question: "Cum L-a identificat Iuda Iscarioteanul pe Isus în fața soldaților?",
    options: ["Arătându-L cu degetul", "Strigându-I numele", "Printr-un sărut", "Oferindu-I o pâine"],
    correctIndex: 2,
    reference: "Matei 26:48-49",
  },
  {
    question: "Ce semn a pus Dumnezeu pe cer ca legământ că nu va mai distruge pământul prin potop?",
    options: ["Un curcubeu", "O stea strălucitoare", "Un nor de foc", "O eclipsă de soare"],
    correctIndex: 0,
    reference: "Geneza 9:13",
  },
  {
    question: "Cine a fost prima persoană care L-a văzut pe Isus înviat la mormânt?",
    options: ["Petru", "Ioan", "Maria, mama lui Isus", "Maria Magdalena"],
    correctIndex: 3,
    reference: "Ioan 20:14-18",
  },
  {
    question: "Spre ce oraș călătorea Saul când a fost orbit de o lumină cerească și chemat de Isus?",
    options: ["Roma", "Damasc", "Ierusalim", "Antiohia"],
    correctIndex: 1,
    reference: "Faptele Apostolilor 9:3",
  },
  {
    question: "Cine a fost omul integru din țara Uț, încercat de Satana dar rămas credincios lui Dumnezeu?",
    options: ["Iov", "Avraam", "Iacov", "Daniel"],
    correctIndex: 0,
    reference: "Iov 1:1",
  },
  {
    question: "Cum se numeau cei trei tineri evrei aruncați în cuptorul aprins de regele Nebucadnețar?",
    options: ["Șadrac, Meșac și Abed-Nego", "Daniel, Hanania și Azaria", "Iosif, Beniamin și Levi", "Petru, Iacov și Ioan"],
    correctIndex: 0,
    reference: "Daniel 3:19-20",
  },
  {
    question: "Ce a cerut Solomon de la Dumnezeu când Acesta i S-a arătat în vis?",
    options: ["Bogăție", "Viață lungă", "Înțelepciune", "Victoria asupra dușmanilor"],
    correctIndex: 2,
    reference: "1 Împărați 3:9",
  },
  {
    question: "Câte pâini și câți pești a folosit Isus pentru a hrăni cei 5.000 de oameni?",
    options: ["5 pâini și 2 pești", "7 pâini și câțiva peștișori", "12 pâini și 5 pești", "3 pâini și 1 pește"],
    correctIndex: 0,
    reference: "Matei 14:17",
  },
  {
    question: "Care rege persan a dat decretul prin care evreii s-au putut întoarce să rezidească Ierusalimul?",
    options: ["Darius", "Cirus", "Artaxerxe", "Xerxe"],
    correctIndex: 1,
    reference: "Ezra 1:1-3",
  },
  {
    question: "Care era meseria lui Iosif, soțul pământesc al Mariei?",
    options: ["Păstor", "Pescar", "Tâmplar", "Fierar"],
    correctIndex: 2,
    reference: "Matei 1:18",
  },
  {
    question: "Ce plantă a făcut Dumnezeu să crească într-o noapte ca să-i țină umbră lui Iona?",
    options: ["Un curcubete", "Un finic", "Un smochin", "Un măslin"],
    correctIndex: 0,
    reference: "Iona 4:6-7",
  },
  {
    question: "Câte porunci au fost scrise pe cele două table de piatră ale Legii?",
    options: ["5 porunci", "10 porunci", "12 porunci", "7 porunci"],
    correctIndex: 1,
    reference: "Exodul 34:28",
  },
  {
    question: "Care rege a căzut să-L ucidă pe pruncul Isus, trimițând să fie omorâți toți copiii din Betleem?",
    options: ["Irod cel Mare", "Irod Antipa", "Cezar August", "Pontiu Pilat"],
    correctIndex: 0,
    reference: "Matei 2:16",
  },
  {
    question: "Cum se numea sora lui Moise și a lui Aaron?",
    options: ["Sara", "Rebeca", "Maria", "Debora"],
    correctIndex: 2,
    reference: "Numeri 26:59",
  },
  {
    question: "Ce fenomen fizic deosebit s-a petrecut în timpul răstignirii lui Isus?",
    options: ["Un cutremur mare", "Un întuneric de trei ore", "O ploaie cu grindină", "O furtună de nisip"],
    correctIndex: 1,
    reference: "Matei 27:45",
  },
  {
    question: "Câți ani a trăit în total Adam, conform relatărilor din Geneza?",
    options: ["120 de ani", "930 de ani", "969 de ani", "500 de ani"],
    correctIndex: 1,
    reference: "Geneza 5:5",
  },
  {
    question: "Cine a fost marele preot care l-a primit și l-a crescut pe tânărul Samuel la Templu?",
    options: ["Aaron", "Eli", "Zaharia", "Melchisedec"],
    correctIndex: 1,
    reference: "1 Samuel 1:24-28",
  },
  {
    question: "Care a fost primul oraș fortificat cucerit de israeliți la intrarea în Canaan?",
    options: ["Ierihon", "Ai", "Gabaon", "Hebron"],
    correctIndex: 0,
    reference: "Iosua 6:1-20",
  },
  {
    question: "Ce nume nou i-a dat Dumnezeu lui Iacov după ce acesta s-a luptat cu îngerul?",
    options: ["Avraam", "Israel", "Iosif", "Petru"],
    correctIndex: 1,
    reference: "Geneza 32:28",
  },
  {
    question: "Pe ce loc (munte/deal) a fost răstignit Isus în afara zidurilor Ierusalimului?",
    options: ["Muntele Sinai", "Muntele Măslinilor", "Golgota", "Muntele Tabor"],
    correctIndex: 2,
    reference: "Matei 27:33",
  },
  {
    question: "Din ce fel de lemn i-a poruncit Dumnezeu lui Noe să construiască corabia?",
    options: ["Lemn de cedru", "Lemn de stejar", "Lemn de gofer", "Lemn de măslin"],
    correctIndex: 2,
    reference: "Geneza 6:14",
  },
  {
    question: "Care apostol a tăiat urechea slujitorului marelui preot în grădina Ghetsimani?",
    options: ["Ioan", "Iacov", "Petru", "Iuda"],
    correctIndex: 2,
    reference: "Ioan 18:10",
  },
  {
    question: "Cine a fost guvernatorul roman care L-a condamnat pe Isus la moarte?",
    options: ["Pontiu Pilat", "Irod cel Mare", "Cezar August", "Felix"],
    correctIndex: 0,
    reference: "Matei 27:24-26",
  },
  {
    question: "În care dintre scrisorile sale Pavel detaliază componentele armurii lui Dumnezeu?",
    options: ["Romani", "Corinteni", "Efeseni", "Filipeni"],
    correctIndex: 2,
    reference: "Efeseni 6:11-17",
  },
  {
    question: "Cum se numea preotul din Madian care era socrul lui Moise?",
    options: ["Ietro", "Aaron", "Iosua", "Balaam"],
    correctIndex: 0,
    reference: "Exodul 3:1",
  },
  {
    question: "Ce hrană de carne le-a trimis Dumnezeu evreilor seara în pustiu?",
    options: ["Prepelițe", "Miei", "Porumbei", "Pești"],
    correctIndex: 0,
    reference: "Exodul 16:13",
  },
  {
    question: "Ce obiect a văzut Iacov în visul său, care unea pământul cu cerul și pe care urcau îngerii?",
    options: ["O scară", "Un turn", "Un drum de aur", "Un stâlp de foc"],
    correctIndex: 0,
    reference: "Geneza 28:12",
  },
  {
    question: "Cine este autorul Psalmului 23, care începe cu „Domnul este Păstorul meu”?",
    options: ["Solomon", "Moise", "David", "Asaf"],
    correctIndex: 2,
    reference: "Psalmul 23:1",
  },
  {
    question: "Câte pietre luate din albia Iordanului a ridicat Iosua ca mărturie?",
    options: ["7 pietre", "10 pietre", "12 pietre", "40 de pietre"],
    correctIndex: 2,
    reference: "Iosua 4:9",
  },
  {
    question: "Spre ce sat se îndreptau cei doi ucenici când Isus S-a apropiat de ei după înviere?",
    options: ["Betania", "Nazaret", "Emaus", "Ierihon"],
    correctIndex: 2,
    reference: "Luca 24:13-15",
  },
  {
    question: "Ce pedeapsă a primit Zaharia din partea îngerului Gavriil pentru că s-a îndoit de vestea primită?",
    options: ["A orbit", "A rămas mut", "A amuțit pentru totdeauna", "A fost alungat"],
    correctIndex: 1,
    reference: "Luca 1:20",
  },
  {
    question: "Cum se numea tatăl lui Avraam?",
    options: ["Terah", "Nahor", "Haran", "Lot"],
    correctIndex: 0,
    reference: "Geneza 11:27",
  },
  {
    question: "Ce femeie i-a ascuns pe spionii evrei în Ierihon înainte ca zidurile orașului să cadă?",
    options: ["Rut", "Rahav", "Estera", "Dalila"],
    correctIndex: 1,
    reference: "Iosua 2:1-4",
  },
  {
    question: "Cine a fost primul martir creștin, ucis cu pietre în timp ce se ruga pentru ucigașii săi?",
    options: ["Iacov", "Pavel", "Ștefan", "Petru"],
    correctIndex: 2,
    reference: "Faptele Apostolilor 7:59-60",
  },
  {
    question: "Care rege l-a aruncat pe Daniel în groapa cu lei din cauza unei legi neschimbătoare?",
    options: ["Nebucadnețar", "Belșațar", "Darius", "Cirus"],
    correctIndex: 2,
    reference: "Daniel 6:16",
  },
];
