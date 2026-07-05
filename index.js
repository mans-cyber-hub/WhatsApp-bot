const express = require('express');
const app = express();
app.use(express.json());

// API Key yako ya Gemini ikiwa imekaa sehemu yake safi kabisa
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;


app.post('/webhook', async (req, res) => {
    // AutoResponder inatuma meseji ya mtu kupitia req.body.query
    const userMessage = req.body.query;

    if (!userMessage) {
        return res.json({ replies: [{ text: "Mwanangu, sijaona ujumbe wowote hapa!" }] });
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
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const aiReply = data.candidates[0].content.parts[0].text;
            
            // Muundo rasmi wa JSON unaorudishwa kwa AutoResponder
            return res.json({
                replies: [
                    { text: aiReply }
                ]
            });
        } else {
            return res.json({ replies: [{ text: "Dah, kuna shida kidogo imetokea kwenye mfumo wa AI." }] });
        }

    } catch (error) {
        console.error("Error:", error);
        return res.json({ 
            replies: [{ text: "Dah mshkaji wangu, ubongo umepata hitilafu kidogo, nicheki baadae!" }] 
        });
    }
});

// Port itakayotumika kuwasha server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ya kinyamwezi ipo tayari kwenye port ${PORT}`));
