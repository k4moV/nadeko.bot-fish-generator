/* ==============================================================
   generator.js – przyjazny, bez‑BOM JavaScript
   ============================================================== */

/* ---------- DOM ---------- */
const form        = document.getElementById('configForm');
const output      = document.getElementById('output');
const downloadBtn = document.getElementById('downloadBtn');

/* ---------- Dane ---------- */
const fishNames   = [
  'Salmon','Trout','Carp','Bass','Pike','Perch','Catfish',
  'Sturgeon','Haddock','Halibut','Cod','Tuna','Snapper',
  'Mahi‑Mahi','Barracuda','Marlin','Swordfish','Octopus',
  'Eel','Crab','Lobster','Shrimp','Mackerel','Sardine',
  'Anchovy','Herring','Pufferfish','Angelfish','Grouper',
  'Ray','Skate'
];

const spotOptions   = ['Ocean','River','Reef','Swamp','Lake'];
const weatherOptions= ['Rain','Clear','Snow','Storm'];
const timeOptions    = ['Dawn','Dusk','Day','Night'];

/* ---------- Spot‑map (jedna wartość na rybę) ---------- */
const fishSpotMap = {
  Salmon: 'River',
  Trout: 'River',
  Carp: 'Lake',
  Bass: 'Lake',
  Pike: 'River',
  Perch: 'River',
  Catfish: 'River',
  Sturgeon: 'River',
  Haddock: 'Ocean',
  Halibut: 'Ocean',
  Cod: 'Ocean',
  Tuna: 'Ocean',
  Snapper: 'Reef',
  'Mahi‑Mahi': 'Reef',
  Barracuda: 'Reef',
  Marlin: 'Ocean',
  Swordfish: 'Ocean',
  Octopus: 'Ocean',
  Eel: 'River',
  Crab: 'Swamp',
  Lobster: 'Swamp',
  Shrimp: 'Ocean',
  Mackerel: 'Ocean',
  Sardine: 'Ocean',
  Anchovy: 'Ocean',
  Herring: 'Ocean',
  Pufferfish: 'Reef',
  Angelfish: 'Reef',
  Grouper: 'Reef',
  Ray: 'Ocean',
  Skate: 'Swamp'
};

/* ---------- Pomocnicze ---------- */
function randInt(min, max){ return Math.floor(Math.random()*(max-min+1))+min; }
function maybePick(arr){ return arr && arr.length ? arr[Math.floor(Math.random()*arr.length)] : null; }

/* ---------- Główna logika generowania YAML ---------- */
function generateYAML({count}) {
  const items = [];

for (let i=0;i<count;i++){
  const baseName   = fishNames[Math.floor(Math.random()*fishNames.length)];
  const spot       = fishSpotMap[baseName] || maybePick(spotOptions);
  const normalChance = randInt(1,100);

  /* ★ LOSOWE stars dla normalnej ryby */
  const normalStars = randInt(1,4);

  const rareChance   = Math.max(1, Math.round(normalChance/2));
  const legChance    = Math.max(1, Math.round(rareChance/3));

  items.push({
    id:          i*3,
    name:        baseName,
    weather:     null,
    spot:        spot,
    time:        null,
    chance:      normalChance,
    stars:       normalStars,
    fluff:       `${baseName} glows in the ${maybePick(weatherOptions)||'unknown'} waters.`,
    condition:   "",
    image:       "https://",
    emoji:       "<>"
  });

  items.push({
    id:          i*3+1,
    name:        `Rare_${baseName}`,
    weather:     maybePick(weatherOptions),
    spot:        spot,
    time:        maybePick(timeOptions),
    chance:      rareChance,
    stars:       Math.min(4, normalStars + 1),
    fluff:       `${baseName} glows in the ${maybePick(weatherOptions)||'unknown'} waters.`,
    condition:   "",
    image:       "https://",
    emoji:       "<>"
  });

  items.push({
    id:          i*3+2,
    name:        `Legendary_${baseName}`,
    weather:     maybePick(weatherOptions),
    spot:        spot,
    time:        maybePick(timeOptions),
    chance:      legChance,
    stars:       4,
    fluff:       `${baseName} glows in the ${maybePick(weatherOptions)||'unknown'} waters.`,
    condition:   "",
    image:       "https://",
    emoji:       "<>"
  });
}


  return jsyaml.dump(items, { lineWidth:-1 }); // `jsyaml` z CDN
}

/* ---------- Obsługa formularza ---------- */
form.addEventListener('submit', e=>{
  e.preventDefault();
  const count = parseInt(form.elements.count.value,10);
  output.value = generateYAML({count});
  downloadBtn.disabled=false;
});

/* ---------- Pobieranie pliku ---------- */
downloadBtn.addEventListener('click', ()=>{
  const blob = new Blob([output.value], {type:"text/yaml"});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'generated.yaml';
  a.click();
  URL.revokeObjectURL(url);
});
