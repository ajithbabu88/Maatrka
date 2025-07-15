
'use client'
import { useState, useEffect, useRef } from 'react';

interface ChatMsg {
  role: 'user' | 'assistant';
  content: string;
  zone?: string;
}

export default function ChatPage() {
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  async function send() {
    if (!input.trim()) return;
    const userMsg: ChatMsg = { role: 'user', content: input };
    setMsgs(m => [...m, userMsg]);
    setInput('');
    const res = await fetch('/api/chat', { method: 'POST', body: JSON.stringify({ userMsg: input }) });
    const data = await res.json();
    const botMsg: ChatMsg = { role: 'assistant', content: data.answer, zone: data.zone };
    setMsgs(m => [...m, botMsg]);
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {msgs.map((m,i)=>(
          <div key={i} className={m.role==='user'?'text-right':''}>
            <div className={`inline-block px-4 py-2 rounded-lg ${m.role==='user'?'bg-indigo-600 text-white':'bg-gray-200 text-gray-900'}`}>
              {m.content}
            </div>
            {m.zone && <div className="text-xs text-gray-500">{m.zone}</div>}
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>
      <div className="p-4 border-t flex gap-2">
        <input className="flex-1 border rounded px-3 py-2" placeholder="Type your message..."
          value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} />
        <button className="bg-indigo-600 text-white px-4 py-2 rounded" onClick={send}>Send</button>
      </div>
    </div>
  );
}
