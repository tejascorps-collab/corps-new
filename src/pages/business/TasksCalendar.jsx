import { PageHeader, Card, CardHeader, Badge, StatCard, Icon } from '../../components/ui/Primitives'
import { tasks, upcomingActivities } from '../../data/mockData'

const prioTone = { High: 'red', Medium: 'orange', Low: 'slate' }
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
// July 2026 starts on a Wednesday
const monthStartOffset = 2
const eventDays = { 2: 1, 3: 1, 5: 2, 8: 1, 10: 1 }

export default function TasksCalendar() {
  return (
    <div>
      <PageHeader title="Tasks & Calendar" subtitle="Team tasks, follow-ups, meetings & scheduling" icon="CalendarDays">
        <button className="btn-ghost btn-sm">Today</button>
        <button className="btn-gold btn-sm">+ New Task</button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open Tasks" value="36" delta={0} up icon="ListTodo" tint="blue" />
        <StatCard label="Due Today" value="4" delta={0} up icon="AlarmClock" tint="orange" />
        <StatCard label="Completed (wk)" value="28" delta={12.0} up icon="CheckCircle2" tint="green" />
        <StatCard label="Overdue" value="2" delta={1.0} up={false} icon="AlertCircle" tint="red" hint="fewer" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* Calendar */}
        <Card>
          <CardHeader title="July 2026" icon="CalendarDays"
            action={<div className="flex gap-1">
              <button className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5"><Icon name="ChevronLeft" size={16} /></button>
              <button className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5"><Icon name="ChevronRight" size={16} /></button>
            </div>} />
          <div className="card-pad pt-3">
            <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase text-slate-500">
              {days.map((d) => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: monthStartOffset }).map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: 31 }).map((_, i) => {
                const day = i + 1
                const isToday = day === 2
                const ev = eventDays[day]
                return (
                  <div key={day} className={`aspect-square rounded-lg p-1.5 text-sm ring-1 transition ${
                    isToday ? 'bg-gold-400/15 text-gold-200 ring-gold-400/40' : 'text-slate-300 ring-white/5 hover:bg-white/[0.03]'}`}>
                    <div className="flex justify-between">
                      <span>{day}</span>
                      {ev && <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gold-400" />}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>

        {/* Agenda */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Upcoming" icon="Clock" />
            <div className="card-pad space-y-2 pt-3">
              {upcomingActivities.map((a, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl bg-white/[0.02] px-3 py-2.5 ring-1 ring-white/5">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gold-400/10 text-center leading-none text-gold-300">
                    <span className="text-sm font-bold">{a.day}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-slate-100">{a.title}</div>
                    <div className="text-xs text-slate-500">{a.sub} · {a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card className="mt-6 overflow-hidden">
        <div className="px-5 pt-5 text-sm font-semibold text-white">Task List</div>
        <div className="overflow-x-auto px-2 pb-2 pt-2">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wide text-slate-500">
                {['Task', 'Due', 'Priority', 'Assignee', 'Status'].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.title} className="table-row">
                  <td className="px-3 py-3 font-medium text-slate-100">{t.title}</td>
                  <td className="px-3 py-3 text-slate-400">{t.due}</td>
                  <td className="px-3 py-3"><Badge tone={prioTone[t.priority]}>{t.priority}</Badge></td>
                  <td className="px-3 py-3 text-slate-400">{t.assignee}</td>
                  <td className="px-3 py-3"><Badge>{t.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
