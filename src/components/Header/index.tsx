import styles from './styles.module.scss'

export default function Header() {
  const currentDate = new Date().toLocaleDateString('pt-Br', {
    dateStyle: 'full'
  });

  return(
    <header className={styles.header}>
      <img src="/logo.svg" alt="Podcastr"/>
      <p>O melhor para você ouvir, sempre!</p>
      <span>{currentDate}</span>
    </header>
  )
}