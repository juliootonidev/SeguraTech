import { useState } from 'react'

export function useViaCep() {
  const [loading, setLoading] = useState(false)

  async function fetchCep(cep) {
    const sanitized = cep.replace(/\D/g, '')
    if (sanitized.length !== 8) return null

    try {
      setLoading(true)
      const response = await fetch(`https://viacep.com.br/ws/${sanitized}/json/`)
      const data = await response.json()
      if (data.erro) return null
      return data
    } catch {
      return null
    } finally {
      setLoading(false)
    }
  }

  return { loading, fetchCep }
}
