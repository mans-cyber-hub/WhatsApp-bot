const express = require('express');
const app = express();
app.use(express.json());

// API Key yako ya Gemini kutoka kwenye Environment Variables ya Render
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post('/webhook', async (req, res) => {
    // AutoResponder inatuma meseji kupitia req.body.query au req.body.message
    const userMessage = req.body.query || req.body.message;

    if (!userMessage) {
        return res.json({
            message: "Mwanangu, sijaona ujumbe wowote hapa!",
            replies: [{ text: "Mwanangu, sijaona ujumbe wowote hapa!", message: "Mwanangu, sijaona ujumbe wowote hapa!" }]
        });
    }

    try {
        // Hapa tunatuma ujumbe kwenda kwa Gemini AI
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Wewe ni msaidizi wa kinyamwezi sana na una akili nyingi. Jibu ujumbe huu wa mshkaji wako kwa lugha ya Kiswahili ya mtaani, changamka, uwe na vibe na ueleweke haraka: ${userMessage}`
                    }]
                }]
              })
        });

        const data = await response.json();

        // Hakikisha jibu limepatikana kutoka Gemini kabla ya kutuma
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
            const aiReply = data.candidates[0].content.parts[0].text;
            
            // Muundo mpya wa kijanja unaokubalika na mifumo yote ya AutoResponder
            return res.json({
                message: aiReply,
                replies: [{ text: aiReply, message: aiReply }]
            });
        } else {
            const errorReply = "Dah, kuna shida kidogo imetokea kwenye mfumo wa AI.";
            return res.json({
                message: errorReply,
                replies: [{ text: errorReply, message: errorReply }]
            });
        }

    } catch (error) {
        console.error("Error:", error);
        const catchReply = "Dah mshkaji wangu, ubongo umepata hitilafu kidogo, nicheki baadae!";
        return res.json({
            message: catchReply,
            replies: [{ text: catchReply, message: catchReply }]
        });
    }
});

// Port itakayotumika kuwasha server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ya kinyamwezi ipo tayari kwenye port ${PORT}`));
            
