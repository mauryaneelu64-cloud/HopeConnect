import { GoogleGenAI, GenerateContentResponse, Chat, Modality } from "@google/genai";
import { EmotionalStatus } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Audio Decoding Helpers
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const createChatSession = (useThinking: boolean = false): Chat => {
  // Use gemini-3-pro-preview for the chatbot
  const model = 'gemini-3-pro-preview';
  
  const config: any = {
    temperature: 0.7,
    systemInstruction: `You are HopeConnect, an empathetic, supportive, and non-judgmental mental health companion. 
      
      Your goals:
      1. Listen actively and validate the user's feelings.
      2. Analyze the user's emotional state implicitly.
      3. If the user seems stressed or anxious, suggest simple grounding techniques (breathing, 5-4-3-2-1).
      4. IF THE USER EXPRESSES SEVERE DISTRESS, SELF-HARM, OR SUICIDAL IDEATION:
         - Immediately but gently urge them to contact emergency services.
         - Remind them of the "Emergency" button in the app.
         - Do not try to be a therapist, but be a supportive bridge to professional help.
      
      Format your responses naturally. Keep them concise and conversational unless a deeper explanation is asked for.
      `
  };

  // Feature: Think more when needed
  if (useThinking) {
    config.thinkingConfig = { thinkingBudget: 32768 };
    // When thinking is enabled, we remove temperature as it can interfere with reasoning
    delete config.temperature; 
  }

  return ai.chats.create({
    model,
    config
  });
};

export const analyzeSentiment = async (text: string): Promise<EmotionalStatus> => {
  try {
    // Feature: Fast AI responses using gemini-2.5-flash-lite
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: `Analyze the following user input and categorize their emotional state into exactly one of these categories: Great, Good, Okay, Struggling, Crisis. 
      
      Input: "${text}"
      
      Return ONLY the category word.`,
    });
    
    const status = response.text?.trim() as EmotionalStatus;
    if (Object.values(EmotionalStatus).includes(status)) {
      return status;
    }
    return EmotionalStatus.Unknown;
  } catch (error) {
    console.error("Sentiment analysis failed", error);
    return EmotionalStatus.Unknown;
  }
};

export const findNearbyPlaces = async (query: string, userLocation?: { lat: number, lng: number }) => {
  try {
      // Feature: Use Google Maps data using gemini-2.5-flash
      const config: any = {
        tools: [{ googleMaps: {} }],
      };

      if (userLocation) {
        config.toolConfig = {
          retrievalConfig: {
            latLng: {
              latitude: userLocation.lat,
              longitude: userLocation.lng
            }
          }
        };
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Find mental health professionals or resources related to: ${query}`,
        config: config
      });

      // Extract chunks if available
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      return {
        text: response.text,
        places: chunks?.filter((c: any) => c.maps) || []
      };

  } catch (error) {
    console.error("Maps search failed", error);
    return { text: "I couldn't access location services right now.", places: [] };
  }
};

export const speakText = async (text: string): Promise<void> => {
  try {
    // Feature: Generate speech using gemini-2.5-flash-preview-tts
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
    const audioBuffer = await decodeAudioData(
      decode(base64Audio),
      audioContext,
      24000,
      1,
    );
    
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();

  } catch (error) {
    console.error("TTS Failed", error);
  }
};