import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MakePopularity = ({ data }) => {
    const chartData = useMemo(() => {
        const makeCounts = data.reduce((acc, vehicle) => {
            const make = vehicle['Make'];
            if (make) {
                acc[make] = (acc[make] || 0) + 1;
            }
            return acc;
        }, {});

        return Object.keys(makeCounts)
            .map(make => ({
                make: make,
                count: makeCounts[make],
            }))
            .sort((a, b) => b.count - a.count) // Sort descending
            .slice(0, 10); // Get top 10
    }, [data]);
    
    if (!chartData.length) {
        return <p className="text-center text-slate-500">No data available for the selected filters.</p>;
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis type="category" dataKey="make" width={80} stroke="#94a3b8" />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                    labelStyle={{ color: '#cbd5e1' }}
                />
                <Legend />
                <Bar dataKey="count" name="Vehicle Count" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default MakePopularity;