import { useState } from "react";
import WeatherModule from "./components/WeatherModule.jsx";
import CurrencyConverter from "./components/CurrencyConverter.jsx";
import QuoteGenerator from "./components/QuoteGenerator.jsx";
import { CloudSun, BadgeIndianRupee, Quote, Sparkles } from "lucide-react";

const TABS = [
  { key: "Weather", icon: CloudSun },
  { key: "Converter", icon: BadgeIndianRupee },
  { key: "Quotes", icon: Quote },
];

export default function App() {
  const [active, setActive] = useState("Weather");

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight flex items-center gap-2">
          <Sparkles className="size-6 text-blue-400" />
          InfoHub
          <span className="chip ml-2 hidden sm:inline">SPA</span>
        </h1>
        <nav className="flex gap-2">
          {TABS.map(({ key, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`btn ${active === key ? "ring-2 ring-blue-500" : ""}`}
              aria-pressed={active === key}
            >
              <Icon className="size-4" /> {key}
            </button>
          ))}
        </nav>
      </header>

      <main className="grid gap-4">
        <section className="card">
          {active === "Weather" && <WeatherModule />}
          {active === "Converter" && <CurrencyConverter />}
          {active === "Quotes" && <QuoteGenerator />}
        </section>
        <p className="text-xs text-slate-400">No reloads. Graceful loading & errors. Mobile-first, glassmorphism UI.</p>
      </main>
    </div>
  );
}
