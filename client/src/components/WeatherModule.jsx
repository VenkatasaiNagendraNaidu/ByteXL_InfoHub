import { useState } from "react";
import axios from "axios";
import { LocateFixed, CloudSun, Search } from "lucide-react";

export default function WeatherModule() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState(null);
  const [isLoading, setL] = useState(false);
  const [msg, setMsg] = useState("");

  const getWeather = async () => {
    setMsg(""); setData(null);
    const city = (query || "").trim();
    if (!city) { setMsg("Please enter a city name (e.g., Hyderabad)."); return; }

    setL(true);
    try {
      const res = await axios.get("/api/weather", { params: { city } });
      setData(res.data);
    } catch (e) {
      setMsg(e?.response?.data?.error || "Could not fetch weather.");
    } finally { setL(false); }
  };

  const useCurrent = () => {
    setMsg(""); setData(null);
    if (!navigator.geolocation) return setMsg("Geolocation not supported.");
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        setL(true);
        try {
          const r = await axios.get("/api/weather", {
            params: { lat: coords.latitude, lon: coords.longitude },
          });
          setData(r.data);
          if (r.data?.city) setQuery(r.data.city); // keep input as city only
        } catch {
          setMsg("Could not fetch location weather.");
        } finally { setL(false); }
      },
      () => setMsg("Please allow location access.")
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <CloudSun className="size-5 text-yellow-400" /> Weather Info
      </h2>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch">
        <input
          className="input flex-1"
          placeholder="Enter city (e.g., Hyderabad)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="flex gap-2">
          <button className="btn flex items-center gap-2" onClick={getWeather}>
            <Search className="size-4" /> Search
          </button>
          <button className="btn flex items-center gap-2" onClick={useCurrent}>
            <LocateFixed className="size-4" /> Current
          </button>
        </div>
      </div>

      {isLoading && <p className="text-slate-300">Loading weather…</p>}
      {msg && <p className="text-red-400">{msg}</p>}

      {!isLoading && !msg && data && (
        <div className="grid sm:grid-cols-3 gap-3 mt-3">
          <div className="card">
            <p className="text-sm text-slate-400">Location</p>
            <p className="text-lg font-medium">
              {data.city}{data.country ? `, ${data.country}` : ""}
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-slate-400">Temperature</p>
            <p className="text-2xl font-semibold">{data.temperature}°C</p>
            <p className="text-xs text-slate-400">Feels like {data.feelsLike}°C</p>
          </div>
          <div className="card">
            <p className="text-sm text-slate-400">Condition</p>
            <p className="text-lg capitalize">{data.condition}</p>
          </div>
        </div>
      )}
    </div>
  );
}
