export const SPACE_INTRO_SCENE = {
    name: "Kesifci-7 Acil Durum",
    description: "Kesifci-7 uzay gemisi meteor carpmasi sonucu agir hasar gordu. Ana oksijen tanki hizla bosaliyor.",
    narrative: "Sistem panelleri kirmizi uyarilarla dolu. Oksijen 72.",
    oxygen: 72,
    choices: [
        {
            text: "Oksijen borusunu bantla",
            impact: "Belki gecici bir cozum...",
            oxygenChange: 0,
            resultNarrative: "Yapiştirıcı bantı titreyen ellerinle boruya doluyorsun. Sistem bir anlığına duraliyor ama oksijen hala azaliyor.",
            promptHint: "Oyuncu bant ile hizli cozum aradi ama kalici degil"
        },
        {
            text: "Enerji taramasi yap",
            impact: "Disarida neler gizli acaba?",
            oxygenChange: 0,
            resultNarrative: "Acil kapsule inip radar ekranina bakiyorsun. 300km oteде zayif bir sinyal var... Belki bir umut.",
            promptHint: "Oyuncu yakinlarda bir istasyon kesfetti"
        },
        {
            text: "Manuel sistemi baslat",
            impact: "Eski teknoloji bazen ise yarar...",
            oxygenChange: 0,
            resultNarrative: "Koprü bolumune kosuyorsun. Eski kontrol panellerini acıp kabloları birlestiriyorsun. Gemi hafifçe titriyor.",
            promptHint: "Oyuncu gemiyi manuel kontrol altina almayi denedi"
        }
    ]
};

export const SPACE_GAME_OVER_SCENE = {
    name: "Oyun Bitti",
    description: "Oksijen tukendi. Kesifci-7'deki yolculugun burada sona erdi.",
    narrative: "Son nefesini verirken, geminin sessizligi seni sariyor...",
    choices: []
};

export function buildSpaceSystemPrompt() {
    return `Sen bir uzay hayatta kalma oyunu icin sahne ureten AI'sin.
SADECE GECERLI JSON formatinda yanit ver. Hicbir aciklama ekleme. Turkce ozel karakter kullanma.

KRITIK: HER STRING DEGERI MUTLAKA TIRNAK ICINDE OLMALI! ("text": "deger" seklinde)

KURAL:
- Kisa ve hizli sahneler (2-3 cumle)
- Hikaye Kesifci-7 gemisinde geciyor
- Oksijen kritik, her sahne oksijen degistirir
- 2-4 arasi secim sun
- Her secimde su alanlar OLMALI:
  * text: Kisa secim metni (5-8 kelime) - TIRNAK ICINDE
  * impact: HIKAYE ODAKLI belirsiz ipucu (ASLA oksijen veya enerji degisiminden bahsetme!) - TIRNAK ICINDE
  * oxygenChange: Sayi (negatif, pozitif veya sifir) - TIRNAK YOK
  * resultNarrative: Secim yapilinca ne oldugu (1-2 cumle) - TIRNAK ICINDE
  * promptHint: Sonraki sahne icin ipucu (kisa not) - TIRNAK ICINDE

IMPACT ALANI KURALLARI (COK ONEMLI):
- ASLA "oksijen", "enerji", "kaynak", "arttirir", "azaltir" gibi kelimeler KULLANMA
- Bunun yerine GIZEMLI ve HIKAYE ODAKLI ipuclari yaz
- Oyuncu sonucu ONCEDEN BILMEMELI
- Ornekler:
  * YANLIS: "Oksijeni arttırır" veya "Riskli ama kaynak kazandırır"
  * DOGRU: "Karanliga dogru bir adim..." veya "Kim bilir neler bekliyor?"
  * DOGRU: "Sessizce ilerle..." veya "Bu kapinin ardinda ne var?"
  * DOGRU: "Belki de son sans..." veya "Eski dostlar yardim eder mi?"

ORNEK GECERLI FORMAT:
"impact": "Gizemli sese dogru birsey ilerle"

YANLIS FORMAT (KULLANMA):
"impact":Gizemli sese dogru ilerle
"impact": "Oksijen kazandırır"`;
}

export function buildSpaceUserPrompt(lastChoice, currentOxygen, storyHistory = []) {
    let prompt = `Oyuncu secimi: "${lastChoice.text}"\n`;
    prompt += `Secim sonucu: ${lastChoice.resultNarrative}\n`;
    prompt += `Ipucu: ${lastChoice.promptHint}\n`;
    prompt += `Mevcut oksijen: ${currentOxygen}\n\n`;

    if (storyHistory.length > 0) {
        prompt += `GECMIS SECIMLER:\n`;
        storyHistory.slice(-3).forEach((entry, idx) => {
            prompt += `${idx + 1}. ${entry.choice} -> ${entry.result}\n`;
        });
        prompt += `\n`;
    }

    prompt += `ORNEK JSON:\n`;
    prompt += `{\n`;
    prompt += `  "name": "Sahne Basligi",\n`;
    prompt += `  "description": "Kisa aciklama",\n`;
    prompt += `  "narrative": "Ek detay",\n`;
    prompt += `  "choices": [\n`;
    prompt += `    {\n`;
    prompt += `      "text": "Kisa secim",\n`;
    prompt += `      "impact": "Etki",\n`;
    prompt += `      "oxygenChange": -5,\n`;
    prompt += `      "resultNarrative": "Bu secimdən ne oldu",\n`;
    prompt += `      "promptHint": "Sonraki sahne icin not"\n`;
    prompt += `    }\n`;
    prompt += `  ]\n`;
    prompt += `}\n\n`;
    prompt += `Uzay gemisi Kesifci-7. Yukardaki formatta yeni sahne uret. Sadece JSON dondur.`;

    return prompt;
}

export function calculateOxygenChange(currentOxygen, oxygenChange) {
    const newOxygen = currentOxygen + oxygenChange;
    return Math.max(0, Math.min(100, newOxygen));
}

export function isGameOver(oxygen) {
    return oxygen <= 0;
}

export function createHistoryEntry(scene, choice, oxygenBefore, oxygenAfter) {
    return {
        scene: scene.name,
        description: scene.description,
        choice: choice.text,
        result: choice.resultNarrative,
        promptHint: choice.promptHint,
        oxygenBefore: oxygenBefore,
        oxygenAfter: oxygenAfter
    };
}

export function validateSpaceScene(scene) {
    if (!scene.choices || !Array.isArray(scene.choices)) {
        return false;
    }

    for (const choice of scene.choices) {
        if (choice.oxygenChange === undefined || choice.oxygenChange === null) {
            return false;
        }
        if (!choice.resultNarrative || !choice.promptHint) {
            return false;
        }
    }

    return true;
}
