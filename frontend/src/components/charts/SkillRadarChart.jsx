import React from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function SkillRadarChart({ scores }) {
  const data = {
    labels: [
      "Technical Knowledge",
      "Communication",
      "Confidence",
      "Problem Solving",
      "Code Efficiency",
      "Explanation Quality",
    ],
    datasets: [
      {
        label: "Candidate Skill Assessment",
        data: scores || [92, 88, 85, 90, 94, 89],
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        borderColor: "#10b981",
        borderWidth: 2,
        pointBackgroundColor: "#059669",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#059669",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      r: {
        angleLines: { color: "rgba(226, 232, 240, 0.8)" },
        grid: { color: "rgba(226, 232, 240, 0.8)" },
        pointLabels: {
          font: { size: 10, weight: "bold" },
          color: "#475569",
        },
        ticks: {
          display: false,
          min: 0,
          max: 100,
        },
      },
    },
  };

  return (
    <div className="h-64 w-full flex items-center justify-center">
      <Radar data={data} options={options} />
    </div>
  );
}
