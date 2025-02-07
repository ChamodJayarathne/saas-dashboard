"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const res = await fetch("/api/Users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData }),
    
      });

      const data = await res.json();

      if (!res.ok) {
      
        setErrorMessage(response.message);
      }

      router.refresh();
      router.push("/");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
       
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-center text-black mb-6">Create New User</h1>
          
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-1 text-black ">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              onChange={handleChange}
              required
              value={formData.name}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1  text-black">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              onChange={handleChange}
              required
              value={formData.email}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="mb-1 text-black">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              onChange={handleChange}
              required
              value={formData.password}
              className="p-2 border rounded focus:outline-none  focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="mt-4 bg-blue-500 text-balck p-2 font-semibold rounded hover:bg-blue-600 transition-colors"
          >
            Create User
          </button>
        </form>
         
          {errorMessage && (
            <p className="mt-4 text-red-500 text-center">{errorMessage}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Register;
