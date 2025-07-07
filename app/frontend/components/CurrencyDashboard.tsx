import * as THREE from 'three';
import { useState, useEffect } from "react";
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Moon, Sun, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CurrencyData } from '@/types';
import Bitcoin3D from './threejs/Bitcoin3D';
import CurrencySymbol3D from './threejs/CurrencySymbol3D';
import Background3D from './threejs/Background3D';

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