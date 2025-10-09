import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setPageTitle, setBreadcrumbs } from '../../store/slices/uiSlice';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import './AdminTablePage.scss';

const ProgressCell = ({ x, y, percent, label }) => (
  <div>
    <div className="table-ui__progress-label">
      <span>{x} / {y}</span>
      <span>{percent}%</span>
    </div>
    <div className="table-ui__progress">
      <div className="table-ui__progress-bar" style={{ width: `${percent}%` }} />
    </div>
    {label && <div className="table-ui__progress-plan">{label}</div>}
  </div>
);

const StatusCell = ({ status }) => (
  <span className={`table-ui__status-btn${status !== 'Active' ? ' inactive' : ''}`}>{status}</span>
);

const columns = [
  { Header: 'Invoice & Plan Name', accessor: 'domain', Cell: row => (
    <div>
      <div style={{ fontWeight: 600 }}>{row.domain}</div>
      <div style={{ fontSize: '0.9em', color: 'var(--color-text-secondary)' }}>{row.plan}</div>
    </div>
  ) },
  { Header: 'Success Vision', accessor: 'storage', Cell: row => <ProgressCell x={row.storageX} y={row.storageY} percent={row.storagePercent} /> },
  { Header: 'Error Vision', accessor: 'visitor', className: 'col-hide-mobile', Cell: row => <ProgressCell x={row.visitorX} y={row.visitorY} percent={row.visitorPercent} /> },
  { Header: 'Meal Plan', accessor: 'domainType', className: 'col-hide-mobile', Cell: row => (
    <span style={{
      display: 'inline-block',
      padding: '2px 12px',
      borderRadius: '12px',
      background: row.domainType === 'Primary' ? 'var(--color-primary)' : '#f3f4f6',
      color: row.domainType === 'Primary' ? '#fff' : 'var(--color-text-secondary)',
      fontWeight: 500,
      fontSize: '0.95em',
    }}>{row.domainType}</span>
  ) },
  { Header: 'Status', accessor: 'status', Cell: row => <StatusCell status={row.status} /> },
];

const data = [
  {
    domain: 'INV123123123',
    plan: 'Diet Plan',
    storageX: 35.3,
    storageY: 120,
    storagePercent: 29,
    visitorX: 900,
    visitorY: 1200,
    visitorPercent: 75,
    domainType: 'Primary',
    status: 'Active',
    detail: {
      plan: 'Diet Plan',
      usage: '35 GB',
      domains: ['INV123123123', 'supply.INV123123123'],
      notes: 'Main package menu.'
    }
  },
  {
    domain: 'INV11111111111',
    plan: 'Add-on Plan',
    storageX: 15,
    storageY: 120,
    storagePercent: 12,
    visitorX: 200,
    visitorY: 1200,
    visitorPercent: 17,
    domainType: 'Add-on',
    status: 'Active',
    detail: {
      plan: 'Add-on Plan',
      usage: '15',
      domains: ['INV11111111111'],
      notes: 'Add-on for supply.'
    }
  },
  {
    domain: 'INV2222222222',
    plan: 'Custom Plan',
    storageX: 8,
    storageY: 120,
    storagePercent: 7,
    visitorX: 100,
    visitorY: 1200,
    visitorPercent: 8,
    domainType: 'Custom',
    status: 'Inactive',
    detail: {
      plan: 'Custom Plan',
      usage: '8',
      domains: ['INV2222222222'],
      notes: 'Custom for stock.'
    }
  },
  {
    domain: 'INV3333333333',
    plan: 'Bulking Plan',
    storageX: 60,
    storageY: 120,
    storagePercent: 50,
    visitorX: 1100,
    visitorY: 1200,
    visitorPercent: 92,
    domainType: 'Primary',
    status: 'Active',
    detail: {
      plan: 'Bulking Plan',
      usage: '60',
      domains: ['INV3333333333'],
      notes: 'Bulking plan.'
    }
  },
];

const filterOptions = [
  {
    accessor: 'domainType',
    options: ['Primary', 'Add-on']
  }
];

const renderDetail = (row) => (
  <div className="table-ui__detail-row-content">
    <div className="table-ui__detail-list">
      <div className="table-ui__detail-label">Plan</div>
      <div className="table-ui__detail-value">{row.detail.plan}</div>
    </div>
    <div className="table-ui__detail-list">
      <div className="table-ui__detail-label">Usage</div>
      <div className="table-ui__detail-value">{row.detail.usage} GB</div>
    </div>
    <div className="table-ui__detail-list">
      <div className="table-ui__detail-label">Domains</div>
      <div className="table-ui__detail-badges">
        {row.detail.domains.map((d, i) => (
          <span className="table-ui__detail-badge" key={i}>{d}</span>
        ))}
      </div>
    </div>
    <div className="table-ui__detail-list">
      <div className="table-ui__detail-label">Notes</div>
      <div className="table-ui__detail-value">{row.detail.notes}</div>
    </div>
  </div>
);

const AdminTablePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Site Details'));
    dispatch(setBreadcrumbs([
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Administration', path: '/dashboard/administration/accounts' },
      { label: 'Site Details', path: '/dashboard/administration/site-details' },
    ]));
  }, [dispatch]);

  return (
    <div className="admin">
      <div className="admin__header">
        <div className="admin__title">
          <h1>{t('admin.title')}</h1>
          <p>{t('admin.overview')}</p>
        </div>
      </div>
      <Table columns={columns} data={data} renderDetail={renderDetail} filterOptions={filterOptions} />
    </div>
  );
};

export default AdminTablePage;
