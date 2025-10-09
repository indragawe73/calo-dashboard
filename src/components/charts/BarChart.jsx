import ChartWrapper from './ChartWrapper';

const BarChart = ({ data, options = {}, ...props }) => {
  const defaultOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    ...options,
  };

  return (
    <ChartWrapper
      type="bar"
      data={data}
      options={defaultOptions}
      {...props}
    />
  );
};

export default BarChart;
