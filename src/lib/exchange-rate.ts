export async function getExchangeRate(currency: string = 'PHP') {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      next: { revalidate: 86400 } // cache for 24 hours
    });
    const data = await res.json();
    return data.rates?.[currency] || 56.0;
  } catch (error) {
    console.error('Failed to fetch exchange rate:', error);
    return 56.0; // fallback rate
  }
}
