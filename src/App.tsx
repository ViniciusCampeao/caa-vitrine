import { useEffect, useMemo, useState } from 'react'
import CardButton from './components/CardButton'
import { createDefaultCards } from './data/cards'
import { speak, ttsSupported } from './tts'
import type { Card } from './types'

type Settings = {
  holdToSpeak: boolean
  holdMs: number
  rate: number
  speakOnTap: boolean
}

const DEFAULT_SETTINGS: Settings = {
  holdToSpeak: false,
  holdMs: 500,
  rate: 1,
  speakOnTap: true,
}

const SETTINGS_KEY = 'caa-vitrine:settings'
const PAGE_SIZE = 12 // grade 4 x 3

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    /* localStorage pode falhar em janela privada — seguimos com o padrão */
  }
  return DEFAULT_SETTINGS
}

export default function App() {
  const root = useMemo(() => createDefaultCards(), [])
  const [path, setPath] = useState<Card[]>([]) // trilha de categorias abertas
  const [sentence, setSentence] = useState<Card[]>([])
  const [page, setPage] = useState(0)
  const [settings, setSettings] = useState<Settings>(loadSettings)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    } catch {
      /* ignore */
    }
  }, [settings])

  const current = path.length ? path[path.length - 1].children ?? [] : root
  const pageCount = Math.max(1, Math.ceil(current.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount - 1)
  const visible = current.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE)

  function textOf(card: Card) {
    return card.speak ?? card.display.toLowerCase()
  }

  function handleActivate(card: Card) {
    if (card.children?.length) {
      setPath((p) => [...p, card])
      setPage(0)
      if (settings.speakOnTap) speak(textOf(card), { rate: settings.rate })
      return
    }
    setSentence((s) => [...s, card])
    if (settings.speakOnTap) speak(textOf(card), { rate: settings.rate })
  }

  function speakSentence() {
    if (!sentence.length) return
    speak(sentence.map(textOf).join(' '), { rate: settings.rate })
  }

  function goBack() {
    setPath((p) => p.slice(0, -1))
    setPage(0)
  }

  function goHome() {
    setPath([])
    setPage(0)
  }

  return (
    <div className="app">
      {/* ---- barra de sentença ---- */}
      <div className="sentencebar">
        <div className="sentence" aria-live="polite" aria-label="Frase montada">
          {sentence.length === 0 ? (
            <span className="sentence__hint">Toque nos cartões para montar uma frase…</span>
          ) : (
            sentence.map((c, i) => (
              <span className="chip" key={`${c.id}-${i}`}>
                <span aria-hidden="true">{c.emoji}</span> {c.display}
              </span>
            ))
          )}
        </div>
        <div className="sentence__actions">
          <button type="button" className="act act--speak" onClick={speakSentence} aria-label="Falar a frase">
            🔊 Falar
          </button>
          <button
            type="button"
            className="act"
            onClick={() => setSentence((s) => s.slice(0, -1))}
            aria-label="Apagar último"
          >
            ⌫
          </button>
          <button type="button" className="act" onClick={() => setSentence([])} aria-label="Limpar frase">
            🗑️
          </button>
        </div>
      </div>

      {/* ---- barra de navegação ---- */}
      <div className="navbar">
        <div className="navbar__left">
          <button type="button" className="nav" onClick={goHome} aria-label="Início">
            🏠 <span className="nav__lbl">Início</span>
          </button>
          <button type="button" className="nav" onClick={goBack} disabled={path.length === 0} aria-label="Voltar">
            ← <span className="nav__lbl">Voltar</span>
          </button>
        </div>

        <div className="breadcrumb" aria-live="polite">
          {path.length ? path.map((c) => c.display).join(' › ') : 'PÁGINA INICIAL'}
        </div>

        <div className="navbar__right">
          {pageCount > 1 && (
            <div className="pager">
              <button
                type="button"
                className="nav"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={safePage === 0}
                aria-label="Página anterior"
              >
                ‹
              </button>
              <span className="pager__count">
                {safePage + 1}/{pageCount}
              </span>
              <button
                type="button"
                className="nav"
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                disabled={safePage === pageCount - 1}
                aria-label="Próxima página"
              >
                ›
              </button>
            </div>
          )}
          <button
            type="button"
            className="nav"
            onClick={() => setShowSettings((s) => !s)}
            aria-expanded={showSettings}
            aria-label="Ajustes"
          >
            ⚙️
          </button>
        </div>
      </div>

      {!ttsSupported() && (
        <p className="warn" role="status">
          Este navegador não tem síntese de voz. A navegação funciona, mas não há áudio.
        </p>
      )}

      {showSettings && (
        <section className="settings" aria-label="Ajustes">
          <label className="field">
            <input
              type="checkbox"
              checked={settings.speakOnTap}
              onChange={(e) => setSettings((s) => ({ ...s, speakOnTap: e.target.checked }))}
            />
            Falar ao tocar cada cartão
          </label>
          <label className="field">
            <input
              type="checkbox"
              checked={settings.holdToSpeak}
              onChange={(e) => setSettings((s) => ({ ...s, holdToSpeak: e.target.checked }))}
            />
            Exigir toque longo (evita toques acidentais)
          </label>
          <label className="field">
            Velocidade da voz: {settings.rate.toFixed(1)}×
            <input
              type="range"
              min={0.6}
              max={1.4}
              step={0.1}
              value={settings.rate}
              onChange={(e) => setSettings((s) => ({ ...s, rate: Number(e.target.value) }))}
            />
          </label>
        </section>
      )}

      {/* ---- grade de cartões ---- */}
      <main className="board">
        {visible.map((card) => (
          <CardButton
            key={card.id}
            card={card}
            onActivate={handleActivate}
            holdDurationMs={settings.holdToSpeak ? settings.holdMs : 0}
          />
        ))}
      </main>
    </div>
  )
}
