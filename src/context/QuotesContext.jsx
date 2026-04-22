import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const QUOTES_KEY = 'seguratech_quotes'
const EMISSIONS_KEY = 'seguratech_emissions'

const QuotesContext = createContext(null)

function generateProtocol(prefix) {
  const base = Date.now().toString(36).toUpperCase()
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `N9-${prefix}-${base}-${suffix}`
}

function withQuoteProtocol(quote) {
  return {
    ...quote,
    protocolId: quote.protocolId || generateProtocol('COT'),
  }
}

function withEmissionProtocol(emission) {
  return {
    ...emission,
    protocolId: emission.protocolId || generateProtocol('EMI'),
    subscriptionProtocolId: emission.subscriptionProtocolId || generateProtocol('SUB'),
  }
}

function readStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]')
  } catch {
    return []
  }
}

function createEmissionFromQuote(quote) {
  const now = new Date().toISOString()

  return withEmissionProtocol({
    id: `emission-${quote.id}`,
    quoteId: quote.id,
    createdAt: now,
    updatedAt: now,
    currentStage: 'dados_cliente',
    preAnalysisStatus: 'em_analise',
    statusLabel: 'Aguardando início',
    personalData: {
      ...quote.personalData,
      cep: quote.personalData?.cep || '',
      rua: quote.personalData?.rua || '',
      bairro: quote.personalData?.bairro || '',
      cidade: quote.personalData?.cidade || '',
      estado: quote.personalData?.estado || '',
    },
    vehicleData: { ...quote.vehicleData },
    coverages: { ...quote.coverages },
    inspectionImage: '',
    inspectionNotes: '',
    pendingReason: '',
    pendingItems: [],
  })
}

export function QuotesProvider({ children }) {
  const [quotes, setQuotes] = useState(() => readStorage(QUOTES_KEY).map(withQuoteProtocol))
  const [emissions, setEmissions] = useState(() => readStorage(EMISSIONS_KEY).map(withEmissionProtocol))

  useEffect(() => {
    localStorage.setItem(QUOTES_KEY, JSON.stringify(quotes))
  }, [quotes])

  useEffect(() => {
    localStorage.setItem(EMISSIONS_KEY, JSON.stringify(emissions))
  }, [emissions])

  const saveQuote = (quote) => {
    const now = new Date().toISOString()
    const newQuote = withQuoteProtocol({
      ...quote,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
      status: 'aguardando_cliente',
      customerConfirmedAt: null,
    })
    setQuotes((prev) => [newQuote, ...prev])
    return newQuote
  }

  const deleteQuote = (id) => {
    setQuotes((prev) => prev.filter((quote) => quote.id !== id))
    setEmissions((prev) => prev.filter((emission) => emission.quoteId !== id))
  }

  const confirmQuote = (id) => {
    let acceptedQuote = null

    setQuotes((prev) =>
      prev.map((quote) => {
        if (quote.id !== id) return quote

        acceptedQuote = {
          ...withQuoteProtocol(quote),
          ...quote,
          status: 'aceita',
          updatedAt: new Date().toISOString(),
          customerConfirmedAt: new Date().toISOString(),
        }

        return acceptedQuote
      })
    )

    setEmissions((prev) => {
      if (!acceptedQuote || prev.some((item) => item.quoteId === id)) return prev
      return [createEmissionFromQuote(acceptedQuote), ...prev]
    })

    return acceptedQuote
  }

  const updateEmission = (id, updater) => {
    setEmissions((prev) =>
      prev.map((emission) => {
        if (emission.id !== id) return emission
        const next = typeof updater === 'function' ? updater(emission) : { ...emission, ...updater }
        return { ...next, updatedAt: new Date().toISOString() }
      })
    )
  }

  const metrics = useMemo(() => {
    const acceptedQuotes = quotes.filter((quote) => quote.status === 'aceita').length
    const activeEmissions = emissions.filter((emission) => emission.currentStage !== 'finalizado').length
    const finishedEmissions = emissions.filter((emission) => emission.currentStage === 'finalizado').length

    return {
      acceptedQuotes,
      activeEmissions,
      finishedEmissions,
    }
  }, [quotes, emissions])

  return (
    <QuotesContext.Provider
      value={{
        quotes,
        emissions,
        saveQuote,
        deleteQuote,
        confirmQuote,
        updateEmission,
        metrics,
        generateProtocol,
      }}
    >
      {children}
    </QuotesContext.Provider>
  )
}

export const useQuotes = () => useContext(QuotesContext)
