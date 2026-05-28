import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import apiClient from '../api/apiClient.js'

const SUPPORTED_LANGS = ['tr', 'en', 'de', 'fr', 'ru', 'sp', 'ar']

const LangContext = createContext(null)

export const LangProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => {
    const saved = localStorage.getItem('bp_lang')
    if (saved && SUPPORTED_LANGS.includes(saved)) return saved
    const browser = navigator.language?.slice(0, 2)
    return SUPPORTED_LANGS.includes(browser) ? browser : 'tr'
  })
  const [t, setT] = useState({})
  const [loadingLang, setLoadingLang] = useState(true)

  const fetchTranslations = useCallback(async (l) => {
    setLoadingLang(true)
    try {
      const res = await apiClient.get(`/lang/${l}`)
      setT(res.data.data || {})
    } catch {
      // Hata durumunda boş obje
      setT({})
    } finally {
      setLoadingLang(false)
    }
  }, [])

  useEffect(() => {
    fetchTranslations(lang)
  }, [lang, fetchTranslations])

  const changeLang = useCallback((newLang) => {
    if (SUPPORTED_LANGS.includes(newLang)) {
      localStorage.setItem('bp_lang', newLang)
      setLangState(newLang)
    }
  }, [])

  return (
    <LangContext.Provider value={{ lang, t, loadingLang, changeLang, supportedLangs: SUPPORTED_LANGS }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LangProvider')
  return ctx
}
