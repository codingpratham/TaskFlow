import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";



const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
     const res=await axios.post("http://localhost:5000/api/auth/login", form);
      toast.success("Login successful");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;

      if(user?.role === "USER") {
        navigate("/user-dashboard");
      }
      if(user?.role === "TEAM_ADMIN") {
        navigate("/team-dashboard");
      }  
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-neutral-50"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[#ededed] px-10 py-3">
        <div className="flex items-center gap-4 text-[#141414]">
          <div className="w-5 h-5">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor" />
            </svg>
          </div>
          <h2 className="text-lg font-bold tracking-tight">TaskFlow</h2>
        </div>
      </header>

      {/* Centered Login Form */}
      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[512px] bg-white rounded-xl p-6 shadow-md"
        >
          <h2 className="text-[#141414] text-[28px] font-bold text-center mb-6">
            Welcome back
          </h2>

          {/* Username */}
          <div className="mb-4">
            <label className="block text-base font-medium text-[#141414] mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your Email"
              value={form.email}
              onChange={handleChange}
              className="w-full h-14 rounded-lg border border-[#dbdbdb] bg-neutral-50 p-4 text-base text-[#141414] placeholder:text-neutral-500 focus:outline-none focus:border-black"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-base font-medium text-[#141414] mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="w-full h-14 rounded-lg border border-[#dbdbdb] bg-neutral-50 p-4 text-base text-[#141414] placeholder:text-neutral-500 focus:outline-none focus:border-black"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full h-10 rounded-lg bg-black text-white font-bold text-sm tracking-wide mb-4"
          >
            Login
          </button>

          {/* Link */}
          <p className="text-center text-sm text-neutral-500 underline">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-black font-medium">
              Sign up
            </a>
          </p>
        </form>
      </main>
    </div>
  );
};

export default LoginPage;
