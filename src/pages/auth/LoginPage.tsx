import { Title, Desc } from "docbook-ui-package";
import LoginForm, { type LoginFormData } from "../../components/auth/LoginForm";

export default function LoginPage() {
  const handleLogin = (data: LoginFormData) => {
    // Ready for clinic authentication handler / TanStack Mutation
    console.log("Clinic login attempt:", data);
  };

  return (
    <div className="flex flex-1 flex-col justify-between items-center gap-2 sm:gap-4 px-5 py-3 sm:py-6 sm:px-10 md:py-6 md:px-12 lg:py-8 lg:px-10 xl:p-14 lg:justify-center lg:gap-6 xl:gap-8 w-full bg-background min-h-full">
      {/* Top Header: Title & Description */}
      <div className="flex flex-col gap-1.5 sm:gap-2 w-full max-w-md shrink-0 text-center">
        <Title className="text-center">Welcome to DocBook</Title>
        <Desc className="text-center">
          Sign in to your clinic management portal
        </Desc>
      </div>

      {/* Center Visual / Illustration */}
      <div className="flex justify-center items-center my-auto lg:my-0 shrink-0 py-1">
        <img
          src="/Doctor.png"
          alt="Doctor illustration"
          className="w-36 sm:w-44 md:w-52 lg:w-48 xl:w-60 h-auto max-h-[18dvh] sm:max-h-[20dvh] lg:max-h-[19vh] xl:max-h-[23vh] max-w-full object-contain drop-shadow-sm select-none"
        />
      </div>

      {/* Form Slot Container */}
      <div className="w-full max-w-md shrink-0 pb-2 sm:pb-0">
        <LoginForm onSubmit={handleLogin} />
      </div>
    </div>
  );
}
