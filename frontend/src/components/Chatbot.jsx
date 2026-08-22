import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Calendar, 
  Stethoscope, 
  FileText, 
  Clock, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'bot',
    text: "Hello! 👋 I'm your ICOP Healthcare Assistant. How can I help you today? You can ask me about specialist doctors, booking consultations, digital prescriptions, or clinic hours.",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

const SUGGESTIONS = [
  "Find a Cardiologist",
  "How to book an appointment?",
  "View my prescriptions",
  "Clinic hours & emergency",
  "Doctors available today"
];

const Chatbot = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const generateBotReply = (userQuery) => {
    const q = userQuery.toLowerCase();

    if (q.includes('cardio') || q.includes('heart')) {
      return {
        text: "🩺 **Cardiology Specialist**: Dr. Sarah Jenkins (MD, FACC - Harvard Medical) is available Monday through Thursday for consultations ($150.00). Would you like to book an appointment with her?",
        action: { label: "Book Dr. Sarah", link: "/patient/book-appointment" }
      };
    } else if (q.includes('neuro') || q.includes('brain') || q.includes('headache') || q.includes('migraine')) {
      return {
        text: "🧠 **Neurology Specialist**: Dr. Alex Vance (MD, PhD - Johns Hopkins) specializes in neurological evaluations and chronic migraines on Tue, Thu, and Fri.",
        action: { label: "Book Dr. Alex", link: "/patient/book-appointment" }
      };
    } else if (q.includes('pediatric') || q.includes('child') || q.includes('baby')) {
      return {
        text: "👶 **Pediatrics Specialist**: Dr. Priya Patel (MBBS, MD - Stanford University) is available Mon, Wed, Fri, and Sat for child health consultations.",
        action: { label: "Book Dr. Priya", link: "/patient/book-appointment" }
      };
    } else if (q.includes('ortho') || q.includes('bone') || q.includes('joint') || q.includes('fracture')) {
      return {
        text: "🦴 **Orthopedics Specialist**: Dr. Marcus Chen (MS Ortho, FRCS - Mayo Clinic) offers expert orthopedic consultations Mon, Tue, and Thu ($200.00).",
        action: { label: "Book Dr. Marcus", link: "/patient/book-appointment" }
      };
    } else if (q.includes('derma') || q.includes('skin') || q.includes('rash') || q.includes('acne')) {
      return {
        text: "✨ **Dermatology Specialist**: Dr. Elena Rostova (MD, FAAD - Columbia University) is available Wed through Sat for dermatological care.",
        action: { label: "Book Dr. Elena", link: "/patient/book-appointment" }
      };
    } else if (q.includes('book') || q.includes('appointment') || q.includes('schedule')) {
      return {
        text: "📅 **Booking an Appointment**: You can easily book an appointment in 4 simple steps: 1) Select your Doctor, 2) Choose Date & Open Slot, 3) Enter Reason, and 4) Confirm!",
        action: { label: "Go to Booking Portal", link: "/patient/book-appointment" }
      };
    } else if (q.includes('prescription') || q.includes('medicine') || q.includes('drug') || q.includes('rx')) {
      return {
        text: "💊 **Digital Prescriptions**: Once your doctor completes your consultation, your digital prescription (medicines, dosage, instructions, and diagnosis) is immediately available in your appointment summary.",
        action: { label: "View My Appointments", link: "/patient/appointments" }
      };
    } else if (q.includes('hour') || q.includes('time') || q.includes('timing') || q.includes('open')) {
      return {
        text: "⏰ **Clinic Operational Hours**: Monday - Saturday: 8:00 AM – 8:00 PM. Emergency clinical triage is available 24/7. Call our helpline at +1 (555) 900-ICOP."
      };
    } else if (q.includes('cancel') || q.includes('reschedule')) {
      return {
        text: "🔄 **Cancellation**: You can cancel an upcoming appointment anytime before consultation directly from 'My Appointments' tab."
      };
    } else if (q.includes('emergency') || q.includes('urgent') || q.includes('chest pain')) {
      return {
        text: "🚨 **Medical Emergency Alert**: If you are experiencing severe symptoms such as sudden acute chest pain, shortness of breath, or loss of consciousness, please call 911 or visit the nearest emergency room immediately."
      };
    } else {
      return {
        text: "Thank you for your message! Our clinical platform allows you to book verified doctors across Cardiology, Neurology, Pediatrics, Orthopedics, and Dermatology, with digital prescriptions and real-time status updates. How else can I assist you?",
        action: { label: "Explore Services", link: "/#features" }
      };
    }
  };

  const handleSend = (textToSend = input) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateBotReply(textToSend);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponse.text,
        action: botResponse.action,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group flex items-center gap-3 px-4 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-float transition-all duration-300 hover:scale-105 active:scale-95"
          title="Open Healthcare Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-amber-500 rounded-full animate-pulse" />
          </div>
          <span className="text-sm font-bold tracking-tight pr-1">ICOP Assistant</span>
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[550px] bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 p-4 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                  <span>ICOP Care Assistant</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                </h3>
                <span className="text-[11px] text-amber-100 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Online • Healthcare AI
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#FBF9F5]/70">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-amber-500 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {msg.action && (
                    <button
                      onClick={() => {
                        navigate(msg.action.link);
                        setIsOpen(false);
                      }}
                      className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold shadow-sm transition-all"
                    >
                      <span>{msg.action.label}</span>
                    </button>
                  )}

                  <span
                    className={`block text-[9px] mt-1 ${
                      msg.sender === 'user' ? 'text-amber-100 text-right' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                <Bot className="w-4 h-4 text-amber-500 animate-bounce" />
                <span>Assistant is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Suggestions */}
          <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto">
            {SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s)}
                className="px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-medium whitespace-nowrap border border-amber-200/60 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about doctors, appointments, symptoms..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-9 h-9 rounded-full bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white flex items-center justify-center shadow-sm transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
