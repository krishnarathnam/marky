import React from 'react';
import HeatMap from '@uiw/react-heat-map';

// Get the current year
const currentYear = new Date().getFullYear();

// Set start date to the first day of the current year
const startDate = new Date(currentYear, 0, 1);

// Set end date to the last day of the current year
const endDate = new Date(currentYear, 12, 31);

// Example data (you can adjust as needed)
const data = [
  { date: '2025-01-01', value: 5 },
  { date: '2025-02-14', value: 8 },
  { date: '2025-06-21', value: 10 },
  { date: '2025-12-31', value: 12 },
  // Add more data points as needed
];

const Home = () => {
  return (
    <div>
      <h1>Heatmap Example</h1>
      <HeatMap
        data={data}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
};

export default Home;
