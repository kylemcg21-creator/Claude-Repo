import { useState, useEffect } from 'react';

interface PortfolioItem {
  id: string;
  name: string;
  value: number;
  allocation: number;
  change: number;
  className?: string;
}

interface ChartPoint {
  month: string;
  value: number;
}

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());

  const portfolioItems: PortfolioItem[] = [
    { id: '1', name: 'Equities', value: 2840000, allocation: 52, change: 8.2 },
    { id: '2', name: 'Fixed Income', value: 1680000, allocation: 31, change: 1.4 },
    { id: '3', name: 'Alternatives', value: 680000, allocation: 13, change: 12.6 },
    { id: '4', name: 'Real Estate', value: 420000, allocation: 8, change: 3.1 },
  ];

  const chartData: ChartPoint[] = [
    { month: 'Jan', value: 4200000 },
    { month: 'Feb', value: 4380000 },
    { month: 'Mar', value: 4520000 },
    { month: 'Apr', value: 4680000 },
    { month: 'May', value: 4920000 },
    { month: 'Jun', value: 5220000 },
    { month: 'Jul', value: 5620000 },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleCards((prev) => new Set([...prev, entry.target.id]));
        }
      });
    });

    document.querySelectorAll('[data-card]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const bgColor = theme === 'dark' ? 'bg-slate-950' : 'bg-amber-50';
  const textColor = theme === 'dark' ? 'text-slate-50' : 'text-slate-900';
  const cardBg = theme === 'dark' ? 'bg-slate-900' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-slate-800' : 'border-amber-100';

  return (
    <div className={`min-h-screen transition-colors duration-700 ${bgColor} ${textColor}`}>
      {/* Navigation */}
      <nav className={`sticky top-0 z-40 mt-6 mx-auto w-max rounded-full ${cardBg} border ${borderColor} px-8 py-3 shadow-lg backdrop-blur-xl`}>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-600 to-amber-800"></div>
            <span className="font-serif text-lg font-semibold">Meridian</span>
          </div>
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="text-sm px-4 py-2 rounded-full bg-amber-100 dark:bg-slate-800 hover:bg-amber-200 dark:hover:bg-slate-700 transition-colors duration-300"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </nav>

      <main className="w-full overflow-x-hidden">
        {/* Hero Section */}
        <section className="py-32 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <p className="text-amber-600 dark:text-amber-400 text-sm uppercase tracking-widest font-medium mb-4">Your Wealth</p>
              <h1 className="font-serif text-6xl md:text-7xl font-bold mb-4 leading-tight max-w-4xl">
                Navigate Your <span className="bg-gradient-to-r from-amber-600 to-amber-700 dark:from-amber-400 dark:to-amber-500 bg-clip-text text-transparent">Financial Path</span>
              </h1>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <div className={`${cardBg} border ${borderColor} rounded-3xl p-8 backdrop-blur-sm`} style={{ animation: 'fadeUp 0.8s ease-out' }}>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Total Assets</p>
                <p className="font-serif text-4xl font-bold">$5.62M</p>
                <p className="text-green-600 dark:text-green-400 text-sm mt-2">+9.2% YTD</p>
              </div>

              <div className={`${cardBg} border ${borderColor} rounded-3xl p-8 backdrop-blur-sm`} style={{ animation: 'fadeUp 0.8s ease-out 0.1s both' }}>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Monthly Return</p>
                <p className="font-serif text-4xl font-bold">+$287K</p>
                <p className="text-blue-600 dark:text-blue-400 text-sm mt-2">↑ 8.7% month-over-month</p>
              </div>

              <div className={`${cardBg} border ${borderColor} rounded-3xl p-8 backdrop-blur-sm`} style={{ animation: 'fadeUp 0.8s ease-out 0.2s both' }}>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Risk Score</p>
                <p className="font-serif text-4xl font-bold">Moderate</p>
                <p className="text-orange-600 dark:text-orange-400 text-sm mt-2">Well-balanced portfolio</p>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="py-32 px-6 md:px-12 bg-gradient-to-b from-transparent to-amber-50 dark:to-slate-900/50">
          <div className="max-w-6xl mx-auto">
            <p className="text-amber-600 dark:text-amber-400 text-sm uppercase tracking-widest font-medium mb-4">Asset Allocation</p>
            <h2 className="font-serif text-5xl font-bold mb-16">Portfolio Composition</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolioItems.map((item, idx) => (
                <div
                  key={item.id}
                  id={`card-${item.id}`}
                  data-card
                  className={`${cardBg} border ${borderColor} rounded-3xl p-8 backdrop-blur-sm transition-all duration-700 ${
                    visibleCards.has(`card-${item.id}`) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  } hover:shadow-xl hover:scale-[1.02] cursor-pointer group`}
                  style={{ transitionDelay: `${idx * 100}ms` }}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Asset Class</p>
                      <p className="font-serif text-2xl font-bold">{item.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Allocation</p>
                      <p className="font-bold text-xl">{item.allocation}%</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-400 dark:to-amber-500 rounded-full transition-all duration-1000`}
                        style={{
                          width: visibleCards.has(`card-${item.id}`) ? `${item.allocation}%` : '0%',
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Value</p>
                      <p className="font-serif font-bold">${(item.value / 1000000).toFixed(2)}M</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${item.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {item.change >= 0 ? '+' : ''}{item.change}%
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">12M return</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Performance Chart */}
        <section className="py-32 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <p className="text-amber-600 dark:text-amber-400 text-sm uppercase tracking-widest font-medium mb-4">Performance</p>
            <h2 className="font-serif text-5xl font-bold mb-16">Growth Trajectory</h2>

            <div className={`${cardBg} border ${borderColor} rounded-3xl p-12 backdrop-blur-sm`}>
              <div className="h-64 flex items-end justify-between gap-4">
                {chartData.map((point, idx) => {
                  const maxValue = Math.max(...chartData.map((p) => p.value));
                  const height = (point.value / maxValue) * 100;

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                      <div
                        className="w-full bg-gradient-to-t from-amber-500 to-amber-400 dark:from-amber-400 dark:to-amber-300 rounded-t-lg transition-all duration-500 hover:shadow-lg hover:brightness-110"
                        style={{ height: `${height}%` }}
                      ></div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{point.month}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        ${(point.value / 1000000).toFixed(2)}M
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="py-24 px-6 md:px-12 border-t border-amber-100 dark:border-slate-800">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-600 to-amber-800"></div>
                  <span className="font-serif text-lg font-semibold">Meridian</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
                  Navigate your financial future with precision and confidence. Premium wealth management for discerning investors.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-12">
                <div>
                  <p className="font-medium mb-4">Product</p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li><a href="#" className="hover:text-amber-600 dark:hover:text-amber-400 transition">Dashboard</a></li>
                    <li><a href="#" className="hover:text-amber-600 dark:hover:text-amber-400 transition">Analytics</a></li>
                    <li><a href="#" className="hover:text-amber-600 dark:hover:text-amber-400 transition">Reports</a></li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-4">Company</p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li><a href="#" className="hover:text-amber-600 dark:hover:text-amber-400 transition">About</a></li>
                    <li><a href="#" className="hover:text-amber-600 dark:hover:text-amber-400 transition">Blog</a></li>
                    <li><a href="#" className="hover:text-amber-600 dark:hover:text-amber-400 transition">Contact</a></li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-4">Legal</p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li><a href="#" className="hover:text-amber-600 dark:hover:text-amber-400 transition">Privacy</a></li>
                    <li><a href="#" className="hover:text-amber-600 dark:hover:text-amber-400 transition">Terms</a></li>
                    <li><a href="#" className="hover:text-amber-600 dark:hover:text-amber-400 transition">Security</a></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border-t border-amber-100 dark:border-slate-800 pt-8 text-center text-sm text-gray-600 dark:text-gray-400">
              <p>© 2024 Meridian. All rights reserved.</p>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px) blur(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0) blur(0);
          }
        }
      `}</style>
    </div>
  );
}
