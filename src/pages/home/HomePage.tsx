import { Title, Desc, Button } from "docbook-ui-package";
import { Link } from "react-router";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-12 max-w-lg w-full flex flex-col items-center gap-4">
        <div className="size-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2">
          <svg
            className="size-10 stroke-[2] text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="16" height="20" x="4" y="2" rx="2" />
            <path d="M9 22v-4h6v4" />
            <path d="M8 6h.01" />
            <path d="M16 6h.01" />
            <path d="M12 6h.01" />
            <path d="M12 10h.01" />
            <path d="M12 14h.01" />
            <path d="M16 10h.01" />
            <path d="M16 14h.01" />
            <path d="M8 10h.01" />
            <path d="M8 14h.01" />
          </svg>
        </div>
        <Title>Welcome to DocBook Clinic</Title>
        <Desc>
          Your all-in-one clinic administration portal. Manage appointments, doctors, and patient records seamlessly.
        </Desc>
        <div className="pt-4 w-full">
          <Link to="/login" className="w-full block">
            <Button variant="primary" className="w-full justify-center py-3">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
