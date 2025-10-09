import { useState } from 'react';
import './Table.scss';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Input from './Input';
import Button from './Button';

const Table = ({ columns, data, renderDetail, filterOptions = [] }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [expanded, setExpanded] = useState(null);

  const handleSearch = (e) => setSearch(e.target.value);
  const handleFilter = (e) => setFilter(e.target.value);
  const handleExpand = (idx) => setExpanded(expanded === idx ? null : idx);

  const filteredData = data.filter(row => {
    const matchesSearch = columns.some(col =>
      String(row[col.accessor] || '').toLowerCase().includes(search.toLowerCase())
    );
    const matchesFilter = filter ? row[filterOptions[0]?.accessor] === filter : true;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="table-ui">
      <div className="table-ui__controls">
        <Input
          placeholder="Search..."
          value={search}
          onChange={handleSearch}
          size="sm"
          className="table-ui__search"
        />
        {filterOptions.length > 0 && (
          <select className="table-ui__filter" value={filter} onChange={handleFilter}>
            <option value="">All</option>
            {filterOptions[0].options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        )}
      </div>
      <div className="table-ui__wrapper">
        <table className="table-ui__table">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.accessor} className={col.className || ''}>{col.Header}</th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, idx) => (
              <>
                <tr key={idx} className="table-ui__row" onClick={() => handleExpand(idx)}>
                  {columns.map(col => (
                    <td key={col.accessor} className={col.className || ''}>
                      {col.Cell ? col.Cell(row) : row[col.accessor]}
                    </td>
                  ))}
                  <td className="table-ui__expand-icon">
                    {expanded === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </td>
                </tr>
                {expanded === idx && (
                  <tr className="table-ui__detail-row">
                    <td colSpan={columns.length + 1}>
                      {renderDetail(row)}
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <div className="table-ui__empty">No data found.</div>
        )}
      </div>
    </div>
  );
};

export default Table;
