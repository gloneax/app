/********************************************************************* 
Author: Sukanta Manna  
Purpose: Show statistics on storm.
**********************************************************************/
import React, { useEffect, useState } from 'react';

interface LiveStormCounts {
  tornadoes: number;
  severeThunderstorms: number;
  cyclonesAndHurricanes: number;
  galesAndHighWinds: number;
  totalActiveAlerts: number;
}

export default function StormInsightsCard() {
  const [counts, setCounts] = useState<LiveStormCounts>({
    tornadoes: 0,
    severeThunderstorms: 0,
    cyclonesAndHurricanes: 0,
    galesAndHighWinds: 0,
    totalActiveAlerts: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    async function fetchLiveNOAAAlerts() {
      try {
        // Fetch active live alert count summary directly from NOAA NWS API
        const response = await fetch('https://api.weather.gov/alerts/active/count', {
          headers: { 'User-Agent': 'GloneaxHazardApp/1.0' },
        });

        if (!response.ok) throw new Error(`HTTP status: ${response.status}`);

        const data = await response.json();

        if (data && data.zones) {
          const zones = data.zones;

          // Dynamically aggregate categories from NOAA zone object
          const tornadoCount =
            (zones['Tornado Warning'] || 0) +
            (zones['Tornado Watch'] || 0) +
            (zones['Tornado'] || 0);

          const tstormCount =
            (zones['Severe Thunderstorm Warning'] || 0) +
            (zones['Severe Thunderstorm Watch'] || 0) +
            (zones['Severe Thunderstorm'] || 0);

          const cycloneCount =
            (zones['Hurricane Warning'] || 0) +
            (zones['Hurricane Watch'] || 0) +
            (zones['Tropical Storm Warning'] || 0) +
            (zones['Tropical Storm Watch'] || 0) +
            (zones['Hurricane Statement'] || 0);

          const windCount =
            (zones['High Wind Warning'] || 0) +
            (zones['High Wind Watch'] || 0) +
            (zones['Gale Warning'] || 0) +
            (zones['Wind Advisory'] || 0);

          const total = data.total || Object.values(zones as Record<string, number>).reduce((a, b) => a + b, 0);

          setCounts({
            tornadoes: tornadoCount,
            severeThunderstorms: tstormCount,
            cyclonesAndHurricanes: cycloneCount,
            galesAndHighWinds: windCount,
            totalActiveAlerts: total,
          });
          setError(false);
        }
      } catch (err) {
        console.error('Failed to stream live NOAA storm telemetry:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchLiveNOAAAlerts();
    const interval = setInterval(fetchLiveNOAAAlerts, 120000); // Poll every 2 mins
    return () => clearInterval(interval);
  }, []);

  const totalTrackedCategory =
    counts.tornadoes +
    counts.severeThunderstorms +
    counts.cyclonesAndHurricanes +
    counts.galesAndHighWinds || 1;

  // Calculate dynamic percentages for the infographic gauge bars
  const tstormPct = Math.round((counts.severeThunderstorms / totalTrackedCategory) * 100);
  const windPct = Math.round((counts.galesAndHighWinds / totalTrackedCategory) * 100);
  const cyclonePct = Math.round((counts.cyclonesAndHurricanes / totalTrackedCategory) * 100);
  const tornadoPct = Math.min(100, Math.max(5, Math.round((counts.tornadoes / totalTrackedCategory) * 100)));

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>🌪️</span> Live Storm & Atmospheric Telemetry
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time active weather warnings streamed directly from NOAA NWS
          </p>
        </div>

        <div className="flex items-center gap-2">
          {loading ? (
            <span className="text-xs text-slate-400 font-medium animate-pulse">
              Streaming...
            </span>
          ) : (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400 border border-sky-200 dark:border-sky-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Feed Active
            </span>
          )}
        </div>
      </div>

      {error ? (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-xl">
          ⚠️ Unable to fetch live NOAA storm alert counts. Retrying automatically...
        </div>
      ) : (
        <>
          {/* Main Infographic KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            
            {/* KPI 1: Severe Thunderstorms */}
            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Severe Thunderstorms
              </span>
              <div className="my-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-amber-500">
                  {counts.severeThunderstorms}
                </span>
                <span className="text-xs text-slate-400 font-medium">active alerts</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-500"
                  style={{ width: `${tstormPct}%` }}
                />
              </div>
            </div>

            {/* KPI 2: Gales & High Winds */}
            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                High Winds & Gales
              </span>
              <div className="my-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-sky-500">
                  {counts.galesAndHighWinds}
                </span>
                <span className="text-xs text-slate-400 font-medium">active alerts</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-500 transition-all duration-500"
                  style={{ width: `${windPct}%` }}
                />
              </div>
            </div>

            {/* KPI 3: Tornadoes */}
            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Active Tornadoes
              </span>
              <div className="my-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-rose-600 dark:text-rose-500">
                  {counts.tornadoes}
                </span>
                <span className="text-xs text-slate-400 font-medium">watches / warnings</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 transition-all duration-500"
                  style={{ width: `${tornadoPct}%` }}
                />
              </div>
            </div>

            {/* KPI 4: Tropical Cyclones */}
            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Tropical Cyclones
              </span>
              <div className="my-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-purple-600 dark:text-purple-400">
                  {counts.cyclonesAndHurricanes}
                </span>
                <span className="text-xs text-slate-400 font-medium">tracked systems</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 transition-all duration-500"
                  style={{ width: `${cyclonePct}%` }}
                />
              </div>
            </div>

          </div>

          {/* Visual Distribution Infographic Bar */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 rounded-xl p-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Live Alert Volume Breakdown
              </span>
              <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                {counts.totalActiveAlerts.toLocaleString()} Total Alerts Tracked
              </span>
            </div>

            {/* Multi-segment Segmented Bar Chart */}
            <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex gap-0.5">
              <div
                title="Thunderstorms"
                className="h-full bg-amber-500 transition-all duration-500"
                style={{ width: `${tstormPct}%` }}
              />
              <div
                title="High Winds"
                className="h-full bg-sky-500 transition-all duration-500"
                style={{ width: `${windPct}%` }}
              />
              <div
                title="Tornadoes"
                className="h-full bg-rose-500 transition-all duration-500"
                style={{ width: `${tornadoPct}%` }}
              />
              <div
                title="Cyclones"
                className="h-full bg-purple-500 transition-all duration-500"
                style={{ width: `${cyclonePct}%` }}
              />
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400 mt-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Thunderstorms ({tstormPct}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                <span>High Winds ({windPct}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Tornadoes ({tornadoPct}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span>Cyclones ({cyclonePct}%)</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}