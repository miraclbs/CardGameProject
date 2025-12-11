import { buildSystemPrompt, buildUserPrompt } from './promptBuilder';

const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const API_URL = "/api/deepseek/chat/completions";

async function callDeepSeekAPI(systemPrompt, userPrompt, temperature = 0.3, maxTokens = 800) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + API_KEY,
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                temperature: temperature,
                max_tokens: maxTokens,
            }),
        });

        if (!response.ok) {
            throw new Error("API Hatasi: " + response.statusText);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

function parseJSONResponse(content) {
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();

    let jsonStart = content.indexOf('{');
    let jsonEnd = content.lastIndexOf('}');

    if (jsonStart !== -1 && jsonEnd !== -1) {
        content = content.substring(jsonStart, jsonEnd + 1);
    }

    try {
        const scene = JSON.parse(content);

        if (!scene.name || !scene.description || !scene.choices || !Array.isArray(scene.choices)) {
            throw new Error("Invalid scene structure");
        }

        return scene;
    } catch (firstError) {
        console.warn("First parse failed, attempting to fix JSON...");

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

            // Validate structure
            if (!scene.name || !scene.description || !scene.choices || !Array.isArray(scene.choices)) {
                throw new Error("Invalid scene structure");
            }

            console.log("JSON fixed successfully!");
            return scene;
        } catch (secondError) {
            console.error("JSON Parse Error:", firstError);
            console.error("Second attempt failed:", secondError);
            console.error("AI Response:", content);
            throw new Error("AI yaniti gecersiz JSON formatinda. Lutfen tekrar deneyin.");
        }
    }
}



export async function generateNextScene(storyHistory, lastChoice, story, currentOxygen, introScene) {
    const systemPrompt = buildSystemPrompt(story);
    const userPrompt = buildUserPrompt(story, lastChoice, currentOxygen);

    const content = await callDeepSeekAPI(systemPrompt, userPrompt, 0.3, 800);
    return parseJSONResponse(content);
}