/**
 * Merkezi API/Upload URL yardımcıları.
 * 
 * Geliştirme (dev) ortamında VITE_API_URL boş bırakılır ve Vite proxy sayesinde
 * göreceli yollar (/api, /uploads) doğrudan çalışır.
 * 
 * Üretim (production) ortamında VITE_API_URL dolu olacağı için tüm istekler
 * doğrudan backend sunucusuna yönlendirilir.
 */

/** Backend kök URL'si. Dev'de boş string, prod'da tam URL. */
export const API_BASE = import.meta.env.VITE_API_URL || ''

/**
 * /uploads/ altındaki görsellere tam URL üretir.
 * @param {string} filename – Yüklenen dosyanın adı (örn. "img-123.jpg")
 * @returns {string} Tam URL (örn. "https://bonapipet-production.up.railway.app/uploads/img-123.jpg")
 */
export function uploadUrl(filename) {
  if (!filename) return '/images/resimyok.png'
  return `${API_BASE}/uploads/${filename}`
}
