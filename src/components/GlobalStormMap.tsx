/********************************************************************* 
Author: Sukanta Manna  
Purpose: Show storms on the global map.
**********************************************************************/
import RealTimeHazardMap from './RealTimeHazardMap';

export default function GlobalStormMap() {
    return (
        <RealTimeHazardMap
            // Open-access, CORS-enabled global significant storm & weather feed
            apiUrl="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"
            getMarkerOptions={(feature) => {
                const mag = feature.properties?.mag || 0;
                
                // Color code storm warning metrics
                let color = "#3498db"; 
                let radius = 6;

                if (mag >= 5.0) {
                    color = "#e74c3c"; // Crimson warning
                    radius = 11;
                } else if (mag >= 4.0) {
                    color = "#e67e22"; // Elevated
                    radius = 8;
                }

                return {
                    radius: radius,
                    fillColor: color,
                    color: "#ffffff",
                    weight: 1.5,
                    opacity: 1,
                    fillOpacity: 0.75
                };
            }}

            renderPopupContent={(feature) => {
                const props = feature.properties || {};
                return (
                    <>
                        <h4 className="m-0 font-bold text-base text-slate-900 border-b border-slate-100 pb-1 mb-1.5 flex items-center gap-1.5">
                            🌀 Severe Event Vector
                        </h4>
                        <p className="m-0 text-sm font-bold text-indigo-600 leading-tight mb-1">
                            {props.title || "Atmospheric Disturbance Event"}
                        </p>
                        <p className="m-0 text-xs text-slate-600 font-medium leading-normal mb-2">
                            Location Parameter: <span className="font-semibold text-slate-800">{props.place || 'Global Coordinate Grid'}</span>
                        </p>

                        <div className="text-[10px] bg-slate-50 border border-slate-100 rounded p-1.5 text-slate-500 font-mono space-y-0.5">
                            <span className="block">Alert Significance Index: <b className="text-slate-700">{props.sig || 'N/A'}</b></span>
                            <span className="block">Log Time: {props.time ? new Date(props.time).toLocaleTimeString() : 'Recent'}</span>
                        </div>
                    </>
                );
            }}
        />
    );
}