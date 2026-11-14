import { useState, useRef, useEffect } from "react";
import type { KeyboardEvent, ClipboardEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "docbook-ui-package";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30;

export interface VerifyOtpFormProps {
  identifier?: string | null;
  onSuccess?: (otp: string) => void;
  isLoading?: boolean;
}

export function VerifyOtpForm({
  identifier,
  onSuccess,
  isLoading = false,
}: VerifyOtpFormProps) {
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState<number>(RESEND_COOLDOWN);
  const [error, setError] = useState<string>("");
  const [isResending, setIsResending] = useState(false);

  const canResend = timer <= 0;
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus the first input on initial mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Resend countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    setError("");
    const digit = value.replace(/\D/g, "");
    if (!digit) {
      const nextOtp = [...otp];
      nextOtp[index] = "";
      setOtp(nextOtp);
      return;
    }

    const nextOtp = [...otp];
    nextOtp[index] = digit.slice(-1);
    setOtp(nextOtp);

    // Auto-advance to the next input box
    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Move to previous box and clear it
        const nextOtp = [...otp];
        nextOtp[index - 1] = "";
        setOtp(nextOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        const nextOtp = [...otp];
        nextOtp[index] = "";
        setOtp(nextOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    setError("");
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pastedData) return;

    const nextOtp = [...otp];
    pastedData.split("").forEach((char, idx) => {
      if (idx < OTP_LENGTH) {
        nextOtp[idx] = char;
      }
    });
    setOtp(nextOtp);

    const nextFocusIndex = Math.min(pastedData.length, OTP_LENGTH - 1);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  const handleResend = async () => {
    if (!canResend || isResending) return;
    setIsResending(true);
    setOtp(Array(OTP_LENGTH).fill(""));
    setError("");

    try {
      // Simulate/trigger resend OTP
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success("New verification code sent successfully!");
      setTimer(RESEND_COOLDOWN);
      inputRefs.current[0]?.focus();
    } catch {
      const msg = "Failed to resend code. Please try again.";
      toast.error(msg);
      setError(msg);
    } finally {
      setIsResending(false);
    }
  };

  const isComplete = otp.every((digit) => digit.length === 1);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const otpCode = otp.join("");
    if (otpCode.length !== OTP_LENGTH || !/^\d{6}$/.test(otpCode)) {
      const msg = "Please enter the complete 6-digit verification code";
      setError(msg);
      toast.error(msg);
      const firstEmpty = otp.findIndex((d) => !d);
      inputRefs.current[firstEmpty !== -1 ? firstEmpty : 0]?.focus();
      return;
    }

    if (onSuccess) {
      onSuccess(otpCode);
    } else {
      toast.success("Code verified successfully!");
      const query = identifier
        ? `?identifier=${encodeURIComponent(identifier)}&code=${encodeURIComponent(otpCode)}`
        : `?code=${encodeURIComponent(otpCode)}`;
      navigate(`/reset-password${query}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      {/* 6-digit OTP Inputs */}
      <div className="flex justify-between items-center gap-1.5 sm:gap-2.5">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            pattern="\d*"
            maxLength={1}
            disabled={isLoading}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            aria-label={`Digit ${index + 1} of 6`}
            className={`h-11 w-10 sm:h-12 sm:w-11 md:h-13 md:w-12 lg:h-12 lg:w-11 xl:h-13 xl:w-12 rounded-xl border-2 bg-white text-center text-lg sm:text-xl md:text-2xl font-bold text-primary-dark transition-[border-color,box-shadow,transform] duration-150 outline-none select-none disabled:opacity-60 disabled:cursor-not-allowed ${
              error
                ? "border-red-500 shadow-[0_2px_8px_rgba(239,68,68,0.3)] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.25)]"
                : digit
                  ? "border-primary shadow-[0_2px_8px_rgba(0,0,255,0.25)]"
                  : "border-primary/50 shadow-[0_2px_8px_rgba(0,0,255,0.15)]"
            } focus:border-primary focus:shadow-[0_0_0_3px_rgba(0,0,255,0.2)] focus:scale-105`}
          />
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-center text-xs sm:text-sm font-medium text-red-600 animate-in fade-in duration-200">
          {error}
        </p>
      )}

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          className="w-full justify-center text-base py-3"
          disabled={isLoading || !isComplete}
        >
          {isLoading ? "Verifying..." : "Verify and Proceed"}
        </Button>
      </div>

      {/* Resend & Actions Row */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-secondary-text pt-1">
        <Link
          to="/forgot-password"
          className="font-medium hover:text-primary transition-colors hover:underline"
        >
          Change contact
        </Link>

        <div>
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending || isLoading}
              className="font-semibold text-primary hover:underline cursor-pointer disabled:opacity-50"
            >
              {isResending ? "Sending..." : "Resend code"}
            </button>
          ) : (
            <span>
              Resend in <span className="font-semibold">{timer}s</span>
            </span>
          )}
        </div>
      </div>
    </form>
  );
}

export default VerifyOtpForm;
