import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { KPICard } from './KPICard'; // Assuming KPICard is in a separate file

// --- Chart Components for this Tab ---

const TopCountiesChart = ({ data }) => {
  const chartData = useMemo(() => {
    const counts = data.reduce((acc, v) => { acc[v.County] = (acc[v.County] || 0) + 1; return acc; }, {});
    return Object.entries(counts).map(([county, count]) => ({ county, count })).sort((a, b) => b.count - a.count).slice(0, 10);
  }, [data]);
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData} layout="vertical" margin={{ left: 40 }}><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis type="category" dataKey="county" width={80} /><Tooltip /><Legend /><Bar dataKey="count" fill="#f59e0b" /></BarChart>
    </ResponsiveContainer>
  );
};

const TopCitiesChart = ({ data }) => {
  const chartData = useMemo(() => {
    const counts = data.reduce((acc, v) => { acc[v.City] = (acc[v.City] || 0) + 1; return acc; }, {});
    return Object.entries(counts).map(([city, count]) => ({ city, count })).sort((a, b) => b.count - a.count).slice(0, 10);
  }, [data]);
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData} layout="vertical" margin={{ left: 40 }}><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis type="category" dataKey="city" width={80} /><Tooltip /><Legend /><Bar dataKey="count" fill="#10b981" /></BarChart>
    </ResponsiveContainer>
  );
};

// --- Main Tab Component ---

const GeographicAnalysisTab = ({ data }) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <KPICard title="Top 10 Counties by EV Registrations"><TopCountiesChart data={data} /></KPICard>
      <KPICard title="Top 10 Cities by EV Registrations"><TopCitiesChart data={data} /></KPICard>
    </div>
  );
};

export default GeographicAnalysisTab;
