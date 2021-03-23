import React, { useEffect, useState } from 'react';
import { CalendarEvent, getCalendarEvents } from '../api-client';
import { useLoadStatus } from '../hooks';
import { getCustomDate } from '../utils/date-helper';
import style from "./style.module.css";
interface EventData {
  date: Date,
  events: CalendarEvent[]
}

const CalendarSummary: React.FunctionComponent = () => {
  const { isLoaded, setIsLoaded, error, setError } = useLoadStatus();
  const [events, setEvents] = useState<EventData[] | null>(null);
  let quantityEvents: any = [];
  let longestEvents: CalendarEvent[] = [];
  let totalDurations: any = [];

  const fetchEvents = async () => {
    try {
      const days = [];

      for (let i = 0; i < 7; i++) {
        const date: Date = new Date();
        date.setDate(date.getDate() + i);
        const response = await getCalendarEvents(date);
        const day = { date, events: response };
        days.push(day);
      }

      setEvents(days);
      setIsLoaded(true);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const getTotalDuration = (arr: CalendarEvent[]): number => {
    const totalDuration = arr.reduce((acc, curr) => acc += curr.durationInMinutes, 0);
    totalDurations = [...totalDurations, totalDuration];
    return totalDuration;
  };

  const getQuantityEvents = (arr: CalendarEvent[]): number => {
    const quantity = arr.length;
    quantityEvents = [...quantityEvents, quantity];
    return quantity;
  }

  const getLongestEvent = (arr: CalendarEvent[]): CalendarEvent => {
    const longestEvent = [...arr].sort((a, b) => b.durationInMinutes - a.durationInMinutes)[0]
    longestEvents = [...longestEvents, longestEvent];
    return longestEvent;
  };

  const getWeekTotalDuration = (): number => {
    return totalDurations.reduce((acc: number, curr: number) => acc += curr, 0);
  };

  const getWeekTotalEvents = (): number => {
    return quantityEvents.reduce((acc: number, curr: number) => acc += curr, 0);
  }

  const getWeekLongestEvent = (): CalendarEvent => {
    return longestEvents.sort((a, b) => b.durationInMinutes - a.durationInMinutes)[0];
  }

  const getMarkupByLoadStatus = () => {
    if (error) {
      return <div className={style.statusInfoContainer}><h2>Error: {error.message}</h2></div>;
    } else if (!isLoaded) {
      return <div className={style.statusInfoContainer}><h2>Loading...</h2></div>;
    } else {
      return (
        <div>
          <table className={style.eventsTable}>
            <thead className={style.eventsTableHeader}>
              <tr>
                <th>Date</th>
                <th>Number of events</th>
                <th>Total duration</th>
                <th>Longest event</th>
              </tr>
            </thead>
            <tbody>
              {events && events.map((it: any) => (
                <tr key={it.date.toString()}>
                  <td>{getCustomDate(it.date)}</td>
                  <td>{getQuantityEvents(it.events)}</td>
                  <td>{getTotalDuration(it.events)}</td>
                  <td>{getLongestEvent(it.events).title}</td>
                </tr>
              ))}
              {events &&
                <tr>
                  <td>Total</td>
                  <td>{getWeekTotalEvents()}</td>
                  <td>{getWeekTotalDuration()}</td>
                  <td>{getWeekLongestEvent().title}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      );
    }
  };

  return (
    <div>
      <h2>Calendar summary</h2>
      {getMarkupByLoadStatus()}
    </div>
  );
};

export default CalendarSummary;
