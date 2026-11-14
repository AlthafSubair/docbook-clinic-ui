export interface AuthShowcaseProps {
  className?: string;
}

export default function AuthShowcase({ className = "" }: AuthShowcaseProps) {
  return (
    <section
      className={`hidden lg:flex lg:w-1/2 xl:w-7/12 relative flex-col justify-between p-8 xl:p-12 lg:py-8 lg:px-10 xl:py-10 xl:px-14 bg-gradient-to-br from-primary to-primary-dark text-white overflow-hidden isolate lg:h-full ${className}`.trim()}
    >
      {/* Ambient background glows & pattern overlays using token colors */}
      <div className="absolute -top-32 -left-32 size-96 rounded-full bg-primary/25 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 size-96 rounded-full bg-primary-dark/35 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Brand Header */}
      <div className="relative z-10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-md shadow-black/10">
            {/* Stethoscope / Clinic Icon */}
            <svg
              className="size-6 stroke-[2.3]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
              <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
              <circle cx="20" cy="10" r="2" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-2xl tracking-tight text-white leading-none">
              Doc<span className="text-white/80">Book</span>
            </span>
            <span className="text-[11px] font-medium text-white/75 tracking-wider uppercase mt-1">
              Clinic Portal
            </span>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-xs text-xs font-semibold text-white/90">
          <svg
            className="size-3.5 text-white/90"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
          </svg>
          <span>Fast & Secure</span>
        </div>
      </div>

      {/* Hero Copy & Value Propositions */}
      <div className="relative z-10 my-auto py-4 xl:py-6 max-w-xl">
        <h2 className="text-2xl lg:text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
          Clinic operations made simple, streamlined & intelligent.
        </h2>

        <p className="mt-3 xl:mt-4 text-sm lg:text-base xl:text-lg text-white/85 leading-relaxed font-normal">
          Manage real-time queues, doctor rosters, patient tokens, and clinic staff in one centralized portal.
        </p>

        {/* Highlights Grid */}
        <div className="mt-5 xl:mt-8 grid grid-cols-1 gap-2.5 xl:gap-3.5">
          {/* Item 1 */}
          <div className="flex items-start gap-3 xl:gap-3.5 p-3 xl:p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm transition-transform hover:scale-[1.01]">
            <div className="size-9 xl:size-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 text-white">
              <svg
                className="size-4.5 xl:size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <h3 className="text-xs xl:text-sm font-bold text-white">
                Live Queue & Token Tracker
              </h3>
              <p className="text-[11px] xl:text-xs text-white/80 mt-0.5">
                Real-time queue tracking, patient calling, and automated status displays.
              </p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex items-start gap-3 xl:gap-3.5 p-3 xl:p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm transition-transform hover:scale-[1.01]">
            <div className="size-9 xl:size-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 text-white">
              <svg
                className="size-4.5 xl:size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <path d="M16 2v4" />
                <path d="M8 2v4" />
                <path d="M3 10h18" />
                <path d="m9 16 2 2 4-4" />
              </svg>
            </div>
            <div>
              <h3 className="text-xs xl:text-sm font-bold text-white">
                Doctor Rosters & Schedules
              </h3>
              <p className="text-[11px] xl:text-xs text-white/80 mt-0.5">
                Organize specialist consultation hours, slot availability, and leaves.
              </p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex items-start gap-3 xl:gap-3.5 p-3 xl:p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm transition-transform hover:scale-[1.01]">
            <div className="size-9 xl:size-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 text-white">
              <svg
                className="size-4.5 xl:size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <h3 className="text-xs xl:text-sm font-bold text-white">
                Patient Profiles & Records
              </h3>
              <p className="text-[11px] xl:text-xs text-white/80 mt-0.5">
                Quick lookup for returning patients and linked family accounts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
