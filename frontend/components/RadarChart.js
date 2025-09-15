"use client";

import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function RadarChart({ testResults }) {
  const labels = Object.keys(testResults || {});
  const data = {
    labels,
    datasets: [
      {
        label: "Skill Test Scores",
        data: labels.map((label) => testResults[label]),
        fill: true,
        backgroundColor: "rgba(219, 39, 119, 0.4)",
        borderColor: "rgb(219, 39, 119)",
        pointBackgroundColor: "rgb(219, 39, 119)",
        pointBorderColor: "#fff",
      },
    ],
  };

  const options = {
    scales: {
      r: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return <Radar data={data} options={options} />;
}
