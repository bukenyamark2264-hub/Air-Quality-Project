/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StateProvider, useAppState } from './managers/StateManager';
import { MapManager } from './managers/MapManager';
import { StageManager } from './managers/StageManager';
import { Map, LayoutGrid, Flame, ListFilter, RefreshCw, AlertCircle, Info, Thermometer, X, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AQI_LEVELS, getAQILevel } from './constants';
import * as AirQoIcons from '@airqo/icons-react';
import { useState } from 'react';

const AirQoIcon = ({ name, size = 24, color = 'currentColor', className = '' }: { name: string, size?: number, color?: string, className?: string }) => {
  const Icon = (AirQoIcons as any)[name];
  if (!Icon) return null;
  return <Icon size={size} color={color} className={className} />;
};

const AQILegend = ({ onClose }: { onClose: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95, y: 10 }}
    className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-xl pointer-events-auto relative group"
  >
    <div className="flex justify-between items-center mb-3 px-1">
      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AQI Scale (PM2.5)</h4>
      <button 
        onClick={onClose}
        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 rounded-md transition-all text-slate-400"
      >
        <X size={12} />
      </button>
    </div>
    <div className="flex flex-col gap-1.5">
      {AQI_LEVELS.map((level) => (
        <div key={level.name} className="flex items-center gap-3 p-1 rounded-lg hover:bg-slate-50 transition-colors">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm" 
            style={{ backgroundColor: `${level.color}20` }} 
          >
            <AirQoIcon name={level.icon} size={20} color={level.color} />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-700 leading-none">{level.name}</span>
            <span className="text-[9px] text-slate-400 font-medium leading-tight">
              {level.min}-{level.max === 999 ? '+' : level.max} µg/m³
            </span>
            <span className="text-[8px] text-slate-500 italic leading-tight max-w-[150px] mt-0.5">
              {(level as any).maskRecommendation}
            </span>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

const DashboardUI = () => {
  const { state, setActiveModule, refreshData } = useAppState();
  const [showStats, setShowStats] = useState(true);
  const [showLegend, setShowLegend] = useState(true);

  const avgPM25 = state.measurements.length > 0 
    ? state.measurements.reduce((sum, m) => sum + m.weight, 0) / state.measurements.length 
    : 0;

  const status = getAQILevel(avgPM25);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col p-4 md:p-6 gap-6 z-10 overflow-hidden">
      <div className="flex flex-col md:flex-row gap-6 h-full">
        {/* Sidebar - Controls */}
        <div className="w-full md:w-80 pointer-events-auto flex flex-col gap-4">
          <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-5 shadow-xl shadow-slate-200/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                <Map size={20} />
              </div>
              <div>
                <h1 className="font-bold text-slate-900 tracking-tight">AirQo Monitor</h1>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Kampala Metropolitan</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Visualization Mode</p>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => setActiveModule('clustering')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    state.activeModule === 'clustering'
                      ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <LayoutGrid size={18} className={state.activeModule === 'clustering' ? 'text-blue-600' : 'text-slate-400'} />
                  Station Clusters
                </button>
                <button
                  onClick={() => setActiveModule('heatmap')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    state.activeModule === 'heatmap'
                      ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Flame size={18} className={state.activeModule === 'heatmap' ? 'text-blue-600' : 'text-slate-400'} />
                  Intensity Heatmap
                </button>
                <button
                  onClick={() => setActiveModule('markers')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    state.activeModule === 'markers'
                      ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <ListFilter size={18} className={state.activeModule === 'markers' ? 'text-blue-600' : 'text-slate-400'} />
                  Detailed Nodes
                </button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-2">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Display Options</p>
              <button
                onClick={() => setShowStats(!showStats)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-bold transition-all ${
                  showStats ? 'bg-slate-50 text-slate-700' : 'bg-transparent text-slate-400 border border-slate-100'
                }`}
              >
                {showStats ? <Eye size={14} /> : <EyeOff size={14} />}
                {showStats ? 'Hide' : 'Show'} Metropolitan Stats
              </button>
              <button
                onClick={() => setShowLegend(!showLegend)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-bold transition-all ${
                  showLegend ? 'bg-slate-50 text-slate-700' : 'bg-transparent text-slate-400 border border-slate-100'
                }`}
              >
                {showLegend ? <Eye size={14} /> : <EyeOff size={14} />}
                {showLegend ? 'Hide' : 'Show'} Air Quality Legend
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <button
                onClick={refreshData}
                disabled={state.loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                <RefreshCw size={14} className={state.loading ? 'animate-spin' : ''} />
                Sync Live Data
              </button>
              {state.error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2">
                  <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-red-600 leading-tight">{state.error}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="flex-1 pointer-events-none flex flex-col items-start gap-4">
          <AnimatePresence mode="wait">
            {!state.loading && state.measurements.length > 0 && showStats && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-5 shadow-lg pointer-events-auto min-w-[280px] group relative"
              >
                <button 
                  onClick={() => setShowStats(false)}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 rounded-md transition-all text-slate-400"
                >
                  <X size={14} />
                </button>
                <div className="flex justify-between items-start mb-4 gap-4 pr-6">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Metropolitan Avg</p>
                    <h3 className="text-sm font-bold text-slate-700">{status.name}</h3>
                  </div>
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200 shrink-0"
                    style={{ backgroundColor: status.color }}
                  >
                    <AirQoIcon name={status.icon} size={32} color="#FFFFFF" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-3xl font-bold text-slate-900 flex items-baseline gap-1">
                      {avgPM25.toFixed(1)}
                      <span className="text-sm font-medium text-slate-400 lowercase italic">µg/m³</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">Average PM2.5 Concentration</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                    <div>
                      <p className="text-lg font-bold text-slate-900">{state.measurements.length}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-black">Active Nodes</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-slate-900">
                        {Math.max(...state.measurements.map(m => m.weight)).toFixed(0)}
                      </p>
                      <p className="text-[10px] text-slate-400 uppercase font-black">Peak Level</p>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t border-blue-50">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <ShieldCheck size={12} />
                      Walking Guidance
                    </p>
                    <p className="text-[11px] text-slate-700 leading-normal font-medium bg-blue-50/50 p-2 rounded-lg border border-blue-100">
                      {(status as any).maskRecommendation}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Info & Legend Section */}
        <div className="mt-auto pointer-events-auto flex flex-col gap-4 self-end md:self-end">
          <AnimatePresence>
            {showLegend && <AQILegend onClose={() => setShowLegend(false)} />}
          </AnimatePresence>
          
          <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-lg flex items-center gap-3 max-w-[280px]">
            <Info size={16} className="text-blue-500 shrink-0" />
            <p className="text-[11px] text-slate-600 leading-tight">
              Nodes across <span className="font-bold text-slate-900">Kampala</span> provide live PM2.5 readings. Switch to <span className="text-blue-600 italic">Heatmap</span> for density analysis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <StateProvider>
      <div className="relative w-full h-screen overflow-hidden bg-slate-50">
        <MapManager>
          <StageManager />
        </MapManager>
        <DashboardUI />
      </div>
    </StateProvider>
  );
}
