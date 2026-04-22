const COVERAGE_PRICES = {
  rouboFurto: 0.004,
  colisao: 0.005,
  perdaTotal: 0.003,
  terceiros: 0.003,
  carroReserva: 0.002,
  assistencia24h: 0.001,
  vidros: 0.002,
  enchente: 0.002,
}

const COVERAGE_LABELS = {
  rouboFurto: 'Roubo e Furto',
  colisao: 'Colisão',
  perdaTotal: 'Perda Total',
  terceiros: 'Terceiros',
  carroReserva: 'Carro Reserva',
  assistencia24h: 'Assistência 24h',
  vidros: 'Vidros',
  enchente: 'Enchente',
}

const PROTECTION_MULTIPLIER = {
  70: 0.85,
  80: 0.92,
  90: 1.0,
  100: 1.1,
}

export function useQuoteCalculator() {
  const calculate = (vehicleValue, coverages, protectionPercent) => {
    const value = parseFloat(vehicleValue?.replace(/\D/g, '') || 0) / 100

    if (!value) return { monthly: 0, annual: 0, breakdown: [] }

    const base = value * 0.03
    let coverageTotal = 0
    const breakdown = []

    Object.entries(coverages).forEach(([key, enabled]) => {
      if (enabled && COVERAGE_PRICES[key]) {
        const amount = value * COVERAGE_PRICES[key]
        coverageTotal += amount
        breakdown.push({ label: COVERAGE_LABELS[key], value: amount })
      }
    })

    const subtotal = base + coverageTotal
    const multiplier = PROTECTION_MULTIPLIER[protectionPercent] || 1
    const annual = subtotal * multiplier * 12
    const monthly = annual / 12

    return {
      monthly,
      annual,
      base,
      coverageTotal,
      breakdown,
      multiplier,
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const parseCurrencyInput = (value) => {
    const numbers = value.replace(/\D/g, '')
    if (!numbers) return ''
    const amount = parseInt(numbers, 10) / 100
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount)
  }

  return { calculate, formatCurrency, parseCurrencyInput, COVERAGE_LABELS }
}
