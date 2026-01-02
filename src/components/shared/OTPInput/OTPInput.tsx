import { useRef } from "react";
import type { KeyboardEvent, ClipboardEvent } from "react";

export interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  onChange,
  onComplete,
}) => {
  const getOtpArray = (val: string) => {
    const arr = val.split("").slice(0, length);
    return [...arr, ...Array(Math.max(0, length - arr.length)).fill("")];
  };

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const currentOtp = getOtpArray(value);

  const handleChange = (index: number, newValue: string) => {
    // Allow only alphanumeric characters
    if (!/^[a-zA-Z0-9]*$/.test(newValue)) return;

    const newOtp = getOtpArray(value);
    newOtp[index] = newValue.slice(-1).toUpperCase();

    const otpString = newOtp.join("");
    onChange(otpString);

    // Move to next input
    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if complete
    if (otpString.length === length && !otpString.includes("") && onComplete) {
      onComplete(otpString);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!currentOtp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      const newOtp = getOtpArray(value);
      newOtp[index] = "";
      onChange(newOtp.join(""));
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    if (!/^[a-zA-Z0-9]*$/.test(pastedData)) return;

    onChange(pastedData.toUpperCase());

    // Focus last filled input
    const focusIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[focusIndex]?.focus();

    if (pastedData.length === length && onComplete) {
      onComplete(pastedData.toUpperCase());
    }
  };

  return (
    <div className="flex gap-2 sm:gap-3 justify-center">
      {currentOtp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-12 h-12 sm:w-14 sm:h-14 text-center text-lg sm:text-xl font-bold
                     bg-white border-2 border-[#E1E4EA] rounded-xl
                     focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                     transition-all duration-200 text-dark"
        />
      ))}
    </div>
  );
};

export default OTPInput;
