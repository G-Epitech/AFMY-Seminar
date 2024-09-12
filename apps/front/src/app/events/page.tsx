"use client";
import React from "react";
import { Subtitle } from "@/components/text/subtitle";
import { Card } from "@/components/ui/card";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { EventInput } from "@fullcalendar/core";
import api from "@/api";
import { MeetingEvent } from "@seminar/common";

export default function Events() {
  const fetchEvents = async (
    fetchInfo: { start: Date; end: Date },
    successCallback: any,
    failureCallback: any,
  ): Promise<EventInput[]> => {
    const response = await api.events.list({
      month: fetchInfo.start.getMonth() + 1,
      year: fetchInfo.start.getFullYear(),
    });

    if (response && response.data) {
      const events = response.data.events.map(
        (event: MeetingEvent): EventInput => {
          return {
            title: event.title,
            start: event.start,
            end: event.end,
          };
        },
      );
      successCallback(events);
      return events;
    } else {
      failureCallback(response);
      return [];
    }
  };

  return (
    <main>
      <Subtitle text="Events" />
      <Card className={"p-4"}>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={fetchEvents}
        />
      </Card>
    </main>
  );
}
