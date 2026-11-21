// Text-to-speech usando a Web Speech API nativa do navegador (SpeechSynthesis).
// 100% local, sem chamadas de rede e sem enviar áudio a nenhum serviço externo.

export function ttsSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

/** Lista as vozes em português disponíveis no dispositivo. */
export function listPtVoices(): SpeechSynthesisVoice[] {
  if (!ttsSupported()) return []
  return window.speechSynthesis
    .getVoices()
    .filter((v) => v.lang?.toLowerCase().startsWith('pt'))
}

/**
 * Fala um texto. Cancela qualquer fala em andamento para evitar fila acumulada
 * quando a criança toca em vários cartões em sequência.
 */
export function speak(text: string, opts: { voiceURI?: string; rate?: number; pitch?: number } = {}): void {
  const trimmed = text.trim()
  if (!trimmed || !ttsSupported()) return

  const synth = window.speechSynthesis
  const utter = new SpeechSynthesisUtterance(trimmed)
  utter.lang = 'pt-BR'
  utter.rate = clamp(opts.rate ?? 1, 0.5, 1.5)
  utter.pitch = clamp(opts.pitch ?? 1, 0, 2)

  if (opts.voiceURI) {
    const voice = synth.getVoices().find((v) => v.voiceURI === opts.voiceURI)
    if (voice) utter.voice = voice
  } else {
    const pt = listPtVoices()[0]
    if (pt) utter.voice = pt
  }

  synth.cancel()
  synth.speak(utter)
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}
