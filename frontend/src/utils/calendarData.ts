import { CalendarEvent } from '../components/Calendar';

// Helper function to create date objects
const createDate = (year: number, month: number, day: number) => new Date(year, month - 1, day);

// Academic Calendar 2024-2025
export const academicCalendarEvents: CalendarEvent[] = [
  // Academic Year Events
  {
    id: 'academic-1',
    title: 'Academic Year Begins',
    description: 'New academic session starts for all students',
    date: createDate(2024, 8, 1),
    type: 'event',
    isAllDay: true,
    priority: 'high',
    department: 'All',
    color: 'bg-blue-500'
  },
  {
    id: 'academic-2',
    title: 'Freshers Orientation',
    description: 'Orientation program for new students',
    date: createDate(2024, 8, 5),
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    type: 'event',
    location: 'Main Auditorium',
    priority: 'high',
    attendees: ['All First Year Students', 'Faculty', 'Staff']
  },
  
  // Holidays
  {
    id: 'holiday-1',
    title: 'Independence Day',
    date: createDate(2024, 8, 15),
    type: 'holiday',
    isAllDay: true,
    priority: 'medium'
  },
  {
    id: 'holiday-2',
    title: 'Gandhi Jayanti',
    date: createDate(2024, 10, 2),
    type: 'holiday',
    isAllDay: true,
    priority: 'medium'
  },
  {
    id: 'holiday-3',
    title: 'Diwali Break',
    description: 'Festival holidays - 5 days',
    date: createDate(2024, 11, 1),
    type: 'holiday',
    isAllDay: true,
    priority: 'medium'
  },
  {
    id: 'holiday-4',
    title: 'Christmas Day',
    date: createDate(2024, 12, 25),
    type: 'holiday',
    isAllDay: true,
    priority: 'medium'
  },
  {
    id: 'holiday-5',
    title: 'New Year Day',
    date: createDate(2025, 1, 1),
    type: 'holiday',
    isAllDay: true,
    priority: 'medium'
  },
  {
    id: 'holiday-6',
    title: 'Republic Day',
    date: createDate(2025, 1, 26),
    type: 'holiday',
    isAllDay: true,
    priority: 'medium'
  },

  // Examinations
  {
    id: 'exam-1',
    title: 'Mid-Semester Exams Begin',
    description: 'Mid-semester examinations for all courses',
    date: createDate(2024, 10, 15),
    startTime: '09:00 AM',
    type: 'exam',
    priority: 'high',
    department: 'All'
  },
  {
    id: 'exam-2',
    title: 'Mid-Semester Exams End',
    date: createDate(2024, 10, 25),
    type: 'exam',
    priority: 'high',
    department: 'All'
  },
  {
    id: 'exam-3',
    title: 'End Semester Exams Begin',
    description: 'Final examinations for semester courses',
    date: createDate(2024, 12, 10),
    startTime: '09:00 AM',
    type: 'exam',
    priority: 'high',
    department: 'All'
  },
  {
    id: 'exam-4',
    title: 'End Semester Exams End',
    date: createDate(2024, 12, 22),
    type: 'exam',
    priority: 'high',
    department: 'All'
  },

  // Academic Events
  {
    id: 'event-1',
    title: 'Technical Symposium',
    description: 'Annual technical event with competitions and workshops',
    date: createDate(2024, 9, 15),
    startTime: '10:00 AM',
    endTime: '06:00 PM',
    type: 'event',
    location: 'Campus Grounds',
    priority: 'high',
    department: 'Engineering'
  },
  {
    id: 'event-2',
    title: 'Cultural Fest',
    description: 'Annual cultural celebration with performances and competitions',
    date: createDate(2024, 11, 20),
    startTime: '04:00 PM',
    endTime: '10:00 PM',
    type: 'event',
    location: 'Main Ground',
    priority: 'high',
    department: 'All'
  },
  {
    id: 'event-3',
    title: 'Sports Day',
    description: 'Annual sports competition',
    date: createDate(2025, 2, 14),
    startTime: '08:00 AM',
    endTime: '05:00 PM',
    type: 'event',
    location: 'Sports Complex',
    priority: 'medium',
    department: 'All'
  },
  {
    id: 'event-4',
    title: 'Annual Convocation',
    description: 'Graduation ceremony for final year students',
    date: createDate(2025, 3, 20),
    startTime: '10:00 AM',
    endTime: '02:00 PM',
    type: 'event',
    location: 'Main Auditorium',
    priority: 'high',
    department: 'All'
  }
];

// Student-specific events
export const studentCalendarEvents: CalendarEvent[] = [
  ...academicCalendarEvents,
  
  // Assignments
  {
    id: 'assign-1',
    title: 'Data Structures Assignment',
    description: 'Implement Binary Search Tree operations',
    date: createDate(2024, 10, 5),
    type: 'assignment',
    priority: 'high',
    course: 'CS301',
    department: 'Computer Science'
  },
  {
    id: 'assign-2',
    title: 'Database Project Submission',
    description: 'Complete database management system project',
    date: createDate(2024, 10, 12),
    type: 'assignment',
    priority: 'high',
    course: 'CS302',
    department: 'Computer Science'
  },
  {
    id: 'assign-3',
    title: 'Network Lab Report',
    description: 'Submit network configuration lab report',
    date: createDate(2024, 10, 18),
    type: 'assignment',
    priority: 'medium',
    course: 'CS303',
    department: 'Computer Science'
  },
  
  // Classes
  {
    id: 'class-1',
    title: 'Data Structures Lecture',
    description: 'Graph algorithms and traversal',
    date: createDate(2024, 10, 1),
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    type: 'class',
    location: 'Room 301',
    course: 'CS301'
  },
  {
    id: 'class-2',
    title: 'Database Management Lab',
    description: 'SQL queries and optimization',
    date: createDate(2024, 10, 2),
    startTime: '02:00 PM',
    endTime: '05:00 PM',
    type: 'class',
    location: 'Computer Lab 2',
    course: 'CS302'
  },
  
  // Personal Deadlines
  {
    id: 'deadline-1',
    title: 'Scholarship Application Due',
    description: 'Submit merit scholarship application',
    date: createDate(2024, 10, 30),
    type: 'deadline',
    priority: 'high'
  },
  {
    id: 'deadline-2',
    title: 'Internship Application',
    description: 'Apply for summer internship programs',
    date: createDate(2024, 11, 15),
    type: 'deadline',
    priority: 'medium'
  }
];

// Teacher-specific events
export const teacherCalendarEvents: CalendarEvent[] = [
  ...academicCalendarEvents,
  
  // Faculty Meetings
  {
    id: 'meeting-1',
    title: 'Department Faculty Meeting',
    description: 'Monthly department meeting to discuss curriculum updates',
    date: createDate(2024, 10, 3),
    startTime: '03:00 PM',
    endTime: '05:00 PM',
    type: 'meeting',
    location: 'Conference Room A',
    priority: 'high',
    attendees: ['Dr. Smith', 'Prof. Johnson', 'Dr. Williams']
  },
  {
    id: 'meeting-2',
    title: 'Academic Council Meeting',
    description: 'College-wide academic planning session',
    date: createDate(2024, 10, 10),
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    type: 'meeting',
    location: 'Principal Office',
    priority: 'high'
  },
  {
    id: 'meeting-3',
    title: 'Parent-Teacher Conference',
    description: 'Meeting with parents to discuss student progress',
    date: createDate(2024, 11, 5),
    startTime: '09:00 AM',
    endTime: '06:00 PM',
    type: 'meeting',
    location: 'Classrooms',
    priority: 'medium'
  },
  
  // Classes and Labs
  {
    id: 'teach-class-1',
    title: 'Advanced Algorithms Class',
    description: 'Dynamic programming concepts',
    date: createDate(2024, 10, 1),
    startTime: '11:00 AM',
    endTime: '12:00 PM',
    type: 'class',
    location: 'Room 405',
    course: 'CS401'
  },
  {
    id: 'teach-class-2',
    title: 'Machine Learning Lab',
    description: 'Supervised learning algorithms implementation',
    date: createDate(2024, 10, 4),
    startTime: '02:00 PM',
    endTime: '05:00 PM',
    type: 'class',
    location: 'AI Lab',
    course: 'CS501'
  },
  
  // Administrative Tasks
  {
    id: 'admin-1',
    title: 'Grade Submission Deadline',
    description: 'Submit mid-semester grades to academic office',
    date: createDate(2024, 10, 28),
    type: 'deadline',
    priority: 'high'
  },
  {
    id: 'admin-2',
    title: 'Course Material Upload',
    description: 'Upload lecture notes and assignments to LMS',
    date: createDate(2024, 10, 8),
    type: 'deadline',
    priority: 'medium'
  }
];

// Principal-specific events
export const principalCalendarEvents: CalendarEvent[] = [
  ...academicCalendarEvents,
  
  // Administrative Meetings
  {
    id: 'principal-meeting-1',
    title: 'Board of Directors Meeting',
    description: 'Quarterly review with board members',
    date: createDate(2024, 10, 7),
    startTime: '10:00 AM',
    endTime: '02:00 PM',
    type: 'meeting',
    location: 'Board Room',
    priority: 'high',
    attendees: ['Board Members', 'Senior Faculty']
  },
  {
    id: 'principal-meeting-2',
    title: 'Department Heads Meeting',
    description: 'Weekly coordination meeting with all department heads',
    date: createDate(2024, 10, 4),
    startTime: '09:00 AM',
    endTime: '11:00 AM',
    type: 'meeting',
    location: 'Principal Office',
    priority: 'high'
  },
  {
    id: 'principal-meeting-3',
    title: 'University Inspection',
    description: 'Annual inspection by university officials',
    date: createDate(2024, 11, 12),
    startTime: '10:00 AM',
    endTime: '04:00 PM',
    type: 'meeting',
    location: 'Campus Tour',
    priority: 'high'
  },
  
  // Events and Ceremonies
  {
    id: 'principal-event-1',
    title: 'New Faculty Induction',
    description: 'Orientation program for newly joined faculty members',
    date: createDate(2024, 9, 10),
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    type: 'event',
    location: 'Faculty Lounge',
    priority: 'high'
  },
  {
    id: 'principal-event-2',
    title: 'Industry Partnership Meet',
    description: 'Meeting with industry partners for internship and placement opportunities',
    date: createDate(2024, 10, 20),
    startTime: '11:00 AM',
    endTime: '03:00 PM',
    type: 'meeting',
    location: 'Conference Hall',
    priority: 'high'
  },
  
  // Strategic Planning
  {
    id: 'principal-plan-1',
    title: 'Budget Planning Session',
    description: 'Annual budget allocation and planning',
    date: createDate(2024, 11, 25),
    startTime: '09:00 AM',
    endTime: '06:00 PM',
    type: 'meeting',
    location: 'Finance Office',
    priority: 'high'
  },
  {
    id: 'principal-plan-2',
    title: 'Accreditation Review',
    description: 'Prepare documentation for accreditation renewal',
    date: createDate(2024, 12, 5),
    type: 'deadline',
    priority: 'high'
  }
];

// Get events by user role
export const getEventsByRole = (role: 'student' | 'teacher' | 'principal'): CalendarEvent[] => {
  switch (role) {
    case 'student':
      return studentCalendarEvents;
    case 'teacher':
      return teacherCalendarEvents;
    case 'principal':
      return principalCalendarEvents;
    default:
      return academicCalendarEvents;
  }
};

// Get upcoming events (next 30 days)
export const getUpcomingEvents = (events: CalendarEvent[], days: number = 30): CalendarEvent[] => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);
  
  return events
    .filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= today && eventDate <= futureDate;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// Get events for a specific date
export const getEventsForDate = (events: CalendarEvent[], date: Date): CalendarEvent[] => {
  return events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.toDateString() === date.toDateString();
  });
};

// Get events by type
export const getEventsByType = (events: CalendarEvent[], type: CalendarEvent['type']): CalendarEvent[] => {
  return events.filter(event => event.type === type);
};

// Sample event creation function
export const createSampleEvent = (
  title: string, 
  date: Date, 
  type: CalendarEvent['type'], 
  description?: string,
  startTime?: string,
  endTime?: string,
  location?: string
): CalendarEvent => {
  return {
    id: `event-${Date.now()}`,
    title,
    description,
    date,
    startTime,
    endTime,
    type,
    location,
    priority: 'medium',
    isAllDay: !startTime,
    createdBy: 'user'
  };
};