import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const InteractiveCharts = ({ customers, interactions }) => {
  // Customer Growth Chart Data
  const customerGrowthData = useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date.toLocaleString('default', { month: 'short' });
    }).reverse();

    const monthlyData = last6Months.map(month => {
      // Mock data - replace with actual monthly customer counts
      return Math.floor(Math.random() * 50) + 20;
    });

    return {
      labels: last6Months,
      datasets: [
        {
          label: 'New Customers',
          data: monthlyData,
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
          tension: 0.4,
        },
      ],
    };
  }, [customers]);

  // Interaction Trends Chart Data
  const interactionTrendsData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toLocaleString('default', { weekday: 'short' });
    }).reverse();

    const dailyInteractions = last7Days.map(day => {
      // Count interactions for each day (mock for now)
      return Math.floor(Math.random() * 20) + 5;
    });

    return {
      labels: last7Days,
      datasets: [
        {
          label: 'Daily Interactions',
          data: dailyInteractions,
          borderColor: 'rgba(16, 185, 129, 1)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }, [interactions]);

  // Customer Distribution Chart Data
  const customerDistributionData = useMemo(() => {
    const industries = ['Technology', 'Finance', 'Healthcare', 'Retail', 'Other'];
    const industryCounts = industries.map(industry => 
      customers.filter(c => c.industry === industry).length
    );

    return {
      labels: industries,
      datasets: [
        {
          data: industryCounts,
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(156, 163, 175, 0.8)',
          ],
          borderWidth: 2,
          borderColor: '#fff',
        },
      ],
    };
  }, [customers]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    maintainAspectRatio: false,
  };

  const lineChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Customer Growth Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Growth</h3>
        <div className="h-64">
          <Line data={customerGrowthData} options={lineChartOptions} />
        </div>
      </div>

      {/* Interaction Trends Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Interaction Trends</h3>
        <div className="h-64">
          <Line data={interactionTrendsData} options={lineChartOptions} />
        </div>
      </div>

      {/* Customer Distribution Chart */}
      <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Distribution by Industry</h3>
        <div className="h-64">
          <Doughnut data={customerDistributionData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default InteractiveCharts;