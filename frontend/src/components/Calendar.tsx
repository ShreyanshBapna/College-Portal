import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users, BookOpen, GraduationCap, Calendar as CalendarIcon, Filter, Search } from 'lucide-react';
import Card from './Card';
import ResponsiveContainer from './ResponsiveContainer';
import EventModal from './EventModal';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  type: 'exam' | 'assignment' | 'holiday' | 'meeting' | 'class' | 'event' | 'deadline';
  location?: string;
  attendees?: string[];
  isAllDay?: boolean;
  color?: string;
  priority?: 'low' | 'medium' | 'high';
  createdBy?: string;
  department?: string;
  course?: string;
}

interface CalendarProps {
  events?: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onDateClick?: (date: Date) => void;
  onEventCreate?: (date: Date) => void;
  canCreateEvents?: boolean;
  viewMode?: 'month' | 'week' | 'day';
  userRole?: 'student' | 'teacher' | 'principal';
  className?: string;
}

const Calendar: React.FC<CalendarProps> = ({
  events = [],
  onEventClick,
  onDateClick,
  onEventCreate,
  canCreateEvents = false,
  viewMode: initialViewMode = 'month',
  userRole = 'student',
  className = ''
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>(initialViewMode);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'exam': return 'bg-red-500';
      case 'assignment': return 'bg-orange-500';
      case 'holiday': return 'bg-green-500';
      case 'meeting': return 'bg-blue-500';
      case 'class': return 'bg-purple-500';
      case 'event': return 'bg-pink-500';
      case 'deadline': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getEventTypeIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'exam': return GraduationCap;
      case 'assignment': return BookOpen;
      case 'meeting': return Users;
      case 'class': return Clock;
      case 'event': return CalendarIcon;
      default: return Clock;
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesFilter = filterType === 'all' || event.type === filterType;
      const matchesSearch = !searchQuery || 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [events, filterType, searchQuery]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    if (!date) return [];
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + (direction === 'next' ? 7 : -7));
      return newDate;
    });
  };

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const weekDay = new Date(startOfWeek);
      weekDay.setDate(startOfWeek.getDate() + i);
      weekDays.push(weekDay);
    }
    return weekDays;
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateClick?.(date);
  };

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setIsModalOpen(true);
    onEventClick?.(event);
  };

  const handleCreateEvent = (date: Date) => {
    if (canCreateEvents) {
      onEventCreate?.(date);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    
    return (
      <div className="h-full flex flex-col">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-0.5 mb-1 flex-shrink-0">
          {dayNames.map(day => (
            <div key={day} className="p-1 text-center text-xs font-semibold text-gray-700 bg-gray-100/50 rounded-lg">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days grid */}
        <div className="flex-1 grid grid-cols-7 gap-0.5 auto-rows-fr">
          {days.map((date, index) => {
            if (!date) {
              return <div key={index} className="min-h-[60px]"></div>;
            }
            
            const dayEvents = getEventsForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            
            return (
              <motion.div
                key={date.toDateString()}
                className={`
                  min-h-[60px] p-1 border border-gray-200/50 rounded-lg cursor-pointer transition-all duration-200 relative flex flex-col
                  ${isToday ? 'bg-indigo-100/70 border-indigo-300' : 'hover:bg-gray-50/70'}
                  ${isSelected ? 'ring-1 ring-indigo-500' : ''}
                `}
                onClick={() => handleDateClick(date)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className={`
                  text-xs font-medium mb-1 text-center flex-shrink-0
                  ${isToday ? 'text-indigo-700' : 'text-gray-900'}
                `}>
                  {date.getDate()}
                </div>
                
                <div className="flex-1 space-y-0.5 overflow-y-auto">
                  {dayEvents.slice(0, 3).map((event, eventIndex) => {
                    const Icon = getEventTypeIcon(event.type);
                    return (
                      <motion.div
                        key={event.id}
                        className={`
                          ${getEventTypeColor(event.type)} text-white text-xs rounded px-1 py-0.5 truncate cursor-pointer
                          hover:opacity-80 transition-opacity
                        `}
                        onClick={(e) => handleEventClick(event, e)}
                        whileHover={{ scale: 1.03 }}
                        title={`${event.title} ${event.startTime ? `at ${event.startTime}` : ''}`}
                      >
                        <div className="flex items-center space-x-1">
                          <Icon className="w-2 h-2" />
                          <span className="truncate text-xs">{event.title}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                  
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{dayEvents.length - 3}
                    </div>
                  )}
                </div>
                
                {canCreateEvents && (
                  <button
                    className="absolute top-0 right-0 w-4 h-4 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-indigo-600 transition-colors opacity-0 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCreateEvent(date);
                    }}
                  >
                    <Plus className="w-2 h-2" />
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate);
    
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 grid grid-cols-7 gap-1">
          {weekDays.map(date => {
            const dayEvents = getEventsForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <div key={date.toDateString()} className="flex flex-col h-full">
                <div className={`
                  text-center p-1 rounded-lg flex-shrink-0
                  ${isToday ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100/50 text-gray-700'}
                `}>
                  <div className="text-xs font-medium">{dayNames[date.getDay()]}</div>
                  <div className="text-sm font-bold">{date.getDate()}</div>
                </div>
                
                <div className="flex-1 space-y-1 overflow-y-auto py-1">
                  {dayEvents.map(event => {
                    const Icon = getEventTypeIcon(event.type);
                    return (
                      <motion.div
                        key={event.id}
                        className={`
                          ${getEventTypeColor(event.type)} text-white text-xs rounded-lg p-1 cursor-pointer
                          hover:opacity-80 transition-opacity
                        `}
                        onClick={(e) => handleEventClick(event, e)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center space-x-1 mb-0.5">
                          <Icon className="w-2 h-2" />
                          <span className="font-medium truncate text-xs">{event.title}</span>
                        </div>
                        {event.startTime && (
                          <div className="text-xs opacity-90">{event.startTime}</div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate);
    const isToday = currentDate.toDateString() === new Date().toDateString();
    
    return (
      <div className="space-y-3">
        <div className={`
          text-center p-3 rounded-xl
          ${isToday ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100/50 text-gray-700'}
        `}>
          <div className="text-xs font-medium">{dayNames[currentDate.getDay()]}</div>
          <div className="text-lg font-bold">{currentDate.getDate()}</div>
          <div className="text-xs">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</div>
        </div>
        
        <div className="space-y-3">
          {dayEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No events scheduled for this day</p>
              {canCreateEvents && (
                <button
                  className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  onClick={() => handleCreateEvent(currentDate)}
                >
                  Create Event
                </button>
              )}
            </div>
          ) : (
            dayEvents.map(event => {
              const Icon = getEventTypeIcon(event.type);
              return (
                <motion.div
                  key={event.id}
                  className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={(e) => handleEventClick(event, e)}
                  whileHover={{ scale: 1.01, y: -2 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-xl ${getEventTypeColor(event.type)} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{event.title}</h3>
                      {event.description && (
                        <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {event.startTime && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{event.startTime}{event.endTime ? ` - ${event.endTime}` : ''}</span>
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        {event.attendees && event.attendees.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{event.attendees.length} attendees</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <ResponsiveContainer className={`h-full flex flex-col ${className}`}>
      <Card className="bg-white/70 backdrop-blur-sm border border-white/30 shadow-xl h-full flex flex-col">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <h2 className="text-lg lg:text-xl font-bold text-gray-900">
              {viewMode === 'month' && `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
              {viewMode === 'week' && `Week of ${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`}
              {viewMode === 'day' && `${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`}
            </h2>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={() => viewMode === 'month' ? navigateMonth('prev') : navigateWeek('prev')}
                className="p-1.5 rounded-lg bg-gray-100/70 hover:bg-gray-200/70 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-2 py-1.5 rounded-lg bg-indigo-100/70 text-indigo-700 hover:bg-indigo-200/70 transition-colors text-xs font-medium"
              >
                Today
              </button>
              <button
                onClick={() => viewMode === 'month' ? navigateMonth('next') : navigateWeek('next')}
                className="p-1.5 rounded-lg bg-gray-100/70 hover:bg-gray-200/70 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100/70 rounded-lg p-0.5">
              {(['month', 'week', 'day'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`
                    px-2 py-1 rounded-md text-xs font-medium transition-colors capitalize
                    ${viewMode === mode 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'}
                  `}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex items-center space-x-3 mb-3 flex-shrink-0">
          <div className="flex items-center space-x-1">
            <Filter className="w-3 h-3 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-2 py-1 bg-white/50 border border-gray-200/50 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="all">All Events</option>
              <option value="exam">Exams</option>
              <option value="assignment">Assignments</option>
              <option value="class">Classes</option>
              <option value="meeting">Meetings</option>
              <option value="holiday">Holidays</option>
              <option value="event">Events</option>
              <option value="deadline">Deadlines</option>
            </select>
          </div>
          
          <div className="flex-1 max-w-sm relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1 bg-white/50 border border-gray-200/50 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          
          {canCreateEvents && (
            <button
              onClick={() => handleCreateEvent(new Date())}
              className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-1 text-xs"
            >
              <Plus className="w-3 h-3" />
              <span>Add</span>
            </button>
          )}
        </div>

        {/* Calendar Views */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {viewMode === 'month' && (
                <div className="h-full flex flex-col">
                  {renderMonthView()}
                </div>
              )}
              {viewMode === 'week' && (
                <div className="h-full">
                  {renderWeekView()}
                </div>
              )}
              {viewMode === 'day' && (
                <div className="h-full overflow-y-auto">
                  {renderDayView()}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Event Legend */}
        <div className="mt-3 pt-3 border-t border-gray-200/50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-700">Event Types</h3>
            <div className="text-xs text-gray-500">{filteredEvents.length} events</div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {[
              { type: 'exam', label: 'Exams' },
              { type: 'assignment', label: 'Assignments' },
              { type: 'class', label: 'Classes' },
              { type: 'meeting', label: 'Meetings' },
              { type: 'holiday', label: 'Holidays' },
              { type: 'event', label: 'Events' },
              { type: 'deadline', label: 'Deadlines' }
            ].map(({ type, label }) => {
              return (
                <div key={type} className="flex items-center space-x-1 text-xs">
                  <div className={`w-2 h-2 rounded-full ${getEventTypeColor(type as CalendarEvent['type'])}`}></div>
                  <span className="text-gray-600">{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Event Modal */}
      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
        onEdit={(updatedEvent) => {
          console.log('Event updated:', updatedEvent);
          // Here you would typically update the event in your state/database
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
        onDelete={(eventId) => {
          console.log('Event deleted:', eventId);
          // Here you would typically remove the event from your state/database
        }}
        userRole={userRole}
      />
    </ResponsiveContainer>
  );
};

export default Calendar;