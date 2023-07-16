const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.chatWithAI = async (req, res) => {
    const { message } = req.body;

    try {
        const chatCompletion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {
            role: "system",
            content: "You are a helpful assistant that specializes in general knowledge and automobile repairs."
            },
            {
            role: "user",
            content: message
            }
        ]
        });
        const aiMessage = chatCompletion.data.choices[0].message.content;
        res.json({ aiMessage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error processing your message.' });
    }
};
  
