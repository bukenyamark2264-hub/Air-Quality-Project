/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { MapPoint } from '../types';
import { useState } from 'react';

interface MarkerModuleProps {
  data: MapPoint[];
}

import { AQI_LEVELS, getAQILevel } from '../constants';
import * as AirQoIcons from '@airqo/icons-react';

const AirQoIcon = ({ name, size = 24, color = 'currentColor', className = '' }: { name: string, size?: number, color?: string, className?: string }) => {
  const Icon = (AirQoIcons as any)[name];
  if (!Icon) return null;
  return <Icon size={size} color={color} className={className} />;
};

const AirMarker = ({ point }: { point: MapPoint }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoWindowShown, setInfoWindowShown] = useState(false);

  // Use shared AQI color logic
  const level = getAQILevel(point.weight);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: point.lat, lng: point.lng }}
        onClick={() => setInfoWindowShown(true)}
        title={`PM2.5: ${point.weight.toFixed(1)}`}
      >
        <div 
          className="relative group transition-transform hover:scale-110 active:scale-95"
          style={{ cursor: 'pointer' }}
        >
          <div 
            className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white transform rotate-45 transition-colors"
            style={{ backgroundColor: level.color }}
          >
            <div className="transform -rotate-45">
              <AirQoIcon name={level.icon} size={24} color="#FFFFFF" />
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-white px-1 py-0.5 rounded-md text-[9px] font-black text-slate-800 shadow-sm border border-slate-100">
            {point.weight.toFixed(0)}
          </div>
        </div>
      </AdvancedMarker>

      {infoWindowShown && (
        <InfoWindow
          anchor={marker}
          onCloseClick={() => setInfoWindowShown(false)}
        >
          <div className="p-1 min-w-[200px]">
            <div className="flex items-center gap-3 mb-3 pb-2 border-b border-slate-100">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                style={{ backgroundColor: `${level.color}20` }}
              >
                <AirQoIcon name={level.icon} size={24} color={level.color} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-xs font-black text-slate-900 leading-tight">
                  {point.metadata.siteDetails?.formatted_name || `Site: ${point.metadata.site_id}`}
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: level.color }}>
                  {level.name}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium whitespace-nowrap">PM2.5 Concentration</span>
                <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-800 font-bold">
                  {point.weight.toFixed(1)} µg/m³
                </span>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-2 mt-2 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Health Guidance</p>
                <p className="text-[10px] text-slate-600 leading-normal">
                  <span className="font-bold text-slate-900">Mask Advice:</span> {(level as any).maskRecommendation}
                </p>
              </div>

              <p className="text-[10px] text-slate-400 mt-2 leading-tight italic">
                {level.description}
              </p>

              <div className="pt-2 mt-2 border-t border-slate-50 flex items-center justify-between">
                 <p className="text-[9px] text-slate-300 uppercase font-black tracking-widest leading-none">
                  AirQo Live Node
                 </p>
                 <p className="text-[9px] text-slate-400 font-medium">
                  {new Date(point.metadata.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </p>
              </div>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export const MarkerModule = ({ data }: MarkerModuleProps) => {
  return (
    <>
      {data.map(point => (
        // @ts-ignore - key is handled by React but TS is being overly strict here
        <AirMarker key={point.id} point={point} />
      ))}
    </>
  );
};
