import styles from './PageTitle.module.css'

export default function PageTitle({ title }) {
  return (
    <section className={styles.pageTitle} style={{ backgroundImage: 'url(/images/page-title-bg.jpg)' }}>
      <div className={styles.overlay}></div>
      <div className="container">
        <h1>{title}</h1>
      </div>
    </section>
  )
}
