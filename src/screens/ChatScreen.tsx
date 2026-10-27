import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { useApp } from '../context/AppContext';
import {
  Send,
  Phone,
  Zap,
  ShieldCheck,
  CheckCheck,
  Sparkles,
  Paperclip,
  ShieldAlert,
} from 'lucide-react';

export const ChatScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    messages,
    sendChatMessage,
    activeRequest,
    hostProfile,
    driverProfile,
    currentRole,
  } = useApp();

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText, currentRole === 'driver' ? 'driver' : 'host');
    setInputText('');
  };

  const quickReplies = [
    'I have arrived at Gate 1',
    'What is the security gate code?',
    'Stuck in slight traffic, 3 mins away',
    'Plugging in Type 2 cable now, thanks!',
  ];

  const currentHost = activeRequest
    ? {
        name: activeRequest.hostName,
        phone: activeRequest.hostPhone,
        address: activeRequest.hostAddressText,
        pin: activeRequest.checkinCode,
      }
    : {
        name: hostProfile.name,
        phone: hostProfile.phone,
        address: hostProfile.addressText,
        pin: 'CS-8491',
      };

  return (
    <div className="flex-1 flex flex-col bg-bg text-ink h-screen max-h-screen">
      {/* Header */}
      <div className="bg-surface/95 backdrop-blur-md px-4 py-3 border-b border-surface-border shadow-card flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
              alt={currentHost.name}
              className="w-10 h-10 rounded-xl object-cover border border-surface-border"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full border-2 border-surface" />
          </div>
          <div>
            <h3 className="font-extrabold text-ink text-xs sm:text-sm">
              {currentRole === 'driver' ? currentHost.name : driverProfile.name}
            </h3>
            <p className="text-[10px] text-primary font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span>Online · Bay PIN: {currentHost.pin}</span>
            </p>
          </div>
        </div>

        <a
          href={`tel:${currentHost.phone}`}
          className="w-8 h-8 rounded-xl bg-surface-card border border-surface-border flex items-center justify-center text-ink hover:border-primary transition"
          title="Call"
        >
          <Phone className="w-4 h-4 text-primary" />
        </a>
      </div>

      {/* Safety Notice per Section 10/13 */}
      <div className="px-4 pt-2">
        <div className="bg-surface-card p-2 rounded-xl border border-surface-border text-[10px] text-ink-muted flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-warning shrink-0" />
            <span>Safety Rule: Meet only at the address shown after accept. Never share OTP or card info.</span>
          </div>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
        {messages.map((msg) => {
          const isSender =
            (currentRole === 'driver' && msg.senderId === 'driver') ||
            (currentRole === 'host' && msg.senderId === 'host');

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isSender ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                  isSender
                    ? 'bg-primary text-bg font-medium rounded-tr-none shadow-glow-primary'
                    : 'bg-surface text-ink border border-surface-border rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <div
                  className={`flex items-center justify-end gap-1 text-[9px] mt-0.5 ${
                    isSender ? 'text-bg/80' : 'text-ink-muted'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {isSender && <CheckCheck className="w-3 h-3 text-bg" />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reply Chips */}
      <div className="px-4 py-1.5 flex gap-1.5 overflow-x-auto no-scrollbar">
        {quickReplies.map((qr) => (
          <button
            key={qr}
            onClick={() => sendChatMessage(qr, currentRole === 'driver' ? 'driver' : 'host')}
            className="px-2.5 py-1 rounded-full bg-surface-card border border-surface-border text-ink-muted hover:text-ink text-[11px] font-semibold whitespace-nowrap shrink-0 transition"
          >
            {qr}
          </button>
        ))}
      </div>

      {/* Message Input Bar */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-surface border-t border-surface-border flex items-center gap-2 sticky bottom-0 z-20"
      >
        <button
          type="button"
          onClick={() => alert('Photo sharing simulated.')}
          className="w-9 h-9 rounded-xl bg-surface-card border border-surface-border text-ink-muted hover:text-ink flex items-center justify-center transition"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Message (e.g. at the gate)..."
          className="flex-1 rounded-xl bg-surface-card border border-surface-border px-3.5 py-2 text-xs text-ink focus:outline-none focus:border-primary transition placeholder:text-ink-subtle"
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
            inputText.trim()
              ? 'bg-primary text-bg font-bold shadow-glow-primary active:scale-95'
              : 'bg-surface-card text-ink-subtle border border-surface-border cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
