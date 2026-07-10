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
    title: "Regulamentul taberei",
    intro:
      "Aceasta este o secțiune placeholder. Textul complet al regulamentului taberei va fi adăugat aici.",
    items: [
      "Regulile generale ale taberei (program, comportament, siguranță etc.) urmează să fie completate.",
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
        title: "Cum elimini o țintă",
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
        title: "Cum câștigi",
        intro: "Jocul se încheie atunci când:",
        items: [
          "Rămâne un singur participant neeliminat; sau",
          "Lanțul eliminărilor ajunge înapoi la tine, iar noua ta țintă este propriul nume.",
          "În oricare dintre situații, acel participant este declarat câștigător.",
        ],
      },
    ],
  },
];
