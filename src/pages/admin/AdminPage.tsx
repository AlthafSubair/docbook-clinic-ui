import { Title, Desc, Button } from "docbook-ui-package";
import {
  UserPlus,
  QrCode,
  Clock,
  DollarSign,
  Users,
} from "lucide-react";

export default function AdminPage() {
  const adminSections = [
    {
      title: "Staff Accounts",
      desc: "Add or manage clinic doctors, receptionists, and accountants.",
      icon: Users,
      action: "Manage Staff",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Clinic Timings & Working Hours",
      desc: "Configure weekly operational days, shift hours, and holiday schedules.",
      icon: Clock,
      action: "Edit Hours",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Consultation Fees & Services",
      desc: "Set specialty pricing, registration fees, and follow-up charges.",
      icon: DollarSign,
      action: "Configure Fees",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Clinic QR Code",
      desc: "Generate and print the clinic QR code for patient self-booking and check-in.",
      icon: QrCode,
      action: "View QR Code",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Title>Clinic Administration</Title>
          <Desc>
            Control clinic configuration, staff permissions, pricing, and QR booking setup.
          </Desc>
        </div>
        <div className="shrink-0 flex items-center gap-2.5">
          <Button variant="primary" className="flex items-center gap-2 py-2.5">
            <UserPlus className="size-4" />
            <span>Invite Staff</span>
          </Button>
        </div>
      </div>

      {/* Admin Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {adminSections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between gap-4 hover:border-primary/40 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${section.bg} ${section.color}`}>
                  <Icon className="size-6" />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-base font-bold text-slate-800 leading-tight">
                    {section.title}
                  </h4>
                  <p className="text-xs text-secondary-text mt-1 leading-relaxed">
                    {section.desc}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <Button variant="secondary" className="text-xs py-1.5 px-3">
                  {section.action}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
