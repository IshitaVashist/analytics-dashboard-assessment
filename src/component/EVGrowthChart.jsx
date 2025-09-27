import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EVGrowthChart = ({ data }) => {
    // Memoize processed data to prevent re-computation on every render
    const chartData = useMemo(() => {
        const yearCounts = data.reduce((acc, vehicle) => {
            const year = vehicle['Model Year'];
            if (year) {
                acc[year] = (acc[year] || 0) + 1;
            }
            return acc;
        }, {});

        return Object.keys(yearCounts)
            .map(year => ({
                year: parseInt(year),
                count: yearCounts[year],
            }))
            .sort((a, b) => a.year - b.year); // Sort by year
    }, [data]);

    if (!chartData.length) {
        return <p className="text-center text-slate-500">No data available for the selected filters.</p>;
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="year" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                    labelStyle={{ color: '#cbd5e1' }}
                />
                <Legend />
                <Line type="monotone" dataKey="count" name="Vehicles Registered" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default EVGrowthChart;