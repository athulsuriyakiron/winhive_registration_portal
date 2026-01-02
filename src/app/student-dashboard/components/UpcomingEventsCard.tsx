'use client';

import { AppIcon } from '@/components/ui/AppIcon';

interface Event {
  id: string;
  title: string;
  date: string;
  type: string;
}

interface UpcomingEventsCardProps {
  events: Event[];
}

export default function UpcomingEventsCard({ events }: UpcomingEventsCardProps) {
  const eventTypeConfig = {
    'job-fair': { icon: 'briefcase', color: 'bg-blue-100 text-blue-600' },
    'expert-talk': { icon: 'users', color: 'bg-purple-100 text-purple-600' },
    'workshop': { icon: 'lightbulb', color: 'bg-green-100 text-green-600' },
    'webinar': { icon: 'video', color: 'bg-orange-100 text-orange-600' }
  };

  const defaultEvents = [
    {
      id: '1',
      title: 'Tech Career Fair 2025',
      date: '2025-01-15',
      type: 'job-fair'
    },
    {
      id: '2',
      title: 'Resume Building Workshop',
      date: '2025-01-10',
      type: 'workshop'
    },
    {
      id: '3',
      title: 'Industry Expert Talk',
      date: '2025-01-08',
      type: 'expert-talk'
    }
  ];

  const displayEvents = events.length > 0 ? events : defaultEvents;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Upcoming Events</h3>
        <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
          View All
        </button>
      </div>

      {displayEvents.length === 0 ? (
        <div className="text-center py-8">
          <AppIcon name="calendar" size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No upcoming events</p>
          <button className="mt-3 text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            Explore Events
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {displayEvents.map((event) => {
            const config = eventTypeConfig[event.type as keyof typeof eventTypeConfig] || eventTypeConfig['webinar'];
            const eventDate = new Date(event.date);
            const daysUntil = Math.ceil((eventDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

            return (
              <div
                key={event.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-indigo-200 transition cursor-pointer"
              >
                <div className="flex items-start space-x-3">
                  <div className={`${config.color} p-2 rounded-lg`}>
                    <AppIcon name={config.icon} size={18} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900">{event.title}</h4>
                    <div className="flex items-center mt-1 text-xs text-gray-600">
                      <AppIcon name="calendar" size={12} className="mr-1" />
                      {eventDate.toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                      {daysUntil > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full">
                          {daysUntil} days
                        </span>
                      )}
                      {daysUntil === 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-green-50 text-green-600 rounded-full font-medium">
                          Today
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button className="w-full mt-4 border border-indigo-200 text-indigo-600 py-2 rounded-lg hover:bg-indigo-50 transition text-sm font-medium">
        Explore More Events
      </button>
    </div>
  );
}