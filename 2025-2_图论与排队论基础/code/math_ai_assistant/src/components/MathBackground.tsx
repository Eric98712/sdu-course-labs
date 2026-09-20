import { useMemo } from 'react';

const symbols = ['∑', '∫', 'π', '∞', '√', 'Δ', 'θ', 'φ', '∂', 'λ', 'σ', 'ω', 'α', 'β', 'γ', 'δ', 'ε', 'μ', '∏', '∐'];

interface MathSymbol {
  symbol: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  rotation: number;
}

export default function MathBackground() {
  const particles = useMemo(() => {
    const items: MathSymbol[] = [];
    for (let i = 0; i < 50; i++) {
      items.push({
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 14 + Math.random() * 20,
        opacity: 0.03 + Math.random() * 0.04,
        rotation: Math.random() * 360,
      });
    }
    return items;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute select-none font-serif"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            transform: `rotate(${p.rotation}deg)`,
            color: '#f0c060',
          }}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
}
