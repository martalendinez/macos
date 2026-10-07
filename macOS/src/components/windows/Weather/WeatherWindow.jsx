// src/components/windows/Weather/WeatherWindow.jsx
// Live weather for every city Marta has lived in. Data: Open-Meteo (free, no API key).
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const CITIES = [
  { id: "stockholm", name: "Stockholm", flag: "🇸🇪", note: "Home now", lat: 59.3293, lon: 18.0686 },
  { id: "madrid", name: "Madrid", flag: "🇪🇸", note: "Where I grew up", lat: 40.4168, lon: -3.7038 },
  { id: "groningen", name: "Groningen", flag: "🇳🇱", note: "University years", lat: 53.2194, lon: 6.5665 },
  { id: "stuttgart", name: "Stuttgart", flag: "🇩🇪", note: "Exchange semester", lat: 48.7758, lon: 9.1829 },
  { id: "hamilton", name: "Hamilton", flag: "🇨🇦", note: "2025 adventure", lat: 43.2557, lon: -79.8711 },
];

const API =
  "https://api.open-meteo.com/v1/forecast?" +
  new URLSearchParams({
    latitude: CITIES.map((c) => c.lat).join(","),
    longitude: CITIES.map((c) => c.lon).join(","),
    current: "temperature_2m,apparent_temperature,weather_code,is_day,wind_speed_10m,relative_humidity_2m",
    hourly: "temperature_2m,weather_code,is_day",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset",
    timezone: "auto",
    forecast_days: "7",
  });

function describe(code, isDay = 1) {
  if (code === 0) return { label: isDay ? "Sunny" : "Clear", icon: isDay ? "☀️" : "🌙", kind: "clear" };
  if (code === 1) return { label: "Mostly Clear", icon: isDay ? "🌤️" : "🌙", kind: "clear" };
  if (code === 2) return { label: "Partly Cloudy", icon: isDay ? "⛅" : "☁️", kind: "cloudy" };
  if (code === 3) return { label: "Cloudy", icon: "☁️", kind: "cloudy" };
  if (code === 45 || code === 48) return { label: "Fog", icon: "🌫️", kind: "cloudy" };
  if (code >= 51 && code <= 57) return { label: "Drizzle", icon: "🌦️", kind: "rain" };
  if (code >= 61 && code <= 67) return { label: "Rain", icon: "🌧️", kind: "rain" };
  if (code >= 71 && code <= 77) return { label: "Snow", icon: "🌨️", kind: "snow" };
  if (code >= 80 && code <= 82) return { label: "Showers", icon: "🌦️", kind: "rain" };
  if (code === 85 || code === 86) return { label: "Snow Showers", icon: "🌨️", kind: "snow" };
  if (code >= 95) return { label: "Thunderstorm", icon: "⛈️", kind: "storm" };
  return { label: "—", icon: "🌡️", kind: "cloudy" };
}

function sky(kind, isDay) {
  const map = {
    clear: isDay ? ["#2f7fe0", "#7cc0f5"] : ["#0a1633", "#283d6b"],
    cloudy: isDay ? ["#5e7387", "#a3b3c1"] : ["#1b2330", "#3a4555"],
    rain: isDay ? ["#3d4b5c", "#6c7d90"] : ["#141b26", "#323d4c"],
    snow: isDay ? ["#7f95ad", "#d3dde7"] : ["#2a3446", "#5a6a80"],
    storm: ["#24263a", "#4a4e69"],
  };
  const [a, b] = map[kind] ?? map.cloudy;
  return `linear-gradient(180deg, ${a} 0%, ${b} 100%)`;
}

const r = (n) => Math.round(n);

function localTime(tz, opts = { hour: "2-digit", minute: "2-digit" }) {
  return new Date().toLocaleTimeString("en-GB", { ...opts, timeZone: tz, hour12: false });
}

function Card({ title, children, className = "" }) {
  return (
    <div className={`rounded-2xl bg-black/15 backdrop-blur-md ring-1 ring-white/15 p-3 ${className}`}>
      {title && <div className="text-[11px] font-semibold uppercase tracking-wide text-white/60 mb-2">{title}</div>}
      {children}
    </div>
  );
}

export default function WeatherWindow() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [sel, setSel] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const load = () =>
      fetch(API)
        .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
        .then((json) => {
          if (!cancelled) {
            setData(Array.isArray(json) ? json : [json]);
            setError(false);
          }
        })
        .catch(() => !cancelled && setError(true));
    load();
    const id = setInterval(load, 10 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const city = CITIES[sel];
  const w = data?.[sel];

  const view = useMemo(() => {
    if (!w) return null;
    const cur = w.current;
    const d = describe(cur.weather_code, cur.is_day);
    // next 24 hours, starting at the current hour
    const start = Math.max(0, w.hourly.time.findIndex((t) => t >= cur.time.slice(0, 13)));
    const hours = w.hourly.time.slice(start, start + 24).map((t, i) => ({
      label: i === 0 ? "Now" : t.slice(11, 13),
      temp: w.hourly.temperature_2m[start + i],
      icon: describe(w.hourly.weather_code[start + i], w.hourly.is_day[start + i]).icon,
    }));
    const lo = Math.min(...w.daily.temperature_2m_min);
    const hi = Math.max(...w.daily.temperature_2m_max);
    const days = w.daily.time.map((t, i) => ({
      label: i === 0 ? "Today" : new Date(t + "T12:00").toLocaleDateString("en-GB", { weekday: "short" }),
      icon: describe(w.daily.weather_code[i]).icon,
      min: w.daily.temperature_2m_min[i],
      max: w.daily.temperature_2m_max[i],
      left: ((w.daily.temperature_2m_min[i] - lo) / (hi - lo || 1)) * 100,
      width: ((w.daily.temperature_2m_max[i] - w.daily.temperature_2m_min[i]) / (hi - lo || 1)) * 100,
    }));
    return { cur, d, hours, days, bg: sky(d.kind, cur.is_day) };
  }, [w]);

  return (
    <div className="no-darkwin h-full flex text-white">
      {/* city list */}
      <aside className="w-[240px] shrink-0 bg-[#1c1c1e] border-r border-white/10 p-2 overflow-y-auto space-y-2">
        {CITIES.map((c, i) => {
          const cw = data?.[i];
          const cd = cw ? describe(cw.current.weather_code, cw.current.is_day) : null;
          return (
            <motion.button
              key={c.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSel(i)}
              className={`w-full text-left rounded-xl p-3 relative overflow-hidden ${sel === i ? "ring-2 ring-white/70" : ""}`}
              style={{ background: cw ? sky(cd.kind, cw.current.is_day) : "#2c2c2e" }}
            >
              <div className="flex justify-between">
                <div>
                  <div className="text-[15px] font-bold drop-shadow-sm">
                    {c.name} {c.flag}
                  </div>
                  <div className="text-[11px] text-white/80">{cw ? localTime(cw.timezone) : c.note}</div>
                </div>
                <div className="text-[30px] font-light leading-none">{cw ? `${r(cw.current.temperature_2m)}°` : "–"}</div>
              </div>
              <div className="mt-3 flex justify-between text-[11px] text-white/85">
                <span>{cd?.label ?? c.note}</span>
                {cw && (
                  <span>
                    H:{r(cw.daily.temperature_2m_max[0])}° L:{r(cw.daily.temperature_2m_min[0])}°
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
        <div className="px-2 pt-1 text-[10px] text-white/35">Weather data by Open-Meteo.com</div>
      </aside>

      {/* detail */}
      <main className="relative flex-1 min-w-0 overflow-y-auto" style={{ background: view?.bg ?? "#2c2c2e", transition: "background 600ms ease" }}>
        {!view ? (
          <div className="h-full flex items-center justify-center text-white/70 text-[14px]">
            {error ? "Couldn't load the weather. Check your connection and try again." : "Loading weather…"}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={city.id}
              className="max-w-[640px] mx-auto px-6 py-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              <div className="text-center drop-shadow-sm">
                <div className="text-[32px] font-normal">{city.name}</div>
                <div className="text-[96px] font-thin leading-none -mt-1">{r(view.cur.temperature_2m)}°</div>
                <div className="text-[18px] text-white/90 mt-1">
                  {view.d.icon} {view.d.label}
                </div>
                <div className="text-[16px] text-white/90">
                  H:{r(view.days[0].max)}° L:{r(view.days[0].min)}°
                </div>
                <div className="mt-1 text-[12px] text-white/65">
                  {city.flag} {city.note} · local time {localTime(w.timezone)}
                </div>
              </div>

              <Card title="Hourly forecast" className="mt-8">
                <div className="flex gap-5 overflow-x-auto pb-1">
                  {view.hours.map((h, i) => (
                    <div key={i} className="shrink-0 flex flex-col items-center gap-2 text-[13px] w-9">
                      <span className="text-white/85 font-medium">{h.label}</span>
                      <span className="text-[20px]">{h.icon}</span>
                      <span className="font-semibold">{r(h.temp)}°</span>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-3">
                <Card title="7-day forecast">
                  {view.days.map((d) => (
                    <div key={d.label} className="grid grid-cols-[52px_28px_34px_1fr_34px] items-center gap-2 py-1.5 border-t border-white/10 first:border-t-0 text-[14px]">
                      <span className="font-medium">{d.label}</span>
                      <span className="text-[18px]">{d.icon}</span>
                      <span className="text-white/60 text-right">{r(d.min)}°</span>
                      <span className="relative h-[5px] rounded-full bg-black/25">
                        <span
                          className="absolute h-full rounded-full"
                          style={{ left: `${d.left}%`, width: `${Math.max(d.width, 6)}%`, background: "linear-gradient(90deg,#7ad0ff,#ffd36b,#ff9a3c)" }}
                        />
                      </span>
                      <span className="font-semibold">{r(d.max)}°</span>
                    </div>
                  ))}
                </Card>

                <div className="grid grid-cols-2 gap-3 content-start">
                  <Card title="Feels like">
                    <div className="text-[28px] font-light">{r(view.cur.apparent_temperature)}°</div>
                  </Card>
                  <Card title="Humidity">
                    <div className="text-[28px] font-light">{r(view.cur.relative_humidity_2m)}%</div>
                  </Card>
                  <Card title="Wind">
                    <div className="text-[28px] font-light">
                      {r(view.cur.wind_speed_10m)}
                      <span className="text-[13px] ml-1">km/h</span>
                    </div>
                  </Card>
                  <Card title="Sunset">
                    <div className="text-[28px] font-light">{w.daily.sunset[0].slice(11, 16)}</div>
                  </Card>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
