import React from 'react';
import { Line } from "react-chartjs-2";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

const StatsLineChart = (props) => {

    const data = {
        labels: props.stlabels,
        datasets: props.data_set
    }
    const options= {
        plugins: {
            title: {
                display: true,
                text: props.title
              }
        },
        scales: {
          x: { title: 
            { display: true, text: props.x_axis_title }
          },
          y: { title: { 
                        display: true, text: props.y_axis_title 
                      },
                precision: 0
          }
        }
      }
    return (
        <div>
            <Line data={data} options= {options} />
            {/* {console.log(randomColor())} */}
        </div>
    );
};

export default StatsLineChart;