import { Title, Desc, Button } from "docbook-ui-package";
import { Stethoscope, Plus, Search, Clock } from "lucide-react";

export default function DoctorsPage() {
  const sampleDoctors = [
    {
      name: "Dr. Sarah Jenkins",
      specialty: "General Physician",
      room: "OPD Room 1",
      status: "Available",
      statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      timing: "09:00 AM - 01:00 PM",
    },
    {
      name: "Dr. Rajesh Kumar",
      specialty: "Pediatrician",
      room: "OPD Room 2",
      status: "In Consultation",
      statusColor: "bg-amber-50 text-amber-700 border-amber-200",
      timing: "10:00 AM - 04:00 PM",
    },
    {
      name: "Dr. Emily Wong",
      specialty: "Dermatologist",
      room: "OPD Room 3",
      status: "On Break",
      statusColor: "bg-slate-100 text-slate-700 border-slate-200",
      timing: "02:00 PM - 07:00 PM",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Title>Doctors Directory</Title>
          <Desc>
            View active doctors, duty schedules, consultation rooms, and live availability.
          </Desc>
        </div>
        <div className="shrink-0">
          <Button variant="primary" className="flex items-center gap-2 py-2.5">
            <Plus className="size-4" />
            <span>Add Doctor</span>
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="size-4 text-tertiary-text absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search doctor by name or specialty..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-secondary-text outline-none focus:border-primary focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Doctors Grid Cards Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sampleDoctors.map((doc) => (
          <div
            key={doc.name}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between gap-4 hover:border-primary/40 transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Stethoscope className="size-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-800 leading-tight">
                    {doc.name}
                  </h4>
                  <p className="text-xs text-primary font-medium mt-0.5">
                    {doc.specialty}
                  </p>
                </div>
              </div>
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${doc.statusColor}`}>
                {doc.status}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-secondary-text pt-2 border-t border-slate-100">
              <span className="font-semibold text-slate-700">{doc.room}</span>
              <span className="flex items-center gap-1.5 text-tertiary-text">
                <Clock className="size-3.5" />
                {doc.timing}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
