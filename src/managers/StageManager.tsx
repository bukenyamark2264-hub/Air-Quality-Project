/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useAppState } from './StateManager';
import { HeatmapModule } from '../modules/HeatmapModule';
import { MarkerModule } from '../modules/MarkerModule';
import { ClusteringModule } from '../modules/ClusteringModule';

export const StageManager = () => {
  const { state } = useAppState();

  if (state.loading && state.measurements.length === 0) {
    return (
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-full border border-slate-200 shadow-sm flex items-center gap-3">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        <span className="text-xs font-medium text-slate-600">Fetching sensor data...</span>
      </div>
    );
  }

  return (
    <>
      {state.activeModule === 'heatmap' && <HeatmapModule data={state.measurements} />}
      {state.activeModule === 'markers' && <MarkerModule data={state.measurements} />}
      {state.activeModule === 'clustering' && <ClusteringModule data={state.measurements} />}
    </>
  );
};
