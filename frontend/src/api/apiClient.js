import axios from 'axios'
import { API_BASE } from './config.js'

const apiClient = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// İstek gönderilmeden önce JWT token'ı ekle ve FormData için Content-Type'ı sil
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bp_admin_token')
    if (token) config.headers['Authorization'] = `Bearer ${token}`
    
    // Eğer veri FormData ise, Content-Type'ı silip Axios'un boundary oluşturmasına izin ver
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    
    return config
  },
  (error) => Promise.reject(error)
)

// 401 hatalarında otomatik çıkış
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('bp_admin_token')
      localStorage.removeItem('bp_admin_user')
      window.location.href = '/admin/giris'
    }
    return Promise.reject(error)
  }
)

export default apiClient
