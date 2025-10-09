import ChartWrapper from './ChartWrapper';

const PieChart = ({ data, options = {}, ...props }) => {
  const defaultOptions = {
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    ...options,
  };

  return (
    <ChartWrapper
      type="pie"
      data={data}
      options={defaultOptions}
      {...props}
    />
  );
};

export default PieChart;
