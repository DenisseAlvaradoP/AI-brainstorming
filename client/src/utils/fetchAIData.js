// src/api/fetchAI.js (o donde prefieras)
export async function fetchAIData(groupCode) {
  try {
    const response = await fetch(`/api/ai/analyze/${groupCode}`);
    if (!response.ok) {
      throw new Error("Error al obtener datos de IA");
    }
    const data = await response.json();
    return data; // { keywords, summary, suggestions }
  } catch (error) {
    console.error("Error al hacer fetch de IA:", error);
    throw error;
  }
}
