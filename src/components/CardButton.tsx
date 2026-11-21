import { useRef } from 'react'
import type { Card } from '../types'

type Props = {
  card: Card
  /** Ativado ao clicar/soltar (ou, no modo toque longo, após segurar). */
  onActivate: (card: Card) => void
  /** Quando > 0, exige segurar o cartão por N ms antes de ativar. */
  holdDurationMs?: number
}

/**
 * Cartão de comunicação acessível (visual estilo prancha TD Snap).
 * - Clique, Enter ou Espaço ativam (teclado funciona de verdade).
 * - Modo "toque longo" opcional evita ativação acidental por toque de passagem.
 */
export default function CardButton({ card, onActivate, holdDurationMs = 0 }: Props) {
  const timerRef = useRef<number | null>(null)

  function clearTimer() {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  function startHold() {
    if (holdDurationMs <= 0) return
    timerRef.current = window.setTimeout(() => onActivate(card), holdDurationMs)
  }

  function handleClick() {
    if (holdDurationMs > 0) return // no modo toque-longo quem dispara é o timer
    onActivate(card)
  }

  const isFolder = !!card.children?.length

  return (
    <button
      type="button"
      className="card"
      aria-label={isFolder ? `${card.display}, categoria` : card.display}
      onClick={handleClick}
      onPointerDown={startHold}
      onPointerUp={clearTimer}
      onPointerLeave={clearTimer}
      onPointerCancel={clearTimer}
      style={{ ['--cor' as string]: card.color }}
    >
      {isFolder && (
        <span className="card__folder" aria-hidden="true" title="Abre mais opções">
          ⋯
        </span>
      )}
      <span className="card__emoji" aria-hidden="true">
        {card.emoji}
      </span>
      <span className="card__label">{card.display}</span>
    </button>
  )
}
