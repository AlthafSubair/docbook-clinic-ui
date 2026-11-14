import { Title, Desc, Button } from "docbook-ui-package";
import {
  Calendar,
  Clock,
  UserCheck,
  CheckCircle2,
  Search,
  Filter,
  Plus,
  Users,
} from "lucide-react";

export default function AppointmentsPage() {
  const stats = [
    { label: "Today's Appointments", value: "24", icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Checked In (Waiting)", value: "8", icon: UserCheck, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "In Consultation", value: "2", icon: Clock, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Completed", value: "14", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Title>Appointments & Live Queue</Title>
          <Desc>
            Monitor real-time patient arrivals, doctor consultations, and today's schedule.
          </Desc>
        </div>
        <div className="shrink-0 flex items-center gap-2.5">
          <Button variant="primary" className="flex items-center gap-2 py-2.5">
            <Plus className="size-4" />
            <span>Book Appointment</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5"
            >
              <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${item.bg} ${item.color}`}>
                <Icon className="size-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-slate-800 leading-tight">
                  {item.value}
                </span>
                <span className="text-xs text-secondary-text font-medium">
                  {item.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="size-4 text-tertiary-text absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by patient name, phone, or token..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-secondary-text outline-none focus:border-primary focus:bg-white transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="secondary" className="flex items-center gap-2 text-sm py-2">
            <Filter className="size-4" />
            <span>Filter Status</span>
          </Button>
        </div>
      </div>

      {/* Appointments List / Queue Table Placeholder */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 text-center py-16 flex flex-col items-center justify-center gap-3">
          <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-1">
            <Users className="size-8 stroke-[1.8]" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            Appointments Queue Placeholder
          </h3>
          <p className="text-sm text-secondary-text max-w-md">
            This page will display live appointment queues, token calling controls, check-in statuses, and patient details.
          </p>
        </div>
      </div>
    </div>
  );
}
