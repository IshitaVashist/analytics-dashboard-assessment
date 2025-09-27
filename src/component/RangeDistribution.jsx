import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RangeDistribution = ({ data }) => {
    const chartData = useMemo(() => {
        const rangeBins = {
            '0-50': 0, '51-100': 0, '101-150': 0, '151-200': 0, '201-250': 0, '251-300': 0, '301+': 0
        };

        data.forEach(vehicle => {
            const range = vehicle['Electric Range'];
            if (range === 0) return; // Ignore vehicles with 0 range (often placeholders)
            if (range > 0 && range <= 50) rangeBins['0-50']++;
            else if (range <= 100) rangeBins['51-100']++;
            else if (range <= 150) rangeBins['101-150']++;
            else if (range <= 200) rangeBins['151-200']++;
            else if (range <= 250) rangeBins['201-250']++;
            else if (range <= 300) rangeBins['251-300']++;
            else if (range > 300) rangeBins['301+']++;
        });

        return Object.keys(rangeBins).map(range => ({
            range: range,
            count: rangeBins[range],
        }));
    }, [data]);
    
    if (!data.length) {
        return <p className="text-center text-slate-500">No data available for the selected filters.</p>;
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="range" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                    labelStyle={{ color: '#cbd5e1' }}
                />
                <Legend />
                <Bar dataKey="count" name="Number of Vehicles" fill="#22c55e" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default RangeDistribution;