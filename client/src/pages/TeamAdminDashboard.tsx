/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TeamAdminDashboard = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [pendingTasks, setPendingTasks] = useState<any[]>([]);
  const [completedTasks, setCompletedTasks] = useState<any[]>([]);
  const [usersCount, setUsersCount] = useState<number>(0);
  const navigate = useNavigate();

  const actionRoutes: { [key: string]: string } = {
    "Invite User": "/invite-user",
    "Create Team": "/create-team",
    "Create Project": "/create-project",
    "Create Task": "/create-task",
  };

  const fetchTeams = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}api/team/get`, {
        withCredentials: true,
      });
      setUsersCount(res.data.usersCount || 0);
    } catch (err) {
      console.error("Error fetching teams:", err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}api/team/projects`, {
        withCredentials: true,
      });
      setProjects(res.data.projects || []);
    } catch (err) {
      console.error("❌ Error fetching projects", err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}api/task/get`, {
        withCredentials: true,
      });

      setPendingTasks(res.data.pendingTasks || []);
      setCompletedTasks(res.data.completedTasks || []);
    } catch (err) {
      console.error("❌ Error fetching tasks", err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchTeams();
    fetchTasks();
  }, []);

  // ✅ FIXED FILTERING (trim + case-safe)
  const CompleteFiltering = completedTasks.filter(
    (task) => task.status?.trim().toUpperCase() === "COMPLETED"
  ).length;

  const PendingFiltering = pendingTasks.filter(
    (task) => task.status?.trim().toUpperCase() === "PENDING"
  ).length;

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex items-start justify-center py-10 px-5">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-md border border-[#d4dce2] overflow-hidden">
        <div className="px-10 py-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#101518]">Team Dashboard</h1>
              <p className="text-sm text-[#5c748a] mt-1">
                Overview of team performance and project timelines.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <h2 className="text-xl font-bold text-[#101518] mt-8 mb-3">Quick Actions</h2>
          <div className="flex flex-wrap gap-3 mb-6">
            {Object.keys(actionRoutes).map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(actionRoutes[action])}
                className={`${
                  index % 2 === 0 ? "bg-[#dce8f3]" : "bg-[#eaedf1]"
                } text-sm font-bold text-[#101518] px-4 py-2 rounded-xl`}
              >
                {action}
              </button>
            ))}
          </div>

          {/* Team Performance */}
          <h2 className="text-xl font-bold text-[#101518] mt-8 mb-3">Team Performance</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { title: "Active Projects", value: projects.length },
              { title: "Completed Tasks", value: CompleteFiltering },
              { title: "Pending Tasks", value: PendingFiltering },
              { title: "Team Members", value: usersCount },
            ].map((item, index) => (
              <div
                key={index}
                className="p-4 border border-[#d4dce2] rounded-xl flex flex-col gap-1"
              >
                <p className="text-base text-[#101518]">{item.title}</p>
                <p className="text-2xl font-bold text-[#101518]">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Active Projects Table */}
          <h2 className="text-xl font-bold text-[#101518] mt-8 mb-3">Active Projects</h2>
          <div className="overflow-x-auto rounded-xl border border-[#d4dce2] bg-gray-50 mb-6">
            <table className="w-full min-w-[600px] text-sm text-left">
              <thead className="bg-gray-50 text-[#101518] font-medium">
                <tr>
                  <th className="px-4 py-3 w-1/3">Project Name</th>
                  <th className="px-4 py-3 w-1/4">Team</th>
                  <th className="px-4 py-3 w-1/4">Status</th>
                </tr>
              </thead>
              <tbody className="text-[#101518] font-normal">
                {projects.length > 0 ? (
                  projects.map((project: any) => (
                    <tr key={project.id} className="border-t border-[#dbdbdb]">
                      <td className="px-4 py-2">{project.name}</td>
                      <td className="px-4 py-2">{project.team?.name || "N/A"}</td>
                      <td className="px-4 py-2">
                        <span className="inline-block bg-[#eaedf1] rounded-xl px-3 py-1 text-sm">
                          {project.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-4 py-4 text-center text-gray-500">
                      No projects found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamAdminDashboard;
