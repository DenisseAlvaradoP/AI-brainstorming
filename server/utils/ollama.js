import axios from "axios";

export async function analyzeGroupDiscussion(text) {
  try {
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "phi3:mini",
      prompt: `Lee el siguiente texto y devuelve únicamente un bloque Markdown con el JSON que contiene "keywords", "summary" y "suggestions". Ejemplo:

\`\`\`json
{
  "keywords": ["palabra1", "palabra2"],
  "summary": ["resumen 1", "resumen 2"],
  "suggestions": ["sugerencia 1", "sugerencia 2"]
}
\`\`\`

Texto:
${text}`,
      stream: false
    });

    const raw = response.data.response;

    // Extrae JSON de un bloque Markdown
    const match = raw.match(/```json\s*([\s\S]*?)\s*```/);
    if (!match) throw new Error("No se pudo extraer JSON");

    const jsonText = match[1];
    console.log("JSON recibido crudo:", jsonText);

    try {
      return JSON.parse(jsonText);
    } catch (e) {
      console.error("❌ Error al parsear JSON generado:", e.message);
      console.log("🔍 Texto recibido que falló:", jsonText);
      return { keywords: [], summary: [], suggestions: [] };
    }
  } catch (error) {
    console.error("Error en analyzeGroupDiscussion:", error.message);
    return { error: "Error analyzing AI" };
  }
}
