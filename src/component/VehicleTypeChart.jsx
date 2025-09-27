import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F']; // Colors for BEV and PHEV

const VehicleTypeChart = ({ data }) => {
    const chartData = useMemo(() => {
        const typeCounts = data.reduce((acc, vehicle) => {
            const type = vehicle['Electric Vehicle Type'];
            if (type) {
                acc[type] = (acc[type] || 0) + 1;
            }
            return acc;
        }, {});

        return Object.keys(typeCounts).map(type => ({
            name: type,
            value: typeCounts[type],
        }));
    }, [data]);
    
    if (!chartData.length) {
        return <p className="text-center text-slate-500">No data available for the selected filters.</p>;
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                    labelStyle={{ color: '#cbd5e1' }}
                />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default VehicleTypeChart;