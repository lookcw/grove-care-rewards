import { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, CheckCircle2, AlertCircle, Calendar, Clock } from 'lucide-react';

interface CalendarPatient {
  id: string;
  name: string;
  surgeryDate: string;
  surgeryTime?: string;
  procedure?: string;
}

interface FollowUp {
  id: string;
  patientId: string;
  patientName: string;
  procedure?: string;
  expectedDate: string;
  actualDate?: string;
  type: string;
  completed: boolean;
}

interface SurgeryCalendarProps {
  patients: CalendarPatient[];
  followUps: FollowUp[];
  onPatientClick: (patientId: string) => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function SurgeryCalendar({ patients, followUps, onPatientClick }: SurgeryCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [missingExpanded, setMissingExpanded] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDay = firstDayOfMonth.getDay();

  // Create calendar grid
  const calendarDays: (number | null)[] = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDay; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Get patients for a specific day
  const getPatientsForDay = (day: number): CalendarPatient[] => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return patients.filter(p => p.surgeryDate === dateStr);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (day: number): boolean => {
    const today = new Date();
    return day === today.getDate() &&
           month === today.getMonth() &&
           year === today.getFullYear();
  };

  // Filter follow-ups for current month
  const getMonthFollowUps = () => {
    const monthStart = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const monthEnd = `${year}-${String(month + 1).padStart(2, '0')}-31`;

    return followUps.filter(f => {
      const expectedInMonth = f.expectedDate >= monthStart && f.expectedDate <= monthEnd;
      const actualInMonth = f.actualDate && f.actualDate >= monthStart && f.actualDate <= monthEnd;
      return expectedInMonth || actualInMonth;
    });
  };

  const monthFollowUps = getMonthFollowUps();
  const expectedFollowUps = monthFollowUps.filter(f => f.expectedDate >= `${year}-${String(month + 1).padStart(2, '0')}-01` && f.expectedDate <= `${year}-${String(month + 1).padStart(2, '0')}-31`);
  const actualFollowUps = monthFollowUps.filter(f => f.completed && f.actualDate);
  const missingFollowUps = followUps.filter(f => {
    const today = new Date().toISOString().split('T')[0];
    return !f.completed && f.expectedDate < today;
  });

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {MONTHS[month]} {year}
          </h2>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            Today
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {DAYS.map(day => (
          <div
            key={day}
            className="py-3 text-center text-sm font-medium text-gray-500 bg-gray-50"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => {
          const dayPatients = day ? getPatientsForDay(day) : [];
          const hasPatients = dayPatients.length > 0;

          return (
            <div
              key={index}
              className={`min-h-[120px] border-b border-r border-gray-100 p-2 ${
                day === null ? 'bg-gray-50' : ''
              } ${isToday(day!) ? 'bg-blue-50' : ''}`}
            >
              {day !== null && (
                <>
                  <div className={`text-sm mb-1 ${
                    isToday(day) ? 'font-bold text-blue-600' : 'text-gray-500'
                  }`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayPatients.slice(0, 3).map(patient => (
                      <button
                        key={patient.id}
                        onClick={() => onPatientClick(patient.id)}
                        className="w-full text-left px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded text-xs text-blue-800 truncate transition-colors"
                        title={`${patient.name}${patient.surgeryTime ? ` @ ${patient.surgeryTime}` : ''}`}
                      >
                        {patient.surgeryTime && (
                          <span className="font-medium">{patient.surgeryTime} </span>
                        )}
                        {patient.name}
                      </button>
                    ))}
                    {dayPatients.length > 3 && (
                      <div className="text-xs text-gray-500 px-2">
                        +{dayPatients.length - 3} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Follow-ups Section */}
      <div className="border-t border-gray-200 p-4 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Follow-ups for {MONTHS[month]} {year}
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {/* Expected Follow-ups */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Expected Follow-ups ({expectedFollowUps.length})
            </h4>
            {expectedFollowUps.length === 0 ? (
              <p className="text-sm text-gray-500">No follow-ups expected this month</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {expectedFollowUps.map(followUp => (
                  <div
                    key={followUp.id}
                    onClick={() => onPatientClick(followUp.patientId)}
                    className="bg-white rounded p-2 cursor-pointer hover:bg-blue-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 text-sm">{followUp.patientName}</span>
                      <span className="text-xs text-gray-500">{formatDate(followUp.expectedDate)}</span>
                    </div>
                    <div className="text-xs text-gray-600">{followUp.type}</div>
                    {followUp.procedure && (
                      <div className="text-xs text-gray-500">{followUp.procedure}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actual Follow-ups */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Completed Follow-ups ({actualFollowUps.length})
            </h4>
            {actualFollowUps.length === 0 ? (
              <p className="text-sm text-gray-500">No follow-ups completed this month</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {actualFollowUps.map(followUp => (
                  <div
                    key={followUp.id}
                    onClick={() => onPatientClick(followUp.patientId)}
                    className="bg-white rounded p-2 cursor-pointer hover:bg-green-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 text-sm">{followUp.patientName}</span>
                      <span className="text-xs text-gray-500">{formatDate(followUp.actualDate!)}</span>
                    </div>
                    <div className="text-xs text-gray-600">{followUp.type}</div>
                    {followUp.procedure && (
                      <div className="text-xs text-gray-500">{followUp.procedure}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Missing Follow-ups (Expandable) */}
        {missingFollowUps.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setMissingExpanded(!missingExpanded)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-red-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-800">
                  Patients Missing Follow-ups ({missingFollowUps.length})
                </span>
              </div>
              {missingExpanded ? (
                <ChevronUp className="w-5 h-5 text-red-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-red-600" />
              )}
            </button>
            {missingExpanded && (
              <div className="px-4 pb-4 space-y-2">
                {missingFollowUps.map(followUp => (
                  <div
                    key={followUp.id}
                    onClick={() => onPatientClick(followUp.patientId)}
                    className="bg-white rounded p-3 cursor-pointer hover:bg-red-100 transition-colors border border-red-100"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{followUp.patientName}</span>
                      <span className="text-xs text-red-600 font-medium">
                        Was due {formatDate(followUp.expectedDate)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">{followUp.type}</div>
                    {followUp.procedure && (
                      <div className="text-sm text-gray-500">{followUp.procedure}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
