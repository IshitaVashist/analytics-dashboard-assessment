import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, ScatterChart, Scatter, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, ZAxis
} from 'recharts';

// --- Data Parsing Utility ---
const parseData = (fileUrl) => {
  return new Promise((resolve, reject) => {
    Papa.parse(fileUrl, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const cleanedData = results.data.filter(row =>
          row['Model Year'] && row['Make'] && row['Electric Vehicle Type'] && row['Electric Range'] !== null
        );
        resolve(cleanedData);
      },
      error: (error) => reject(error),
    });
  });
};


// --- Reusable UI Components ---

const Loader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-600"></div>
      <p className="text-lg text-gray-600 mt-4">Loading EV Data...</p>
    </div>
  </div>
);

const KPICard = ({ title, value, children }) => {
  const isMetricCard = value !== undefined;
  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col h-full">
      {isMetricCard ? (
        <>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider text-center">{title}</p>
          <p className="text-4xl font-bold text-gray-800 mt-2 text-center">{value}</p>
        </>
      ) : (
        <>
          {title && <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>}
          <div className="flex-grow">{children}</div>
        </>
      )}
    </div>
  );
};

const Sidebar = ({ kpis, filters, setFilters, uniqueValues, data }) => {
  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-80 p-6 flex flex-col gap-6 overflow-y-auto bg-gray-50 border-r">
      <KPICard>
        <h2 className="text-2xl font-bold text-gray-800 text-center">EV Analytics</h2>
      </KPICard>
      <KPICard title="Total Registered EVs" value={kpis.totalEVs.toLocaleString()} />
      <KPICard title="Filters">
        <div className="space-y-4">
          {Object.keys(filters).map(key => (
            <div key={key}>
              <label htmlFor={key} className="block text-sm font-medium text-gray-600 mb-1 capitalize">
                {key.replace(/([A-Z])/g, ' $1')}
              </label>
              <select
                id={key} name={key} value={filters[key]} onChange={handleFilterChange}
                className="w-full p-2 border rounded-md bg-white border-gray-300 focus:ring-2 focus:ring-blue-500"
              >
                {uniqueValues[key].map(option => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
          ))}
        </div>
      </KPICard>
      <KPICard title="Top 5 Makes">
        <MakePopularityChart data={data} />
      </KPICard>
    </aside>
  );
};


// --- Chart Components ---

// --- Overview Tab Charts ---
const EVGrowthChart = ({ data }) => {
  const chartData = useMemo(() => {
    const counts = data.reduce((acc, v) => { acc[v['Model Year']] = (acc[v['Model Year']] || 0) + 1; return acc; }, {});
    return Object.entries(counts).map(([year, count]) => ({ year: +year, count })).sort((a, b) => a.year - b.year);
  }, [data]);
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="count" name="Vehicles" stroke="#3b82f6" /></LineChart>
    </ResponsiveContainer>
  );
};

const MakePopularityChart = ({ data }) => {
  const chartData = useMemo(() => {
    const counts = data.reduce((acc, v) => { acc[v['Make']] = (acc[v['Make']] || 0) + 1; return acc; }, {});
    return Object.entries(counts).map(([make, count]) => ({ make, count })).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [data]);
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={chartData} layout="vertical" margin={{ left: 30 }}><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis type="category" dataKey="make" width={60} /><Tooltip /><Bar dataKey="count" fill="#8884d8" /></BarChart>
    </ResponsiveContainer>
  );
};

const VehicleTypeChart = ({ data }) => {
  const COLORS = ['#0088FE', '#00C49F'];
  const chartData = useMemo(() => {
    const counts = data.reduce((acc, v) => { acc[v['Electric Vehicle Type']] = (acc[v['Electric Vehicle Type']] || 0) + 1; return acc; }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [data]);
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart><Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>{chartData.map((e, i) => <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart>
    </ResponsiveContainer>
  );
};

const RangeDistributionChart = ({ data }) => {
  const chartData = useMemo(() => {
    const bins = { '0-100': 0, '101-200': 0, '201-300': 0, '301+': 0 };
    data.forEach(v => {
      const r = v['Electric Range']; if (!r) return;
      if (r > 0 && r <= 100) bins['0-100']++; else if (r <= 200) bins['101-200']++; else if (r <= 300) bins['201-300']++; else if (r > 300) bins['301+']++;
    });
    return Object.entries(bins).map(([range, count]) => ({ range, count }));
  }, [data]);
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="range" /><YAxis /><Tooltip /><Legend /><Bar dataKey="count" name="Vehicles" fill="#34d399" /></BarChart>
    </ResponsiveContainer>
  );
};

// --- Geographic Analysis Tab Charts (NEW) ---
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

// --- Market Insights Tab Charts (NEW) ---
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

// --- Main App Component ---
function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [filters, setFilters] = useState({ modelYear: 'All', make: 'All', electricVehicleType: 'All' });

  useEffect(() => {
    parseData('/ev_data.csv').then(setData).catch(err => setError("Failed to load data.")).finally(() => setLoading(false));
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(item =>
      (filters.modelYear === 'All' || item['Model Year'] == filters.modelYear) &&
      (filters.make === 'All' || item['Make'] === filters.make) &&
      (filters.electricVehicleType === 'All' || item['Electric Vehicle Type'] === filters.electricVehicleType)
    );
  }, [data, filters]);

  const uniqueValues = useMemo(() => ({
    modelYear: ['All', ...new Set(data.map(i => i['Model Year']))].sort((a,b) => (a==='All'?-1:b==='All'?1:b-a)),
    make: ['All', ...new Set(data.map(i => i['Make']))].sort(),
    electricVehicleType: ['All', ...new Set(data.map(i => i['Electric Vehicle Type']))].sort(),
  }), [data]);

  const kpis = useMemo(() => {
    const total = filteredData.length; if (total === 0) return { totalEVs: 0, bevP: 0, phevP: 0, makes: 0 };
    const bevC = filteredData.filter(d => d['Electric Vehicle Type'] === 'Battery Electric Vehicle (BEV)').length;
    return {
      totalEVs: total,
      bevP: Math.round((bevC / total) * 100),
      phevP: 100 - Math.round((bevC / total) * 100),
      makes: new Set(filteredData.map(d => d['Make'])).size
    };
  }, [filteredData]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Geographic Analysis':
        return (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <KPICard title="Top 10 Counties by EV Registrations"><TopCountiesChart data={filteredData} /></KPICard>
            <KPICard title="Top 10 Cities by EV Registrations"><TopCitiesChart data={filteredData} /></KPICard>
          </div>
        );
      case 'Market Insights':
        return (
          <div className="flex flex-col gap-8">
            <KPICard title="Electric Range (mi) vs. Base MSRP ($)"><PriceVsRangeChart data={filteredData} /></KPICard>
            <KPICard title="CAFV Eligibility Breakdown"><EligibilityChart data={filteredData} /></KPICard>
          </div>
        );
      case 'Overview':
      default:
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <KPICard title="Fully Electric (BEV) Share" value={`${kpis.bevP}%`} />
              <KPICard title="Plug-in Hybrid (PHEV) Share" value={`${kpis.phevP}%`} />
              <KPICard title="Market Brand Diversity" value={kpis.makes} />
            </div>
            <KPICard title="EV Growth Trend"><EVGrowthChart data={filteredData} /></KPICard>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <KPICard title="Vehicle Type Distribution"><VehicleTypeChart data={filteredData} /></KPICard>
              <KPICard title="Electric Range Distribution (miles)"><RangeDistributionChart data={filteredData} /></KPICard>
            </div>
          </>
        );
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-600"><p>{error}</p></div>;

  const tabs = ['Overview', 'Geographic Analysis', 'Market Insights'];

  return (
    <div className="flex bg-gray-100 font-sans">
      <Sidebar kpis={kpis} filters={filters} setFilters={setFilters} uniqueValues={uniqueValues} data={filteredData} />
      <main className="flex-1 p-8 ml-80 flex flex-col gap-8">
        <KPICard><h1 className="text-4xl font-bold text-gray-800 text-center">EV Analytics Dashboard</h1></KPICard>
        <div className="bg-white p-2 rounded-xl shadow-md">
          <nav className="flex items-center justify-center space-x-2">
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold rounded-lg transition-colors duration-200 ${
                  activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'bg-transparent text-gray-600 hover:bg-blue-100'
                }`}
              >{tab}</button>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-8">{renderTabContent()}</div>
      </main>
    </div>
  );
}

export default App;

