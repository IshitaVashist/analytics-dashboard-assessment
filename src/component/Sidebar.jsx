import React from 'react';
import KPICard from './KPICard';
import MakePopularity from './MakePopularity';

const Sidebar = ({ totalEVs, data, filters, setFilters, years, makes, types }) => {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    // The <aside> is a container for multiple cards, with the main page background
    <aside className="fixed top-0 left-0 h-screen w-80 p-6 flex flex-col gap-6 overflow-y-auto bg-background">
      {/* Card 1: Main Title */}
      <KPICard>
        <h2 className="text-2xl font-bold text-text-primary text-center">EV Analytics</h2>
      </KPICard>
      
      {/* Card 2: Total EVs */}
      <KPICard title="Total EVs" value={totalEVs.toLocaleString()} />

      {/* Card 3: Filters */}
      <KPICard title="Filters">
        <div className="space-y-4">
            <div>
                <label htmlFor="year" className="block text-sm font-medium text-text-secondary mb-1">
                    Year
                </label>
                <select
                    id="year"
                    name="year"
                    value={filters.year}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded-md bg-background border-slate-300 focus:ring-2 focus:ring-primary"
                >
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="make" className="block text-sm font-medium text-text-secondary mb-1">
                    Make
                </label>
                <select
                    id="make"
                    name="make"
                    value={filters.make}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded-md bg-background border-slate-300 focus:ring-2 focus:ring-primary"
                >
                    {makes.map(make => (
                        <option key={make} value={make}>{make}</option>
                    ))}
                </select>
            </div>
             <div>
                <label htmlFor="type" className="block text-sm font-medium text-text-secondary mb-1">
                    Vehicle Type
                </label>
                <select
                    id="type"
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded-md bg-background border-slate-300 focus:ring-2 focus:ring-primary"
                >
                    {types.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>
        </div>
      </KPICard>

      {/* Card 4: Top EV Makes Chart */}
      <KPICard title="Top EV Makes / Models">
        <MakePopularity data={data} />
      </KPICard>
    </aside>
  );
};

export default Sidebar;

