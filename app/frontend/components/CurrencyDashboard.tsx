import { useState, useEffect } from "react";
import { CurrencyData } from '../types';
import CurrencyCard from './CurrencyCard';

export default function CurrencyDashboard() {
  const [currencyData, setCurrencyData] = useState<CurrencyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetch('/api/currency')
      .then(res => res.json())
      .then(data => {
        setCurrencyData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, []);

  return (
    <div className="relative h-screen w-full">
      <div className="absolute inset-0 p-8">
        <div className="container mx-auto">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currencyData.map((currency) => (
                <CurrencyCard 
                  key={currency.name}
                  currency={currency}
                  isDark={darkMode}
                  onClick={() => {}}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}