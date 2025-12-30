import fs from "fs";
import path from "path";
import formidable from "formidable";
import fetch from "node-fetch";

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  const form = formidable();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Errore upload audio" });
    }

    const audioFile = files.file[0];
    const filePath = audioFile.filepath;

    const audioData = fs.createReadStream(filePath);

    const whisperResponse = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: (() => {
          const fd = new FormData();
          fd.append("file", audioData);
          fd.append("model", "whisper-1");
          fd.append("language", "it");
          return fd;
        })()
      }
    );

    const result = await whisperResponse.json();

    res.status(200).json({ texto: result.text });
  });
}
