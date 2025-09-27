import React from 'react';

/**
 * A versatile card component that can display a simple metric (title and value)
 * or act as a container for more complex children, like charts or forms.
 * It adjusts its styling based on the props it receives.
 * @param {object} props - The component props.
 * @param {string} props.title - The title to display.
 * @param {string|number} [props.value] - The metric value to display. If provided, the card styles as a metric card.
 * @param {React.ReactNode} [props.children] - Child elements to render inside the card (e.g., a chart).
 */
const KPICard = ({ title, value, children }) => {
  // A card is considered a "metric" card if it has a `value` prop. Otherwise, it's a content card.
  const isMetricCard = value !== undefined;

  return (
    <div className="bg-card p-4 sm:p-6 rounded-lg shadow-card flex flex-col">
      {/* Metric cards have smaller, centered, uppercase titles */}
      {isMetricCard ? (
        <p className="text-sm font-medium text-text-secondary uppercase tracking-wider text-center">{title}</p>
      ) : (
        // Content cards (like for charts) have larger, left-aligned titles
        <h3 className="text-xl font-semibold mb-4 text-text-primary">{title}</h3>
      )}

      {/* Render the main content: either the value or the children */}
      {isMetricCard ? (
        <p className="text-3xl font-bold text-text-primary mt-1 text-center">{value}</p>
      ) : (
        <div className="flex-grow mt-2">{children}</div> // Add a small top margin for children
      )}
    </div>
  );
};

export default KPICard;

