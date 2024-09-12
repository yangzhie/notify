"use client";

import React, { useState } from "react";
import ProfileInfo from "../Cards/ProfileInfo";
import { useRouter } from "next/navigation";
import Searchbar from "../Searchbar/Searchbar";

function Navbar() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  const handleSearch = () => {};

  const onClearSearch = () => {
    setSearchQuery("");
  };

  const onLogout = () => {
    router.push("login");
  };
  return (
    <>
      <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
        <h2 className="text-xl font-medium text-black py-2">Notify</h2>

        <Searchbar
          value={searchQuery}
          onChange={({ target }) => {
            setSearchQuery(target.value);
          }}
          handleSearch={handleSearch}
          onClearSearch={onClearSearch}
        />

        <ProfileInfo onLogout={onLogout} />
      </div>
    </>
  );
}

export default Navbar;
