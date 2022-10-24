import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Chart as ChartJS,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
} from "chart.js";
import "chartjs-adapter-luxon";
import StreamingPlugin from "chartjs-plugin-streaming";
import { Line } from "react-chartjs-2";

ChartJS.register(
  StreamingPlugin,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title
);

interface CharProps {
  stock: string;
}

const Chart = forwardRef((props: CharProps, ref) => {
  const chartRef = useRef<ChartJS<any>>(null);

  useImperativeHandle(ref, () => ({
    getChart() {
      return chartRef.current;
    },
  }));

  return (
    <Line
      ref={chartRef}
      data={{
        datasets: [
          {
            label: "Dataset 1",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            borderColor: "rgb(255, 99, 132)",
            cubicInterpolationMode: "monotone",
            borderDash: [8, 4],
            fill: true,
            data: [],
          },
          {
            label: "Dataset 2",
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            borderColor: "rgb(54, 162, 235)",
            fill: true,
            data: [],
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: "realtime",
            realtime: {
              delay: 1000,
              refresh: 1000,
              duration: 60 * 1000,
              // onRefresh: (chart) => {
              //   chart.data.datasets.forEach((dataset) => {
              //     dataset.label === "Dataset 1"
              //       ? dataset.data.push({
              //           x: Date.now(),
              //           y: Math.random(),
              //         })
              //       : dataset.data.push({
              //           x: Date.now(),
              //           y: 0.4,
              //         });
              //   });
              // },
            },
          },
        },
      }}
    />
  );
});

const areEqual = (prevProps: CharProps, nextProps: CharProps) =>
  prevProps.stock === nextProps.stock;

export const ChartComponent = React.memo(Chart, areEqual);
