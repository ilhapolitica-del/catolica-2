import { GoogleGenAI, Type, Schema } from "@google/genai";
import { CatechismResult } from "../types";

const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

const responseSchema: Schema = {
  type: Type.ARRAY,
  description: "Lista de parágrafos do Catecismo da Igreja Católica encontrados.",
  items: {
    type: Type.OBJECT,
    properties: {
      number: {
        type: Type.INTEGER,
        description: "O número do parágrafo (apenas números).",
      },
      text: {
        type: Type.STRING,
        description: "O texto integral do parágrafo em Português do Brasil.",
      },
      topic: {
        type: Type.STRING,
        description: "Um tópico breve ou título para o contexto deste parágrafo.",
      },
      reference: {
        type: Type.STRING,
        description: "Referências bíblicas ou de concílios mencionadas no texto.",
      },
    },
    required: ["number", "text", "topic"],
  },
};

export const searchCatechism = async (query: string): Promise<CatechismResult[]> => {
  if (!apiKey) {
    throw new Error("API Key não configurada. Se você está na Vercel, adicione a variável de ambiente API_KEY.");
  }

  try {
    const modelId = "gemini-2.5-flash"; 
    
    const systemInstruction = `
      Você atua como o backend de busca do site 'catecismodaigreja.com.br'.
      Sua missão é recuperar parágrafos do Catecismo da Igreja Católica com extrema precisão.

      REGRAS DE DADOS:
      1. FONTE: Utilize exclusivamente o texto da tradução oficial da CNBB para o Catecismo (PT-BR).
      2. FIDELIDADE: O texto retornado deve ser idêntico ao impresso/site oficial. Não resuma.
      3. CONTEXTO: Se a busca for temática (ex: "Eucaristia"), retorne os parágrafos dogmáticos centrais.
      4. QUANTIDADE: Retorne entre 3 e 6 resultados mais relevantes.
      
      REGRAS DE FORMATO:
      - O campo 'number' deve ser apenas o número inteiro (ex: 144). Não inclua '§'.
      - O campo 'text' não deve conter o número do parágrafo no início.
    `;

    const userPrompt = `Busca do usuário: "${query}". Retorne os parágrafos correspondentes em formato JSON.`;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1, 
      },
    });

    // FIX: In the new SDK, .text is a property getter, not a function.
    let jsonText = response.text;
    
    if (!jsonText) {
      console.warn("Resposta vazia da API");
      return [];
    }

    // Limpeza robusta para garantir JSON válido
    jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      const parsedData = JSON.parse(jsonText) as CatechismResult[];
      return parsedData;
    } catch (parseError) {
      console.error("Erro ao fazer parse do JSON:", jsonText);
      throw new Error("Falha ao processar dados retornados pela IA.");
    }

  } catch (error: any) {
    console.error("Erro na busca do catecismo:", error);
    // Relançar erro com mensagem amigável se possível
    if (error.message && error.message.includes("API key")) {
       throw new Error("Chave de API inválida ou ausente.");
    }
    throw error;
  }
};