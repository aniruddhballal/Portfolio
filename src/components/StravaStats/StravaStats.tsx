import { ArrowUpRight } from "lucide-react";
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
          <div className="endurance-milestone">
            <p className="endurance-caption">THE LONG RUN</p>
            <p className="endurance-milestone-distance">
              50 <span>km</span>
            </p>
            <h4>In a single run.</h4>
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
