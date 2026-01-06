import { buildSystemPrompt, buildUserPrompt } from './promptBuilder';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_URL = "/api/openai/v1/chat/completions";

async function callOpenAI(systemPrompt, userPrompt, temperature = 0.7, maxTokens = 800) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + API_KEY,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                temperature: temperature,
                max_tokens: maxTokens,
            }),
        });

        if (!response.ok) {
            throw new Error("Sunucuya bağlanırken bir sorun oluştu. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.");
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (error) {
        throw error;
    }
}

function parseJSONResponse(content, isWizard = false) {
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();

    let jsonStart = content.indexOf('{');
    let jsonEnd = content.lastIndexOf('}');

    if (jsonStart !== -1 && jsonEnd !== -1) {
        content = content.substring(jsonStart, jsonEnd + 1);
    }

    try {
        const scene = JSON.parse(content);

        if (isWizard) {
            if (!scene.narrative || !scene.situation) {
                throw new Error("Oyun yükleme sırasında beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.");
            }
            if (scene.progress === undefined || scene.progress === null) {
                scene.progress = 1;
            }
        } else {
            if (!scene.name || !scene.description || !scene.choices || !Array.isArray(scene.choices)) {
                throw new Error("Oyun yükleme sırasında beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.");
            }
        }

        return scene;
    } catch (firstError) {

        try {
            let fixedContent = content;

            fixedContent = fixedContent.replace(
                /"(\w+)":\s*([A-Z][^,\n}\]]*?)(?=\s*[,\n}\]])/g,
                (match, key, value) => {
                    if (value.match(/^["'\d]/) || value === 'true' || value === 'false' || value === 'null') {
                        return match;
                    }
                    return `"${key}": "${value.trim()}"`;
                }
            );

            const openBraces = (fixedContent.match(/{/g) || []).length;
            const closeBraces = (fixedContent.match(/}/g) || []).length;
            const openBrackets = (fixedContent.match(/\[/g) || []).length;
            const closeBrackets = (fixedContent.match(/\]/g) || []).length;

            for (let i = 0; i < (openBrackets - closeBrackets); i++) {
                fixedContent += '\n]';
            }
            for (let i = 0; i < (openBraces - closeBraces); i++) {
                fixedContent += '\n}';
            }

            const scene = JSON.parse(fixedContent);

            if (isWizard) {
                if (!scene.narrative || !scene.situation) {
                    throw new Error("Oyun yükleme sırasında beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.");
                }
                if (scene.progress === undefined || scene.progress === null) {
                    scene.progress = 1;
                }
            } else {
                if (!scene.name || !scene.description || !scene.choices || !Array.isArray(scene.choices)) {
                    throw new Error("Oyun yükleme sırasında beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.");
                }
            }

            return scene;
        } catch (secondError) {
            throw new Error("Bir beklenmeyen hata oluştu. Lütfen tekrar deneyin.");
        }
    }
}

export async function generateNextScene(storyHistory, lastChoice, story, currentValue, introScene) {
    // Check if story has custom prompts (wizard mode)
    const isWizard = story.id === 'wizard';

    let systemPrompt, userPrompt;

    if (story.systemPrompt && story.userPrompt) {
        // Use custom prompts from story (wizard mode)
        systemPrompt = story.systemPrompt;
        userPrompt = story.userPrompt;
    } else {
        // Use default prompt builders (space mode)
        systemPrompt = buildSystemPrompt(story);
        userPrompt = buildUserPrompt(story, lastChoice, currentValue);
    }

    const content = await callOpenAI(systemPrompt, userPrompt, 0.7, 800);
    return parseJSONResponse(content, isWizard);
}
