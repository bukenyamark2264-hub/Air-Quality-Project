/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { MapPoint } from '../types';
import { getAQILevel } from '../constants';

interface ClusteringModuleProps {
  data: MapPoint[];
}

export const ClusteringModule = ({ data }: ClusteringModuleProps) => {
  const map = useMap();
  const markerLib = useMapsLibrary('marker');
  const clusterer = useRef<MarkerClusterer | null>(null);
  const [markers, setMarkers] = useState<{[key: string]: google.maps.Marker}>({});

  useEffect(() => {
    if (!map) return;

    if (!clusterer.current) {
       clusterer.current = new MarkerClusterer({ map });
    }

    return () => {
      clusterer.current?.clearMarkers();
    };
  }, [map]);

  useEffect(() => {
    if (!clusterer.current || !map || !markerLib) return;

    // Remove old markers
    const oldMarkers = Object.values(markers) as google.maps.Marker[];
    clusterer.current.clearMarkers();
    oldMarkers.forEach(m => m.setMap(null));

    // Create new markers
    const newMarkers: {[key: string]: google.maps.Marker} = {};
    const markerList: google.maps.Marker[] = data.map(point => {
      const level = getAQILevel(point.weight);
      const m = new google.maps.Marker({
        position: { lat: point.lat, lng: point.lng },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: level.color,
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 1.5,
          scale: 10
        },
        label: {
           text: point.weight.toFixed(0),
           color: point.weight > 35 ? 'white' : '#475569',
           fontSize: '9px',
           fontWeight: 'bold'
        },
        title: `PM2.5: ${point.weight}`
      });
      newMarkers[point.id] = m;
      return m;
    });

    clusterer.current.addMarkers(markerList);
    setMarkers(newMarkers);

  }, [data, markerLib, map]);

  return null;
};
