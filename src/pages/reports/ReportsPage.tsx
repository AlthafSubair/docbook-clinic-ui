import { Title, Desc, Button } from "docbook-ui-package";
import {
  BarChart3,
  Download,
  DollarSign,
  CreditCard,
  Banknote,
  Receipt,
} from "lucide-react";

export default function ReportsPage() {
  const financialMetrics = [
    { label: "Today's Revenue", value: "₹24,800", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Cash Collections", value: "₹10,500", icon: Banknote, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "UPI / Digital Payments", value: "₹14,300", icon: CreditCard, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Invoices Settled", value: "28", icon: Receipt, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Title>Reports & Financials</Title>
          <Desc>
            Review daily collections, revenue summaries, and clinic performance analytics.
          </Desc>
        </div>
        <div className="shrink-0 flex items-center gap-2.5">
          <Button variant="secondary" className="flex items-center gap-2 py-2.5">
            <Download className="size-4" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      {/* Financial Metrics Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {financialMetrics.map((item) => {
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

      {/* Reports Content Placeholder */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-8 text-center py-16 flex flex-col items-center justify-center gap-3">
        <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-1">
          <BarChart3 className="size-8 stroke-[1.8]" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">
          Financial & Performance Reports Placeholder
        </h3>
        <p className="text-sm text-secondary-text max-w-md">
          This page will show daily transaction logs, doctor-wise revenue distribution, patient volume trends, and accounting ledgers.
        </p>
      </div>
    </div>
  );
}
