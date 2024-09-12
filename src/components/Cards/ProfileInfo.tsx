import React from "react";
import { getInitials } from "@/utils/helper";

interface ProfileInfoProps {
  onLogout: () => void;
}

function ProfileInfo({ onLogout }: ProfileInfoProps) {
  return (
    <>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 bg-slate-100 font-medium">
          {getInitials("Arnav Malasi")}
        </div>

        <div>
          <p className="text-sm font-medium">Arnav</p>

          <button
            className="text-sm t ext-slate-700 underline"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default ProfileInfo;
