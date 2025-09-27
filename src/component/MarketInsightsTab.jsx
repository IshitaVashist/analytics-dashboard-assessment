import React, { useMemo } from 'react';
import { ScatterChart, Scatter, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, ZAxis } from 'recharts';
import { KPICard } from './KPICard'; // Assuming KPICard is in a separate file

// --- Chart Components for this Tab ---

const PriceVsRangeChart = ({ data }) => {
  const chartData = useMemo(() => data.filter(v => v['Base MSRP'] > 0).map(v => ({
    msrp: v['Base MSRP'], range: v['Electric Range'], make: v['Make']
  })), [data]);
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart><CartesianGrid /><XAxis type="number" dataKey="range" name="Electric Range" unit="mi" /><YAxis type="number" dataKey="msrp" name="Base MSRP" unit="$" tickFormatter={(v) => `$${(v/1000)}k`} /><ZAxis dataKey="make" name="Make" /><Tooltip cursor={{ strokeDasharray: '3 3' }} /><Legend /><Scatter name="Models" data={chartData} fill="#ef4444" /></ScatterChart>
    </ResponsiveContainer>
  );
};

const EligibilityChart = ({ data }) => {
  const COLORS = ['#3b82f6', '#fbbf24', '#a8a29e'];
  const chartData = useMemo(() => {
    const counts = data.reduce((acc, v) => { acc[v['Clean Alternative Fuel Vehicle (CAFV) Eligibility']] = (acc[v['Clean Alternative Fuel Vehicle (CAFV) Eligibility']] || 0) + 1; return acc; }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [data]);
  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart><Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} label>{chartData.map((e, i) => <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart>
    </ResponsiveContainer>
  );
};

// --- Main Tab Component ---

const MarketInsightsTab = ({ data }) => {
    return (
        <div className="flex flex-col gap-8">
            <KPICard title="Electric Range (mi) vs. Base MSRP ($)"><PriceVsRangeChart data={data} /></KPICard>
            <KPICard title="CAFV Eligibility Breakdown"><EligibilityChart data={data} /></KPICard>
        </div>
    );
};

export default MarketInsightsTab;
