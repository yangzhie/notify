"use client";

import PasswordInput from "../../components/Input/PasswordInput";
import Navbar from "../../components/Navbar/Navbar";
import Link from "next/link";
import React, { useState } from "react";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { useRouter } from "next/navigation";
import dune from "../../public/dune.jpg";
import Image from "next/image";
import Button from "src/components/Buttons/Button";

function page() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
    try {
      // sends POST request to backend "/login"
      const response = await axiosInstance.post("/login", {
        // key: value
        // the key that backend expects: value from frontend
        email: email,
        password: password,
      });

      // handle successful login
      // backend returns accessToken in response.data
      if (response.data && response.data.accessToken) {
        // token stored in localStorage to be used in other parts of app
        localStorage.setItem("token", response.data.accessToken);
        // redirect to dashboard
        router.push("/");
      }
    } catch (error: any | unknown) {
      // handle login error
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Unexpected error, try again.");
      }
    }
  };
  return (
    <>
      <Navbar sticky={false} background={false} />

      <div className="flex h-screen justify-between bg-[#160906]">
        <div className="flex items-center w-1/2">
          <img
            className="w-full h-full object-cover"
            width={380}
            src="https://images.unsplash.com/photo-1580639613257-5b1a20fe3760?q=80&w=1980&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="dune"
          />
        </div>

        <div className="flex mr-[170px]">
          <div className="bg flex items-center justify-center">
            <div className="w-[400px] px-7 py-10">
              <form onSubmit={handleLogin}>
                <div>
                  <h4 className="text-5xl mb-6 text-white">Sign in</h4>

                  <p className="text-sm mr-4 text-gray-300">
                    Don't have an account?{" "}
                    <Link
                      href="/signup"
                      className="font-medium text-[#7650b3] underline"
                    >
                      Create an account
                    </Link>
                  </p>
                </div>

                <div className="mt-12">
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
                  <Button>Login</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default page;
