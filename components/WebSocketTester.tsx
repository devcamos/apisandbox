"use client";

import { useState } from "react";
import { Play, Square, CheckCircle, Activity } from "lucide-react";

interface WebSocketTesterProps {
  title: string;
  description: string;
}

export default function WebSocketTester({ title, description }: WebSocketTesterProps) {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Array<{ type: string; data: string; time: string }>>([]);
  const [message, setMessage] = useState("Hello WebSocket!");

  const handleConnect = () => {
    setConnected(true);
    setMessages([
      { type: "system", data: "✅ Connected to WebSocket server", time: new Date().toLocaleTimeString() }
    ]);
    
    // Simulate incoming messages
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: "received",
        data: JSON.stringify({ type: "welcome", message: "Welcome to the chat!" }),
        time: new Date().toLocaleTimeString()
      }]);
    }, 500);
  };

  const handleDisconnect = () => {
    setConnected(false);
    setMessages(prev => [...prev, {
      type: "system",
      data: "❌ Disconnected from WebSocket server",
      time: new Date().toLocaleTimeString()
    }]);
  };

  const handleSend = () => {
    if (!connected || !message.trim()) return;
    
    setMessages(prev => [...prev, {
      type: "sent",
      data: message,
      time: new Date().toLocaleTimeString()
    }]);
    
    // Simulate server response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: "received",
        data: JSON.stringify({ type: "echo", message: `Server received: ${message}` }),
        time: new Date().toLocaleTimeString()
      }]);
    }, 200);
    
    setMessage("");
  };

  return (
    <div className="bg-slate-900 p-4 rounded-lg border border-green-500/30 bg-green-500/10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <Activity className={`w-5 h-5 ${connected ? 'text-green-400 animate-pulse' : 'text-gray-400'}`} />
          <span className="text-green-400 font-semibold text-sm">{title}</span>
          <span className={`text-xs px-2 py-1 rounded ${connected ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        {!connected ? (
          <button
            onClick={handleConnect}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Connect
          </button>
        ) : (
          <button
            onClick={handleDisconnect}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
          >
            <Square className="w-4 h-4" />
            Disconnect
          </button>
        )}
      </div>

      <p className="text-gray-400 text-xs mb-3">{description}</p>

      {/* Message Log */}
      <div className="mb-3 bg-slate-800 border border-slate-700 rounded-lg p-3 h-48 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-xs text-center">No messages yet. Connect to start!</p>
        ) : (
          <div className="space-y-2">
            {messages.map((msg, idx) => (
              <div key={idx} className={`text-xs ${
                msg.type === 'sent' ? 'text-blue-400' :
                msg.type === 'received' ? 'text-green-400' :
                'text-gray-400'
              }`}>
                <span className="text-gray-500">[{msg.time}]</span>{' '}
                <span className="font-semibold">
                  {msg.type === 'sent' ? '→ Sent:' : msg.type === 'received' ? '← Received:' : '•'}
                </span>{' '}
                {msg.data}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Send Message */}
      {connected && (
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-slate-800 text-gray-300 border border-slate-700 rounded-lg px-3 py-2 text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}

