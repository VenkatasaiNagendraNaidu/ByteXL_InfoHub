import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.get("/api/quote", async (_req, res) => {
  try {
    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    });

    const random = Math.random().toString(36).substring(2, 15);
    const r = await axios.get(`https://thequoteshub.com/api/random-quote?nocache=${random}`, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "InfoHub/1.0 (no-cache)",
      },
    });

    const d = r.data || {};
    const quote = d.quote || d.text || d.content || "Keep going, you're doing great!";
    const author = d.author || d.writer || d.by || "Anonymous";

    res.json({ id: random, quote, author });
  } catch (err) {
    console.error("Quote API error:", err.message);
    res.status(500).json({ error: "Could not fetch a fresh quote." });
  }
});


app.get("/api/weather", async (req, res) => {
  try {
    const { lat, lon, country, state, city } = req.query;

    let query = "";
    if (lat && lon) {
      query = `lat=${lat}&lon=${lon}`;
    } else {
      if (!country || !state || !city)
        return res.status(400).json({
          error: "Please provide Country, State, and City fields.",
        });
      query = `q=${encodeURIComponent(`${city},${state},${country}`)}`;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${process.env.WEATHER_API_KEY}&units=metric`;
    const r = await axios.get(url);
    const { main, weather, name, sys, coord } = r.data;

    res.json({
      city: name,
      country: sys?.country,
      coords: coord,
      temperature: main?.temp ?? null,
      feelsLike: main?.feels_like ?? null,
      condition: weather?.[0]?.description ?? "N/A",
    });
  } catch (err) {
    console.error("Weather error:", err.message);
    res.status(500).json({ error: "Could not fetch weather data." });
  }
});

app.get("/api/currency", async (req, res) => {
  try {
    const amount = Number(req.query.amount || 1);
    const from = (req.query.from || "INR").toUpperCase();
    const to = (req.query.to || "USD").toUpperCase();

    if (Number.isNaN(amount) || amount <= 0)
      return res.status(400).json({ error: "Enter a valid positive amount." });

    const url = `https://v6.exchangerate-api.com/v6/${process.env.CURRENCY_API_KEY}/latest/${from}`;
    const r = await axios.get(url);
    const rates = r.data?.conversion_rates || {};
    if (!rates[to])
      return res.status(400).json({ error: `Currency not supported: ${to}` });

    res.json({
      amount,
      from,
      to,
      rate: rates[to],
      result: (amount * rates[to]).toFixed(2),
    });
  } catch (err) {
    console.error("Currency error:", err.message);
    res.status(500).json({ error: "Could not fetch currency data." });
  }
});


if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(` API running on http://localhost:${PORT}`));
}
export default app;
