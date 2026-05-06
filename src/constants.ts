/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const AQI_LEVELS = [
  { 
    name: 'Good', 
    min: 0, 
    max: 12, 
    color: '#00e400', 
    text: 'text-green-600', 
    description: 'Air quality is satisfactory.', 
    icon: 'AqGood',
    maskRecommendation: 'Air is clean. No mask required for outdoor walks.'
  },
  { 
    name: 'Moderate', 
    min: 12.1, 
    max: 35.4, 
    color: '#ffff00', 
    text: 'text-yellow-600', 
    description: 'Sensitive individuals should limit exertion.', 
    icon: 'AqModerate',
    maskRecommendation: 'Sensitive groups should consider wearing a mask if walking near busy roads.'
  },
  { 
    name: 'Sensitive', 
    min: 35.5, 
    max: 55.4, 
    color: '#ff7e00', 
    text: 'text-orange-600', 
    description: 'Unhealthy for sensitive groups.', 
    icon: 'AqUnhealthyForSensitiveGroups',
    maskRecommendation: 'Masks recommended for sensitive groups. Others should avoid long outdoor walks.'
  },
  { 
    name: 'Unhealthy', 
    min: 55.5, 
    max: 150.4, 
    color: '#ff0000', 
    text: 'text-red-600', 
    description: 'Everyone may begin to feel health effects.', 
    icon: 'AqUnhealthy',
    maskRecommendation: 'Everyone should wear a mask for outdoor activities. Limit time outside.'
  },
  { 
    name: 'Very Unhealthy', 
    min: 150.5, 
    max: 250.4, 
    color: '#8f3f97', 
    text: 'text-purple-600', 
    description: 'Health alert: serious effects for all.', 
    icon: 'AqVeryUnhealthy',
    maskRecommendation: 'High-grade masks (N95/KN95) essential for any time spent outdoors.'
  },
  { 
    name: 'Hazardous', 
    min: 250.5, 
    max: 999, 
    color: '#7e0023', 
    text: 'text-maroon-600', 
    description: 'Emergency conditions likely.', 
    icon: 'AqHazardous',
    maskRecommendation: 'DANGER: Wear N95/KN95 masks if you MUST go outside. Stay indoors if possible.'
  },
];

export const getAQILevel = (pm25: number) => {
  return AQI_LEVELS.find(level => pm25 <= level.max) || AQI_LEVELS[AQI_LEVELS.length - 1];
};
