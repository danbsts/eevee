import React from "react";
import { Line } from "react-chartjs-2";

const options = {
  scales: {
    yAxes: [
      {
        type: "linear",
        display: true,
        position: "left",
        id: "y-axis-1",
      },
    ],
  },
  maintainAspectRatio: true,
};

const Chart = ({ data }) => {
  return (
    <>
      <Line data={data} options={options} width={5} height={1} />
    </>
  );
};

export default Chart;
