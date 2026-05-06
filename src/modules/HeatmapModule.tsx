/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { MapPoint } from '../types';
import { normalizePM25 } from '../services/airqoService';

interface HeatmapModuleProps {
  data: MapPoint[];
}

export const HeatmapModule = ({ data }: HeatmapModuleProps) => {
  const map = useMap();

  const overlay = useMemo(() => {
    return new GoogleMapsOverlay({
      layers: [
        new HeatmapLayer({
          id: 'airqo-heatmap',
          data,
          getPosition: (d: MapPoint) => [d.lng, d.lat],
          getWeight: (d: MapPoint) => normalizePM25(d.weight),
          radiusPixels: 40,
          intensity: 1,
          threshold: 0.05,
          aggregation: 'SUM'
        })
      ]
    });
  }, [data]);

  useEffect(() => {
    if (!map) return;
    overlay.setMap(map);
    return () => overlay.setMap(null);
  }, [map, overlay]);

  return null;
};
