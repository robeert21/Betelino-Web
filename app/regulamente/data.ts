export type GameRule = {
  slug: string;
  title: string;
  summary: string;
  instructions: string[];
};

export type GameCategory = {
  slug: string;
  label: string;
  description: string;
  games: GameRule[];
};

export const GAME_CATEGORIES: GameCategory[] = [
  {
    slug: "echipa-vs-echipa",
    label: "Echipă vs Echipă",
    description:
      "Jocuri menite să stimuleze competiția sănătoasă și colaborarea intensă între membrii aceleiași echipe.",
    games: [
      {
        slug: "capture-the-flag",
        title: "Capture the Flag",
        summary:
          "Terenul e împărțit în două jumătăți, fiecare echipă apără un steag păzit într-un cerc și încearcă să fure steagul advers.",
        instructions: [
          "Terenul este împărțit în două jumătăți, câte una pentru fiecare echipă, iar fiecare echipă își păzește steagul într-un cerc la capătul terenului propriu.",
          "În terenul propriu ești complet imun: chiar dacă ești udat de apă, poți continua jocul normal și vânezi inamicii care intră pe teritoriul tău.",
          "În terenul advers ești o țintă: dacă ești lovit de un jet de apă, îngheți instant pe loc, cu mâinile sus, fără să mai tragi.",
          "Un coechipier liber te poate salva alergând până la tine în terenul inamic și atingându-te pe umăr; amândoi primiți 5 secunde de imunitate pentru a fugi înapoi, ținând obligatoriu o mână pe cap ca semnal vizual.",
          "Apărătorii trebuie să păstreze minimum 3-4 pași distanță față de cercul steagului, fără să facă „zid” lângă el, ca să lase atacatorilor o șansă corectă.",
          "Un atacator ajuns în cercul steagului advers este în siguranță, dar poate rămâne acolo maximum 15-20 de secunde.",
          "Dacă purtătorul steagului este udat pe drumul de întoarcere, îngheață pe loc, iar steagul rămâne exact acolo unde a căzut — apărătorii nu au voie să-l mute înapoi în cerc.",
          "Echipa câștigă fie aducând steagul advers peste linia de mijloc, fie înghețând toți adversarii în același timp.",
        ],
      },
      {
        slug: "coada-dragonului",
        title: "Dragon's Tail (Coada Dragonului)",
        summary:
          "Fiecare echipă formează un șir indian legat la mijloc, iar capul dragonului încearcă să fure coada dragonului advers.",
        instructions: [
          "Fiecare echipă se așază în șir indian, prinși de mijlocul coechipierului din față.",
          "Ultimul participant din șir are o eșarfă prinsă la spate, care reprezintă „coada” dragonului.",
          "„Capul” dragonului conduce șirul și încearcă să prindă eșarfa dragonului advers, apărându-și în același timp propria coadă.",
          "Ruperea șirului în timpul jocului duce la penalizări sau la pierderea rundei.",
        ],
      },
    ],
  },
  {
    slug: "jocuri-de-noapte",
    label: "Jocuri de Noapte",
    description:
      "Activități care au loc după lăsarea întunericului, pentru atmosfera de mister și camaraderie.",
    games: [
      {
        slug: "operation-night-scramble",
        title: "Operation: Night Scramble",
        summary:
          "Echipele adună bețigașe luminoase împrăștiate pe teren, sub supravegherea liderilor „paznici”.",
        instructions: [
          "Bețigașele luminoase (glow sticks) sunt împrăștiate pe teren înainte de începerea jocului.",
          "Fiecare echipă trebuie să colecteze cât mai multe bețigașe și să le aducă la găleata proprie.",
          "Liderii „paznici” încearcă să oprească participanții folosind tuburi de spumă (pool noodles) sau șosete legate.",
        ],
      },
      {
        slug: "sardines",
        title: "Sardines (Sardinele)",
        summary:
          "Formă inversată a jocului de-a v-ați ascunselea, jucată până când toată lumea se înghesuie în aceeași ascunzătoare.",
        instructions: [
          "O singură persoană se ascunde la începutul jocului, iar restul participanților pornesc în căutarea ei.",
          "Fiecare participant care găsește ascunzătoarea se ascunde alături de persoana găsită, fără să anunțe pe ceilalți.",
          "Jocul continuă până când toți participanții sunt înghesuiți, ca sardinele, în aceeași ascunzătoare.",
        ],
      },
      {
        slug: "leader-hunt",
        title: "Leader Hunt (Vânătoarea de lideri)",
        summary:
          "Echipele caută liderii ascunși în tabără pentru a obține semnături pe fișa lor.",
        instructions: [
          "Liderii se ascund în perimetrul taberei înainte de startul jocului.",
          "Echipele trebuie să găsească fiecare lider pentru a primi o semnătură pe fișa lor.",
          "Un lider găsit poate cere participanților să îndeplinească o sarcină amuzantă (de exemplu, 10 genuflexiuni) înainte de a semna.",
        ],
      },
      {
        slug: "predator",
        title: "Predator (Prădătorul)",
        summary:
          "Liderii vânează participanții, iar echipele încearcă să-și păstreze cât mai multe carduri.",
        instructions: [
          "Fiecare echipă primește carduri colorate la începutul jocului.",
          "Liderii vânează participanții folosind unelte desemnate pentru joc.",
          "Un participant lovit trebuie să predea un card și să se întoarcă la baza echipei.",
          "Câștigă echipa cu cele mai puține carduri recuperate de lideri până la final.",
        ],
      },
    ],
  },
  {
    slug: "stafeta-cu-obstacole",
    label: "Ștafeta cu Obstacole",
    description:
      "Participanții trebuie să parcurgă pe rând mai multe obstacole.",
    games: [
      {
        slug: "cursa-in-saci",
        title: "Cursă în saci de rafie",
        summary:
          "Participanții parcurg traseul sărind într-un sac de rafie.",
        instructions: [
          "Fiecare participant intră într-un sac de rafie și parcurge traseul stabilit sărind, fără să iasă din sac.",
          "Dacă un participant cade sau iese din sac, trebuie să se oprească, să reintre în sac și să continue de unde a rămas.",
        ],
      },
      {
        slug: "pod-suspendat",
        title: "Pod suspendat",
        summary:
          "Coechipierii formează un pod mobil dintr-o scândurică, pentru a transporta o persoană ușoară până la linia de finish.",
        instructions: [
          "Coechipierii se grupează câte doi și țin în mâini o scândurică ce formează un „pod”.",
          "O persoană ușoară pășește pe scândurele, în timp ce restul echipei mută constant piesele podului înainte.",
          "Podul trebuie să rămână în mișcare continuă până ce persoana trece de linia de finish.",
        ],
      },
      {
        slug: "pas-cu-pas",
        title: "Pas cu pas",
        summary:
          "Echipa avansează pe un rând de scânduri, fără să atingă vreodată podeaua.",
        instructions: [
          "Participanții pășesc pe scândurile așezate pe jos, fără să atingă podeaua cu picioarele.",
          "Pentru a înainta, echipa se strânge pe scândurile ocupate și trece scândurile libere din spate către față, din mână în mână.",
          "Dacă un singur participant calcă pe jos, toată echipa se întoarce la start.",
        ],
      },
    ],
  },
  {
    slug: "jocuri-cu-apa",
    label: "Jocuri cu Apă",
    description:
      "Activități răcoritoare, perfecte pentru după-amiezele toride de vară.",
    games: [
      {
        slug: "bataia-cu-baloane",
        title: "Bătaia cu baloane cu apă",
        summary:
          "Confruntare clasică în care echipele încearcă să rămână cât mai uscate în timp ce elimină adversarii.",
        instructions: [
          "Fiecare echipă primește un stoc de baloane umplute cu apă.",
          "Echipele se aruncă reciproc cu baloane, încercând să elimine cât mai mulți adversari.",
          "Câștigă echipa care rămâne cât mai uscată la finalul confruntării.",
        ],
      },
      {
        slug: "stafeta-cu-bureti",
        title: "Ștafeta cu bureți",
        summary:
          "Participanții transportă apă dintr-un capăt în altul al traseului folosind un burete.",
        instructions: [
          "Fiecare participant folosește un burete mare pentru a transporta apă de la un punct de start până la o găleată aflată la finalul traseului.",
          "Participanții din echipă se schimbă pe rând, continuând ștafeta.",
          "Câștigă echipa care umple prima găleata cu apă.",
        ],
      },
    ],
  },
  {
    slug: "jocul-cu-eliminatul",
    label: "Jocul cu Eliminatul",
    description:
      "Test suprem de strategie și discreție, desfășurat pe parcursul întregii tabere.",
    games: [
      {
        slug: "eliminatul",
        title: "Jocul cu eliminatul",
        summary:
          "Elimină-ți țintele și supraviețuiește până la final — fiecare moment din tabără devine o misiune palpitantă.",
        instructions: [
          "Misiunea inițială: fiecare participant extrage câte două bilete, care conțin numele unei „ținte” și un obiect specific, adesea banal, dar letal în joc.",
          "Eliminarea prin „Atingerea Tăcută”: pentru a elimina o țintă, trebuie să o atingi cu obiectul primit. Atacul este valid doar dacă nu există niciun martor pe o rază de 2 metri, cu excepția vânătorului și a victimei.",
          "Preluarea contractului: odată eliminată, victima îți predă misiunea ei (numele și obiectul), astfel primești o nouă țintă și o nouă unealtă de joc.",
          "Victoria finală: jocul se încheie triumfător atunci când reușești să îți extragi propriul nume sau când rămâi ultimul supraviețuitor din tabără.",
        ],
      },
    ],
  },
  {
    slug: "concurs-biblic",
    label: "Concurs Biblic",
    description:
      "Competiție organizată într-o seară, cu întrebări biblice din programa școlii duminicale.",
    games: [
      {
        slug: "trivia-biblica",
        title: "Competiție Trivia Biblică",
        summary:
          "Câțiva reprezentanți ai echipelor ies în față, iar gazda pune întrebări biblice.",
        instructions: [
          "Câțiva reprezentanți ai fiecărei echipe ies în față pentru a răspunde la întrebări.",
          "Gazda pune întrebări biblice bazate pe programa școlii duminicale.",
          "Participantul care apasă primul pe buton are prima șansă să răspundă.",
        ],
      },
    ],
  },
];
