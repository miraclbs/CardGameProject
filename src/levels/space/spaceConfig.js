export const SPACE_CONFIG = {
    id: 'space',
    name: 'Uzay Macerası',
    description: 'Uzayda hayatta kalma mücadelesi',
    img: '/img/space-card.png',
    lockedImg: '/img/space-card-lock.png',
    backgroundImg: '/img/space-bg.png',
};

export const SPACE_INTRO_SCENE = {
    name: "Uzay İstasyonu Krizi",
    description: "Uzay istasyonunda tek başına kaldın. Oksijen seviyesi %100. Her seçim oksijen seviyeni değiştirecek. Dikkatli ol!",
    narrative: "Görev başarısız oldu. Ekip tahliye edildi. Sadece sen kaldın...",
    oxygen: 100,
    choices: []
};

export const SPACE_GAME_OVER_SCENE = {
    name: "Oksijen Tükendi",
    description: "Oksijen seviyesi %0'a düştü. Görev başarısız...",
    narrative: "Karanlık seni sardı. Belki başka bir zaman diliminde farklı seçimler yapabilirdin...",
    oxygen: 0,
    choices: []
};
