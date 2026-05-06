/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AppState, MapPoint } from '../types';
import { fetchAirQualityData } from '../services/airqoService';

interface StateContextType {
  state: AppState;
  setActiveModule: (module: AppState['activeModule']) => void;
  refreshData: () => Promise<void>;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export function StateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    measurements: [],
    loading: true,
    error: null,
    activeModule: 'clustering',
  });

  const refreshData = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await fetchAirQualityData();
      setState(prev => ({ ...prev, measurements: data, loading: false }));
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: err instanceof Error ? err.message : 'Unknown error' 
      }));
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const setActiveModule = (activeModule: AppState['activeModule']) => {
    setState(prev => ({ ...prev, activeModule }));
  };

  return (
    <StateContext.Provider value={{ state, setActiveModule, refreshData }}>
      {children}
    </StateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within a StateProvider');
  }
  return context;
}
