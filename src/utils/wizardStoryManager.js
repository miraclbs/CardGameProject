import {
    WIZARD_INTRO_SCENE,
    WIZARD_VICTORY_SCENE,
    WIZARD_DEFEAT_SCENE
} from "../levels/wizard/wizardConfig";

export { WIZARD_INTRO_SCENE, WIZARD_VICTORY_SCENE, WIZARD_DEFEAT_SCENE };

export function buildWizardSystemPrompt(currentProgress, maxProgress) {
    return `Sen bir fantezi macera oyununda Dungeon Master rolündesin. Oyuncu serbest metin yazarak ne yapmak istediğini söylüyor, sen hikayeyi ona göre ilerletiyorsun.

GÖREV: Oyuncu Karanlık Büyücü Malachar'ı durdurmaya çalışıyor.

KURALLAR:
1. Oyuncunun yazdığı aksiyona MANTIKLI tepki ver
2. Hikayeyi 2-3 cümle ile ilerlet
3. Sonunda yeni bir durum/meydan okuma sun
4. Her zaman atmosferik ve sürükleyici ol
5. Bazen esprili, bazen ciddi anlar olsun
6. TÜRKÇE yaz

İLERLEME SİSTEMİ:
- Mevcut ilerleme: ${currentProgress}/${maxProgress}
- "progress" değeri döndür: -1 (kötü hamle), 0 (nötr), +1 (iyi), +2 (harika)
- ${maxProgress - currentProgress} puan daha kazanırsa oyuncu FİNALE ulaşır
- İlerleme 0'ın altına düşerse oyuncu KAYBEDİYOR

JSON FORMATI (SADECE JSON DÖNDÜR):
{
    "narrative": "Hikayenin devamı ve oyuncunun aksiyonunun sonucu (2-3 cümle)",
    "situation": "Şu anki durum ve meydan okuma (1-2 cümle)", 
    "progress": 1,
    "hint": "Oyuncuya küçük bir ipucu (opsiyonel, bazen boş bırak)"
}`;
}

export function buildWizardUserPrompt(playerAction, storyHistory = []) {
    let prompt = `OYUNCUNUN AKSİYONU: "${playerAction}"\n\n`;

    if (storyHistory.length > 0) {
        prompt += `SON 3 OLAY:\n`;
        storyHistory.slice(-3).forEach((entry, idx) => {
            prompt += `${idx + 1}. Oyuncu: "${entry.action}" → ${entry.result}\n`;
        });
        prompt += `\n`;
    }

    prompt += `Oyuncunun aksiyonuna göre hikayeyi ilerlet. SADECE JSON döndür.`;

    return prompt;
}

export function calculateProgress(currentProgress, progressChange) {
    return currentProgress + (progressChange || 0);
}

export function isVictory(progress, maxProgress) {
    return progress >= maxProgress;
}

export function isDefeat(progress) {
    return progress < 0;
}

export function createWizardHistoryEntry(playerAction, result, progressBefore, progressAfter) {
    return {
        action: playerAction,
        result: result,
        progressBefore: progressBefore,
        progressAfter: progressAfter,
        timestamp: Date.now()
    };
}

export function validateWizardResponse(response) {
    if (!response.narrative || !response.situation) return false;
    if (response.progress === undefined || response.progress === null) return false;
    return true;
}