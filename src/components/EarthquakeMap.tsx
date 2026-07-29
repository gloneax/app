/********************************************************************* 
Author: Sukanta Manna  
Purpose: Show earthquakes on the global map.
**********************************************************************/
import RealTimeHazardMap from './RealTimeEarthquakeMap';

export default function EarthquakeMap() {
  return (
    <RealTimeHazardMap
      apiUrl="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
      // Tectonic plate boundary dataset
      overlayUrl="https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
      // Authentic USGS Map Red Fault Line Styling
      overlayStyle={{
        color: "#dc2626", // USGS Red (#dc2626)
        weight: 1.8,      // Crisp, visible line width
        opacity: 0.85,    // Clean high contrast against base tiles
      }}
      getMarkerOptions={(feature) => {
        const mag = feature.properties.mag || 0;
        let color = "#2ecc71"; // Minor
        if (mag >= 5.0) color = "#e74c3c"; // Major
        else if (mag >= 3.0) color = "#f39c12"; // Moderate

        return {
          radius: Math.max(mag * 3, 4),
          fillColor: color,
          color: "#ffffff",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.75
        };
      }}
      renderPopupContent={(feature) => (
        <>
          <h4 className="m-0 font-bold text-base text-slate-900 border-b border-slate-100 pb-1 mb-1.5">
            Magnitude: {feature.properties.mag}
          </h4>
          <p className="m-0 text-sm text-slate-600 font-medium leading-tight mb-1">
            {feature.properties.place}
          </p>
          <span className="text-[11px] text-slate-400 block font-normal mt-1">
            {new Date(feature.properties.time).toLocaleString()}
          </span>
        </>
      )}
    />
  );
}