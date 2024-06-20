"use client";

import { cn } from "@/lib/utils";
import Timeline from "rsuite/Timeline";
import "rsuite/Timeline/styles/index.css";
import "@/styles/timeline.css";
import Link from "next/link";

export interface TimelineEvent {
  logo: React.ReactNode;
  icon?: React.ReactNode;
  title: string;
  subtitle: string;
  timeline?: string;
  link?: string;
  children: React.ReactNode;
}

interface CustomTimelineProps {
  timelineEvents: TimelineEvent[];
  className?: string;
}

export function CustomTimeline({
  timelineEvents,
  className,
}: CustomTimelineProps) {
  return (
    <Timeline
      align={"left"}
      className={cn("custom-timeline overflow-y-hidden", className)}
      isItemActive={() => false}
    >
      {timelineEvents.map((event, index) => (
        <Timeline.Item key={index} dot={event.icon}>
          <div className="hover:border-green relative flex flex-col justify-between overflow-hidden rounded-md border">
            <div className="flex items-center space-x-4 p-2 pl-5">
              {event.logo}
              <div className="text-start">
                <p className="text-lg font-medium leading-6 md:text-xl">
                  {!!event.link ? (
                    <Link
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-full rounded-md before:absolute before:inset-0 before:content-[''] hover:no-underline focus:no-underline active:no-underline"
                    >
                      {event.title}
                    </Link>
                  ) : (
                    event.title
                  )}
                </p>
                <p className="text-sm md:text-base">{event.subtitle}</p>
              </div>
            </div>
            <div className="m-6 text-start subpixel-antialiased md:text-base">
              {!!event.timeline && (
                <>
                  <p>
                    <b>{event.timeline}</b>
                  </p>
                  <br />
                </>
              )}
              {event.children}
            </div>
          </div>
        </Timeline.Item>
      ))}
    </Timeline>
  );
}
