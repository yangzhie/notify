import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";
import React from "react";

function page() {
  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form>
            <h4 className="text-2xl mb-7">Login</h4>

            <input
              type="text"
              placeholder="Email"
              className="w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none"
            />

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
