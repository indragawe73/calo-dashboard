import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setPageTitle, setBreadcrumbs } from '../../store/slices/uiSlice';
import Card from '../../components/ui/Card';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';
import './Dashboard.scss';

const Dashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle(t('dashboard.title')));
    dispatch(setBreadcrumbs([
      { label: t('breadcrumbs.home'), path: '/' },
      { label: t('dashboard.title'), path: '/dashboard' }
    ]));
  }, [dispatch, t]);

  const stats = [
    {
      title: t('dashboard.totalUsers'),
      value: '1,234',
      change: '+12%',
      trend: 'up',
      color: 'primary'
    },
    {
      title: t('dashboard.activeUsers'),
      value: '456',
      change: '+5%',
      trend: 'up',
      color: 'success'
    },
    {
      title: t('dashboard.totalDocuments'),
      value: '8,901',
      change: '+18%',
      trend: 'up',
      color: 'info'
    },
    {
      title: t('dashboard.recentDocuments'),
      value: '234',
      change: '-2%',
      trend: 'down',
      color: 'warning'
    }
  ];

  // Sample chart data
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'error',
        data: [65, 59, 80, 81, 56, 55],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
      },
      {
        label: 'Pass',
        data: [28, 48, 40, 19, 86, 27],
        borderColor: '#01A863',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
      },
    ],
  };

  const barChartData = {
    labels: ['Administration', 'Procedure', 'Standard Code', 'Forms', 'Literature'],
    datasets: [
      {
        label: 'Usage',
        data: [12, 19, 3, 5, 2],
        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6',
        ],
      },
    ],
  };

  const pieChartData = {
    labels: ['Active', 'Inactive', 'Pending'],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: [
          '#10b981',
          '#ef4444',
          '#f59e0b',
        ],
      },
    ],
  };

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div className="dashboard__title">
          <h1>{t('dashboard.title')}</h1>
          <p>{t('dashboard.overview')}</p>
        </div>
      </div>

      <div className="dashboard__content">
        {/* Stats Grid */}
        <div className="dashboard__stats">
          {stats.map((stat, index) => (
            <Card key={index} className={`stat-card stat-card--${stat.color}`} padding="lg">
              <div className="stat-card__content">
                <div className="stat-card__header">
                  <h3 className="stat-card__title">{stat.title}</h3>
                  <span className={`stat-card__trend stat-card__trend--${stat.trend}`}>
                    {stat.change}
                  </span>
                </div>
                <div className="stat-card__value">{stat.value}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="dashboard__charts">
          <Card 
            title="OCR Trends" 
            className="dashboard__chart dashboard__chart--large"
            padding="lg"
          >
            <LineChart data={lineChartData} height={350} />
          </Card>

          {/* <Card 
            title="Module Usage" 
            className="dashboard__chart dashboard__chart--medium"
            padding="lg"
          >
            <BarChart data={barChartData} height={300} />
          </Card> */}

          {/* <Card 
            title="User Status" 
            className="dashboard__chart dashboard__chart--medium"
            padding="lg"
          >
            <PieChart data={pieChartData} height={300} />
          </Card> */}
        </div>

        {/* Main Content Grid */}
        <div className="dashboard__grid">
          <Card 
            title={t('dashboard.recentActivity')} 
            className="dashboard__activity"
            padding="lg"
          >
            {/* <div className="activity-list">
              <div className="activity-item">
                <div className="activity-item__icon">📄</div>
                <div className="activity-item__content">
                  <div className="activity-item__title">New document added</div>
                  <div className="activity-item__time">2 minutes ago</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-item__icon">👤</div>
                <div className="activity-item__content">
                  <div className="activity-item__title">User John Doe logged in</div>
                  <div className="activity-item__time">5 minutes ago</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-item__icon">📊</div>
                <div className="activity-item__content">
                  <div className="activity-item__title">Monthly report generated</div>
                  <div className="activity-item__time">1 hour ago</div>
                </div>
              </div>
            </div> */}
          </Card>

          {/* <Card 
            title={t('dashboard.quickActions')} 
            className="dashboard__actions"
            padding="lg"
          >
            <div className="quick-actions">
              <button className="quick-action">
                <div className="quick-action__icon">📁</div>
                <div className="quick-action__label">Add Document</div>
              </button>
              <button className="quick-action">
                <div className="quick-action__icon">👥</div>
                <div className="quick-action__label">Manage Users</div>
              </button>
              <button className="quick-action">
                <div className="quick-action__icon">📈</div>
                <div className="quick-action__label">View Reports</div>
              </button>
              <button className="quick-action">
                <div className="quick-action__icon">⚙️</div>
                <div className="quick-action__label">Settings</div>
              </button>
            </div>
          </Card>

          <Card 
            title={t('dashboard.systemStatus')} 
            className="dashboard__status"
            padding="lg"
          >
            <div className="system-status">
              <div className="status-item">
                <div className="status-item__indicator status-item__indicator--online"></div>
                <div className="status-item__label">Database</div>
                <div className="status-item__value">Online</div>
              </div>
              <div className="status-item">
                <div className="status-item__indicator status-item__indicator--online"></div>
                <div className="status-item__label">API Server</div>
                <div className="status-item__value">Online</div>
              </div>
              <div className="status-item">
                <div className="status-item__indicator status-item__indicator--warning"></div>
                <div className="status-item__label">File Storage</div>
                <div className="status-item__value">Warning</div>
              </div>
            </div>
          </Card> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
