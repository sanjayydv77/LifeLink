import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Stethoscope, ChevronDown } from 'lucide-react';

// ─── Knowledge Base ────────────────────────────────────────────────────────────
interface QA { keywords: string[]; answer: string; }

const KB: QA[] = [
  {
    keywords: ['what is lifelink', 'what is this platform', 'about lifelink', 'about this', 'tell me about', 'purpose', 'overview', 'introduction'],
    answer: `**LifeLink** is a real-time healthcare resource coordination platform connecting three key actors:\n\n🏥 **Hospitals** — manage beds, oxygen, ambulances & incoming requests\n🚑 **Ambulance Drivers** — receive SOS dispatches, navigate to patients, notify hospitals\n👤 **Public / Patients** — book beds, find nearby hospitals, request appointments\n\nEverything is synchronized live using WebSocket technology.`,
  },
  {
    keywords: ['doctor', 'which role', 'i am a doctor', 'i am doctor', 'role for doctor', 'what role', 'select role', 'my role', 'which portal'],
    answer: `If you are a **Doctor**, you should log in under the **Hospital Admin** role.\n\nDoctors working within a hospital can:\n✅ View & manage incoming patient requests\n✅ Accept/reject bed bookings and appointments\n✅ Update the hospital's resource inventory\n✅ Manage inter-hospital resource sharing\n\nAsk your hospital admin for the login credentials.`,
  },
  {
    keywords: ['patient', 'i am patient', 'public portal', 'book bed', 'find hospital', 'appointment', 'emergency', 'sos'],
    answer: `As a **Patient / Public User**, use the **Public Portal** to:\n\n🏥 Browse nearby hospitals and their live availability\n🛏️ Book a hospital bed or ICU slot\n📅 Schedule a doctor appointment\n🚨 Send an SOS emergency request (dispatches the nearest ambulance)\n\nSelect **"Patient"** when logging in.`,
  },
  {
    keywords: ['ambulance', 'driver', 'ambulance driver', 'i drive', 'i am driver'],
    answer: `**Ambulance Drivers** have a dedicated portal that provides:\n\n🗺️ Live map view of emergency SOS calls\n📡 Real-time GPS tracking of your vehicle\n🏥 Nearest hospital list with live bed/oxygen counts\n📞 One-tap hospital notification ("Inform" button)\n🧭 Google Maps navigation to patient or hospital\n\nSelect **"Ambulance Driver"** when logging in.`,
  },
  {
    keywords: ['hospital admin', 'hospital portal', 'i manage', 'i run hospital', 'admin'],
    answer: `**Hospital Admins** get a full dashboard to:\n\n📊 View live inventory (beds, ICU, oxygen, ambulances)\n📋 Accept or reject patient bed booking & appointment requests\n🚑 Respond to ambulance arrival notifications\n🔄 Share resources with other hospitals (inter-hospital requests)\n👤 Update hospital profile & upload CSV for bulk data import\n\nSelect **"Hospital Admin"** when logging in.`,
  },
  {
    keywords: ['login', 'sign in', 'how to login', 'otp', 'phone', 'credentials', 'log in'],
    answer: `**Logging in is simple:**\n\n1. Enter your registered phone number\n2. Click "Send OTP"\n3. An OTP appears in the **amber Dev Mode banner** (for demo purposes)\n4. Enter the OTP and select your role\n\n📌 Pre-loaded hospital phone numbers:\n• AIIMS → 1234567899\n• Apollo → 9000000001\n• Safdarjung → 9000000002\n(and 7 more hospitals)`,
  },
  {
    keywords: ['resource sharing', 'share resource', 'inter hospital', 'request oxygen', 'borrow', 'lend'],
    answer: `**Inter-Hospital Resource Sharing** allows hospitals to collaborate:\n\n1. Go to the **Resource Sharing** tab in the Hospital Dashboard\n2. **Browse** — see all hospitals with their live inventory\n3. Click **Request** → choose resource type, quantity & add a note\n4. The target hospital receives it instantly (live via WebSocket)\n5. They can **Agree** or **Deny** with a custom message\n6. The requesting hospital sees the response in their **Outgoing** tab`,
  },
  {
    keywords: ['inventory', 'beds', 'oxygen', 'icu', 'ventilator', 'update inventory', 'resources'],
    answer: `Hospital admins can update their **Resource Inventory** from the Dashboard tab:\n\n🛏️ General Beds\n🫀 ICU Beds\n💨 Oxygen Cylinders\n🔬 Ventilators\n🚑 Ambulances\n\nAll changes are **broadcast live** to the Public Portal and Ambulance Portal via WebSocket — patients and drivers see accurate availability instantly.`,
  },
  {
    keywords: ['csv', 'upload csv', 'bulk import', 'import profile', 'csv template'],
    answer: `**CSV Import for Hospital Profile:**\n\n1. Open the Hospital Dashboard → click the **👤 Profile icon** (top right)\n2. In the profile panel, click **Download Template** to get a CSV pre-filled with your hospital's current data\n3. Edit it in Excel / Google Sheets with updated info\n4. Click **Upload CSV** — the profile updates in under 2 seconds!\n\nCSV columns: name, address, city, phone, email, specializations, openingTime, closingTime, totalBeds, icuBeds, oxygen, ambulances, ventilators`,
  },
  {
    keywords: ['real time', 'live', 'socket', 'websocket', 'instant', 'sync'],
    answer: `LifeLink uses **Socket.io WebSockets** for real-time synchronization:\n\n⚡ Inventory updates from hospitals appear instantly on Public & Ambulance portals\n🚨 SOS emergencies are broadcast to all ambulances in real-time\n📋 Resource sharing requests and responses are live\n🚑 Ambulance arrival notifications reach hospital dashboards instantly\n\nNo need to refresh — everything updates automatically!`,
  },
  {
    keywords: ['google map', 'navigation', 'navigate', 'maps', 'directions', 'route'],
    answer: `**Navigation in the Ambulance Portal:**\n\n1. Find a hospital in the right panel\n2. Click the **Nav** button on a hospital card\n3. Google Maps opens in a new tab with turn-by-turn directions from your current GPS location to that hospital\n\nThe app also shows a live route overlay on the in-app map using OSRM routing. The **"Open Maps"** button in the navigation banner also opens Google Maps directly.`,
  },
  {
    keywords: ['specialization', 'cardiology', 'neurology', 'specialty', 'department'],
    answer: `Each hospital on LifeLink displays its **medical specializations** so patients and ambulance drivers can quickly find the right facility.\n\nHospital admins can update specializations from the **Profile panel** (comma-separated). These appear as tags on the Public Portal and Ambulance Portal hospital cards.`,
  },
  {
    keywords: ['contact', 'phone number', 'call', 'support', 'help'],
    answer: `You can call any hospital directly from the **Ambulance Portal** — every hospital card has a **📞 Call** button that uses your device's phone dialer.\n\nFor platform support, contact the LifeLink admin team through your institution.`,
  },
  {
    keywords: ['profile', 'update profile', 'hospital profile', 'edit hospital'],
    answer: `**Updating Your Hospital Profile:**\n\n1. Click the **👤 icon** in the top-right of the Hospital Dashboard\n2. The profile panel slides open with all your current hospital data fetched live from the DB\n3. Click the **✏️ Edit** button to enable editing\n4. Update any field: name, address, phone, email, opening hours, specializations, resources\n5. Click **Save Profile** to persist changes\n\nOr use **CSV Import** for bulk updates!`,
  },
  {
    keywords: ['hi', 'hello', 'hey', 'hii', 'namaste', 'good morning', 'good evening', 'good afternoon'],
    answer: `👋 Hello! I'm **LifeLink Assistant** — your guide to this healthcare coordination platform.\n\nYou can ask me things like:\n• "What is this platform for?"\n• "I am a doctor, which role should I select?"\n• "How does ambulance dispatch work?"\n• "How do I share resources with another hospital?"\n\nWhat would you like to know?`,
  },
  {
    keywords: ['thank', 'thanks', 'thank you', 'great', 'awesome', 'perfect', 'helpful'],
    answer: `You're welcome! 😊 Feel free to ask anything else about the LifeLink platform. I'm here to help 24/7!`,
  },
  {
    keywords: ['bed booking', 'book a bed', 'reserve bed', 'get admitted'],
    answer: `**Booking a Hospital Bed:**\n\n1. Log in as a **Patient** and go to the Public Portal\n2. Browse the hospital list — each card shows live bed availability\n3. Click **Book Bed** on the hospital of your choice\n4. Fill in your name, phone, and reason\n5. The hospital receives your request instantly on their dashboard\n6. You'll be notified when the hospital accepts or rejects the booking`,
  },
  {
    keywords: ['sos', 'emergency', 'send sos', 'emergency request', 'critical'],
    answer: `**Sending an SOS Emergency:**\n\n1. Log in as a **Patient** on the Public Portal\n2. Click the **🚨 SOS Emergency** button\n3. Your request is broadcast to ALL active ambulance drivers in real-time\n4. The nearest available driver accepts the dispatch\n5. Track the ambulance location live on your map\n\n⚠️ Use SOS only for genuine emergencies.`,
  },
];

// ─── Response Engine ────────────────────────────────────────────────────────────
const DEFAULT = `I'm not sure about that specific question. Try asking about:\n• Roles (patient, doctor, ambulance driver)\n• How to book a bed or send SOS\n• Resource sharing between hospitals\n• How to update hospital inventory or profile\n• Google Maps navigation in the Ambulance Portal`;

function getResponse(input: string): string {
  const lower = input.toLowerCase().trim();
  let best: { score: number; answer: string } = { score: 0, answer: DEFAULT };
  for (const qa of KB) {
    const score = qa.keywords.reduce((acc, kw) => acc + (lower.includes(kw) ? kw.split(' ').length : 0), 0);
    if (score > best.score) best = { score, answer: qa.answer };
  }
  return best.answer;
}

// ─── Message Renderer (supports **bold** and newlines) ─────────────────────────
function MsgText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**')
          ? <strong key={i}>{p.slice(2, -2)}</strong>
          : p.split('\n').map((line, j) => (
              <React.Fragment key={`${i}-${j}`}>
                {line}
                {j < p.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))
      )}
    </span>
  );
}

// ─── Quick Questions ────────────────────────────────────────────────────────────
const QUICK: string[] = [
  'What is LifeLink?',
  'I am a doctor — which role?',
  'How does ambulance dispatch work?',
  'How to share resources between hospitals?',
  'How to book a bed?',
];

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Msg { role: 'bot' | 'user'; text: string; ts: Date; }

// ─── Component ─────────────────────────────────────────────────────────────────
export default function LifeLinkChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'bot',
      text: `👋 Hi! I'm **LifeLink Assistant** — your AI guide to this platform.\n\nAsk me anything about roles, features, navigation, or how to get started!`,
      ts: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showQuick, setShowQuick] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  const send = (text: string) => {
    const userMsg = text.trim();
    if (!userMsg) return;
    setInput('');
    setShowQuick(false);
    setMessages(prev => [...prev, { role: 'user', text: userMsg, ts: new Date() }]);
    setTyping(true);
    // Simulate typing delay for realism
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { role: 'bot', text: getResponse(userMsg), ts: new Date() }]);
    }, 700 + Math.random() * 400);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  return (
    <>
      {/* ── Floating Button ── */}
      <button
        onClick={() => setOpen(o => !o)}
        title="LifeLink Assistant"
        className={`fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          open ? 'bg-rose-600 hover:bg-rose-500 rotate-90' : 'bg-gradient-to-br from-teal-500 to-teal-700 hover:from-teal-400 hover:to-teal-600'
        }`}
        style={{ boxShadow: open ? '0 0 0 4px rgba(239,68,68,0.25)' : '0 0 0 4px rgba(20,184,166,0.25), 0 8px 32px rgba(0,0,0,0.4)' }}
      >
        {open
          ? <X className="w-6 h-6 text-white" />
          : (
            <div className="relative flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-teal-700 animate-pulse" />
            </div>
          )
        }
      </button>

      {/* ── Chat Window ── */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-[9998] w-[360px] max-h-[560px] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: 'linear-gradient(180deg,#0a2822 0%,#071e1a 100%)', border: '1px solid rgba(20,184,166,0.25)' }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-teal-900/80 to-[#0a2822] border-b border-teal-800/40 shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-lg shrink-0">
              <Stethoscope className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm leading-tight">LifeLink Assistant</p>
              <p className="text-emerald-400 text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                Online · Healthcare AI Guide
              </p>
            </div>
            <button onClick={() => setOpen(false)} className="text-teal-500 hover:text-white transition-colors">
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ minHeight: 0, maxHeight: 360 }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center shrink-0 mt-0.5 shadow">
                    <Stethoscope style={{ width: 13, height: 13, color: 'white' }} />
                  </div>
                )}
                <div
                  className={`max-w-[82%] px-3 py-2.5 rounded-2xl text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-teal-600 text-white rounded-br-sm'
                      : 'bg-[#0c2e28] border border-teal-800/40 text-teal-100 rounded-bl-sm'
                  }`}
                >
                  <MsgText text={m.text} />
                  <div className={`text-[9px] mt-1 opacity-50 ${m.role === 'user' ? 'text-right' : ''}`}>
                    {m.ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div className="flex gap-2 justify-start">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center shrink-0">
                  <Stethoscope style={{ width: 13, height: 13, color: 'white' }} />
                </div>
                <div className="bg-[#0c2e28] border border-teal-800/40 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Questions */}
          {showQuick && (
            <div className="px-4 pb-2 shrink-0">
              <p className="text-[9px] text-teal-500/60 uppercase tracking-widest font-bold mb-2">Suggested Questions</p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK.map(q => (
                  <button key={q} onClick={() => send(q)}
                    className="text-[10px] px-2.5 py-1.5 bg-teal-900/40 hover:bg-teal-800/60 border border-teal-700/40 text-teal-300 rounded-full transition-all font-medium">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-3 border-t border-teal-800/40 shrink-0 flex gap-2 items-center bg-[#071e1a]">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about LifeLink platform..."
              className="flex-1 bg-[#0a2822] border border-teal-800/50 rounded-xl px-3 py-2 text-white text-xs placeholder:text-teal-700 outline-none focus:border-teal-500 transition-colors"
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || typing}
              className="w-9 h-9 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all shrink-0"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
