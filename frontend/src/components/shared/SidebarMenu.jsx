import { Link } from 'react-router-dom'
import styles from './SidebarMenu.module.css'

export default function SidebarMenu({ title, items, currentSeo, basePath }) {
  if (!items || !items.length) return null

  return (
    <aside className={styles.sidebar}>
      <div className={styles.widget}>
        <h3 className={styles.title}>{title}</h3>
        <ul className={styles.list}>
          {items.map(item => (
            <li key={item.id} className={currentSeo === item.seo ? styles.active : ''}>
              <Link to={`${basePath}/${item.seo}`}>{item.no}</Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
