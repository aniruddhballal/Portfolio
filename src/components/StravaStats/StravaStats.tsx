import { useEffect, useRef, useState } from "react";
import stravaData from "../../data/strava.json";
import type { PeriodStats } from "../../data/strava-types";

type Mode = "weekly" | "monthly" | "annual" | "overall";
type Sport = "run" | "ride";
type Entry = {
  key: string;
  label: string;
  run: PeriodStats;
  ride: PeriodStats;
};

const tabs: { key: Mode; label: string }[] = [
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "annual", label: "Annual" },
  { key: "overall", label: "Overall" },
];
const distance = (km: number) =>
  km.toLocaleString("en-GB", { maximumFractionDigits: 1 });
function lastActiveIndex(
  entries: Entry[],
  sport: Sport,
  from: number,
  through: number,
) {
  for (let index = through; index >= from; index--) {
    if (entries[index][sport].distanceKm > 0) return index;
  }
  return through;
}

function entriesFor(mode: Exclude<Mode, "overall">): Entry[] {
  if (mode === "weekly")
    return stravaData.weekly.map((item) => ({
      key: item.weekStart,
      label: new Date(item.weekStart).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      run: item.run,
      ride: item.ride,
    }));
  if (mode === "monthly")
    return stravaData.monthly.map((item) => ({
      key: item.month,
      label: item.label,
      run: item.run,
      ride: item.ride,
    }));
  return stravaData.annual.map((item) => ({
    key: String(item.year),
    label: String(item.year),
    run: item.run,
    ride: item.ride,
  }));
}

function Progression({ mode }: { mode: Exclude<Mode, "overall"> }) {
  const entries = entriesFor(mode);
  const [sport, setSport] = useState<Sport>("run");
  const [from, setFrom] = useState(Math.max(0, entries.length - 12));
  const [through, setThrough] = useState(entries.length - 1);
  const [selected, setSelected] = useState(
    lastActiveIndex(
      entries,
      "run",
      Math.max(0, entries.length - 12),
      entries.length - 1,
    ),
  );
  const chartRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const chart = chartRef.current;
    if (chart) chart.scrollLeft = chart.scrollWidth;
  }, [from, through]);
  const visible = entries.slice(from, through + 1);
  const total = visible.reduce(
    (sum, entry) => sum + entry[sport].distanceKm,
    0,
  );
  const max = Math.max(1, ...visible.map((entry) => entry[sport].distanceKm));
  const current = entries[selected];

  return (
    <div className="strava-panel">
      <div className="strava-panel-top">
        <div>
          <span className="strava-label">DISTANCE PROGRESSION</span>
          <p>Select a period or adjust the range to explore the record.</p>
        </div>
        <div className="sport-toggle" role="group" aria-label="Sport">
          <button
            type="button"
            aria-pressed={sport === "run"}
            onClick={() => {
              setSport("run");
              setSelected(lastActiveIndex(entries, "run", from, through));
            }}
          >
            Run
          </button>
          <button
            type="button"
            aria-pressed={sport === "ride"}
            onClick={() => {
              setSport("ride");
              setSelected(lastActiveIndex(entries, "ride", from, through));
            }}
          >
            Ride
          </button>
        </div>
      </div>
      <div className="strava-summary">
        <div>
          <span className="strava-label">
            {sport === "run" ? "RUNNING" : "RIDING"} / VISIBLE RANGE
          </span>
          <strong>
            {distance(total)} <small>km</small>
          </strong>
          <p>
            {visible.reduce((sum, entry) => sum + entry[sport].activities, 0)}{" "}
            activities · {visible[0]?.label} – {visible.at(-1)?.label}
          </p>
        </div>
        <div>
          <span className="strava-label">SELECTED PERIOD</span>
          <strong>
            {distance(current?.[sport].distanceKm ?? 0)} <small>km</small>
          </strong>
          <p>
            {current?.label} · {current?.[sport].activities ?? 0} activities
          </p>
        </div>
      </div>
      <div className="strava-range">
        <label>
          From{" "}
          <select
            value={from}
            onChange={(event) => {
              const value = Number(event.target.value);
              setFrom(value);
              if (value > through) setThrough(value);
              setSelected(value);
            }}
          >
            {entries.map((entry, index) => (
              <option key={entry.key} value={index}>
                {entry.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Through{" "}
          <select
            value={through}
            onChange={(event) => {
              const value = Number(event.target.value);
              setThrough(value);
              if (value < from) setFrom(value);
              setSelected(value);
            }}
          >
            {entries.map((entry, index) => (
              <option key={entry.key} value={index}>
                {entry.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div
        ref={chartRef}
        className="bar-chart"
        role="group"
        aria-label={`${sport === "run" ? "Running" : "Riding"} distance by ${mode} period`}
        tabIndex={0}
      >
        {visible.map((entry, index) => {
          const value = entry[sport].distanceKm;
          return (
            <button
              key={entry.key}
              type="button"
              className="bar-column"
              aria-pressed={selected === from + index}
              onClick={() => setSelected(from + index)}
            >
              <span className="sr-only">
                {entry.label}: {distance(value)} kilometres.{" "}
              </span>
              <span className="bar-value">{distance(value)}</span>
              <span className="bar-track">
                <span
                  className="bar-fill"
                  style={{ height: `${Math.max(2, (value / max) * 100)}%` }}
                />
              </span>
              <span className="bar-date">
                {mode === "annual"
                  ? entry.label
                  : mode === "monthly"
                    ? entry.label.slice(0, 3)
                    : entry.label.slice(0, 6)}
              </span>
            </button>
          );
        })}
      </div>
      <details className="strava-data-table">
        <summary>
          View all {entries.length} {mode} records as a table
        </summary>
        <div>
          <table>
            <thead>
              <tr>
                <th scope="col">Period</th>
                <th scope="col">Run (km)</th>
                <th scope="col">Ride (km)</th>
                <th scope="col">Runs</th>
                <th scope="col">Rides</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.key}>
                  <th scope="row">{entry.label}</th>
                  <td>{distance(entry.run.distanceKm)}</td>
                  <td>{distance(entry.ride.distanceKm)}</td>
                  <td>{entry.run.activities}</td>
                  <td>{entry.ride.activities}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

function Overall() {
  return (
    <div className="overall-grid">
      {(["run", "ride"] as const).map((sport) => {
        const summary = stravaData[sport];
        return (
          <div className="overall-sport" key={sport}>
            <span className="strava-label">
              {sport === "run" ? "RUNNING" : "RIDING"} / ALL TIME
            </span>
            <strong>
              {distance(summary.allTime.distanceKm)} <small>km</small>
            </strong>
            <div className="overall-metrics">
              <span>
                {summary.allTime.activities}
                <small>activities</small>
              </span>
              <span>
                {distance(summary.allTime.timeHours)}
                <small>hours</small>
              </span>
              <span>
                {distance(summary.allTime.elevGainM)}
                <small>metres climbed</small>
              </span>
            </div>
            <h4>Personal bests</h4>
            <ul>
              {summary.pbs.map((pb) => (
                <li key={pb.label + pb.date}>
                  <span>{pb.label}</span>
                  <strong>{pb.time}</strong>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

export default function StravaStats() {
  const [tab, setTab] = useState<Mode>("weekly");
  const synced = new Date(stravaData.fetchedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return (
    <div className="strava-stats">
      <div className="strava-heading">
        <span>ENDURANCE DATA / STRAVA SNAPSHOT</span>
        <a
          href="https://www.strava.com/athletes/111442086"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Strava ↗
        </a>
      </div>
      <div className="strava-tabs" role="group" aria-label="Distance period">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            aria-pressed={tab === item.key}
            onClick={() => setTab(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {tab === "overall" ? <Overall /> : <Progression key={tab} mode={tab} />}
      <p className="strava-synced">Last synced: {synced}</p>
    </div>
  );
}
