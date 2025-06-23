const { Ollama } = require('ollama');
const ollama = new Ollama();

const inputText = `
Estábamos hablando sobre cómo la inteligencia artificial puede mejorar la educación. Algunos mencionaron que los tutores virtuales podrían adaptarse a cada estudiante. Otros sugirieron que los algoritmos podrían ayudar a detectar a tiempo problemas de aprendizaje. También surgió el tema de cómo la IA puede crear contenidos educativos personalizados.
`;

async function test() {
  try {
    console.log("Analizando discusión con IA moderadora...\n");

    // 1) Palabras clave
    const keywordsPrompt = `
Extrae solo las palabras clave importantes del siguiente texto, separadas por comas, sin explicaciones ni frases adicionales:

${inputText}
`;
    const keywordsResponse = await ollama.chat({
      model: 'phi3:mini',
      messages: [{ role: 'user', content: keywordsPrompt }],
    });
    const keywords = keywordsResponse.message.content.trim();

    // 2) Resumen de ideas (una oración por idea)
    const summaryPrompt = `
Resume las ideas principales del siguiente texto. Usa una oración por idea, claras y directas:

${inputText}
`;
    const summaryResponse = await ollama.chat({
      model: 'phi3:mini',
      messages: [{ role: 'user', content: summaryPrompt }],
    });
    const summary = summaryResponse.message.content.trim();

    // 3) Sugerencia basada en el resumen
    const suggestionPrompt = `
Con base en el siguiente resumen de ideas, da una única sugerencia concreta y útil para continuar la discusión grupal:

${summary}
`;
    const suggestionResponse = await ollama.chat({
      model: 'phi3:mini',
      messages: [{ role: 'user', content: suggestionPrompt }],
    });
    const suggestion = suggestionResponse.message.content.trim();

    // Mostrar resultados
    console.log("🧠 Palabras clave:");
    console.log(keywords.split(',').map(k => `- ${k.trim()}`).join('\n'));

    console.log("\n📌 Resumen de ideas:");
    summary.split('\n').forEach((line, i) => {
      console.log(`${i + 1}. ${line.trim()}`);
    });

    console.log("\n💡 Sugerencia del moderador:");
    console.log(`👉 ${suggestion}`);

  } catch (error) {
    console.error("❌ Error durante el análisis:", error);
  }
}

test();
