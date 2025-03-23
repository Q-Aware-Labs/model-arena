import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { t } from '../utils/translations';

function CustomRadarChart({ data, locale = 'en' }) {
  // Using Recharts for better layout management
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart outerRadius={90} width={500} height={500} data={data}>
        <PolarGrid gridType="polygon" />
        <PolarAngleAxis 
          dataKey="subject" 
          tick={{ 
            fontSize: 10,
            fill: "#4a5568",
            fontWeight: 500
          }}
          tickSize={5}
          style={{
            fontSize: '10px'
          }}
        />
        <PolarRadiusAxis 
          angle={90} 
          domain={[0, 10]} 
          tick={{ fontSize: 8 }}
          tickCount={5}
        />
        <Radar 
          name={t(locale, 'evaluationSection.score_legend')}
          dataKey="A" 
          stroke="#8884d8" 
          fill="#8884d8" 
          fillOpacity={0.6}
          strokeWidth={2}
        />
        <Tooltip 
          formatter={(value) => [`${value}/10`, t(locale, 'evaluationSection.score_legend')]}
          labelFormatter={(label) => `${label}`}
          contentStyle={{ fontSize: '12px' }}
        />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export default CustomRadarChart;