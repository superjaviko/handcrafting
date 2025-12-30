import OpenAI from "openai";

export const config = {
  api: {
    bodyParser: false
  }
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  try {
    const buffer = Buffer.from(await req.arrayBuffer());

    const file = new File([buffer], "audio", {
      type: req.headers["content-type"] || "audio/mpeg"
    });

    const transcription = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
      language: "it"
    });

    res.status(200).json({ texto: transcription.text });
  } catch (error) {
    console.error("Errore Whisper:", error);
    res.status(500).json({ error: "Errore trascrizione audio" });
  }
}
