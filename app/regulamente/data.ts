export type RuleSection = {
  title: string;
  intro?: string;
  items: string[];
};

export type GameRule = {
  slug: string;
  title: string;
  summary: string;
  sections: RuleSection[];
};

export const CAMP_RULES: RuleSection[] = [
  {
    title: "🏕️ General",
    items: [
      "Participanții vor avea acces limitat la telefon, doar în intervalul orar stabilit de lideri.",
      "Nu se părăsește perimetrul taberei decât cu însoțirea unui lider.",
      "Nu se rămâne băiat-fată singuri în colțurile taberei.",
      "Orice problemă medicală, alergie sau medicament de administrat zilnic trebuie declarate liderului de grupă la sosire sau cât mai curând.",
      "Respectul față de lideri, colegi și bunurile taberei este obligatoriu.",
      "Conflictele se rezolvă prin discuție cu liderul de grupă, nu prin violență verbală sau fizică.",
    ],
  },
  {
    title: "🍽️ Masă",
    items: [
      "Prezența la toate mesele este obligatorie, la orele stabilite.",
      "La fiecare masă vor fi repartizați câțiva copii/adolescenți pentru organizarea meselor și strângerea lor.",
    ],
  },
  {
    title: "🛏️ Cameră",
    items: [
      "Stingerea va fi la ora 00:00. După această oră nu mai este voie să ieșim din camere.",
      "Obiectele de valoare (bani, gadget-uri) sunt aduse pe răspunderea proprie a copilului; organizatorii nu răspund pentru pierderi.",
      "Igiena personală (duș zilnic, păstrarea curățeniei în cameră) este responsabilitatea fiecărui participant, verificată de liderul de cameră.",
    ],
  },
  {
    title: "📋 Program",
    items: [
      "Farsele sunt interzise! Dacă le face cineva și este prins, va fi sancționat cu amendă de la 20 de lei în sus. La 3 abateri se va lua o măsură mai drastică decât amenda.",
      "Participarea la programul spiritual (rugăciune, studiu biblic, momente de închinare) este obligatorie pentru toți participanții.",
      "La părtășie, ținuta trebuie să cuprindă: la băieți — pantaloni lungi; la fete — fustă/rochie și batic.",
    ],
  },
];

export const SHOP_RULES: RuleSection[] = [
  {
    title: "Magazin",
    items: [
      "Magazinul va fi disponibil după părtășia de seară, în jurul orei 21:00.",
      "Fiecare copil va primi produsele comandate și nu altele.",
      "Odată ce comanda este plasată, există opțiunea de a o anula. După anulare, se poate efectua o nouă comandă.",
      "Pentru alte produse, în afară de cele disponibile în meniu, se poate plăti o taxă de 3 lei, care permite solicitarea aducerii la magazin a unui produs specific, indisponibil în meniul obișnuit. Ne rezervăm dreptul de a refuza anumite produse. De exemplu, băuturile energizante, spuma de ras și alte produse considerate nepotrivite nu vor fi acceptate și nu vor fi aduse la magazin.",
      "Toate acțiunile privind plasarea sau anularea comenzilor se vor efectua până la ora 16:00. Cazurile de excepție se discută cu liderii.",
    ],
  },
];

export const GAMES: GameRule[] = [
  {
    slug: "jocul-cu-eliminatul",
    title: "Jocul cu Eliminatul",
    summary:
      "Elimină-ți țintele și supraviețuiește până la final — fiecare moment din tabără devine o misiune palpitantă.",
    sections: [
      {
        title: "Începutul jocului",
        intro:
          "Pregătește-te pentru un joc de strategie, răbdare și discreție care se desfășoară pe toată durata taberei. Fiecare participant este atât vânător, cât și țintă, iar scopul este să elimini cât mai mulți jucători fără să fii eliminat la rândul tău.",
        items: [
          "La început, fiecare participant primește un bilețel cu numele unei ținte.",
          "De asemenea, primește un bilețel cu obiectul care trebuie folosit pentru eliminare.",
          "Păstrează aceste informații secrete. Nu ai voie să le arăți altor participanți.",
        ],
      },
      {
        title: "Cum elimini o țintă?",
        intro: "Pentru a elimina o țintă trebuie:",
        items: [
          "Să atingi persoana respectivă cu obiectul de pe bilețel.",
          "Să ai obiectul în mână în momentul atingerii.",
          "Să nu existe niciun martor aflat la mai puțin de 2 metri de tine sau de victimă (în afară de voi doi).",
          "Dacă toate condițiile sunt îndeplinite, eliminarea este validă.",
        ],
      },
      {
        title: "După eliminare",
        items: [
          "Victima este eliminată din joc și îi predă imediat vânătorului bilețelul cu ținta și obiectul pe care le avea.",
          "Din acel moment, vânătorul preia noul contract și continuă jocul cu noua țintă și noul obiect.",
        ],
      },
      {
        title: "Zone și momente de siguranță",
        intro: "Nu sunt permise eliminări:",
        items: [
          "În timpul activităților oficiale conduse de organizatori.",
          "În timpul meselor.",
          "În baie sau la duș.",
          "În timpul programului de odihnă (stingere).",
          "Organizatorii pot declara și alte zone sau perioade de siguranță, dacă este necesar.",
        ],
      },
      {
        title: "Fair-play",
        items: [
          "Nu ai voie să ascunzi, să distrugi sau să furi obiectul necesar altui jucător.",
          "Nu ai voie să refuzi predarea contractului după ce ai fost eliminat.",
          "Orice dispută este decisă de organizatori, iar decizia lor este definitivă.",
        ],
      },
      {
        title: "Cum câștigi?",
        intro: "Jocul se încheie atunci când:",
        items: [
          "Rămâne un singur participant neeliminat;",
          "Lanțul eliminărilor ajunge înapoi la tine, iar noua ta țintă este propriul nume;",
          "În oricare dintre situații, acel participant este declarat câștigător.",
        ],
      },
    ],
  },
];
