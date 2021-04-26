import { useContext } from 'react'

import { PlayerContext } from '../../contexts/PlayerContext'

import styles from './styles.module.scss'

export default function Player() {
  const player = useContext(PlayerContext)

  return (
    <div className={styles.container}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora {player}</strong>
      </header>

      <section className={styles.emptyPlayer}>
        <strong>Selecione um podcast para ouvir</strong>
      </section>

      <footer className={styles.empty}>
        <div className={styles.progress}>
          <span>00:00</span>
          <div className={styles.slider}>
            <div className={styles.emptySlider} />
          </div>
          <span>00:00</span>
        </div>

        <div className={styles.buttons}>
          <button><img src="/shuffle.svg" alt="Embaralhar" /></button>
          <button><img src="/play-previous.svg" alt="Tocar anterior" /></button>
          <button className={styles.play}><img src="/play.svg" alt="Tocar" /></button>
          <button><img src="/play-next.svg" alt="Tocar próximo" /></button>
          <button><img src="/repeat.svg" alt="Repetir" /></button>
        </div>
      </footer>
    </div>
  )
}