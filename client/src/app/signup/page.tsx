"use client";

import Button from "src/components/Buttons/Button";
import PasswordInput from "../../components/Input/PasswordInput";
import Navbar from "../../components/Navbar/Navbar";
import axiosInstance from "../../utils/axiosInstance";
import { validateEmail } from "../../utils/helper";
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
      <Navbar sticky={false} background={false} />

      <div className="flex h-screen justify-between bg-[#83968b]">
        <div className="flex ml-[170px]">
          <div className="bg flex items-center justify-center">
            <div className="w-[400px] px-7 py-10">
              <form onSubmit={handleSignUp}>
                <div>
                  <h4 className="text-5xl mb-6 text-white">Sign Up</h4>

                  <p className="text-sm mr-4 text-gray-300">
                    Have an account already?{" "}
                    <Link
                      href="/login"
                      className="font-medium text-[#7650b3] underline"
                    >
                      Login
                    </Link>
                  </p>
                </div>

                <div className="mt-12">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full text-white text-sm bg-[#251410] px-5 py-3 rounded mb-4 outline-none hover:bg-[#f8e5df] transition-all ease-in-out duration-300"
                    // extracted value is stored
                    value={name}
                    // extracts the value the user enters
                    onChange={(e) => setName(e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="Your Email"
                    className="w-full text-white text-sm bg-[#251410] px-5 py-3 rounded mb-4 outline-none hover:bg-[#f8e5df] transition-all ease-in-out duration-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

                <div className="flex justify-end">
                  <Button>Register</Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="flex items-center w-1/2">
          <img
            className="w-full h-full object-cover"
            width={380}
            src="https://images.unsplash.com/photo-1705056132819-e26539cd0ca8?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="dune"
          />
        </div>
      </div>
    </>
  );
}

export default page;
