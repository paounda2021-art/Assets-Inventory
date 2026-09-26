'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Clock } from 'lucide-react';

interface ThaiDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const THAI_DAYS_SHORT = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

export const ThaiDatePicker: React.FC<ThaiDatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'เลือกวันที่',
  required = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse current value or fallback to today
  const parseDate = (dateStr: string) => {
    if (!dateStr) return new Date();
    const [y, m, d] = dateStr.split('-').map(Number);
    if (y && m && d) {
      return new Date(y, m - 1, d);
    }
    return new Date();
  };

  const selectedDate = parseDate(value);
  const [viewYear, setViewYear] = useState<number>(selectedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(selectedDate.getMonth()); // 0-11

  // Update view state when prop changes
  useEffect(() => {
    const d = parseDate(value);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }, [value]);

  // Close popover on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatThaiDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-').map(Number);
    if (!y || !m || !d) return dateStr;
    const buddhistYear = y + 543;
    const monthName = THAI_MONTHS[m - 1] || '';
    return `${d} ${monthName} พ.ศ. ${buddhistYear}`;
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const formattedMonth = String(viewMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const isoString = `${viewYear}-${formattedMonth}-${formattedDay}`;
    onChange(isoString);
    setIsOpen(false);
  };

  const handleSelectToday = () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    onChange(`${y}-${m}-${d}`);
    setIsOpen(false);
  };

  // Generate calendar days for viewMonth and viewYear
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfWeek = (year: number, month: number) => {
    return new Date(year, month, 1).getDay(); // 0 = Sunday
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const startDayOfWeek = getFirstDayOfWeek(viewYear, viewMonth);

  // Years array for Buddhist Era dropdown (+543)
  const currentADYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 30 }, (_, i) => currentADYear - 20 + i);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-medium text-slate-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Input Display Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 cursor-pointer hover:border-blue-500 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-blue-600 shrink-0" />
          <span className={value ? 'text-slate-900 font-medium' : 'text-slate-400'}>
            {value ? formatThaiDisplay(value) : placeholder}
          </span>
        </div>
        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
            }}
            className="text-slate-400 hover:text-slate-600 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Popover Calendar Modal */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-3 text-slate-800 animate-in fade-in zoom-in-95 duration-100">
          
          {/* Header Controls */}
          <div className="flex items-center justify-between gap-1 mb-3 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 hover:bg-white rounded-md text-slate-600 hover:text-slate-900 transition-colors shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {/* Thai Month Dropdown */}
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(Number(e.target.value))}
                className="text-xs font-semibold text-slate-800 bg-transparent cursor-pointer focus:outline-none hover:text-blue-600"
              >
                {THAI_MONTHS.map((m, idx) => (
                  <option key={idx} value={idx}>{m}</option>
                ))}
              </select>

              {/* Thai Buddhist Year Dropdown */}
              <select
                value={viewYear}
                onChange={(e) => setViewYear(Number(e.target.value))}
                className="text-xs font-semibold text-slate-800 bg-transparent cursor-pointer focus:outline-none hover:text-blue-600"
              >
                {yearOptions.map(y => (
                  <option key={y} value={y}>พ.ศ. {y + 543}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 hover:bg-white rounded-md text-slate-600 hover:text-slate-900 transition-colors shadow-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 text-center mb-1">
            {THAI_DAYS_SHORT.map((day, idx) => (
              <span
                key={idx}
                className={`text-[11px] font-bold ${
                  idx === 0 ? 'text-red-500' : idx === 6 ? 'text-blue-500' : 'text-slate-500'
                }`}
              >
                {day}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Empty slots for starting offset */}
            {Array.from({ length: startDayOfWeek }).map((_, idx) => (
              <div key={`empty-${idx}`} />
            ))}

            {/* Day buttons */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const formattedMonth = String(viewMonth + 1).padStart(2, '0');
              const formattedDay = String(dayNum).padStart(2, '0');
              const dateIso = `${viewYear}-${formattedMonth}-${formattedDay}`;
              const isSelected = value === dateIso;
              
              const todayStr = new Date().toISOString().substring(0, 10);
              const isToday = todayStr === dateIso;

              return (
                <button
                  key={dayNum}
                  type="button"
                  onClick={() => handleSelectDay(dayNum)}
                  className={`h-7 w-7 mx-auto flex items-center justify-center text-xs rounded-lg font-medium transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold shadow-md scale-105'
                      : isToday
                      ? 'bg-blue-50 text-blue-700 font-bold border border-blue-300'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          {/* Footer Today Button */}
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleSelectToday}
              className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Clock className="w-3.5 h-3.5" />
              เลือกว่าเป็นวันนี้
            </button>

            <span className="text-[10px] text-slate-400">ปฏิทิน พ.ศ.</span>
          </div>

        </div>
      )}
    </div>
  );
};
