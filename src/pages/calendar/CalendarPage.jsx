import React, { useState, useMemo } from 'react';
import {
  format,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parseISO
} from 'date-fns';
import { useCalendarStore } from '../../store/calendarStore';
import { useTaskStore } from '../../store/taskStore';
import { useProjectStore } from '../../store/projectStore';
import { EventModal } from '../../components/calendar/EventModal';
import { TaskDetailModal } from '../../components/tasks/TaskDetailModal';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Filter,
  CheckSquare
} from 'lucide-react';

export const CalendarPage = () => {
  const events = useCalendarStore(state => state.events);
  const addEvent = useCalendarStore(state => state.addEvent);
  const updateEvent = useCalendarStore(state => state.updateEvent);
  const deleteEvent = useCalendarStore(state => state.deleteEvent);

  const tasks = useTaskStore(state => state.tasks);
  const projects = useProjectStore(state => state.projects);

  const [currentDate, setCurrentDate] = useState(new Date(2026, 10, 23)); // Nov 23, 2026
  const [viewMode, setViewMode] = useState('month'); // 'month' | 'week' | 'day' | 'agenda'
  const [projectFilter, setProjectFilter] = useState('All');

  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // Navigation handlers
  const handlePrev = () => {
    if (viewMode === 'month') setCurrentDate(subMonths(currentDate, 1));
    else if (viewMode === 'week') setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subDays(currentDate, 1));
  };

  const handleNext = () => {
    if (viewMode === 'month') setCurrentDate(addMonths(currentDate, 1));
    else if (viewMode === 'week') setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addDays(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 10, 23));
  };

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      if (projectFilter === 'All') return true;
      return e.projectId === projectFilter;
    });
  }, [events, projectFilter]);

  // Tasks with deadlines to display on calendar
  const taskDeadlines = useMemo(() => {
    return tasks
      .filter(t => t.dueDate && (projectFilter === 'All' || t.projectId === projectFilter))
      .map(t => ({
        id: `task-deadline-${t.id}`,
        taskId: t.id,
        title: `⚡ Due: ${t.title}`,
        startDate: `${t.dueDate}T17:00:00Z`,
        endDate: `${t.dueDate}T18:00:00Z`,
        color: t.priority === 'Critical' ? '#EF4444' : '#7867F7',
        isTask: true,
        status: t.status,
        priority: t.priority
      }));
  }, [tasks, projectFilter]);

  const allItems = [...filteredEvents, ...taskDeadlines];

  // Month grid calculation
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Week days calculation
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
            Interactive Calendar
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Sprint milestones, task deadlines, and team synchronization schedule
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setSelectedEvent(null);
              setEventModalOpen(true);
            }}
            icon={Plus}
            variant="primary"
            className="shadow-sm"
          >
            New Event
          </Button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-brand-indigo border border-slate-200/80 dark:border-brand-darkBorder shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Date Navigator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-700 rounded-xl p-1 bg-slate-50 dark:bg-slate-800">
            <button
              onClick={handlePrev}
              className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-2.5 py-0.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={handleNext}
              className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-heading">
            {format(currentDate, 'MMMM yyyy')}
          </h3>
        </div>

        {/* View Switcher & Project Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
          >
            <option value="All">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 text-xs font-bold">
            {['month', 'week', 'day', 'agenda'].map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                  viewMode === mode
                    ? 'bg-white dark:bg-brand-indigo text-brand-violet shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Calendar Views */}
      {viewMode === 'month' && (
        <div className="rounded-2xl border border-slate-200/80 dark:border-brand-darkBorder bg-white dark:bg-brand-indigo overflow-hidden shadow-subtle">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-center text-[11px] font-bold text-slate-400 uppercase py-2.5">
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
            <div>Sun</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 dark:divide-slate-800/80">
            {calendarDays.map((day, idx) => {
              const dayItems = allItems.filter(item => isSameDay(parseISO(item.startDate), day));
              const isCurrentMonth = isSameMonth(day, monthStart);
              const isToday = isSameDay(day, new Date(2026, 10, 23));

              return (
                <div
                  key={idx}
                  className={`min-h-[110px] sm:min-h-[130px] p-1.5 sm:p-2 transition-colors ${
                    isCurrentMonth ? 'bg-white dark:bg-brand-indigo' : 'bg-slate-50/50 dark:bg-slate-900/20 opacity-40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isToday
                          ? 'bg-brand-violet text-white shadow-glow-violet'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {format(day, 'd')}
                    </span>
                    {dayItems.length > 0 && (
                      <span className="text-[10px] text-slate-400 font-semibold hidden sm:inline">
                        {dayItems.length} {dayItems.length === 1 ? 'item' : 'items'}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 overflow-y-auto max-h-[85px]">
                    {dayItems.map(item => (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (item.isTask) {
                            setSelectedTaskId(item.taskId);
                          } else {
                            setSelectedEvent(item);
                            setEventModalOpen(true);
                          }
                        }}
                        className="px-2 py-1 rounded-lg text-[11px] font-medium truncate cursor-pointer hover:brightness-95 transition-all text-white shadow-xs"
                        style={{ backgroundColor: item.color || '#7867F7' }}
                        title={item.title}
                      >
                        {item.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === 'week' && (
        <div className="rounded-2xl border border-slate-200/80 dark:border-brand-darkBorder bg-white dark:bg-brand-indigo overflow-hidden shadow-subtle">
          <div className="grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800">
            {weekDays.map((day, idx) => {
              const dayItems = allItems.filter(item => isSameDay(parseISO(item.startDate), day));
              const isToday = isSameDay(day, new Date(2026, 10, 23));

              return (
                <div key={idx} className="p-3 min-h-[400px]">
                  <div className="text-center pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      {format(day, 'EEE')}
                    </p>
                    <p className={`text-base font-extrabold mx-auto mt-0.5 w-7 h-7 rounded-full flex items-center justify-center ${
                      isToday ? 'bg-brand-violet text-white' : 'text-slate-800 dark:text-slate-100'
                    }`}>
                      {format(day, 'd')}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {dayItems.map(item => (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (item.isTask) setSelectedTaskId(item.taskId);
                          else {
                            setSelectedEvent(item);
                            setEventModalOpen(true);
                          }
                        }}
                        className="p-2.5 rounded-xl text-xs font-semibold text-white shadow-sm cursor-pointer hover:scale-[1.02] transition-transform"
                        style={{ backgroundColor: item.color || '#7867F7' }}
                      >
                        <p className="line-clamp-2">{item.title}</p>
                        <span className="text-[10px] opacity-90 block mt-1">
                          {format(parseISO(item.startDate), 'h:mm a')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === 'day' && (
        <Card>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
            <div>
              <span className="text-xs font-bold text-brand-violet uppercase">Day View</span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">
                {format(currentDate, 'EEEE, MMMM d, yyyy')}
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            {allItems.filter(item => isSameDay(parseISO(item.startDate), currentDate)).length === 0 ? (
              <p className="text-xs text-slate-400 italic py-8 text-center">No scheduled events or deadlines for this day.</p>
            ) : (
              allItems
                .filter(item => isSameDay(parseISO(item.startDate), currentDate))
                .map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (item.isTask) setSelectedTaskId(item.taskId);
                      else {
                        setSelectedEvent(item);
                        setEventModalOpen(true);
                      }
                    }}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-violet/40 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color || '#7867F7' }} />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {format(parseISO(item.startDate), 'h:mm a')} – {format(parseISO(item.endDate), 'h:mm a')}
                        </p>
                      </div>
                    </div>
                    {item.isTask && (
                      <Badge variant={item.priority} size="xs">
                        {item.priority}
                      </Badge>
                    )}
                  </div>
                ))
            )}
          </div>
        </Card>
      )}

      {viewMode === 'agenda' && (
        <Card padding="p-0" className="overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white font-heading">
              Chronological Sprint Agenda
            </h3>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {allItems
              .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
              .map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.isTask) setSelectedTaskId(item.taskId);
                    else {
                      setSelectedEvent(item);
                      setEventModalOpen(true);
                    }
                  }}
                  className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color || '#7867F7' }} />
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-100">{item.title}</p>
                      <span className="text-[11px] text-slate-400">
                        {format(parseISO(item.startDate), 'MMM d, yyyy · h:mm a')}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs text-brand-violet font-semibold">
                    {item.category || (item.isTask ? 'Task Deadline' : 'Event')}
                  </span>
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* Event Modal */}
      <EventModal
        isOpen={eventModalOpen}
        onClose={() => setEventModalOpen(false)}
        event={selectedEvent}
        onSave={(data) => {
          if (selectedEvent) updateEvent(selectedEvent.id, data);
          else addEvent(data);
        }}
        onDelete={deleteEvent}
      />

      {/* Task Modal */}
      <TaskDetailModal
        isOpen={!!selectedTaskId}
        taskId={selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
        onEdit={() => {}}
      />
    </div>
  );
};
