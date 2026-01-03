/* ---------- CONFIGUROWANIE & USTAWIENIA DOM ---------- */
const form     = document.getElementById('configForm');
const output   = document.getElementById('output');
const downloadBtn = document.getElementById('downloadBtn');

/* ---------- PODSTAWOWE DANE ------------------------ */
const fishNames  = ['Salmon', 'Trout', 'Carp', 'Bass', 'Pike'];
const trashNames = ['Bottle', 'Newspaper', 'PlasticBag', 'Can', 'Tin'];

const weatherOptions = ['Rain','Clear','Snow','Storm'];
const spotOptions    = ['Ocean','River','Reef','Swamp','Lake'];
const timeOptions    = ['Dawn','Dusk','Day','Night'];

/* ---------- POMOCNICZE FUNKCJE -------------------- */
function randInt(min, max) { return Math.floor(Math.random()*(max-min+1))+min; }
function maybePick(arr){ return Math.random()<0.5?arr[Math.floor(Math.random()*arr.length)]:null; }

/* ---------- GŁÓWNA LOGIKA GENERATORA -------------- */
function generateYAML({type, count, rare, legendary}) {
  const baseList = type==='fish'? fishNames : trashNames;

  // Ustalenie prawdopodobieństw wariantów
  const probs = {
    normal:     1 - (rare?0.2:0) - (legendary?0.1:0),
    rare:      rare?0.2:0,
    legendary: legendary?0.1:0
  };

  function pickVariant(){
    const r=Math.random();
    if(r<probs.normal) return 'Normal';
    if(r<probs.normal+probs.rare) return 'Rare';
    return 'Legendary';
  }

  const starsMap = { Normal:1, Rare:3, Legendary:5 };

  const items=[];
  for(let i=0;i<count;i++){
    const baseName = baseList[Math.floor(Math.random()*baseList.length)];
    const variant  = pickVariant();

    items.push({
      id:          i,
      name:        `${variant}_${baseName}`,
      weather:     maybePick(weatherOptions),
      spot:        maybePick(spotOptions),
      time:        maybePick(timeOptions),
      chance:      randInt(1,100),
      stars:       starsMap[variant],
      fluff:       `${baseName} glows in the ${maybePick(weatherOptions)||'unknown'} waters.`,
      condition:   "",
      image:       "https://",
      emoji:       "<>"
    });
  }

  // Serializacja do YAML
  return jsyaml.dump(items, { lineWidth:-1 }); // `jsyaml` z CDN
}

/* ---------- OBSŁUGA FORMULARZA -------------------- */
form.addEventListener('submit', e=>{
  e.preventDefault();
  const data = new FormData(form);
  const opts = {
    type:     data.get('type'),
    count:    parseInt(data.get('count'),10),
    rare:     data.get('rare')!==null,
    legendary:data.get('legendary')!==null
  };
  const yamlStr = generateYAML(opts);
  output.value = yamlStr;
  downloadBtn.disabled=false;
});

/* ---------- DOWNLOAD PLIKU ------------------------ */
downloadBtn.addEventListener('click', ()=>{
  const blob = new Blob([output.value], {type:"text/yaml"});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'generated.yaml';
  a.click();
  URL.revokeObjectURL(url);
});
