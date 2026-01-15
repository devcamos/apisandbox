"use client";

import { useState } from "react";
import { Send, CheckCircle, Clock, Archive } from "lucide-react";
import { collectHttpRequest, collectError } from "@/lib/metrics";

interface EventDrivenTesterProps {
  title: string;
  description: string;
  eventType: string;
}

export default function EventDrivenTester({ title, description, eventType }: EventDrivenTesterProps) {
  const [events, setEvents] = useState<Array<{ event: string; status: string; time: string }>>([]);
  const [publishing, setPublishing] = useState(false);

  const publishEvent = async () => {
    setPublishing(true);
    
    const newEvent = {
      event: eventType,
      status: "published",
      time: new Date().toLocaleTimeString()
    };
    
    setEvents(prev => [newEvent, ...prev]);
    
    // Collect metrics for event publishing
    collectHttpRequest({
      method: "EVENT_PUBLISH",
      url: `kafka://localhost:9092/${eventType}`,
      status: 200,
      duration: 15, // Simulated publish time
      timestamp: Date.now(),
      phase: "Phase 1",
      demo: `Event: ${eventType}`
    });
    
    // Simulate event processing
    setTimeout(() => {
      setEvents(prev => prev.map((e, idx) => 
        idx === 0 ? { ...e, status: "processing" } : e
      ));
    }, 500);
    
    setTimeout(() => {
      setEvents(prev => prev.map((e, idx) => 
        idx === 0 ? { ...e, status: "consumed" } : e
      ));
      setPublishing(false);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "text-blue-400 bg-blue-500/10";
      case "processing": return "text-yellow-400 bg-yellow-500/10";
      case "consumed": return "text-green-400 bg-green-500/10";
      default: return "text-gray-400 bg-gray-500/10";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published": return <Send className="w-3 h-3" />;
      case "processing": return <Clock className="w-3 h-3" />;
      case "consumed": return <CheckCircle className="w-3 h-3" />;
      default: return <Archive className="w-3 h-3" />;
    }
  };

  return (
    <div className="bg-slate-900 p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold px-3 py-1 rounded border border-yellow-500/30 bg-yellow-500/10 text-yellow-400">
              EVENT
            </span>
            <span className="text-yellow-400 font-semibold text-sm">{title}</span>
          </div>
        </div>
        <button
          onClick={publishEvent}
          disabled={publishing}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {publishing ? (
            <>
              <Clock className="w-4 h-4 animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Publish Event
            </>
          )}
        </button>
      </div>

      <p className="text-gray-400 text-xs mb-3">{description}</p>

      {/* Event Log */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {events.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-xs">
            No events yet. Click &quot;Publish Event&quot; to start!
          </div>
        ) : (
          events.map((event, idx) => (
            <div key={idx} className="bg-slate-800 border border-slate-700 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 font-mono text-xs">{event.event}</span>
                  <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${getStatusColor(event.status)}`}>
                    {getStatusIcon(event.status)}
                    {event.status}
                  </span>
                </div>
                <span className="text-gray-500 text-xs">{event.time}</span>
              </div>
              <div className="text-xs text-gray-400">
                Event published to message broker → Consumers processing asynchronously
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <p className="text-gray-300 text-xs">
          <span className="font-semibold text-yellow-400">💡 Async:</span> Events are published and consumed asynchronously. 
          Multiple services can react to the same event!
        </p>
      </div>
    </div>
  );
}

