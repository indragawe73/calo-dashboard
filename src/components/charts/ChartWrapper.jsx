import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler,
  LineController,
  BarController,
  PieController,
  DoughnutController,
  PolarAreaController
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { selectTheme } from '../../store/slices/themeSlice';
import './ChartWrapper.scss';

// Register Chart.js components and controllers
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler,
  LineController,
  BarController,
  PieController,
  DoughnutController,
  PolarAreaController
);

const ChartWrapper = ({ 
  type = 'line', 
  data, 
  options = {}, 
  className = '',
  height = 300,
  responsive = true,
  ...props 
}) => {
  const theme = useSelector(selectTheme);
  const chartRef = useRef(null);

  // Theme-aware default options
  const getThemeOptions = () => {
    const isDark = theme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#1e293b';
    const gridColor = isDark ? '#334155' : '#e2e8f0';
    const backgroundColor = isDark ? '#1e293b' : '#ffffff';

    return {
      responsive,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: textColor,
            font: {
              family: 'Inter, sans-serif',
              size: 12,
            },
          },
        },
        tooltip: {
          backgroundColor: isDark ? '#0f172a' : '#ffffff',
          titleColor: textColor,
          bodyColor: textColor,
          borderColor: gridColor,
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          intersect: false,
          mode: 'index',
        },
      },
      scales: type !== 'pie' && type !== 'doughnut' && type !== 'polarArea' ? {
        x: {
          grid: {
            color: gridColor,
            borderColor: gridColor,
          },
          ticks: {
            color: textColor,
            font: {
              family: 'Inter, sans-serif',
              size: 11,
            },
          },
        },
        y: {
          grid: {
            color: gridColor,
            borderColor: gridColor,
          },
          ticks: {
            color: textColor,
            font: {
              family: 'Inter, sans-serif',
              size: 11,
            },
          },
        },
      } : undefined,
      elements: {
        point: {
          radius: 4,
          hoverRadius: 6,
          borderWidth: 2,
        },
        line: {
          borderWidth: 2,
          tension: 0.1,
        },
        bar: {
          borderRadius: 4,
          borderWidth: 0,
        },
      },
      interaction: {
        intersect: false,
        mode: 'index',
      },
      animation: {
        duration: 750,
        easing: 'easeInOutQuart',
      },
    };
  };

  // Merge theme options with provided options
  const mergedOptions = {
    ...getThemeOptions(),
    ...options,
  };

  // Update chart when theme changes
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update('none');
    }
  }, [theme]);

  const chartClasses = [
    'chart-wrapper',
    `chart-wrapper--${type}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={chartClasses} style={{ height: `${height}px` }}>
      <Chart
        ref={chartRef}
        type={type}
        data={data}
        options={mergedOptions}
        {...props}
      />
    </div>
  );
};

export default ChartWrapper;
