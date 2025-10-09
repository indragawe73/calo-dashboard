import ChartWrapper from './ChartWrapper';

const LineChart = ({ data, options = {}, ...props }) => {
  const defaultOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
    ...options,
  };

  return (
    <ChartWrapper
      type="line"
      data={data}
      options={defaultOptions}
      {...props}
    />
  );
};

export default LineChart;
