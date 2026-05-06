/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AirQoMeasurement {
  site_id: string;
  time: string;
  pm2_5: {
    value: number;
  };
  pm10?: {
    value: number;
  };
  siteDetails?: {
    approximate_latitude: number;
    approximate_longitude: number;
    formatted_name?: string;
    city?: string;
  };
  aqi_category?: string;
  aqi_index?: number;
}

export interface MapPoint {
  lat: number;
  lng: number;
  weight: number; // PM2.5 value normalized or raw
  id: string;
  metadata: any;
}

export interface AppState {
  measurements: MapPoint[];
  loading: boolean;
  error: string | null;
  activeModule: 'markers' | 'heatmap' | 'clustering';
}
