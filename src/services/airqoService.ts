/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AirQoMeasurement, MapPoint } from '../types';

export async function fetchAirQualityData(): Promise<MapPoint[]> {
  try {
    const response = await fetch('/api/airqo');

    if (!response.ok) {
      throw new Error(`Proxy API error: ${response.statusText}`);
    }

    const data = await response.json();
    const measurements: AirQoMeasurement[] = data.measurements || [];

    if (measurements.length === 0) {
      console.warn('No real measurements found, loading local sample data.');
      return getMockData();
    }

    return measurements.map((m) => {
      // Robust coordinate extraction handling both approximate and exact fields
      const lat = m.siteDetails?.approximate_latitude || (m as any).location?.latitude?.value || 0;
      const lng = m.siteDetails?.approximate_longitude || (m as any).location?.longitude?.value || 0;
      
      return {
        lat,
        lng,
        weight: m.pm2_5.value,
        id: `${m.site_id}-${m.time}`,
        metadata: m
      };
    }).filter(p => p.lat !== 0 && p.lng !== 0);
    
  } catch (error) {
    console.error('Failed to fetch AirQo data, using fallback sample data:', error);
    return getMockData();
  }
}

/**
 * Returns mock data based on the structure provided by the user.
 * Useful for development and teaching.
 */
export function getMockData(): MapPoint[] {
  // Sample point template
  const sampleTemplate = (name: string, lat: number, lng: number, pm25: number) => ({
    "site_id": `site-${name.replace(/\s+/g, '-').toLowerCase()}`,
    "time": new Date().toISOString(),
    "pm2_5": { "value": pm25 },
    "siteDetails": {
      "formatted_name": name,
      "approximate_latitude": lat,
      "approximate_longitude": lng,
      "name": name,
      "city": "Kampala"
    },
    "aqi_category": pm25 <= 12 ? "Good" : pm25 <= 35 ? "Moderate" : "Unhealthy"
  });

  // Base list of core nodes
  const baseNodes = [
    { name: 'Kampala Central', lat: 0.3476, lng: 32.5825, pm25: 45.2 },
    { name: 'Markerere University', lat: 0.3340, lng: 32.5670, pm25: 38.5 },
    { name: 'Mulago Hospital', lat: 0.3380, lng: 32.5760, pm25: 55.1 },
    { name: 'Kololo Airstrip', lat: 0.3280, lng: 32.5910, pm25: 22.4 },
    { name: 'Nakasero Market', lat: 0.3140, lng: 32.5780, pm25: 68.2 },
    { name: 'Naguru Hill', lat: 0.3450, lng: 32.6050, pm25: 18.2 },
    { name: 'Bugolobi', lat: 0.3210, lng: 32.6210, pm25: 42.7 },
    { name: 'Nakawa Division', lat: 0.3360, lng: 32.6150, pm25: 61.3 },
    { name: 'Banda Industrial', lat: 0.3540, lng: 32.6340, pm25: 75.8 },
    { name: 'Ntinda Bypass', lat: 0.3580, lng: 32.6120, pm25: 33.1 },
    { name: 'Kiwatule Node', lat: 0.3650, lng: 32.6200, pm25: 15.5 },
    { name: 'Kira Road', lat: 0.3480, lng: 32.5980, pm25: 44.4 },
    { name: 'Kamwokya', lat: 0.3390, lng: 32.5870, pm25: 52.9 },
    { name: 'Kyambogo', lat: 0.3510, lng: 32.6280, pm25: 48.2 },
    { name: 'Luzira', lat: 0.2980, lng: 32.6450, pm25: 12.1 },
    { name: 'Munyonyo', lat: 0.2450, lng: 32.6180, pm25: 8.4 },
    { name: 'Ggaba Road', lat: 0.2760, lng: 32.6050, pm25: 29.5 },
    { name: 'Kansanga', lat: 0.2880, lng: 32.5980, pm25: 41.2 },
    { name: 'Kabalgala', lat: 0.3010, lng: 32.5940, pm25: 58.7 },
    { name: 'Nsambya', lat: 0.3070, lng: 32.5850, pm25: 35.4 },
    { name: 'Kibuli', lat: 0.3120, lng: 32.5980, pm25: 43.1 },
    { name: 'Mengo', lat: 0.3020, lng: 32.5620, pm25: 31.8 },
    { name: 'Rubaga Cathedral', lat: 0.3040, lng: 32.5530, pm25: 14.5 },
    { name: 'Namirembe', lat: 0.3150, lng: 32.5610, pm25: 25.9 },
    { name: 'Wandegeya', lat: 0.3280, lng: 32.5720, pm25: 64.2 },
  ];

  return baseNodes.map(loc => {
    const meta = sampleTemplate(loc.name, loc.lat, loc.lng, loc.pm25);
    return {
      lat: loc.lat,
      lng: loc.lng,
      weight: loc.pm25,
      id: `mock-${loc.name}-${Date.now()}`,
      metadata: meta
    };
  });
}

/**
 * Normalizes PM2.5 values to a 0-100 range for better heatmap visualization.
 * Air Quality Index (AQI) categories often go up to 500, but PM2.5 concentrations 
 * of 100+ are already very hazardous.
 */
export function normalizePM25(value: number): number {
  return Math.min(Math.max(value, 0), 100);
}
