import { useState } from "react";
import axios from "axios";
import { ArrowRightLeft } from "lucide-react";

const CURRENCIES = ["INR","USD","EUR","GBP","JPY","AUD","CAD","CNY"];

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState("INR");
  const [to, setTo] = useState("USD");
  const [data, setData] = useState(null);
  const [isLoading, setLoad] = useState(false);
  const [error, setError] = useState("");

  const swap = () => { setFrom(to); setTo(from); setData(null); };

  const convert = async () => {
    setError(""); setData(null); setLoad(true);
    try {
      const n = Number(amount);
      if (!n || n <= 0) throw new Error("Enter a valid amount");
      const r = await axios.get("/api/currency", { params: { amount: n, from, to } });
      setData(r.data);
    } catch (e) {
      setError(e?.response?.data?.error || e.message || "Conversion failed.");
    } finally { setLoad(false); }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Currency Converter</h2>

      {/* Amount */}
      <input
        className="input"
        value={amount}
        onChange={e=>setAmount(e.target.value)}
        placeholder="Enter amount"
        inputMode="decimal"
      />

      {/* From | Swap | To */}
      <div className="conv-row items-center">
        <div className="select-wrap">
          <select className="select" value={from} onChange={e=>setFrom(e.target.value)}>
            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <span className="select-chevron" />
        </div>

        <button className="icon-btn" onClick={swap} aria-label="Swap">
          <ArrowRightLeft className="size-5" />
        </button>

        <div className="select-wrap">
          <select className="select" value={to} onChange={e=>setTo(e.target.value)}>
            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <span className="select-chevron" />
        </div>
      </div>

      {/* Convert */}
      <button className="btn w-full sm:w-auto" onClick={convert}>Convert</button>

      {/* States */}
      {isLoading && <p className="text-slate-300">Converting…</p>}
      {error && <p className="text-red-300">{error}</p>}

      {!isLoading && !error && data && (
        <div className="card">
          <p className="text-lg">
            <span className="font-semibold">{data.amount} {data.from}</span>
            {" = "}
            <span className="font-semibold">{data.result} {data.to}</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Rate: 1 {data.from} = {data.rate} {data.to}
          </p>
        </div>
      )}
    </div>
  );
}
