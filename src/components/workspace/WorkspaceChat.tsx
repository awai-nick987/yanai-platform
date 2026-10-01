import React, { useState, useEffect, useRef } from 'react';
import { UserRole } from '../../types';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Radio, 
  Clock, 
  User, 
  Paperclip, 
  CheckCheck,
  Flame,
  Shield,
  GraduationCap,
  Building
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: string;
  role: string;
  roleType: 'admin' | 'student' | 'business' | 'citizen';
  text: string;
  time: string;
  timestamp: number;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  { 
    id: '1', 
    sender: '柳井市 都市計画課', 
    role: '行政事務局', 
    roleType: 'admin', 
    text: '第3回活性化協議会の開催日程を9月18日に設定しました。議題資料のドラフトを共有ドライブに配置しています。', 
    time: '10:15', 
    timestamp: Date.now() - 3600000 * 4 
  },
  { 
    id: '2', 
    sender: '柳井高校 探究PJ代表（有志）', 
    role: '高校生チーム', 
    roleType: 'student', 
    text: '白壁エリアでの高校生カフェ実験について、地元商店街の皆様への事前ヒアリング日程が決まりました！メニュー案もスプレッドシートに追記しています。', 
    time: '11:30', 
    timestamp: Date.now() - 3600000 * 2 
  },
  { 
    id: '3', 
    sender: '柳井商工会議所 青年部', 
    role: '商工事業者', 
    roleType: 'business', 
    text: '夜間ライトアップの照明器具の手配候補リストを更新しました。電力確保の確認を進めます。', 
    time: '14:20', 
    timestamp: Date.now() - 3600000 * 1 
  }
];

interface WorkspaceChatProps {
  currentRole?: UserRole;
}

export const WorkspaceChat: React.FC<WorkspaceChatProps> = ({ currentRole = 'admin' }) => {
  // Messages state with local storage fallback & BroadcastChannel for real-time multi-tab sync
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('yanai_workspace_chat_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [channel, setChannel] = useState<BroadcastChannel | null>(null);

  // Initialize BroadcastChannel for real-time synchronization across multiple clients/tabs
  useEffect(() => {
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('yanai_workspace_chat_sync');
      bc.onmessage = (event) => {
        if (event.data && Array.isArray(event.data)) {
          setMessages(event.data);
        } else if (event.data && event.data.type === 'NEW_MESSAGE') {
          setMessages(prev => [...prev, event.data.message]);
        }
      };
      setChannel(bc);
    } catch (e) {
      console.warn('BroadcastChannel not supported:', e);
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'yanai_workspace_chat_messages' && e.newValue) {
        try {
          setMessages(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      if (bc) bc.close();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Save to localStorage when messages change
  useEffect(() => {
    localStorage.setItem('yanai_workspace_chat_messages', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    let senderName = '準備会メンバー';
    let roleLabel = 'WGメンバー';
    let roleType: ChatMessage['roleType'] = 'citizen';

    if (currentRole === 'admin') {
      senderName = '柳井市 都市計画課';
      roleLabel = '行政事務局';
      roleType = 'admin';
    } else if (currentRole === 'recruiter') {
      senderName = 'プロジェクト運営事務局';
      roleLabel = '運営コーディネーター';
      roleType = 'admin';
    } else if (currentRole === 'workspace') {
      senderName = '柳井高校 探究PJメンバー';
      roleLabel = '学生・若者チーム';
      roleType = 'student';
    }

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: senderName,
      role: roleLabel,
      roleType,
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now()
    };

    const updated = [...messages, newMessage];
    setMessages(updated);

    // Broadcast to other open tabs/windows
    if (channel) {
      channel.postMessage({ type: 'NEW_MESSAGE', message: newMessage });
    }

    setInputText('');
  };

  // Find latest message ID
  const latestMessageId = messages.length > 0 ? messages[messages.length - 1].id : null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
      
      {/* Header with Title requested by user */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-sky-500" />
            <h2 className="text-xl font-bold text-slate-900">
              プロジェクトメンバー協働チャット
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            行政・民間事業者・高校生・市民WGメンバー間の同時リアルタイム情報共有・ディスカッション
          </p>
        </div>

        {/* Realtime Status Indicator */}
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full self-start sm:self-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
            <Radio className="w-3 h-3 text-emerald-600" />
            <span>リアルタイム同期中</span>
          </span>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="bg-slate-50/70 rounded-2xl border border-slate-200 p-4 min-h-[380px] max-h-[460px] overflow-y-auto space-y-3.5">
        {messages.map((msg, index) => {
          const isLatest = msg.id === latestMessageId;

          return (
            <div
              key={msg.id}
              className={`p-4 rounded-2xl border transition-all space-y-2 relative shadow-2xs ${
                isLatest
                  ? 'bg-white border-sky-400 ring-2 ring-sky-100 shadow-sm'
                  : 'bg-white border-slate-200'
              }`}
            >
              {/* Header inside bubble */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    msg.roleType === 'admin' ? 'bg-indigo-100 text-indigo-800' :
                    msg.roleType === 'student' ? 'bg-emerald-100 text-emerald-800' :
                    msg.roleType === 'business' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {msg.roleType === 'admin' ? <Shield className="w-3.5 h-3.5" /> :
                     msg.roleType === 'student' ? <GraduationCap className="w-3.5 h-3.5" /> :
                     msg.roleType === 'business' ? <Building className="w-3.5 h-3.5" /> :
                     <User className="w-3.5 h-3.5" />}
                  </div>
                  
                  <span className="text-xs font-bold text-slate-800">
                    {msg.sender}
                  </span>

                  <span className={`text-[10px] px-2 py-0.2 rounded-md font-semibold ${
                    msg.roleType === 'admin' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                    msg.roleType === 'student' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    msg.roleType === 'business' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {msg.role}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Latest Badge Requested by User */}
                  {isLatest && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center gap-0.5 animate-pulse shadow-xs">
                      <Flame className="w-3 h-3" />
                      <span>最新 / New</span>
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 font-mono">
                    {msg.time}
                  </span>
                </div>
              </div>

              {/* Text */}
              <p className="text-xs text-slate-700 leading-relaxed pl-8 whitespace-pre-wrap">
                {msg.text}
              </p>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Message Form */}
      <form onSubmit={handleSendMessage} className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="メッセージを入力（プロジェクトメンバー全員にリアルタイム共有されます）..."
            className="flex-1 px-4 py-3 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50 focus:bg-white"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-5 py-3 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>送信</span>
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
          <span className="font-semibold text-slate-400">クイック入力:</span>
          {[
            '共有ドライブに最新資料をアップロードしました。',
            '実証実験のタイムテーブルについて確認です。',
            '高校生探究PJの事前ヒアリングが完了しました！'
          ].map((quickText, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setInputText(quickText)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-medium transition-colors cursor-pointer"
            >
              {quickText}
            </button>
          ))}
        </div>
      </form>

    </div>
  );
};
