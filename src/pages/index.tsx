import Link from 'next/link'
import { GetStaticProps } from 'next'
import { api } from '../services/api'

import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
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
  description: string,
  url: string
}

type HomeProps = {
  lastEpisodes: Episode[] // or Array<Episode>
  allEpisodes: Episode[] // or Array<Episode>
}

export default function Home({ lastEpisodes, allEpisodes }: HomeProps) {
  return (
    <div className={styles.homePage}>
      <section className={styles.lastEpisodes}>
        <h2>Últimos Lançamentos</h2>
        <ul>
          {lastEpisodes.map(item => {
            return (
              <li key={item.id}>
                <img src={item.thumbnail} alt={item.title} />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${item.id}`}>
                    <a>{item.title}</a>
                  </Link>
                  <p>{item.members}</p>
                  <span>{item.publishedAt}</span> • <span>{item.durationString}</span>
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
            {allEpisodes.map(item => {
              return (
                <tr key={item.id}>
                  <td style={{ width: 80 }}>
                    <img src={item.thumbnail} alt={item.title} />
                  </td>
                  <td>
                    <Link href={`/episodes/${item.id}`}>
                      <a>{item.title}</a>
                    </Link>
                  </td>
                  <td>{item.members}</td>
                  <td style={{ width: 120 }}>{item.publishedAt}</td>
                  <td>{item.durationString}</td>
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
      description: episode.description,
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
