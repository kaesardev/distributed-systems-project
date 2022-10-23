import { Chart as ChartJS, LinearScale, LineController, LineElement, PointElement, Title } from 'chart.js';
import 'chartjs-adapter-luxon';
import StreamingPlugin from 'chartjs-plugin-streaming';
import { Line } from 'react-chartjs-2';

ChartJS.register(StreamingPlugin, LineController, LineElement, PointElement, LinearScale, Title);

export const ChartComponent = () => {
  return (
    <Line
      data={{
        datasets: [{
          label: 'Dataset 1',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgb(255, 99, 132)',
          borderDash: [8, 4],
          fill: true,
          data: []
        }, {
          label: 'Dataset 2',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgb(54, 162, 235)',
          cubicInterpolationMode: 'monotone',
          fill: true,
          data: []
        }]
      }}
      options={{
        scales: {
          x: {
            type: 'realtime',
            realtime: {
              delay: 5000,
              refresh: 1000,
              duration: 60000,
              onRefresh: chart => {
                chart.data.datasets.forEach(dataset => {
                  dataset.label === 'Dataset 1' ? dataset.data.push({
                    x: Date.now(),
                    y: Math.random()
                  }) : dataset.data.push({
                    x: Date.now(),
                    y: 0.40
                  });
                });
              }
            }
          }
        }
      }}
    />
  );
};
