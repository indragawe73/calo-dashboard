import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle, setBreadcrumbs } from '../../store/slices/uiSlice';
import Card from '../../components/ui/Card';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';
import './Dashboard.scss';

const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle('Dashboard'));
    dispatch(setBreadcrumbs([
      { label: 'Home', path: '/' },
      { label: 'Dashboard', path: '/dashboard' }
    ]));
  }, [dispatch]);

  // Project metrics data
  const projectMetrics = [
    {
      title: 'Total Invoice',
      value: '24',
      change: '5 Increased from last month',
      trend: 'up',
      color: 'primary',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 13H11V3H3V13ZM3 21H11V15H3V21ZM13 21H21V11H13V21ZM13 3V9H21V3H13Z" fill="currentColor"/>
        </svg>
      )
    },
    {
      title: 'Ended Invoice',
      value: '10',
      change: '6 Increased from last month',
      trend: 'up',
      color: 'secondary',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
        </svg>
      )
    },
    {
      title: 'Running Invoice',
      value: '12',
      change: '2 Increased from last month',
      trend: 'up',
      color: 'secondary',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
        </svg>
      )
    },
    {
      title: 'Pending Invoice',
      value: '2',
      change: 'On Discuss',
      trend: 'neutral',
      color: 'secondary',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
        </svg>
      )
    }
  ];

  // Project analytics chart data
  const projectAnalyticsData = {
    labels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    datasets: [
      {
        label: 'Project Activity',
        data: [20, 40, 74, 60, 30, 25, 15],
        backgroundColor: [
          '#e5e7eb', // Gray for Sunday
          '#00ba31', // Green for Monday
          '#00ba31', // Green for Tuesday
          '#00ba31', // Green for Wednesday
          '#e5e7eb', // Gray for Thursday
          '#e5e7eb', // Gray for Friday
          '#e5e7eb'  // Gray for Saturday
        ],
        borderColor: '#00ba31',
        borderWidth: 1
      }
    ]
  };

  // Project list data
  const projectList = [
    {
      name: 'Status Connected',
      dueDate: 'Nov 26, 2024',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: '#3b82f6'
    },
    {
      name: 'Perfect Match Status',
      dueDate: 'Nov 28, 2024',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      color: '#00ba31'
    },
    {
      name: 'Partial Match Status',
      dueDate: 'Nov 30, 2024',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor"/>
          <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor"/>
          <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor"/>
          <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor"/>
        </svg>
      ),
      color: '#f59e0b'
    },
    {
      name: 'No Match Status',
      dueDate: 'Dec 5, 2024',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor"/>
        </svg>
      ),
      color: '#eab308'
    },
    {
      name: 'Waiting',
      dueDate: 'Dec 6, 2024',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: '#8b5cf6'
    }
  ];

  // Team collaboration data
  const teamMembers = [
    {
      name: 'Alexandra Deff',
      task: 'Make food',
      status: 'Shift 1',
      statusColor: '#00ba31',
      avatar: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    {
      name: 'Edwin Adenike',
      task: 'Shorting Put To Tray',
      status: 'Shift 2',
      statusColor: '#f59e0b',
      avatar: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    {
      name: 'Isaac Oluwatemilorun',
      task: 'Repack food to box',
      status: 'Shift 3',
      statusColor: '#ef4444',
      avatar: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    {
      name: 'David Oshodi',
      task: 'Shorting Put To Tray',
      status: 'Shift 2',
      statusColor: '#f59e0b',
      avatar: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    }
  ];


  return (
    <div className="dashboard">

      {/* Header Section */}
      <div className="dashboard__header">
        <div className="dashboard__title">
          <h1>Dashboard</h1>
          <p>Plan, prioritize, and accomplish your tasks with Klema.</p>
        </div>
        {/* <div className="dashboard__actions">
          <button className="btn btn--primary">+ Add Project</button>
          <button className="btn btn--secondary">Import Data</button>
        </div> */}
      </div>

      {/* Project Metrics */}
      <div className="dashboard__metrics">
        {projectMetrics.map((metric, index) => (
          <Card key={index} className={`metric-card metric-card--${metric.color}`}>
            <div className="metric-card__content">
              <div className="metric-card__header">
                <div className="metric-card__icon">{metric.icon}</div>
                <div className="metric-card__trend">
                  <span 
                    className={`trend-indicator trend-indicator--${metric.trend} ${metric.color === 'primary' ? 'trend-indicator--white-text' : ''}`}
                    style={metric.color === 'primary' ? { color: 'white' } : {}}
                  >
                    {metric.change}
                  </span>
                </div>
              </div>
              <div className="metric-card__value">{metric.value}</div>
              <div className="metric-card__title">{metric.title}</div>
              </div>
            </Card>
          ))}
        </div>

      {/* Main Content Grid */}
      <div className="dashboard__grid">
        {/* Project Analytics - Large widget on the left */}
        <Card className="dashboard__widget project-analytics">
          <div className="widget__header">
            <h3>Invoice Analytics</h3>
          </div>
          <div className="widget__content">
            <BarChart data={projectAnalyticsData} height={250} />
          </div>
        </Card>

        {/* Reminders - Top right */}
        <Card className="dashboard__widget reminders">
          <div className="widget__header">
            <h3>Invoice Delivery Progress</h3>
            {/* <h3>Reminders</h3> */}
          </div>
          {/* <div className="widget__content">
            <div className="reminder-item">
              <div className="reminder__title">CornJob auto Run</div>
              <div className="reminder__time">02.00 pm - 04.00 pm</div>
              <button className="btn btn--success btn--small">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="5,3 19,12 5,21" fill="currentColor"/>
                </svg>
                Start CornJob Manualy
              </button>
            </div>
          </div> */}
          <div className="widget__content">
            <div className="progress-chart">
              <div className="donut-chart">
                <div className="donut-center">
                  <div className="progress-percentage">41%</div>
                  <div className="progress-label">Delivery Ended</div>
                </div>
              </div>
              <div className="progress-legend">
                <div className="legend-item">
                  <div className="legend__dot" style={{ backgroundColor: '#00ba31' }}></div>
                  <span>Completed</span>
                </div>
                <div className="legend-item">
                  <div className="legend__dot" style={{ backgroundColor: '#6b7280' }}></div>
                  <span>In Progress</span>
              </div>
                <div className="legend-item">
                  <div className="legend__dot" style={{ backgroundColor: '#e5e7eb' }}></div>
                  <span>Pending</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Project List - Top right */}
        <Card className="dashboard__widget project-list">
          <div className="widget__header">
            <h3>Invoice</h3>
            {/* <button className="btn btn--small">+ New</button> */}
          </div>
          <div className="widget__content">
            <div className="project-list">
              {projectList.map((project, index) => (
                <div key={index} className="project-item">
                  <div className="project__icon" style={{ color: project.color }}>
                    {project.icon}
                  </div>
                  <div className="project__info">
                    <div className="project__name">{project.name}</div>
                    <div className="project__due">Due date: {project.dueDate}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Team Collaboration - Bottom left */}
        {/* <Card className="dashboard__widget team-collaboration">
          <div className="widget__header">
            <h3>Staff Incharge</h3>
            <button className="btn btn--small">+ Add Staff</button>
          </div>
          <div className="widget__content">
            <div className="team-list">
              {teamMembers.map((member, index) => (
                <div key={index} className="team-member">
                  <div className="member__avatar">{member.avatar}</div>
                  <div className="member__info">
                    <div className="member__name">{member.name}</div>
                    <div className="member__task">{member.task}</div>
                    <div className="member__status" style={{ color: member.statusColor }}>
                      Status: {member.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </div>
        </Card> */}

        {/* Project Progress - Bottom center */}
        {/* <Card className="dashboard__widget project-progress">
          <div className="widget__header">
            <h3>Invoice Delivery Progress</h3>
          </div>
          <div className="widget__content">
            <div className="progress-chart">
              <div className="donut-chart">
                <div className="donut-center">
                  <div className="progress-percentage">41%</div>
                  <div className="progress-label">Delivery Ended</div>
                </div>
              </div>
              <div className="progress-legend">
                <div className="legend-item">
                  <div className="legend__dot" style={{ backgroundColor: '#00ba31' }}></div>
                  <span>Completed</span>
                </div>
                <div className="legend-item">
                  <div className="legend__dot" style={{ backgroundColor: '#6b7280' }}></div>
                  <span>In Progress</span>
              </div>
                <div className="legend-item">
                  <div className="legend__dot" style={{ backgroundColor: '#e5e7eb' }}></div>
                  <span>Pending</span>
                </div>
              </div>
            </div>
          </div>
        </Card> */}

        {/* Time Tracker - Bottom right */}
        {/* <Card className="dashboard__widget time-tracker">
          <div className="widget__header">
            <h3>Run Video</h3>
          </div>
          <div className="widget__content">
            <div className="timer-display">01:24:08</div>
            <div className="timer-controls">
              <button className="timer-btn timer-btn--play">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                  <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
                </svg>
              </button>
              <button className="timer-btn timer-btn--stop">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/>
                </svg>
              </button>
            </div>
            </div>
          </Card> */}
      </div>
    </div>
  );
};

export default Dashboard;