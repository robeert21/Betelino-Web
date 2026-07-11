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

// cost is in bani (1 leu = 100 bani); last field is dailyLimit (null = unlimited)
const items = [
  ["Kinder Delice Prăjitură de cacao", "biscuiti-napolitane", 350, 2],
  ["Bissimo Mini prăjiturică", "biscuiti-napolitane", 250, 2],
  ["Croissant 7 Days - Double Vanilie si cireșe", "biscuiti-napolitane", 500, 1],
  ["Croissant 7 Days - Double Vanilie si cacao", "biscuiti-napolitane", 500, 1],
  ["Tic-Tac - Mentă", "guma-menta", 800, 1],
  ["Tic-Tac - Frutty mix", "guma-menta", 800, 1],
  ["Mentos - Mentă", "guma-menta", 500, 1],
  ["Mentos - Rainbow", "guma-menta", 500, 1],
  ["Sugus - Clasic", "dulciuri-gumate", 700, 1],
  ["Haribo - Goldenbears", "dulciuri-gumate", 150, 2],
  ["Haribo - Happy Cola", "dulciuri-gumate", 1400, 1],
  ["Jeleuri gumate - măr", "dulciuri-gumate", 1000, 1],
  ["Jeleuri gumate - piersică", "dulciuri-gumate", 1000, 1],
  ["Jeleuri gumate - fructe dulce sărat", "dulciuri-gumate", 1000, 1],
  ["Twix Twin Batoane", "ciocolata-batoane", 450, 2],
  ["Mars Baton", "ciocolata-batoane", 450, 2],
  ["Bounty", "ciocolata-batoane", 550, 2],
  ["Snickers", "ciocolata-batoane", 450, 2],
  ["Kit-Kat", "ciocolata-batoane", 500, 2],
  ["Lion", "ciocolata-batoane", 450, 2],
  ["Baton cu caramel și alune de pădure - Mister Choc Lidl", "ciocolata-batoane", 350, 2],
  ["Choco Bananas", "ciocolata-batoane", 900, 1],
  ["Kinder Cards", "ciocolata-batoane", 350, 2],
  ["Kinder Bueno", "ciocolata-batoane", 550, 2],
  ["Kinder Bueno - White", "ciocolata-batoane", 550, 2],
  ["Kinder Batoane", "ciocolata-batoane", 850, 1],
  ["Kinder Maxi", "ciocolata-batoane", 500, 1],
  ["Lovita Biscuiți cu umblutură de portocale", "biscuiti-napolitane", 800, 1],
  ["Lovita Biscuiți cu umblutură de căpșuni", "biscuiti-napolitane", 800, 1],
  ["Milka Choco Minis Biscuiți", "biscuiti-napolitane", 250, 2],
  ["Biscuiți în stil american cu ciocolată - Sondey", "biscuiti-napolitane", 1100, 1],
  ["Biscuiți cu cremă de alune de pădure - Sondey", "biscuiti-napolitane", 1100, 1],
  ["Biscuiți cu cremă de alune de pădure - Nutella", "biscuiti-napolitane", 2000, 1],
  ["Oreo", "biscuiti-napolitane", 400, 2],
  ["Alka Alfers Napolitane - Cremă lămâie", "biscuiti-napolitane", 800, 1],
  ["Alka Alfers Napolitane - Cacao", "biscuiti-napolitane", 800, 1],
  ["Alka Alfers Napolitane - Cremă fructe de pădure si cremă frișcă", "biscuiti-napolitane", 800, 1],
  ["Alka Alfers Napolitane - Vanilie", "biscuiti-napolitane", 800, 1],
  ["Roger Napolitană - Vanilie", "biscuiti-napolitane", 200, 3],
  ["Roger Napolitană - Alune și arahide", "biscuiti-napolitane", 200, 3],
  ["Roger Napolitană - Cocos", "biscuiti-napolitane", 200, 3],
  ["Roger Napolitană - Glazură de ciocolată neagră", "biscuiti-napolitane", 200, 3],
  ["Napolitană cu lapte", "biscuiti-napolitane", 100, 5],
  ["Finetti Dips Grisine", "biscuiti-napolitane", 1100, 1],
  ["Rolouri cu cremă de vanilie", "biscuiti-napolitane", 750, 1],
  ["Rolouri cu cremă de ciocolată", "biscuiti-napolitane", 750, 1],
  ["ALKA Covrigeii Casei - Masline", "chipsuri-snacks", 500, 1],
  ["Toortitzi - Dulce Acrișor", "chipsuri-snacks", 500, 1],
  ["Toortitzi - Roșii și busuioc", "chipsuri-snacks", 500, 1],
  ["Chio Goldfischli", "chipsuri-snacks", 600, 1],
  ["Doritos - Cheese", "chipsuri-snacks", 900, 1],
  ["Doritos - Hot pepper", "chipsuri-snacks", 900, 1],
  ["Pringles - Sare", "chipsuri-snacks", 1400, 1],
  ["Pringles - Paprica", "chipsuri-snacks", 1400, 1],
  ["Pringles - Smântână și ceapă", "chipsuri-snacks", 1400, 1],
  ["Lay's Chips - Sare", "chipsuri-snacks", 1000, 1],
  ["Lay's Chips - Paprika", "chipsuri-snacks", 1000, 1],
  ["Lay's Chips - Smântână și mărar", "chipsuri-snacks", 1000, 1],
  ["Lay's Rumeniți la cuptor - Sare", "chipsuri-snacks", 1100, 1],
  ["Lay's Rumeniți la cuptor - Paprika", "chipsuri-snacks", 1100, 1],
  ["Lay's Rumeniți la cuptor - Smântână și ceapă", "chipsuri-snacks", 1100, 1],
  ["Lay' MAXX - Brânză și ceapă", "chipsuri-snacks", 1100, 1],
  ["Lay' MAXX - Paprika", "chipsuri-snacks", 1100, 1],
  ["Lay's Wavy - Picant", "chipsuri-snacks", 1100, 1],
  ["Pom-Băr", "porumb-dulce", 600, 1],
  ["Star Snacks Mix green", "chipsuri-snacks", 650, 1],
  ["Mango deshidratați", "chipsuri-snacks", 1300, 1],
  ["Miez de floarea soarelui", "chipsuri-snacks", 300, 1],
  ["Mix nuci și stafide", "chipsuri-snacks", 550, 1],
  ["Arahide prăjite și sărate", "chipsuri-snacks", 700, 1],
  ["Caju prăjit sărat", "chipsuri-snacks", 1100, 1],
  ["Caju prăjit nesărat", "chipsuri-snacks", 1100, 1],
  ["Fistic", "chipsuri-snacks", 2000, 1],
  ["Apa plată Alcalina - 1.5L", "bauturi", 600, 1],
  ["Apa plată Dorna - 0.5L", "bauturi", 450, 1],
  ["Apă minerală carbogazificată Bucovina - 0.5L", "bauturi", 450, 1],
  ["Coca-Cola - 0.5L", "bauturi", 700, 1],
  ["Coca-Cola - 0.33L", "bauturi", 500, 1],
  ["Fanta Portocale - 0.33L", "bauturi", 500, 1],
  ["Fanta Struguri - 0.33L", "bauturi", 500, 1],
  ["Sprite - 0.5L", "bauturi", 700, 1],
  ["TEDI Suc Multifruct - 0.2L", "bauturi", 300, 1],
  ["Fuzetea Bautura cu Aroma de Piersica - 0.5L", "bauturi", 600, 1],
  ["Fuzetea Bautura cu Aroma de Fructe de Padure - 0.5L", "bauturi", 600, 1],
  ["Nectar de mere - 0.2L", "bauturi", 250, 2],
  ["Nectar de portocale - 0.2L", "bauturi", 250, 2],
  ["Pachet de șervețele uscate", "igiena", 100, 10],
];

function escape(value) {
  return value.replace(/'/g, "''");
}

console.log(`Deleting existing shop items (${envFlag})...`);
d1Exec("DELETE FROM shop_items");

console.log(`Inserting ${items.length} shop items...`);
for (const [name, category, cost, dailyLimit] of items) {
  const id = crypto.randomUUID();
  d1Exec(
    `INSERT INTO shop_items (id, name, description, cost, image_url, category, flavors, daily_limit) VALUES ('${id}', '${escape(name)}', NULL, ${cost}, NULL, '${escape(category)}', NULL, ${dailyLimit})`,
  );
}

console.log("Done.");
