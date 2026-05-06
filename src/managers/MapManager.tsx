/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { ReactNode } from 'react';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';

export const MapManager = ({ children }: { children: ReactNode }) => {
  const hasValidKey = Boolean(GOOGLE_MAPS_API_KEY) && GOOGLE_MAPS_API_KEY !== 'YOUR_API_KEY';

  if (!hasValidKey) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 p-6 font-sans text-slate-900">
        <div className="max-w-xl bg-white border border-slate-200 rounded-2xl p-10 shadow-xl">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">Google Maps API Key Required</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            To visualize AirQo sensor data, you need a Google Maps Platform API Key.
          </p>
          <div className="space-y-4 text-sm text-slate-700">
            <div className="flex gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-xs font-bold shrink-0 mt-0.5">1</span>
              <p>Get an API key from the <a href="https://console.cloud.google.com/google/maps-apis/start" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">Google Cloud Console</a>.</p>
            </div>
            <div className="flex gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-xs font-bold shrink-0 mt-0.5">2</span>
              <div>
                <p className="font-medium mb-1">Add your key as a secret in AI Studio:</p>
                <ul className="list-disc ml-5 space-y-1 opacity-80">
                  <li>Open <b>Settings</b> (⚙️ gear icon, top-right)</li>
                  <li>Click <b>Secrets</b></li>
                  <li>Name: <code className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">GOOGLE_MAPS_PLATFORM_KEY</code></li>
                  <li>Paste your key and press Enter</li>
                </ul>
              </div>
            </div>
          </div>
          <p className="mt-8 text-xs text-slate-400 text-center italic">The application will rebuild automatically after saving.</p>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY} version="weekly">
      <Map
        defaultCenter={{ lat: 0.3476, lng: 32.5825 }} // Center on Kampala/Uganda
        defaultZoom={11}
        mapId="AIRQO_POLLUTION_MAP"
        className="w-full h-full"
        gestureHandling={'greedy'}
        disableDefaultUI={false}
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
      >
        {children}
      </Map>
    </APIProvider>
  );
};
