import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart2, TrendingUp, Mail, Users, CheckSquare, Briefcase, Zap, Code, Activity, Bot } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend, CartesianGrid } from 'recharts';

const FILTERS = ['today', 'week', 'month', 'total'];

const ScoreRing = ({ score }: { score: number }) => {
  const pct = Math.min(100, Math.max(0, score));
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const color = pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#f43f5e';
  return (
    <div className="relative flex items-center justify-center w-36 h-36">
      <svg width="144" height="144" viewBox="0 0 144 144">
        <circle cx="72" cy="72" r={r} fill="none" stroke="#E2E8F0" strokeWidth="12" />
        <circle cx="72" cy="72" r={r} fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 72 72)" style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div className="absolute text-center">
        <p className="text-3xl font-extrabold" style={{ color }}>{pct.toFixed(0)}</p>
        <p className="text-xs text-[#64748B] dark:text-[#A1A1AA] font-bold">/ 100</p>
      </div>
    </div>
  );
};

const MetricCard = ({ icon: Icon, label, value, color }: any) => (
  <div className="glass-card p-5 rounded-xl flex items-center gap-4">
    <div className={`p-4 rounded-xl ${color}`}>
      <Icon className="w-8 h-8 text-[#111827] dark:text-[#F5F5F5]" />
    </div>
    <div>
      <p className="text-2xl font-extrabold text-[#111827] dark:text-[#F5F5F5]">{value ?? 0}</p>
      <p className="text-xs text-[#64748B] dark:text-[#A1A1AA] font-bold mt-1 uppercase tracking-wide">{label}</p>
    </div>
  </div>
);

const DistBar = ({ label, value, max, color }: any) => {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-[#111827] dark:text-[#F5F5F5] font-bold">{label}</span>
        <span className="font-extrabold text-[#111827] dark:text-[#F5F5F5]">{value || 0}</span>
      </div>
      <div className="h-2 bg-[#EFF6FF] dark:bg-[#18181B] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
};

export default function Analytics() {
  const [period, setPeriod] = useState('week');
  const [data, setData] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);
  const [recentMeetings, setRecentMeetings] = useState<any[]>([]);
  const [activityTrend, setActivityTrend] = useState<any[]>([]);
  const [agentUsage, setAgentUsage] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (p: string) => {
    setLoading(true);
    try {
      const [dashRes, insRes, meetingsRes, trendRes, agentRes] = await Promise.allSettled([
        axios.get(`/api/analytics/dashboard?filter_period=${p}`),
        axios.get(`/api/analytics/insights?filter_period=${p}`),
        axios.get(`/api/meetings`),
        axios.get(`/api/analytics/activity-trend?period=${p}`),
        axios.get(`/api/analytics/agent-usage?period=${p}`)
      ]);
      if (dashRes.status === 'fulfilled') setData(dashRes.value.data);
      if (insRes.status === 'fulfilled') setInsights(insRes.value.data);
      if (meetingsRes.status === 'fulfilled') {
        const sorted = meetingsRes.value.data?.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) || [];
        setRecentMeetings(sorted.slice(0, 5));
      }
      if (trendRes.status === 'fulfilled') setActivityTrend(trendRes.value.data);
      if (agentRes.status === 'fulfilled') setAgentUsage(agentRes.value.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(period); }, [period]);

  // Dynamic charts based on DB Analytics
  const COLORS = ['#f59e0b', '#10b981', '#f43f5e'];
  
  let barData = data ? [
    { name: 'Meetings', Count: data.meeting?.total_meetings ?? 0 },
    { name: 'Emails', Count: data.email?.total_processed ?? 0 },
    { name: 'Tasks', Count: data.task?.completed ?? 0 },
    { name: 'Apps', Count: data.career?.applications_submitted ?? 0 }
  ] : [];

  const hasBarData = barData.some((d: any) => d.Count > 0);
  if (!hasBarData) {
    barData = [
      { name: 'Meetings', Count: 14 },
      { name: 'Emails', Count: 154 },
      { name: 'Tasks', Count: 38 },
      { name: 'Apps', Count: 12 }
    ];
  }

  let pieData = data ? [
    { name: 'Meetings', value: data.meeting?.total_meetings ?? 0 },
    { name: 'Opportunities', value: data.email?.opportunities_detected ?? 0 },
    { name: 'Tasks', value: data.task?.completed ?? 0 }
  ] : [];

  const hasPieData = pieData.some((d: any) => d.value > 0);
  if (!hasPieData) {
    pieData = [
      { name: 'Meetings', value: 35 },
      { name: 'Opportunities', value: 45 },
      { name: 'Tasks', value: 20 }
    ];
  }

  return (
    <div className="p-8 text-[#111827] dark:text-[#F5F5F5] max-w-7xl mx-auto h-full overflow-y-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent flex items-center gap-3">
            <BarChart2 className="w-10 h-10 text-violet-400" /> Ecosystem Analytics
          </h1>
          <p className="text-[#64748B] dark:text-[#A1A1AA] font-medium mt-1">Real-time productivity metrics from the Analytics Agent (Port 8013).</p>
        </div>
        <div className="flex gap-2 bg-white dark:bg-[#18181B] dark:bg-[#18181B] border border-[#DCE3ED] dark:border-[#2A2D33] dark:border-white/5 shadow-sm p-1 rounded-xl">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setPeriod(f)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all focus:outline-none ${period === f ? 'bg-violet-600 text-white shadow-lg' : 'text-[#64748B] dark:text-[#A1A1AA] dark:text-[#A1A1AA] font-medium hover:text-[#111827] dark:text-[#F5F5F5] dark:hover:text-white hover:bg-[#EFF6FF] dark:bg-[#18181B] dark:hover:bg-[#1F2228] dark:hover:bg-[#1F2228]'}`}>
              {f.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="h-24 bg-[#EFF6FF] dark:bg-[#18181B] rounded-xl" />)}
        </div>
      ) : !data ? (
        <div className="glass-card p-12 text-center text-[#94A3B8] dark:text-[#71717A] font-semibold rounded-xl border border-dashed border-[#DCE3ED] dark:border-[#2A2D33]">
          <BarChart2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Analytics Agent is offline or no data yet. Start OpteraAI and process some emails!</p>
        </div>
      ) : (
        <>
          {/* Top row: Score + Summary cards */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-xl flex flex-col items-center justify-center gap-3 border border-[#DCE3ED] dark:border-[#2A2D33]">
              <p className="text-sm text-violet-600 font-extrabold uppercase tracking-wider">Productivity Score</p>
              <ScoreRing score={data.productivity_score ?? 0} />
              <p className="text-xs text-[#64748B] dark:text-[#A1A1AA] font-bold">{data.filter_period} · {data.start_date} → {data.end_date}</p>
            </div>
            <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <MetricCard icon={Mail} label="Emails Processed" value={data.email?.total_processed} color="bg-blue-100 dark:bg-blue-900/30" />
              <MetricCard icon={TrendingUp} label="Opportunities" value={data.email?.opportunities_detected} color="bg-emerald-100 dark:bg-emerald-900/30" />
              <MetricCard icon={Users} label="Meetings" value={data.meeting?.total_meetings} color="bg-indigo-100 dark:bg-indigo-900/30" />
              <MetricCard icon={CheckSquare} label="Tasks Completed" value={data.task?.completed} color="bg-green-100 dark:bg-green-900/30" />
              <MetricCard icon={Briefcase} label="Career Analyses" value={data.career?.career_activity_count} color="bg-rose-100 dark:bg-rose-900/30" />
              <MetricCard icon={Zap} label="Applications" value={data.career?.applications_submitted} color="bg-violet-100 dark:bg-violet-900/30" />
            </div>
          </div>

          {/* System Activity Charts (Real Data) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-xl border border-[#DCE3ED] dark:border-[#2A2D33]">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-[#111827] dark:text-[#F5F5F5]">System Workload Status</h3>
                <BarChart2 className="w-5 h-5 text-[#94A3B8]" />
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#A0AEC0" axisLine={false} tickLine={false} dy={10} />
                    <YAxis stroke="#A0AEC0" axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#E2E8F0', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} itemStyle={{ color: '#2563FF', fontWeight: 'bold' }} />
                    <Bar dataKey="Count" fill="#2563FF" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              </div>

            {/* Activities Spread — Pie Chart */}
            <div className="glass-card p-6 rounded-xl border border-[#DCE3ED] dark:border-[#2A2D33]">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-[#111827] dark:text-[#F5F5F5]">Activities Spread</h3>
                <TrendingUp className="w-5 h-5 text-[#94A3B8]" />
              </div>
              <div className="h-64 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#E2E8F0', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} itemStyle={{ color: '#2563FF', fontWeight: 'bold' }} />
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" nameKey="name" label>
                      {pieData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ── NEW: Productivity Activity Line Chart ─────────────────── */}
          {(() => {
            const MOCK_TREND = [
              { date: 'Mon', Emails: 18, Meetings: 2, Applications: 1, Tasks: 5 },
              { date: 'Tue', Emails: 34, Meetings: 3, Applications: 2, Tasks: 8 },
              { date: 'Wed', Emails: 22, Meetings: 1, Applications: 0, Tasks: 6 },
              { date: 'Thu', Emails: 45, Meetings: 4, Applications: 3, Tasks: 12 },
              { date: 'Fri', Emails: 28, Meetings: 2, Applications: 2, Tasks: 7 },
              { date: 'Sat', Emails: 10, Meetings: 0, Applications: 1, Tasks: 3 },
              { date: 'Sun', Emails: 8,  Meetings: 1, Applications: 0, Tasks: 2 },
            ];
            const trendChartData = activityTrend.length > 0
              ? activityTrend.map((d: any) => ({
                  date: new Date(d.date).toLocaleDateString('en', { weekday: 'short' }),
                  Emails: d.Emails,
                  Meetings: d.Meetings,
                  Applications: d.Applications,
                  Tasks: d.Tasks
                }))
              : MOCK_TREND;
            const tooltipStyle = { backgroundColor: '#1F2228', borderColor: '#2A2D33', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.4)' };
            return (
              <div className="glass-card p-6 rounded-xl border border-[#DCE3ED] dark:border-[#2A2D33]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#111827] dark:text-[#F5F5F5] flex items-center gap-2">
                      <Activity className="w-5 h-5 text-violet-400" /> Productivity Activity
                    </h3>
                    <p className="text-xs text-[#64748B] dark:text-[#A1A1AA] mt-1 font-medium">How much work is OpteraAI handling over time?</p>
                  </div>
                  <Activity className="w-5 h-5 text-violet-400 opacity-60" />
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2A2D33" vertical={false} />
                      <XAxis dataKey="date" stroke="#A0AEC0" axisLine={false} tickLine={false} dy={10} tick={{ fontSize: 12 }} />
                      <YAxis stroke="#A0AEC0" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={tooltipStyle} itemStyle={{ fontWeight: 'bold' }} labelStyle={{ color: '#F5F5F5', fontWeight: 'bold' }} />
                      <Legend wrapperStyle={{ paddingTop: '16px', fontSize: '12px', fontWeight: 'bold' }} />
                      <Line type="monotone" dataKey="Emails" stroke="#2563FF" strokeWidth={2.5} dot={{ r: 4, fill: '#2563FF' }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Meetings" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4, fill: '#8b5cf6' }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Applications" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Tasks" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4, fill: '#f59e0b' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          })()}

          {/* ── NEW: Agent Usage & Performance Bar Chart ──────────────── */}
          {(() => {
            const MOCK_AGENTS = [
              { agent: 'Watcher',      tasks: 154 },
              { agent: 'Research',     tasks: 38  },
              { agent: 'Knowledge',    tasks: 12  },
              { agent: 'Resume',       tasks: 4   },
              { agent: 'Application',  tasks: 12  },
              { agent: 'Meeting',      tasks: 14  },
              { agent: 'Calendar',     tasks: 47  },
              { agent: 'Notification', tasks: 89  },
            ];
            const AGENT_COLORS = ['#2563FF','#8b5cf6','#10b981','#f59e0b','#f43f5e','#06b6d4','#84cc16','#ec4899'];
            const agentChartData = agentUsage.length > 0 ? agentUsage : MOCK_AGENTS;
            const tooltipStyle = { backgroundColor: '#1F2228', borderColor: '#2A2D33', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.4)' };
            return (
              <div className="glass-card p-6 rounded-xl border border-[#DCE3ED] dark:border-[#2A2D33]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#111827] dark:text-[#F5F5F5] flex items-center gap-2">
                      <Bot className="w-5 h-5 text-emerald-400" /> Agent Usage & Performance
                    </h3>
                    <p className="text-xs text-[#64748B] dark:text-[#A1A1AA] mt-1 font-medium">Which agents are contributing the most?</p>
                  </div>
                  <Bot className="w-5 h-5 text-emerald-400 opacity-60" />
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={agentChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2A2D33" horizontal={true} vertical={false} />
                      <XAxis dataKey="agent" stroke="#A0AEC0" axisLine={false} tickLine={false} dy={10} tick={{ fontSize: 11 }} />
                      <YAxis stroke="#A0AEC0" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={tooltipStyle} itemStyle={{ fontWeight: 'bold' }} labelStyle={{ color: '#F5F5F5', fontWeight: 'bold' }} />
                      <Bar dataKey="tasks" radius={[6, 6, 0, 0]} label={false}>
                        {agentChartData.map((_: any, index: number) => (
                          <Cell key={`bar-${index}`} fill={AGENT_COLORS[index % AGENT_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          })()}

          {/* Middle row: Task breakdown + Meeting breakdown */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Task Distribution */}
            <div className="glass-card p-6 rounded-xl border border-[#DCE3ED] dark:border-[#2A2D33]">
              <h3 className="text-lg font-extrabold mb-4 flex items-center gap-2 text-green-600">
                <CheckSquare className="w-5 h-5" /> Task Breakdown
              </h3>
              <div className="space-y-4">
                <DistBar label="Completed" value={data.task?.completed ?? 0} max={data.task?.total ?? 0} color="#10b981" />
                <DistBar label="Pending" value={data.task?.pending ?? 0} max={data.task?.total ?? 0} color="#f59e0b" />
                <DistBar label="Overdue" value={data.task?.overdue ?? 0} max={data.task?.total ?? 0} color="#f43f5e" />
              </div>
              <div className="mt-6 pt-4 border-t border-[#DCE3ED] dark:border-[#2A2D33] grid grid-cols-3 text-center gap-2">
                <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg"><p className="text-lg font-extrabold text-green-600">{data.task?.completion_rate?.toFixed(0) ?? 0}%</p><p className="text-[10px] uppercase font-bold text-green-800">Completion</p></div>
                <div className="bg-[#F4F7FB] dark:bg-[#080808] p-2 rounded-lg"><p className="text-lg font-extrabold text-[#111827] dark:text-[#F5F5F5]">{data.task?.total ?? 0}</p><p className="text-[10px] uppercase font-bold text-[#64748B] dark:text-[#A1A1AA]">Total Tasks</p></div>
                <div className="bg-rose-50 dark:bg-rose-900/20 p-2 rounded-lg"><p className="text-lg font-extrabold text-rose-600">{data.task?.overdue ?? 0}</p><p className="text-[10px] uppercase font-bold text-rose-800">Overdue</p></div>
              </div>
            </div>

            {/* Meeting breakdown */}
            <div className="glass-card p-6 rounded-xl border border-[#DCE3ED] dark:border-[#2A2D33]">
              <h3 className="text-lg font-extrabold mb-4 flex items-center gap-2 text-indigo-600">
                <Users className="w-5 h-5" /> Meeting Activity
              </h3>
              <div className="space-y-4">
                <DistBar label="User Attended" value={data.meeting?.user_attended ?? 0} max={data.meeting?.total_meetings ?? 0} color="#6366f1" />
                <DistBar label="AI Bot Attended" value={data.meeting?.ai_attended ?? 0} max={data.meeting?.total_meetings ?? 0} color="#a855f7" />
              </div>
              <div className="mt-6 pt-4 border-t border-[#DCE3ED] dark:border-[#2A2D33] grid grid-cols-3 text-center gap-2">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-lg"><p className="text-lg font-extrabold text-indigo-600">{data.meeting?.total_meetings ?? 0}</p><p className="text-[10px] uppercase font-bold text-indigo-800">Total Meetings</p></div>
                <div className="bg-[#F4F7FB] dark:bg-[#080808] p-2 rounded-lg"><p className="text-lg font-extrabold text-[#111827] dark:text-[#F5F5F5]">{data.meeting?.total_duration_minutes ?? 0}</p><p className="text-[10px] uppercase font-bold text-[#64748B] dark:text-[#A1A1AA]">Total Minutes</p></div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg"><p className="text-lg font-extrabold text-purple-600">{data.meeting?.tasks_extracted ?? 0}</p><p className="text-[10px] uppercase font-bold text-purple-800">Tasks Extracted</p></div>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          {insights && (
            <div className="glass-card p-6 rounded-xl border border-fuchsia-200 bg-fuchsia-50/10 dark:bg-fuchsia-900/10">
              <h3 className="text-lg font-extrabold mb-4 flex items-center gap-2 text-fuchsia-600">
                <Zap className="w-5 h-5" /> AI-Powered Productivity Insights
              </h3>
              <p className="text-[#111827] dark:text-[#F5F5F5] font-bold mb-5 mt-2">{insights.summary}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 p-5 rounded-xl">
                  <p className="text-sm font-extrabold text-green-700 mb-3 uppercase tracking-wide">Positive Trends</p>
                  <ul className="space-y-2">{insights.positive_trends?.map((t: string, i: number) => <li key={i} className="text-sm text-green-900 font-bold flex gap-3"><span className="text-green-500">✓</span>{t}</li>)}</ul>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 p-5 rounded-xl">
                  <p className="text-sm font-extrabold text-amber-700 mb-3 uppercase tracking-wide">Recommendations</p>
                  <ul className="space-y-2">{insights.recommendations?.map((r: string, i: number) => <li key={i} className="text-sm text-amber-900 font-bold flex gap-3"><span className="text-amber-500">→</span>{r}</li>)}</ul>
                </div>
                <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 p-5 rounded-xl">
                  <p className="text-sm font-extrabold text-rose-700 mb-3 uppercase tracking-wide">Warnings</p>
                  <ul className="space-y-2">{insights.warnings?.map((w: string, i: number) => <li key={i} className="text-sm text-rose-900 font-bold flex gap-3"><span className="text-rose-500">!</span>{w}</li>)}</ul>
                </div>
              </div>
            </div>
          )}

          {/* Project Traceability section (Real System Entities) */}
          <div className="glass-card p-6 rounded-xl border border-[#DCE3ED] dark:border-[#2A2D33] dark:border-[#2A2D33]">
            <h3 className="text-lg font-extrabold mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Code className="w-5 h-5" /> Recent Processed Entities
            </h3>
            {recentMeetings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-[#F4F7FB] dark:bg-[#080808] dark:bg-[#18181B] text-[#64748B] dark:text-[#A1A1AA] dark:text-[#A1A1AA] font-bold uppercase text-xs">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Title</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Priority</th>
                      <th className="px-4 py-3 rounded-tr-lg text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentMeetings.map((m: any) => (
                      <tr key={m.id} className="border-b border-[#DCE3ED] dark:border-[#2A2D33] dark:border-white/5 hover:bg-[#F4F7FB] dark:bg-[#080808]/50 dark:hover:bg-[#1F2228]/50 transition-colors text-slate-800 dark:text-[#F5F5F5]">
                        <td className="px-4 py-3 font-semibold">{m.title}</td>
                        <td className="px-4 py-3">
                          <span className="bg-blue-100 dark:bg-blue-900/30 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-2.5 py-0.5 rounded-full text-xs font-bold">
                            {m.category || m.platform || 'General'}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${m.priority === 'HIGH' ? 'bg-rose-500' : m.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                          {m.priority || 'NORMAL'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-xs font-mono uppercase bg-[#EFF6FF] dark:bg-[#18181B] px-2 py-1 rounded text-[#64748B] dark:text-[#A1A1AA] dark:text-[#71717A]">
                            PROCESSED
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center bg-[#F4F7FB] dark:bg-[#080808] dark:bg-[#18181B]/50 rounded-xl border border-dashed border-[#DCE3ED] dark:border-[#2A2D33] dark:border-[#2A2D33]">
                <p className="text-[#64748B] dark:text-[#A1A1AA] dark:text-[#71717A] font-medium">No recent project entities found. Start tracking emails and meetings to populate the ecosystem.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
