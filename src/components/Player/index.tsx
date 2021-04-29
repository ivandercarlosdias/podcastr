import { useContext, useRef, useEffect } from 'react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import { PlayerContext } from '../../contexts/PlayerContext'

import styles from './styles.module.scss'

export default function Player() {
    const audioRef = useRef<HTMLAudioElement>(null)

    const { episodeList, currentEpisodeIndex, isPlaying, tooglePlay, setPlayingState } = useContext(PlayerContext)

    useEffect(() => {
        if (!audioRef.current)
            return

        if (isPlaying) {
            audioRef.current.play()
        } else {
            audioRef.current.pause()
        }

    }, [isPlaying])

    const episode = episodeList[currentEpisodeIndex]

    return (
        <div className={styles.container}>
            <header>
                <img src="/playing.svg" alt="Tocando agora" />
                <strong>Tocando agora</strong>
            </header>

            { episode ? (
                <div className={styles.currentEpisode}>
                    <img src={episode.thumbnail} alt={episode.title} />
                    <strong>{episode.title}</strong>
                    <p>{episode.members}</p>
                    <audio src={episode.url} ref={audioRef} autoPlay onPlay={() => setPlayingState(true)} onPause={() => setPlayingState(false)} />
                </div>
            ) : (
                <section className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </section>
            )}

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>00:00</span>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                trackStyle={{ backgroundColor: '#04d361' }}
                                railStyle={{ backgroundColor: '#9f75ff' }}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 3 }}
                            ></Slider>
                        ) : (
                            <div className={styles.emptySlider} />
                        )}
                    </div>
                    <span>00:00</span>
                </div>

                <div className={styles.buttons}>
                    <button disabled={!episode}><img src="/shuffle.svg" alt="Embaralhar" /></button>
                    <button disabled={!episode}><img src="/play-previous.svg" alt="Tocar anterior" /></button>
                    <button disabled={!episode} className={styles.play} onClick={tooglePlay}>
                        {isPlaying ? (
                            <img src="/pause.svg" alt="Tocar" />
                        ) : (
                            <img src="/play.svg" alt="Tocar" />
                        )}
                    </button>
                    <button disabled={!episode}><img src="/play-next.svg" alt="Tocar próximo" /></button>
                    <button disabled={!episode}><img src="/repeat.svg" alt="Repetir" /></button>
                </div>
            </footer>
        </div>
    )
}