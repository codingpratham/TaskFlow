import React, { useEffect, useState } from "react";
import axios from "axios";

interface Task {
  id: string;
  title: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  dueDate: string;
  project: string;
}

const UserDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}api/user/getTasks`, {
          withCredentials: true,
        });
        console.log(response.data.tasks);

        setTasks(response.data.tasks || []);
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const total = tasks.length;
  const pending = tasks.filter((task) => task.status === "PENDING").length;
  const completed = tasks.filter((task) => task.status === "COMPLETED").length;

  return (
    <div className="px-16 py-10">
  <h2 className="text-3xl font-bold text-[#141414] mb-8">My Tasks</h2>

  {loading ? (
    <p className="text-gray-500 text-lg">Loading tasks...</p>
  ) : (
    <div className="flex flex-wrap gap-6">
      <div className="bg-[#f3f3f3] rounded-xl px-8 py-6 min-w-[200px]">
        <p className="text-base text-[#333]">Total Tasks</p>
        <p className="text-3xl font-bold mt-2">{total}</p>
      </div>
      <div className="bg-[#f3f3f3] rounded-xl px-8 py-6 min-w-[200px]">
        <p className="text-base text-[#333]">Pending Tasks</p>
        <p className="text-3xl font-bold mt-2">{pending}</p>
      </div>
      <div className="bg-[#f3f3f3] rounded-xl px-8 py-6 min-w-[200px]">
        <p className="text-base text-[#333]">Completed Tasks</p>
        <p className="text-3xl font-bold mt-2">{completed}</p>
      </div>
    </div>
  )}
</div>

  );
};

export default UserDashboard;
