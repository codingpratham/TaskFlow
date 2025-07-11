import { useNavigate } from "react-router-dom";

import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";



type Role = "USER" | "TEAM_ADMIN";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  role: Role;
}

const RegisterPage = () => {
  const navigate = useNavigate();
  

  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res=await axios.post("http://localhost:5000/api/auth/register", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Registration successful"); 
      switch (form.role) {
        case "USER":
          toast.success("Registration successful and redirecting to user dashboard");
          navigate("/user-dashboard");
          break;
        case "TEAM_ADMIN":
          toast.success("Registration successful and redirecting to team dashboard");
          navigate("/team-dashboard");
          break;
        default:
          navigate("/dashboard");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div
      className="flex min-h-screen flex-col bg-neutral-50 overflow-x-hidden"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      <div className="flex grow flex-col">

        {/* Center the form */}
        <div className="flex flex-1 items-center justify-center px-4 py-8">
          <div className="w-full max-w-[512px] bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-[#141414] text-[28px] font-bold leading-tight text-center pb-6">
              Create your account
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Full Name Field */}
              <div className="mb-4">
                <label className="block text-[#141414] text-base font-medium mb-2">
                  Full name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full h-14 rounded-xl bg-[#ededed] text-[#141414] placeholder:text-neutral-500 p-4 text-base font-normal focus:outline-0"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="mb-4">
                <label className="block text-[#141414] text-base font-medium mb-2">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full h-14 rounded-xl bg-[#ededed] text-[#141414] placeholder:text-neutral-500 p-4 text-base font-normal focus:outline-0"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="mb-4">
                <label className="block text-[#141414] text-base font-medium mb-2">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full h-14 rounded-xl bg-[#ededed] text-[#141414] placeholder:text-neutral-500 p-4 text-base font-normal focus:outline-0"
                  required
                />
              </div>

              {/* Role Dropdown */}
              <div className="mb-6">
                <label className="block text-[#141414] text-base font-medium mb-2">
                  Role
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full h-14 rounded-xl bg-[#ededed] text-[#141414] p-4 text-base font-normal focus:outline-0"
                >
                  <option value="USER">USER</option>
                  <option value="TEAM_ADMIN">TEAM_ADMIN</option>
                </select>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                className="w-full h-10 rounded-full bg-black text-neutral-50 text-sm font-bold mb-4"
              >
                Register
              </button>
            </form>

            {/* Login Link */}
            <p className="text-neutral-500 text-sm text-center underline">
              Already have an account?{" "}
              <a href="/login" className="text-black font-medium">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
