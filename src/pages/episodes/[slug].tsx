import { useContext } from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { PlayerContext } from '../../contexts/PlayerContext'
import { api } from '../../services/api'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'

import styles from './episode.module.scss'

type Episode = {
    id: string,
    title: string,
    thumbnail: string,
    members: string,
    publishedAt: string,
    duration: number,
    durationString: number,
    url: string,
    description: string
}

type EpisodeProps = {
    episode: Episode
}

export default function Episode({ episode }: EpisodeProps) {
    const { query } = useRouter()

    const { play } = useContext(PlayerContext)

    return (
        <div className={styles.screenContent}>
            <div className={styles.episode}>
                <div className={styles.thumbnailContainer}>
                    <Link href="/">
                        <button>
                            <img src="/arrow-left.svg" alt="Voltar" />
                        </button>
                    </Link>
                    <img src={episode.thumbnail} alt="Thumbnail" />
                    <button onClick={() => play(episode)}>
                        <img src="/play.svg" alt="Tocar episódio" />
                    </button>
                </div>

                <header>
                    <h1>{episode.title}</h1>
                    <span>{episode.members}</span>
                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationString}</span>
                </header>

                <div className={styles.description} dangerouslySetInnerHTML={{ __html: episode.description }} />
            </div>
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async (context) => {
    const { slug } = context.params

    const { data } = await api.get(`/episodes/${slug}`)

    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yyy', {
            locale: ptBR,
        }),
        duration: Number(data.file.duration),
        durationString: convertDurationToTimeString(
            Number(data.file.duration)
        ),
        description: data.description,
        url: data.file.url,
    }

    return {
        props: {
            episode
        },
        revalidate: 60 * 60 * 24, // 24 hours
    }
}
