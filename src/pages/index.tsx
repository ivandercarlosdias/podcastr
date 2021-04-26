import { GetStaticProps } from 'next'
import Link from 'next/link'
import { useContext } from 'react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { api } from '../services/api'
import { PlayerContext } from '../contexts/PlayerContext'
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString'

import styles from './home.module.scss'

type Episode = {
  id: string,
  title: string,
  thumbnail: string,
  members: string,
  publishedAt: string,
  duration: number,
  durationString: number,
  url: string
}

type HomeProps = {
  lastEpisodes: Episode[] // or Array<Episode>
  allEpisodes: Episode[]
}

export default function Home({ lastEpisodes, allEpisodes }: HomeProps) {
  const player = useContext(PlayerContext)

  return (
    <div className={styles.homePage}>
      <section className={styles.lastEpisodes}>
        <h2>Últimos Lançamentos {player}</h2>
        <ul>
          {lastEpisodes.map(episode => {
            return (
              <li key={episode.id}>
                <img src={episode.thumbnail} alt={episode.title} />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span><span>{episode.durationString}</span>
                </div>

                <button>
                  <img src="/play-green.svg" alt="Tocar episódio" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map(episode => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 80 }}>
                    <img src={episode.thumbnail} alt={episode.title} />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 120 }}>{episode.publishedAt}</td>
                  <td>{episode.durationString}</td>
                  <td>
                    <button>
                      <img src="/play-green.svg" alt="Tocar episódio" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 10,
      _sort: 'published_at',
      _order: 'desc',
    },
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yyy', {
        locale: ptBR,
      }),
      duration: Number(episode.file.duration),
      durationString: convertDurationToTimeString(
        Number(episode.file.duration)
      ),
      url: episode.file.url,
    }
  })

  const lastEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      lastEpisodes: lastEpisodes,
      allEpisodes: allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  }
}
