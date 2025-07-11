import axios from "axios";
import { Link, useNavigate } from "react-router-dom";


const NavBar = () => {

  const navigate = useNavigate();

  // Retrieve user from localStorage
  const user = (() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;
    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  })();

  const handleLogout = async () => {
    const res=await axios.post(`${import.meta.env.VITE_API_BASE_URL}api/auth/logout`);

    if (res.status === 200) {
      console.log("Logout successful");
    } else {
      console.error("Logout failed");
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between border-b border-[#ededed] px-10 py-3 bg-white">
      <div className="flex items-center gap-4 text-[#141414]">
        <div className="w-5 h-5">
          {/* SVG Logo */}
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z"
              fill="currentColor"
            />
            <path
              d="M24 44C31.732 44 38 37.732 38 30C38 22.268 31.732 16 24 16C16.268 16 10 22.268 10 30C10 37.732 16.268 44 24 44Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <h2 className="text-[#141414] text-lg font-bold tracking-tight">TaskFlow</h2>
      </div>

      <div className="flex gap-4 items-center">
        {user ? (
          <>
            {/* Role-based dashboard links */}
            {user.role === "USER" && (
              <>
              <Link to="/user-dashboard" className="text-sm font-medium text-[#141414] hover:underline">
                Dashboard
              </Link>
  

              <Link to="/user-tasks" className="text-sm font-medium text-[#141414] hover:underline">
                Tasks
              </Link>

              <Link to="/user-tasks/pending" className="text-sm font-medium text-[#141414] hover:underline">
                  Pending Tasks
              </Link>

              <Link to="/user-tasks/completed" className="text-sm font-medium text-[#141414] hover:underline">
                  Completed Tasks
              </Link>
                
              </>
            )}
            {user.role === "TEAM_ADMIN" && (
              <>
              <Link to="/team-dashboard" className="text-sm font-medium text-[#141414] hover:underline">
                Team Dashboard
              </Link>

              <Link to="/invite-user" className="text-sm font-medium text-[#141414] hover:underline">
                Invite User
              </Link>

              <Link to="/create-team" className="text-sm font-medium text-[#141414] hover:underline">
                Create Team
              </Link>

              <Link to="/create-project" className="text-sm font-medium text-[#141414] hover:underline">
                Create Project
              </Link>

              <Link to="/create-task" className="text-sm font-medium text-[#141414] hover:underline">
                Create Task
              </Link>

              <Link to="/notification" className="text-sm font-medium text-[#141414] hover:underline">
                Notification
              </Link>
              </>
            )}


            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="bg-[#ededed] text-[#141414] rounded-full px-4 py-2 text-sm font-bold"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-[#ededed] text-[#141414] rounded-full px-4 py-2 text-sm font-bold"
          >
            Log In
          </Link>
        )}
      </div>
    </header>
  );
};

export default NavBar;
