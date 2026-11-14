import { useSearchParams } from "react-router";
import { Title, Desc } from "docbook-ui-package";
import VerifyOtpForm from "../../components/auth/VerifyOtpForm";

export default function VerifyOtpPage() {
  const [searchParams] = useSearchParams();
  const identifier = searchParams.get("identifier");

  return (
    <div className="flex flex-1 flex-col justify-between items-center gap-2 sm:gap-4 px-5 py-3 sm:py-6 sm:px-10 md:py-6 md:px-12 lg:py-8 lg:px-8 xl:p-12 lg:justify-center lg:gap-5 xl:gap-7 w-full bg-background min-h-full">
      <div className="flex flex-col gap-1.5 sm:gap-2 w-full max-w-md shrink-0 text-center">
        <Title className="text-center">Verify with OTP</Title>
        <Desc className="text-center">
          {identifier ? (
            <>
              Enter the 6-digit code sent to{" "}
              <span className="font-semibold text-secondary-text">{identifier}</span>
            </>
          ) : (
            "Enter the 6-digit code sent to your registered contact"
          )}
        </Desc>
      </div>

      <div className="flex justify-center items-center my-auto lg:my-0 shrink-0 py-1">
        <img
          src="/Doctor.png"
          alt="Verify OTP illustration"
          className="w-36 sm:w-44 md:w-52 lg:w-48 xl:w-60 h-auto max-h-[18dvh] sm:max-h-[20dvh] lg:max-h-[19vh] xl:max-h-[23vh] max-w-full object-contain drop-shadow-sm select-none"
        />
      </div>

      <div className="w-full max-w-sm shrink-0 pb-2 sm:pb-0">
        <VerifyOtpForm identifier={identifier} />
      </div>
    </div>
  );
}
