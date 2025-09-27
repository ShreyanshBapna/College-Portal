import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, MapPin, Users, Calendar, AlertCircle, Tag, User } from 'lucide-react';
import { CalendarEvent } from './Calendar';

interface EventModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (event: CalendarEvent) => void;
  onDelete?: (eventId: string) => void;
  userRole?: 'student' | 'teacher' | 'principal';
}

const EventModal: React.FC<EventModalProps> = ({
  event,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  userRole = 'student'
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    if (event) {
      setEditedEvent({ ...event });
    }
    setIsEditing(false);
  }, [event]);

  if (!event || !isOpen) return null;

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

  const getPriorityColor = (priority?: CalendarEvent['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const canEdit = () => {
    if (userRole === 'principal') return true;
    if (userRole === 'teacher' && ['class', 'meeting', 'assignment'].includes(event.type)) return true;
    return false;
  };

  const handleSave = () => {
    if (editedEvent && onEdit) {
      onEdit(editedEvent);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      onDelete?.(event.id);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`${getEventTypeColor(event.type)} text-white p-6 rounded-t-3xl relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
              <div className="relative z-10 flex items-start justify-between">
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedEvent?.title || ''}
                      onChange={(e) => setEditedEvent(prev => prev ? {...prev, title: e.target.value} : null)}
                      className="bg-white/20 border border-white/30 rounded-xl px-4 py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 text-2xl font-bold w-full"
                      placeholder="Event title"
                    />
                  ) : (
                    <h2 className="text-2xl lg:text-3xl font-bold mb-2">{event.title}</h2>
                  )}
                  <div className="flex items-center space-x-3 text-sm opacity-90">
                    <span className="px-2 py-1 bg-white/20 rounded-lg font-medium capitalize">
                      {event.type}
                    </span>
                    {event.priority && (
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getPriorityColor(event.priority)}`}>
                        {event.priority.toUpperCase()} PRIORITY
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Description */}
              {(event.description || isEditing) && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editedEvent?.description || ''}
                      onChange={(e) => setEditedEvent(prev => prev ? {...prev, description: e.target.value} : null)}
                      className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                      rows={3}
                      placeholder="Event description"
                    />
                  ) : (
                    <p className="text-gray-600 leading-relaxed">{event.description}</p>
                  )}
                </div>
              )}

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date and Time */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Date & Time</span>
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 p-3 bg-indigo-50/70 rounded-xl">
                      <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                      <div>
                        <div className="font-medium text-gray-900">{formatDate(new Date(event.date))}</div>
                        <div className="text-sm text-gray-500">
                          {event.isAllDay ? 'All Day' : 
                           event.startTime ? `${event.startTime}${event.endTime ? ` - ${event.endTime}` : ''}` : 
                           'Time not specified'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location and Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                    <Tag className="w-5 h-5" />
                    <span>Details</span>
                  </h3>
                  <div className="space-y-2">
                    {event.location && (
                      <div className="flex items-center space-x-3 p-3 bg-green-50/70 rounded-xl">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Location</div>
                          <div className="text-sm text-gray-600">{event.location}</div>
                        </div>
                      </div>
                    )}
                    
                    {event.course && (
                      <div className="flex items-center space-x-3 p-3 bg-blue-50/70 rounded-xl">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Course</div>
                          <div className="text-sm text-gray-600">{event.course}</div>
                        </div>
                      </div>
                    )}

                    {event.department && (
                      <div className="flex items-center space-x-3 p-3 bg-purple-50/70 rounded-xl">
                        <User className="w-4 h-4 text-purple-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Department</div>
                          <div className="text-sm text-gray-600">{event.department}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Attendees */}
              {event.attendees && event.attendees.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2 mb-3">
                    <Users className="w-5 h-5" />
                    <span>Attendees ({event.attendees.length})</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {event.attendees.map((attendee, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100/70 text-gray-700 rounded-full text-sm font-medium"
                      >
                        {attendee}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Event Metadata */}
              <div className="bg-gray-50/70 rounded-xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Event ID:</span> {event.id}
                  </div>
                  {event.createdBy && (
                    <div>
                      <span className="font-medium">Created by:</span> {event.createdBy}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            {canEdit() && (
              <div className="px-6 pb-6">
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex space-x-3">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSave}
                          className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors font-medium"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
                      >
                        Edit Event
                      </button>
                    )}
                  </div>
                  
                  {userRole === 'principal' && (
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium flex items-center space-x-2"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EventModal;