import { useState, useEffect } from "react";
import { CurrencyData } from '../types';
import CurrencyCard from './CurrencyCard';

fetch("/app/controllers/api/currency_controller.rb")

export default function CurrencyDashboard() {
  const [currencyData, setCurrencyData] = useState<CurrencyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetch('/api/currency_data')
      .then(res => res.json())
      .then(data => {
        setCurrencyData(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="relative h-screen w-full">
      {/* 3D Canvas Background */}
      <Canvas>
        <Background3D />
        <OrbitControls />
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none p-8">
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
                  onClick={() => {/* handle click */}}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}