/**
 * ElevenLabs Text-to-Speech Integration
 * Converts text to speech using ElevenLabs API
 */

const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
const VOICE_ID = 'g5CIjZEefAph4nQFvHAz'; // Josh - young, enthusiastic male voice perfect for educational content

export interface TextToSpeechRequest {
  text: string;
  voice_id?: string;
  model_id?: string;
}

/**
 * Convert text to speech using ElevenLabs API
 * Returns audio data as ArrayBuffer
 */
export async function textToSpeech(text: string, voiceId?: string): Promise<ArrayBuffer> {
  if (!ELEVENLABS_API_KEY) {
    throw new Error('ELEVENLABS_API_KEY environment variable is not set');
  }

  const voice = voiceId || VOICE_ID;
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voice}`;

  console.log(`🎤 ElevenLabs TTS request for text: "${text.substring(0, 50)}..." with voice: ${voice}`);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': ELEVENLABS_API_KEY,
    },
    body: JSON.stringify({
      text: text,
      model_id: 'eleven_turbo_v2_5', // Updated to newer model available on free tier
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ ElevenLabs API error: ${response.status} - ${errorText}`);
    throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
  }

  const audioData = await response.arrayBuffer();
  console.log(`✅ ElevenLabs TTS successful, audio size: ${audioData.byteLength} bytes`);
  
  return audioData;
}

/**
 * Get list of available voices from ElevenLabs
 */
export async function getVoices() {
  if (!ELEVENLABS_API_KEY) {
    throw new Error('ELEVENLABS_API_KEY environment variable is not set');
  }

  const response = await fetch('https://api.elevenlabs.io/v1/voices', {
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ ElevenLabs voices API error: ${response.status} - ${errorText}`);
    throw new Error(`ElevenLabs voices API error: ${response.status}`);
  }

  return await response.json();
}