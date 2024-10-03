import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

function PasswordInput({ value, onChange, placeholder }: PasswordInputProps) {
  const [isShowingPassword, setIsShowingPassword] = useState<boolean>(false);
  const togglePassword = () => {
    setIsShowingPassword(!isShowingPassword);
  };
  return (
    <>
      <div className="flex items-center bg-[#251410] px-5 rounded mb-3">
        <input
          onChange={onChange}
          type={isShowingPassword ? "text" : "password"}
          placeholder={placeholder || "Your Password"}
          className="w-full text-white text-sm bg-transparent py-3 mr-3 rounded outline-none"
        />
        {isShowingPassword ? (
          <FaRegEye
            size={22}
            className="cursor-pointer"
            onClick={() => togglePassword()}
            color="purple"
          />
        ) : (
          <FaRegEyeSlash
            size={22}
            className="text-slate-400 cursor-pointer"
            onClick={() => togglePassword()}
          />
        )}
      </div>
    </>
  );
}

export default PasswordInput;
