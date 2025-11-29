import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { CoreValue } from '../types';

interface ValuesChartProps {
  data: CoreValue[];
}

const ValuesChart: React.FC<ValuesChartProps> = ({ data }) => {
  // Transform data for Recharts
  const chartData = data.map(v => ({
    subject: v.name,
    A: v.score,
    fullMark: 100,
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 12, fontWeight: 600 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Focus"
            dataKey="A"
            stroke="#059669"
            strokeWidth={3}
            fill="#10b981"
            fillOpacity={0.3}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            itemStyle={{ color: '#065f46' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ValuesChart;