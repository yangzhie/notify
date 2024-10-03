"use client";

import React, { useState } from "react";
import ProfileInfo from "../Cards/ProfileInfo";
import { useRouter } from "next/navigation";
import Searchbar from "../Searchbar/Searchbar";
import Link from "next/link";

interface NavbarProps {
  userInfo?: any;
  onSearchNote?: (searchQuery: string) => void;
  handleClearSearch?: () => void;
  sticky: boolean;
  background: boolean;
}

function Navbar({
  userInfo,
  onSearchNote,
  handleClearSearch,
  sticky,
  background,
}: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery && onSearchNote) {
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () => {
    if (handleClearSearch) {
      setSearchQuery("");
      handleClearSearch();
    }
  };

  const onLogout = () => {
    localStorage.clear();
    router.push("login");
  };
  return (
    <>
      <div
        className={`flex ${
          sticky ? "sticky" : "absolute"
        } items-center justify-between px-6 py-2 ${
          background ? "bg-gray-800" : ""
        } drop-shadow-xl`}
      >
        <Link href="/login" className="text-xl font-medium text-white py-2">Notify</Link>

        {userInfo && (
          <Searchbar
            value={searchQuery}
            onChange={({ target }) => {
              setSearchQuery(target.value);
            }}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />
        )}

        {userInfo && <ProfileInfo userInfo={userInfo} onLogout={onLogout} />}
      </div>
    </>
  );
}

export default Navbar;
