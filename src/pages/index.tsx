import { GetStaticProps } from 'next'
import { api } from '../services/api'

type Episode = {
  id: string,
  title: string,
  members: string,
  // ...
}

type HomeProps = {
  episodes: Episode[] // or Array<Episode>
}

export default function Home(props: HomeProps) {
  return (
    <div>
      <h1>Index</h1>

      <p>{JSON.stringify(props.episodes)}</p>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })
  const data = response.data;

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8
  }
}