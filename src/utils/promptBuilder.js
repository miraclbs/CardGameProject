export function buildSystemPrompt(story) {
    const basePrompt = story.systemPrompt || "Sen bir interaktif hikaye yazarisin.";
    return `${basePrompt}\n\nSADECE JSON formatinda yanit ver. Hicbir aciklama ekleme. Turkce ozel karakter kullanma.`;
}

export function buildUserPrompt(story, lastChoice) {
    let userText = `Oyuncu secimi: "${lastChoice}"\n\n`;
    userText += buildJSONExample();
    return userText;
}

function buildJSONExample() {
    let example = `ORNEK JSON FORMAT:\n`;
    example += `{\n`;
    example += `  "name": "Sahne Ismi",\n`;
    example += `  "description": "Kisa aciklama",\n`;
    example += `  "narrative": "Ek detay",\n`;
    example += `  "choices": [\n`;
    example += `    {"text": "Secim 1", "impact": "Etki"},\n`;
    example += `    {"text": "Secim 2", "impact": "Etki"},\n`;
    example += `    {"text": "Secim 3", "impact": "Etki"}\n`;
    example += `  ]\n`;
    example += `}\n\n`;
    return example;
}
