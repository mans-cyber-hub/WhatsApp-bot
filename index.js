const express = require('express');
const app = express();
app.use(express.json());

// Mfumo utasoma ufunguo wako wa AQ. kutoka Render Environment
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post('/webhook', async (req, res) => {
    // AutoResponder inatuma meseji kupitia req.body.query au req.body.message
    const userMessage = req.body.query || req.body.message;

    if (!userMessage) {
        return res.json({
            message: "Niaje mwanangu! Sijaona ujumbe wowote hapa.",
            replies: [{ text: "Niaje mwanangu! Sijaona ujumbe wowote hapa." }]
        });
    }

    try {
        // Tunatuma ombi kwenda kwa Gemini tukitumia API Key yako mpya
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Wewe ni msaidizi wa kinyamwezi sana na una akili nyingi. Jibu ujumbe huu wa mshkaji wako kwa lugha ya Kiswahili ya mtaani, changamka, uwe na vibe na ueleweke haraka: ${userMessage}`
                    }]
                }]
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            const aiReply = data.candidates[0].content.parts[0].text;
            
            // Muundo unaokubalika na toleo lolote lile la AutoResponder
            return res.json({
                message: aiReply,
                replies: [{ text: aiReply, message: aiReply }]
            });
        } else {
            console.log("Google Response Error:", JSON.stringify(data));
            return res.json({
                message: "Dah mwanangu, kuna hitilafu kidogo upande wa AI. Hebu nicheki baadae.",
                replies: [{ text: "Dah mwanangu, kuna hitilafu kidogo upande wa AI. Hebu nicheki baadae." }]
            });
        }

    } catch (error) {
        console.error("Catch Error:", error);
        return res.json({
            message: "Ubongo umepata hitilafu kidogo, nicheki baadae mwanangu!",
            replies: [{ text: "Ubongo umepata hitilafu kidogo, nicheki baadae mwanangu!" }]
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ya kinyamwezi ipo tayari kwenye port ${PORT}`));
            
