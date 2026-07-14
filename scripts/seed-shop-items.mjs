// Replaces the entire shop catalog (shop_items table) with a fixed product
// list. Deletes all existing rows first, then inserts the new ones.
// Usage:
//   node scripts/seed-shop-items.mjs            (local D1)
//   node scripts/seed-shop-items.mjs --remote    (production D1)
import { execFileSync } from "node:child_process";

const remote = process.argv.includes("--remote");
const envFlag = remote ? "--remote" : "--local";

function d1Exec(sql) {
  execFileSync(
    "npx",
    ["wrangler", "d1", "execute", "betelino-db", envFlag, "--command", sql],
    { encoding: "utf8", stdio: "inherit" },
  );
}

// cost is in bani (1 leu = 100 bani), used when the item has no flavors.
// flavors is null, or a list of [name, cost] variant pairs a camper picks
// between — each variant can carry its own price (e.g. different bottle
// sizes of the same drink).
const items = [
  ["Kinder Delice Prăjitură de cacao", "biscuiti-napolitane", 350, 2, null],
  ["Bissimo Mini prăjiturică", "biscuiti-napolitane", 250, 2, null],
  ["Croissant 7 Days - Double", "biscuiti-napolitane", null, 1, [["Vanilie si cireșe", 500], ["Vanilie si cacao", 500]]],
  ["Tic-Tac", "guma-menta", null, 1, [["Mentă", 800], ["Frutty mix", 800]]],
  ["Mentos", "guma-menta", null, 1, [["Mentă", 500], ["Rainbow", 500]]],
  ["Sugus - Clasic", "dulciuri-gumate", 700, 1, null],
  ["Haribo - Goldenbears", "dulciuri-gumate", 150, 2, null],
  ["Haribo - Happy Cola", "dulciuri-gumate", 1400, 1, null],
  ["Jeleuri gumate", "dulciuri-gumate", null, 1, [["Măr", 1000], ["Piersică", 1000], ["Fructe dulce-sărat", 1000]]],
  ["Twix Twin Batoane", "ciocolata-batoane", 450, 2, null],
  ["Mars Baton", "ciocolata-batoane", 450, 2, null],
  ["Bounty", "ciocolata-batoane", 550, 2, null],
  ["Snickers", "ciocolata-batoane", 450, 2, null],
  ["Kit-Kat", "ciocolata-batoane", 500, 2, null],
  ["Lion", "ciocolata-batoane", 450, 2, null],
  ["Baton cu caramel și alune de pădure - Mister Choc Lidl", "ciocolata-batoane", 350, 2, null],
  ["Choco Bananas", "ciocolata-batoane", 900, 1, null],
  ["Kinder Cards", "ciocolata-batoane", 350, 2, null],
  ["Kinder Bueno", "ciocolata-batoane", null, 2, [["Clasic", 550], ["White", 550]]],
  ["Kinder Batoane", "ciocolata-batoane", 850, 1, null],
  ["Kinder Maxi", "ciocolata-batoane", 500, 1, null],
  ["Lovita Biscuiți", "biscuiti-napolitane", null, 1, [["Cu umplutură de portocale", 800], ["Cu umplutură de căpșuni", 800]]],
  ["Milka Choco Minis Biscuiți", "biscuiti-napolitane", 250, 2, null],
  ["Biscuiți Sondey", "biscuiti-napolitane", null, 1, [["În stil american cu ciocolată", 1100], ["Cu cremă de alune de pădure", 1100]]],
  ["Biscuiți cu cremă de alune de pădure - Nutella", "biscuiti-napolitane", 2000, 1, null],
  ["Oreo", "biscuiti-napolitane", 400, 2, null],
  ["Alka Alfers Napolitane", "biscuiti-napolitane", null, 1, [["Cremă lămâie", 800], ["Cacao", 800], ["Cremă fructe de pădure și frișcă", 800], ["Vanilie", 800]]],
  ["Roger Napolitană", "biscuiti-napolitane", null, 3, [["Vanilie", 200], ["Alune și arahide", 200], ["Cocos", 200], ["Glazură de ciocolată neagră", 200]]],
  ["Napolitană cu lapte", "biscuiti-napolitane", 100, 5, null],
  ["Finetti Dips Grisine", "biscuiti-napolitane", 1100, 1, null],
  ["Rolouri cu cremă", "biscuiti-napolitane", null, 1, [["Vanilie", 750], ["Ciocolată", 750]]],
  ["ALKA Covrigeii Casei - Masline", "chipsuri-snacks", 500, 1, null],
  ["Toortitzi", "chipsuri-snacks", null, 1, [["Dulce acrișor", 500], ["Roșii și busuioc", 500]]],
  ["Chio Goldfischli", "chipsuri-snacks", 600, 1, null],
  ["Doritos", "chipsuri-snacks", null, 1, [["Cheese", 1200], ["Hot pepper", 900]]],
  ["Pringles", "chipsuri-snacks", null, 1, [["Sare", 1400], ["Paprica", 1400], ["Smântână și ceapă", 1400]]],
  ["Lay's Chips", "chipsuri-snacks", null, 1, [["Sare", 1000], ["Paprika", 1000], ["Smântână și mărar", 1000]]],
  ["Lay's Rumeniți la cuptor", "chipsuri-snacks", null, 1, [["Sare", 1100], ["Paprika", 1100], ["Smântână și ceapă", 1100]]],
  ["Lay' MAXX", "chipsuri-snacks", null, 1, [["Brânză și ceapă", 1100], ["Paprika", 1100]]],
  ["Lay's Wavy - Picant", "chipsuri-snacks", 1100, 1, null],
  ["Pom-Băr", "dulciuri-gumate", 600, 1, null],
  ["Star Snacks Mix green", "chipsuri-snacks", 650, 1, null],
  ["Mango deshidratați", "chipsuri-snacks", 1300, 1, null],
  ["Miez de floarea soarelui", "chipsuri-snacks", 300, 1, null],
  ["Mix nuci și stafide", "chipsuri-snacks", 550, 1, null],
  ["Arahide prăjite și sărate", "chipsuri-snacks", 700, 1, null],
  ["Caju prăjit", "chipsuri-snacks", null, 1, [["Sărat", 1100], ["Nesărat", 1100]]],
  ["Fistic", "chipsuri-snacks", 2000, 1, null],
  ["Înghețată pe băț", "inghetata", null, 1, [["Ciocolată normală - Almond", 366], ["Ciocolată albă - Almond", 366]]],
  ["Apa plată Alcalina - 1.5L", "bauturi", 600, 1, null],
  ["Apa plată Dorna - 0.5L", "bauturi", 450, 1, null],
  ["Apă minerală carbogazificată Bucovina - 0.5L", "bauturi", 450, 1, null],
  ["Coca-Cola", "bauturi", null, 1, [["0.5L", 950], ["0.33L", 700]]],
  ["Fanta - 0.33L", "bauturi", null, 1, [["Portocale", 700], ["Struguri", 700]]],
  ["Sprite - 0.5L", "bauturi", 900, 1, null],
  ["TEDI Suc Multifruct - 0.2L", "bauturi", 300, 1, null],
  ["Fuzetea - 0.5L", "bauturi", null, 1, [["Piersică", 800], ["Fructe de pădure", 800]]],
  ["Nectar - 0.2L", "bauturi", null, 2, [["Mere", 250], ["Portocale", 250]]],
  ["Pachet de șervețele uscate", "igiena", 100, 10, null],
];

function escape(value) {
  return value.replace(/'/g, "''");
}

console.log(`Deleting existing shop items (${envFlag})...`);
d1Exec("DELETE FROM shop_items");

console.log(`Inserting ${items.length} shop items...`);
for (const [name, category, cost, dailyLimit, flavorPairs] of items) {
  const id = crypto.randomUUID();
  const flavors = flavorPairs ? flavorPairs.map(([n, c]) => ({ name: n, cost: c })) : null;
  const baseCost = cost ?? Math.min(...flavors.map((f) => f.cost));
  const flavorsValue = flavors ? `'${escape(JSON.stringify(flavors))}'` : "NULL";
  d1Exec(
    `INSERT INTO shop_items (id, name, description, cost, image_url, category, flavors, daily_limit) VALUES ('${id}', '${escape(name)}', NULL, ${baseCost}, NULL, '${escape(category)}', ${flavorsValue}, ${dailyLimit})`,
  );
}

console.log("Done.");
