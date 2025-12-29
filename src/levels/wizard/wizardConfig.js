export const WIZARD_CONFIG = {
    id: 'wizard',
    name: 'Büyücü Maceraları',
    description: 'Sihirli dünyada kendi kararlarını ver',
    img: '/img/moon-card.png',
    lockedImg: '/img/moon-card-lock.png',
    backgroundImg: '/img/moon-bg.png',
};

export const WIZARD_INTRO_SCENE = {
    name: "Karanlık Kule'nin Gölgesi",
    description: "Yüzyıllardır uykuda olan Karanlık Büyücü Malachar uyandı. Köyler yakılıyor, insanlar kaçıyor. Sen, genç bir büyücü olarak Malachar'ı durdurmak için yola çıktın.",
    narrative: "Ormandaki patikada yürüyorsun. Uzakta Karanlık Kule'nin silueti görünüyor. Yanında sadece büyü asan ve birkaç iksir var. Yolun çatallaştığı bir noktaya geldin - sol yol ormana, sağ yol nehir kenarına çıkıyor.",
    quest: "Karanlık Büyücü Malachar'ı durdur!",
    progress: 0,
    maxProgress: 10
};

export const WIZARD_VICTORY_SCENE = {
    name: "Zafer!",
    description: "Karanlık Büyücü Malachar yenildi! Krallık kurtuldu!",
    narrative: "Malachar'ın son büyüsü senin gücüne yetmedi. Kule çökerken, güneş ışığı yeniden toprakları aydınlatmaya başladı. Sen bir efsane oldun...",
    isEnding: true,
    victory: true
};

export const WIZARD_DEFEAT_SCENE = {
    name: "Son",
    description: "Karanlık güçler galip geldi...",
    narrative: "Malachar'ın gücü seni alt etti. Belki başka bir zaman, başka bir kahraman bu görevi tamamlayabilir...",
    isEnding: true,
    victory: false
};