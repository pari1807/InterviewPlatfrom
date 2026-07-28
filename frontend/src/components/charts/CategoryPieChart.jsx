import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryPieChart() {
  const data = {
    labels: ["Arrays & Hashing", "Two Pointers", "Linked List", "Trees & Graphs", "Dynamic Programming"],
    datasets: [
      {
        data: [35, 20, 15, 18, 12],
        backgroundColor: ["#10b981", "#14b8a6", "#06b6d4", "#3b82f6", "#8b5cf6"],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: { size: 11 },
          color: "#475569",
          usePointStyle: true,
          boxWidth: 8,
        },
      },
    },
  };

  return (
    <div className="h-64 w-full flex items-center justify-center">
      <Doughnut data={data} options={options} />
    </div>
  );
}
