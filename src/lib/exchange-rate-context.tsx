'use client';

import { createContext, useContext } from 'react';

const ExchangeRateContext = createContext<number>(56.0);

export function ExchangeRateProvider({ rate, children }: { rate: number, children: React.ReactNode }) {
  return (
    <ExchangeRateContext.Provider value={rate}>
      {children}
    </ExchangeRateContext.Provider>
  );
}

export function useExchangeRate() {
  return useContext(ExchangeRateContext);
}
