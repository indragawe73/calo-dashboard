import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import './DatePicker.scss';

const DatePicker = ({ value, onChange, placeholder = "Select date", className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value || '');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const datePickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDateSelect = (date) => {
    // Format date without timezone conversion issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    setSelectedDate(formattedDate);
    onChange?.(formattedDate);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedDate('');
    onChange?.('');
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      days.push(date);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className={`date-picker ${className}`} ref={datePickerRef}>
      <button
        type="button"
        className="date-picker__trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Calendar size={16} />
        <span className="date-picker__value">
          {selectedDate ? formatDisplayDate(selectedDate) : placeholder}
        </span>
        {selectedDate && (
          <button
            type="button"
            className="date-picker__clear"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
          >
            <X size={14} />
          </button>
        )}
      </button>

      {isOpen && (
        <div className="date-picker__dropdown">
          <div className="date-picker__calendar">
            <div className="date-picker__header">
              <button
                type="button"
                className="date-picker__nav-btn"
                onClick={handlePrevMonth}
              >
                <ChevronLeft size={16} />
              </button>
              <div className="date-picker__month-year">
                {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </div>
              <button
                type="button"
                className="date-picker__nav-btn"
                onClick={handleNextMonth}
              >
                <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="date-picker__weekdays">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="date-picker__weekday">{day}</div>
              ))}
            </div>
            
            <div className="date-picker__days">
              {calendarDays.map((day, index) => {
                // Format day for comparison without timezone issues
                const dayFormatted = day ? 
                  `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}` : 
                  '';
                
                return (
                  <button
                    key={index}
                    type="button"
                    className={`date-picker__day ${
                      day && selectedDate === dayFormatted
                        ? 'date-picker__day--selected' 
                        : ''
                    } ${
                      day && day.toDateString() === new Date().toDateString()
                        ? 'date-picker__day--today'
                        : ''
                    }`}
                    onClick={() => day && handleDateSelect(day)}
                    disabled={!day}
                  >
                    {day ? day.getDate() : ''}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
