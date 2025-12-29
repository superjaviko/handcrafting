export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { pregunta, contenido } = req.body;

    const prompt = `
Eres un narrador cultural especializado en artesanía tradicional.
Respondes usando únicamente la información proporcionada.
Puedes explicar historia, significado, proceso y materiales del objeto.
No inventes información.
Si algo no está en los datos, indícalo claramente.

INFORMACIÓN DEL OBJETO:
${contenido}

PREGUNTA DEL USUARIO:
${pregunta}
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.3
      })
    });

    const data = await response.json();

    res.status(200).json({
      respuesta: data.choices[0].message.content
    });

  } catch (error) {
    res.status(500).json({
      error: "Error interno",
      detalle: error.message
    });
  }
}
