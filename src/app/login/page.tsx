"use client";

import PasswordInput from "@/components/Input/PasswordInput";
import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";
import React, { useState } from "react";
import { validateEmail } from "@/utils/helper";

function page() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: any) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    setError("");

    // login API call
  };
  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl mb-7">Login</h4>

            <input
              type="text"
              placeholder="Email"
              className="w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            <button
              type="submit"
              className="w-full text-sm bg-primary text-white p-2 rounded my-1 hover:bg-blue-600"
            >
              Login
            </button>

            <p className="text-sm text-center mr-4">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-primary underline"
              >
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default page;
