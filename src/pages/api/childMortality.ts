/********************************************************************* 
Author: Sukanta Manna  
Purpose: childMortality.ts
**********************************************************************/
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  console.log("🚀 [/api/childMortality] Ingesting optimized WHO Child Mortality indicators and geographic maps...");
  
  try {
    // 🌍 Concurrently fetch the raw WHO MDG metrics and world spatial configurations
    const [whoResponse, geoResponse] = await Promise.all([
      fetch("https://ghoapi.azureedge.net/api/MDG_0000000001"),
      fetch("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json")
    ]);

    if (!whoResponse.ok || !geoResponse.ok) {
      return new Response(JSON.stringify({ error: "Failed to resolve external data sources" }), { status: 502 });
    }

    const whoData = await whoResponse.json();
    const geoData = await geoResponse.json();

    // 1. Build a lookup registry capturing coordinates AND plain-text English country names directly
    const spatialRegistry: Record<string, { coordinates: [number, number]; name: string }> = {};
    
    geoData.features.forEach((feature: any) => {
      const iso3 = feature.id; // e.g., "IND", "NGA"
      const textName = feature.properties?.name || iso3;
      let countryCoords: [number, number] | null = null;

      if (feature.geometry && feature.geometry.type === "Polygon") {
        const coords = feature.geometry.coordinates[0];
        let sumLat = 0, sumLng = 0;
        coords.forEach((c: number[]) => { sumLng += c[0]; sumLat += c[1]; });
        countryCoords = [sumLat / coords.length, sumLng / coords.length];
      } else if (feature.geometry && feature.geometry.type === "MultiPolygon") {
        const firstPolygon = feature.geometry.coordinates[0][0];
        let sumLat = 0, sumLng = 0;
        firstPolygon.forEach((c: number[]) => { sumLng += c[0]; sumLat += c[1]; });
        countryCoords = [sumLat / firstPolygon.length, sumLng / firstPolygon.length];
      }

      if (countryCoords) {
        spatialRegistry[iso3] = {
          coordinates: countryCoords,
          name: textName
        };
      }
    });

    // Manual pinning adjustments for visually balanced placement on the map canvas
    if (spatialRegistry["USA"]) spatialRegistry["USA"].coordinates = [37.0902, -95.7129];
    if (spatialRegistry["CAN"]) spatialRegistry["CAN"].coordinates = [56.1304, -106.3468];
    if (spatialRegistry["CHN"]) spatialRegistry["CHN"].coordinates = [35.8617, 104.1954];

    // 2. Process, filter, and extract raw WHO records
    const records = whoData.value || [];
    const countryLatestData: Record<string, any> = {};

    records.forEach((record: any) => {
      const isCountry = record.SpatialDimType && record.SpatialDimType.toUpperCase() === "COUNTRY";
      if (!isCountry || record.NumericValue === null || record.NumericValue === undefined) return;

      const countryCode = record.SpatialDim;
      const year = parseInt(record.TimeDim) || 0;
      const val = parseFloat(record.NumericValue);

      // Apply demographic sorting filters (Averages from 2020 onwards, both sexes combined)
      if (year < 2020) return;
      if (record.Dim1 !== "SEX_BTSX" && record.Dim1 !== "BTSX" && record.Dim1 !== "Both sexes") return;

      // Cross-reference against our combined spatial registry
      const geoMatch = spatialRegistry[countryCode];
      if (!geoMatch) return; // Drop entries that cannot be projected safely

      // Keep only the most up-to-date calendar tracking frame per country
      if (!countryLatestData[countryCode] || year > countryLatestData[countryCode].year) {
        countryLatestData[countryCode] = {
          countryCode,
          countryName: geoMatch.name, // 🌟 Safe textual name ingestion
          year,
          mortalityRate: Math.round(val * 10) / 10,
          coordinates: geoMatch.coordinates
        };
      }
    });

    const cleanedData = Object.values(countryLatestData);
    console.log(`✨ [/api/childMortality] Dispatched ${cleanedData.length} records. Example layout:`, JSON.stringify(cleanedData[0]));

    return new Response(JSON.stringify(cleanedData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60' 
      }
    });

  } catch (error) {
    console.error("❌ [/api/childMortality] Pipeline processing failed:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};