import { ArrowUpRight } from "lucide-react";
import type { CSSProperties } from "react";
import stravaData from "../../data/strava.json";

const bestFor = (distance: string) =>
  stravaData.run.pbs.find((pb) => pb.label.split(" (")[0] === distance);

const milestone = bestFor("50K");
const selectedBests = [
  { distance: "5K", label: "5K" },
  { distance: "10K", label: "10K" },
  { distance: "Half-Marathon", label: "Half marathon" },
].flatMap(({ distance, label }) => {
  const best = bestFor(distance);
  return best ? [{ ...best, label }] : [];
});

const formatDistance = (km: number) => Math.round(km).toLocaleString("en-GB");
const annualHistory = [...stravaData.annual].sort((a, b) => a.year - b.year);
const firstActiveYear = annualHistory.findIndex(
  ({ run, ride }) => run.activities > 0 || ride.activities > 0,
);
const annualTotals =
  firstActiveYear < 0 ? [] : annualHistory.slice(firstActiveYear);
const annualScale = Math.max(
  250,
  Math.ceil(
    Math.max(
      0,
      ...annualTotals.flatMap(({ run, ride }) => [
        run.distanceKm,
        ride.distanceKm,
      ]),
    ) / 250,
  ) * 250,
);
const snapshotYear = new Date(stravaData.fetchedAt).getUTCFullYear();
const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

export default function StravaStats() {
  return (
    <section
      id="endurance"
      className="strava-stats"
      aria-labelledby="endurance-title"
    >
      <header className="endurance-header">
        <p className="eyebrow">ENDURANCE / THE LONG VIEW</p>
        <h3 id="endurance-title">Going the distance.</h3>
        <p>Running and riding, away from the screen.</p>
      </header>

      <div className="endurance-overview">
        {milestone && (
          <div
            className="endurance-milestone"
            role="group"
            aria-label="Random 50km for fun"
          >
            <p className="endurance-caption">RANDOM</p>
            <p className="endurance-milestone-distance">
              50 <span>km</span>
            </p>
            <h4>For fun.</h4>
            <div className="endurance-milestone-detail">
              <span>
                <strong>{milestone.time}</strong>
                <span>50K best effort</span>
              </span>
              <time dateTime={milestone.date}>
                {formatDate(milestone.date)}
              </time>
            </div>
          </div>
        )}

        <dl className="endurance-lifetime">
          {(["run", "ride"] as const).map((sport) => {
            const { distanceKm, activities } = stravaData[sport].allTime;
            return (
              <div key={sport}>
                <dt className="endurance-caption">
                  {sport === "run" ? "RUNNING" : "CYCLING"} / ALL TIME
                </dt>
                <dd>
                  <span className="endurance-distance">
                    {formatDistance(distanceKm)} <small>km</small>
                  </span>
                  <span className="endurance-activity-count">
                    {activities.toLocaleString("en-GB")}{" "}
                    {sport === "run" ? "runs" : "rides"}
                  </span>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>

      {annualTotals.length > 0 && (
        <figure
          className="endurance-yearly"
          aria-labelledby="endurance-yearly-title"
        >
          <figcaption className="endurance-yearly-heading">
            <div>
              <p className="endurance-caption">DISTANCE / KM</p>
              <h4 id="endurance-yearly-title">Year after year.</h4>
            </div>
            <div className="endurance-yearly-legend">
              <span>
                <i className="endurance-key-run" aria-hidden="true" />
                Running
              </span>
              <span>
                <i className="endurance-key-ride" aria-hidden="true" />
                Cycling
              </span>
            </div>
          </figcaption>
          <div
            className="endurance-yearly-plot"
            style={{ "--year-count": annualTotals.length } as CSSProperties}
          >
            {annualTotals.map((entry) => (
              <div
                className="endurance-year"
                key={entry.year}
                role="img"
                aria-label={`${entry.year}${entry.year === snapshotYear ? " year to date" : ""}: running ${formatDistance(entry.run.distanceKm)} kilometres, cycling ${formatDistance(entry.ride.distanceKm)} kilometres`}
              >
                <div className="endurance-year-bars">
                  {(["run", "ride"] as const).map((sport) => (
                    <div
                      className={`endurance-bar-column endurance-bar-${sport}`}
                      key={sport}
                    >
                      <span className="endurance-bar-value">
                        {Math.round(entry[sport].distanceKm)}
                      </span>
                      <span
                        className="endurance-bar"
                        style={{
                          height: `${(entry[sport].distanceKm / annualScale) * 100}%`,
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="endurance-year-label">
                  {entry.year}
                  {entry.year === snapshotYear && <span>YTD</span>}
                </div>
              </div>
            ))}
          </div>
        </figure>
      )}

      {selectedBests.length > 0 && (
        <div className="endurance-records">
          <h4>Selected running bests</h4>
          <dl>
            {selectedBests.map((best) => (
              <div key={best.label}>
                <dt>{best.label}</dt>
                <dd>{best.time}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <footer className="endurance-footer">
        <p>
          Strava snapshot ·{" "}
          <time dateTime={stravaData.fetchedAt}>
            {formatDate(stravaData.fetchedAt)}
          </time>
        </p>
        <a
          href="https://www.strava.com/athletes/111442086"
          target="_blank"
          rel="noopener noreferrer"
        >
          More on Strava <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </footer>
    </section>
  );
}
