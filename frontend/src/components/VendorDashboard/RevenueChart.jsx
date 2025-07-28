import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RevenueChart = ({ revenueData }) => {
  const data = {
    labels: revenueData.map((d) => d.month),
    datasets: [
      {
        label: "Profit",
        data: revenueData.map((d) => d.profit),
        backgroundColor: "rgba(54, 162, 235, 0.7)",
      },
      {
        label: "Loss",
        data: revenueData.map((d) => d.loss),
        backgroundColor: "rgba(201, 203, 207, 0.7)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Total Revenue",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default RevenueChart;
