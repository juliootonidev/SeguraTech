import { createContext, useContext, useState, useEffect } from 'react'

const QuotesContext = createContext(null)

export function QuotesProvider({ children }) {
  const [quotes, setQuotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('seguratech_quotes') || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('seguratech_quotes', JSON.stringify(quotes))
  }, [quotes])

  const saveQuote = (quote) => {
    const newQuote = {
      ...quote,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setQuotes(prev => [newQuote, ...prev])
    return newQuote
  }

  const deleteQuote = (id) => {
    setQuotes(prev => prev.filter(q => q.id !== id))
  }

  return (
    <QuotesContext.Provider value={{ quotes, saveQuote, deleteQuote }}>
      {children}
    </QuotesContext.Provider>
  )
}

export const useQuotes = () => useContext(QuotesContext)
