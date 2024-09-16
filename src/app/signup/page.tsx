"use client";

import PasswordInput from "@/components/Input/PasswordInput";
import Navbar from "@/components/Navbar/Navbar";
import axiosInstance from "@/utils/axiosInstance";
import { validateEmail } from "@/utils/helper";
import Link from "next/link";
import router from "next/router";
import React, { useState } from "react";

function page() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: any) => {
    e.preventDefault();

    if (!name) {
      setError("Please enter a name.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a vaild email.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
    }

    setError("");

    // sign up API call
    try {
      // sends POST request to backend "/create-account"
      const response = await axiosInstance.post("/create-account", {
        // key: value
        // the key that backend expects: value from frontend
        fullName: name,
        email: email,
        password: password,
      });

      console.log("Response:", response);

      // handle successful registration response
      if (response.data) {
        setError(response.data.message);
        return;
      }

      if (response.data && response.data.accessToken) {
        // token stored in localStorage to be used in other parts of app
        localStorage.setItem("token", response.data.accessToken);
        // redirect to dashboard
        router.push("/");
      } else {
        setError("Failed to receive access token.");
      }
    } catch (error: any) {
      // handle login error
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Internal server error, try again.");
      }
    }
  };
  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleSignUp}>
            <h4 className="text-2xl mb-7">Sign Up</h4>

            <input
              type="text"
              placeholder="Name"
              className="w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none"
              // extracted value is stored
              value={name}
              // extracts the value the user enters
              onChange={(e) => setName(e.target.value)}
            />

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
              Sign up
            </button>

            <p className="text-sm text-center mr-4">
              Have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default page;
