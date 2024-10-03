"use client";

import React, { useState } from "react";
import ProfileInfo from "../Cards/ProfileInfo";
import { useRouter } from "next/navigation";
import Searchbar from "../Searchbar/Searchbar";

interface NavbarProps {
  userInfo?: any;
  onSearchNote?: (searchQuery: string) => void;
  handleClearSearch?: () => void;
}

function Navbar({ userInfo, onSearchNote, handleClearSearch }: NavbarProps) {
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
      <div className="flex absolute items-center justify-between px-6 py-2 drop-shadow">
        <h2 className="text-xl font-medium text-black py-2">Notify</h2>

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
