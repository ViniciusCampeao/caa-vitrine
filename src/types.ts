// Modelo de um cartão da prancha de comunicação.
// Um cartão pode ter filhos, formando uma pasta/categoria navegável.
export type Card = {
  id: string
  /** Rótulo exibido no cartão (ex.: "COMER"). */
  display: string
  /** Texto efetivamente falado (ex.: "comer"). Default = display. */
  speak?: string
  /** Pictograma. Usamos emoji para manter a demo livre de licenças de imagem. */
  emoji: string
  /** Cor da borda/categoria do cartão. */
  color: string
  /** Sub-cartões, caso este cartão seja uma categoria. */
  children?: Card[]
}
