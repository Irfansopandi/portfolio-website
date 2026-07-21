import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Trash2, Check, Mail, Clock, Copy } from 'lucide-react';
import { messageService } from '../../services';
import type { Message } from '../../types';
import toast from 'react-hot-toast';

type FilterType = 'all' | 'unread' | 'read';

const AdminMessagesPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [selected, setSelected] = useState<Message | null>(null);

  const fetchData = async () => {
    try {
      const res = await messageService.getAll(filter === 'all' ? undefined : filter);
      setMessages(res.data.messages);
    } catch { } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); }, [filter]);


  const handleMarkRead = async (id: string, status: 'read' | 'unread') => {
    try {
      await messageService.updateStatus(id, status);
      fetchData();
      if (selected?.id === id) setSelected({ ...selected, status });
    } catch { toast.error('Failed to update status'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    try {
      await messageService.delete(id);
      toast.success('Message deleted!');
      if (selected?.id === id) setSelected(null);
      fetchData();
    } catch { toast.error('Failed to delete'); }
  };

  const handleCopyReply = (msg: Message) => {
    const text = `Hi ${msg.name},\n\n\n-------------------\nOriginal Message from ${msg.name} (${new Date(msg.createdAt).toLocaleString()}):\n> ${msg.message.replace(/\n/g, '\n> ')}`;
    navigator.clipboard.writeText(text);
    toast.success('Reply template copied to clipboard!');
  };

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Messages <span className="gradient-text">Inbox</span></h1>
          <p className="text-gray-400">
            {messages.length} total
            {unreadCount > 0 && <span className="text-indigo-400 ml-2">· {unreadCount} unread</span>}
          </p>
        </div>
        <div className="flex gap-2">
          {(['all', 'unread', 'read'] as FilterType[]).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                filter === f ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
              style={{ background: filter === f ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'rgba(255,255,255,0.05)' }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Messages list */}
        <div className="lg:col-span-1 space-y-2">
          {isLoading ? (
            <div className="flex justify-center py-10"><div className="spinner" /></div>
          ) : messages.length === 0 ? (
            <div className="glass-card p-10 text-center">
              <MessageSquare size={40} className="text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No messages</p>
            </div>
          ) : (
            messages.map((msg) => (
              <motion.div key={msg.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                onClick={() => { setSelected(msg); if (msg.status === 'unread') handleMarkRead(msg.id, 'read'); }}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                  selected?.id === msg.id ? 'border-indigo-500/50' : 'border-white/5 hover:border-white/15'
                }`}
                style={{
                  background: selected?.id === msg.id ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${selected?.id === msg.id ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.05)'}`,
                } as any}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm truncate">{msg.name}</span>
                      {msg.status === 'unread' && <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />}
                    </div>
                    <p className="text-gray-500 text-xs truncate">{msg.email}</p>
                    <p className="text-gray-400 text-xs truncate mt-1">{msg.message}</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Message detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card h-full p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">{selected.name}</h2>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Mail size={14} className="text-indigo-400" />
                    <span>{selected.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-xs mt-1">
                    <Clock size={12} />
                    <span>{new Date(selected.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleMarkRead(selected.id, selected.status === 'read' ? 'unread' : 'read')}
                    className="p-2 rounded-xl text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
                    title={selected.status === 'read' ? 'Mark as unread' : 'Mark as read'}
                  >
                    <Check size={18} />
                  </button>
                  <button onClick={() => handleDelete(selected.id)}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${encodeURIComponent(selected.email)}&su=${encodeURIComponent(`Re: Portfolio Contact - ${selected.name}`)}&body=${encodeURIComponent(`Hi ${selected.name},\n\n\n-------------------\nOriginal Message from ${selected.name} (${new Date(selected.createdAt).toLocaleString()}):\n> ${selected.message.replace(/\n/g, '\n> ')}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Mail size={16} /> Reply via Gmail
                </a>
                <button
                  onClick={() => handleCopyReply(selected)}
                  className="px-4 py-2 rounded-xl text-sm font-medium border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-all inline-flex items-center gap-2"
                >
                  <Copy size={16} /> Copy Reply Body
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="glass-card h-full flex items-center justify-center py-20">
              <div className="text-center">
                <MessageSquare size={48} className="text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">Select a message to read</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessagesPage;
