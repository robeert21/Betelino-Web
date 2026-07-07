export type GameRule = {
  slug: string;
  title: string;
  summary: string;
  instructions: string[];
};

export const GAME_RULES: GameRule[] = [
  {
    slug: "fotbal-pe-echipe",
    title: "Fotbal pe echipe",
    summary:
      "Meci clasic între echipele taberei, jucat pe terenul din spatele cantinei.",
    instructions: [
      "Fiecare echipă trimite 7 jucători pe teren, restul așteaptă pe margine pentru schimburi.",
      "Meciul se joacă în două reprize a câte 15 minute, cu pauză de 5 minute.",
      "Un gol marcat de un jucător nou-venit în tabără valorează dublu în prima săptămână.",
      "Echipa câștigătoare primește 50 de puncte, echipa a doua 20 de puncte.",
    ],
  },
  {
    slug: "vanatoarea-de-comori",
    title: "Vânătoarea de comori",
    summary:
      "Traseu cu indicii ascunse în toată tabăra, rezolvat pe echipe.",
    instructions: [
      "Fiecare echipă primește primul indiciu de la un instructor, la ora anunțată.",
      "Indiciile duc de la un punct al taberei la altul; nu este permis alergatul în zonele cu trafic auto.",
      "Comoara finală conține puncte bonus pentru echipă, împărțite egal între membri.",
      "Prima echipă care ajunge la comoară primește puncte suplimentare de rapiditate.",
    ],
  },
  {
    slug: "seara-talentelor",
    title: "Seara talentelor",
    summary:
      "Fiecare echipă pregătește un moment artistic prezentat în fața întregii tabere.",
    instructions: [
      "Momentul poate fi muzică, teatru, dans sau recitare, durata maximă 5 minute.",
      "Toți membrii echipei trebuie să aibă un rol vizibil pe scenă.",
      "Punctajul este dat de un juriu format din instructori, pe baza creativității și implicării.",
      "Nu se punctează costumele scumpe, ci ideea și implicarea echipei.",
    ],
  },
];
