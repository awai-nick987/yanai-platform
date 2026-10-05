import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  List, 
  Grid, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  MapPin, 
  Clock, 
  Users, 
  Tag, 
  Sparkles,
  X
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  category: 'committee' | 'poc' | 'workshop' | 'forum';
  description: string;
  leadDept: string;
}

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'ev-1',
    title: '第3回 柳井市中心市街地活性化協議会（策定委員会）',
    date: '2026-09-18',
    time: '14:00〜16:30',
    location: '柳井市役所 大会議室（本庁舎3F）',
    category: 'committee',
    description: '市民投稿データ2軸分析結果の共有、実証実験計画および基本計画骨子案の審議。',
    leadDept: '都市計画課'
  },
  {
    id: 'ev-2',
    title: '高校生探究PJ・商店街 合同ワークショップ（第2回）',
    date: '2026-09-26',
    time: '10:00〜12:30',
    location: '柳井市文化福祉会館 第2研修室',
    category: 'workshop',
    description: '空き店舗活用カフェのメニュー開発・内装レイアウト検討および役割分担決め。',
    leadDept: '地域づくり推進課'
  },
  {
    id: 'ev-3',
    title: '白壁夜市＆高校生探究カフェ 合同社会実験（PoC 第1弾）',
    date: '2026-10-04',
    time: '16:00〜20:30',
    location: '白壁の町並み通り・古市金屋地区',
    category: 'poc',
    description: '夜間ライトアップと高校生カフェのプレオープン。歩行者交通量・滞在時間の計測アンケート実施。',
    leadDept: '商工観光課・商工会議所青年部'
  },
  {
    id: 'ev-4',
    title: '駅前広場シェアモビリティ（グリスロ）試乗体験会',
    date: '2026-10-18',
    time: '11:00〜15:00',
    location: 'JR柳井駅前広場・ロータリー',
    category: 'poc',
    description: '電動低速カート（グリスロ）の運行ルート検証および高齢者・観光客の乗り心地ヒアリング。',
    leadDept: '都市計画課'
  },
  {
    id: 'ev-5',
    title: 'まちなか未来共創フォーラム（中間市民報告会）',
    date: '2026-11-15',
    time: '13:30〜16:00',
    location: '柳井市民文化会館 ホール',
    category: 'forum',
    description: '市民・高校生による社会実験の成果報告と基本計画策定に向けたパネルディスカッション。',
    leadDept: '地域づくり推進課'
  }
];

export const WorkspaceCalendar: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'month' | 'week'>('month');
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  
  // Current view date anchor (Default Sept 2026)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // 1-12
  const [selectedDateEvents, setSelectedDateEvents] = useState<{ date: string; events: CalendarEvent[] } | null>(null);

  // Add event modal
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('2026-09-20');
  const [newEventTime, setNewEventTime] = useState('14:00〜16:00');
  const [newEventLocation, setNewEventLocation] = useState('柳井市役所 会議室');
  const [newEventCategory, setNewEventCategory] = useState<CalendarEvent['category']>('committee');
  const [newEventDesc, setNewEventDesc] = useState('');

  // Category badges helper
  const getCategoryBadge = (cat: CalendarEvent['category']) => {
    switch (cat) {
      case 'committee':
        return { label: '協議会・審議', bg: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
      case 'poc':
        return { label: '実証実験 (PoC)', bg: 'bg-amber-100 text-amber-900 border-amber-200' };
      case 'workshop':
        return { label: 'ワークショップ', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'forum':
        return { label: '市民フォーラム', bg: 'bg-rose-100 text-rose-800 border-rose-200' };
    }
  };

  // Calendar month days calculation
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth - 1, 1).getDay(); // 0 is Sun
    const totalDaysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    
    const days: { day: number; dateStr: string; isCurrentMonth: boolean; events: CalendarEvent[] }[] = [];

    // Preceding empty/prev month days
    const prevMonthTotalDays = new Date(currentYear, currentMonth - 1, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = prevMonthTotalDays - i;
      const m = currentMonth - 1 === 0 ? 12 : currentMonth - 1;
      const y = currentMonth - 1 === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ day: d, dateStr, isCurrentMonth: false, events: [] });
    }

    // Current month days
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.date === dateStr);
      days.push({ day: d, dateStr, isCurrentMonth: true, events: dayEvents });
    }

    // Trailing days to fill 35 or 42 grid
    const remaining = 35 - days.length;
    if (remaining > 0) {
      for (let d = 1; d <= remaining; d++) {
        const m = currentMonth + 1 > 12 ? 1 : currentMonth + 1;
        const y = currentMonth + 1 > 12 ? currentYear + 1 : currentYear;
        const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        days.push({ day: d, dateStr, isCurrentMonth: false, events: [] });
      }
    }

    return days;
  }, [currentYear, currentMonth, events]);

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    setEvents([
      ...events,
      {
        id: `ev-${Date.now()}`,
        title: newEventTitle.trim(),
        date: newEventDate,
        time: newEventTime,
        location: newEventLocation,
        category: newEventCategory,
        description: newEventDesc,
        leadDept: '推進WG'
      }
    ]);

    setNewEventTitle('');
    setIsAddEventOpen(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      
      {/* Header & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-rose-500" />
            <h2 className="text-xl font-bold text-slate-900">
              推進スケジュール・協議会日程カレンダー
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            協議会、実証実験、ワークショップの予定を「月表示」「週表示」「リスト表示」で確認・管理できます。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          {/* View Mode Toggle: List / Month / Week */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'month' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              月表示
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'week' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              週表示
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              リスト表示
            </button>
          </div>

          <button
            onClick={() => setIsAddEventOpen(true)}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>予定追加</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. MONTH VIEW (カレンダー月表示)                          */}
      {/* ========================================================= */}
      {viewMode === 'month' && (
        <div className="space-y-4">
          
          {/* Month Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-slate-900">
                {currentYear}年 {currentMonth}月
              </span>
              <span className="text-xs bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full font-bold border border-rose-200">
                令和8年度
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
                title="前月"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setCurrentYear(2026);
                  setCurrentMonth(9);
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer"
              >
                今月
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
                title="次月"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Month Calendar Grid */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            {/* Weekdays header */}
            <div className="grid grid-cols-7 bg-slate-100 text-center py-2 text-xs font-bold text-slate-600 border-b border-slate-200">
              <div className="text-rose-600">日</div>
              <div>月</div>
              <div>火</div>
              <div>水</div>
              <div>木</div>
              <div>金</div>
              <div className="text-blue-600">土</div>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 bg-white">
              {calendarDays.map((d, index) => {
                const hasEvents = d.events.length > 0;

                return (
                  <div
                    key={index}
                    onClick={() => {
                      if (hasEvents) {
                        setSelectedDateEvents({ date: d.dateStr, events: d.events });
                      }
                    }}
                    className={`min-h-[90px] p-2 transition-all flex flex-col justify-between ${
                      d.isCurrentMonth ? 'bg-white' : 'bg-slate-50/50 text-slate-300'
                    } ${hasEvents ? 'hover:bg-rose-50/30 cursor-pointer' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${
                        d.isCurrentMonth ? 'text-slate-700' : 'text-slate-300'
                      }`}>
                        {d.day}
                      </span>
                      {hasEvents && (
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      )}
                    </div>

                    {/* Events pills inside day cell */}
                    <div className="space-y-1 mt-1">
                      {d.events.slice(0, 2).map(ev => {
                        const badge = getCategoryBadge(ev.category);
                        return (
                          <div
                            key={ev.id}
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold truncate ${badge.bg}`}
                            title={ev.title}
                          >
                            {ev.title}
                          </div>
                        );
                      })}
                      {d.events.length > 2 && (
                        <div className="text-[8px] text-slate-400 font-bold">
                          +{d.events.length - 2} 件
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. WEEK VIEW (週間スケジュール表示)                        */}
      {/* ========================================================= */}
      {viewMode === 'week' && (
        <div className="space-y-4">
          <div className="text-xs font-bold text-slate-600">
            2026年9月 第3週（9月14日〜9月20日）
          </div>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-2.5">
            {['9/14 (月)', '9/15 (火)', '9/16 (水)', '9/17 (木)', '9/18 (金)', '9/19 (土)', '9/20 (日)'].map((dayLabel, idx) => {
              const dayDate = `2026-09-${14 + idx}`;
              const dayEvs = events.filter(e => e.date === dayDate);

              return (
                <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 min-h-[160px]">
                  <div className={`text-xs font-bold border-b border-slate-200 pb-1 ${
                    idx === 5 ? 'text-blue-600' : idx === 6 ? 'text-rose-600' : 'text-slate-700'
                  }`}>
                    {dayLabel}
                  </div>

                  {dayEvs.length > 0 ? (
                    dayEvs.map(ev => (
                      <div
                        key={ev.id}
                        onClick={() => setSelectedDateEvents({ date: ev.date, events: [ev] })}
                        className="p-2 bg-white rounded-xl border border-indigo-200 hover:border-indigo-400 shadow-2xs space-y-1 cursor-pointer"
                      >
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800">
                          {ev.time}
                        </span>
                        <div className="text-[11px] font-bold text-slate-800 leading-tight">
                          {ev.title}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-[10px] text-slate-300 py-4 text-center">予定なし</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. LIST VIEW (一覧リスト表示)                             */}
      {/* ========================================================= */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {[...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(ev => {
            const badge = getCategoryBadge(ev.category);
            const [y, m, d] = ev.date.split('-');

            return (
              <div
                key={ev.id}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-rose-300 bg-slate-50/60 hover:bg-white transition-all flex flex-col sm:flex-row items-start gap-4 shadow-2xs"
              >
                {/* Date Block */}
                <div className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-center font-mono shrink-0">
                  <div className="text-[10px] uppercase text-rose-300 font-bold">{m}月</div>
                  <div className="text-xl font-black">{d}</div>
                </div>

                {/* Event Details */}
                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                      {badge.label}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-600">
                      {ev.time}
                    </span>
                    <span className="text-xs text-slate-400">| 担当: {ev.leadDept}</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {ev.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {ev.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>場所: {ev.location}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Date Modal */}
      {selectedDateEvents && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-rose-500" />
                <h3 className="text-base font-bold text-slate-900">
                  {selectedDateEvents.date} の予定詳細
                </h3>
              </div>
              <button onClick={() => setSelectedDateEvents(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {selectedDateEvents.events.map(ev => {
                const badge = getCategoryBadge(ev.category);
                return (
                  <div key={ev.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badge.bg}`}>
                        {badge.label}
                      </span>
                      <span className="text-xs font-mono text-slate-600 font-bold">{ev.time}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{ev.title}</h4>
                    <p className="text-xs text-slate-600">{ev.description}</p>
                    <div className="text-xs text-slate-500 flex items-center gap-1 pt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{ev.location}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {isAddEventOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">新規予定の登録</h3>
              <button onClick={() => setIsAddEventOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">イベント名</label>
                <input
                  type="text"
                  required
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="例: 第4回 まちづくり策定WG"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">日付</label>
                  <input
                    type="date"
                    required
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">時間帯</label>
                  <input
                    type="text"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">開催場所</label>
                <input
                  type="text"
                  value={newEventLocation}
                  onChange={(e) => setNewEventLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">種別</label>
                <select
                  value={newEventCategory}
                  onChange={(e: any) => setNewEventCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="committee">協議会・審議</option>
                  <option value="poc">実証実験 (PoC)</option>
                  <option value="workshop">ワークショップ</option>
                  <option value="forum">市民フォーラム</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddEventOpen(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  追加する
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
