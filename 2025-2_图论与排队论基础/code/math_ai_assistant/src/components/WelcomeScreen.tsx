import { BookOpen, Brain, Calculator, FunctionSquare, Infinity, Sigma } from 'lucide-react';

const examples = [
  { icon: <Calculator size={20} />, text: '求极限 lim(x→0) (sin x)/x' },
  { icon: <FunctionSquare size={20} />, text: '计算定积分 ∫₀¹ x² dx' },
  { icon: <Infinity size={20} />, text: '证明：√2 是无理数' },
  { icon: <Sigma size={20} />, text: '求解线性方程组' },
  { icon: <Brain size={20} />, text: '求函数 f(x)=x³-3x 的极值' },
  { icon: <BookOpen size={20} />, text: '用ε-δ语言证明极限' },
];

interface WelcomeScreenProps {
  onSelectExample: (text: string) => void;
}

export default function WelcomeScreen({ onSelectExample }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 animate-fade-in">
      <div className="text-center mb-10">
        <div className="text-6xl mb-4 font-serif text-math-gold">∫</div>
        <h1 className="text-3xl font-bold text-math-text font-serif mb-2">
          数学考研助手
        </h1>
        <p className="text-math-text-muted text-sm max-w-md mx-auto leading-relaxed">
          基于 AI 的数学解题助手，支持文字输入与图片识别。
          <br />
          输入你的数学问题，开始学习之旅。
        </p>
      </div>

      <div className="w-full max-w-lg">
        <p className="text-xs text-math-text-muted text-center mb-3 uppercase tracking-widest">
          — 试试这些例题 —
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {examples.map((ex, i) => (
            <button
              key={i}
              onClick={() => onSelectExample(ex.text)}
              className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-math-card border border-white/5
                         hover:border-math-gold/40 hover:bg-white/[0.06] transition-all duration-200
                         text-left group"
            >
              <span className="text-math-gold/70 group-hover:text-math-gold transition-colors shrink-0">
                {ex.icon}
              </span>
              <span className="text-sm text-math-text-muted group-hover:text-math-text transition-colors leading-snug">
                {ex.text}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 text-xs text-math-text-muted/50 text-center">
        <span className="font-serif text-math-gold/30">∼ </span>
        支持文字 &amp; 图片输入
        <span className="font-serif text-math-gold/30"> ∼</span>
      </div>
    </div>
  );
}
