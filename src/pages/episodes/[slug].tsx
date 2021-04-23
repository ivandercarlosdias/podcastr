import { useRouter } from 'next/router'

export default function Episode() {
  const { query } = useRouter()
  return (
    <h1>{query.slug}</h1>
  )
}
