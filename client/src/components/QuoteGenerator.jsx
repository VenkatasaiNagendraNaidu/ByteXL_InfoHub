import { useEffect, useState } from "react";
import axios from "axios";
import { RefreshCw } from "lucide-react";

export default function QuoteGenerator() {
  const [quote, setQuote]   = useState(null);
  const [isLoading, setL]   = useState(false);
  const [error, setError]   = useState("");

  const load = async () => {
  setError("");
  setL(true);
  setQuote(null);
  try {
    const r = await axios.get("/api/quote", { params: { t: Date.now(), n: Math.random() } });
    if (!r.data?.quote) throw new Error("No quote data");
    setQuote(r.data);
  } catch {
    setError("Could not fetch a new quote. Try again.");
  } finally {
    setL(false);
  }
};


  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Motivational Quote</h2>

      {isLoading && <p className="text-slate-300">Loading new quote…</p>}
      {error && <p className="text-red-300">{error}</p>}

      {!isLoading && !error && quote && (
        <div className="card">
          <p className="text-lg leading-relaxed">“{quote.quote}”</p>
          <p className="text-sm text-slate-400 mt-2">— {quote.author}</p>
        </div>
      )}

      <button className="btn" onClick={load}><RefreshCw className="size-4" /> New Quote</button>
    </div>
  );
}
