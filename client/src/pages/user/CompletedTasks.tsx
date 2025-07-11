import { useEffect, useState } from "react";
import axios from "axios";

interface Task {
  id: string;
  title: string;
  status: string;
  projectName?: string;
}

const CompletedTasks = () => {
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch completed tasks only
  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}api/user/getTasks`, {
          withCredentials: true,
        });

        const allTasks: Task[] = res.data.tasks;
        const completed = allTasks.filter((task) => task.status === "COMPLETED");
        setCompletedTasks(completed);
      } catch (err) {
        console.error("Error fetching tasks", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedTasks();
  }, []);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (completedTasks.length === 0) return <div className="text-center p-4">No Completed Tasks</div>;

  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <p className="text-[#0d151b] tracking-light text-[32px] font-bold leading-tight min-w-72">
            Completed Tasks
          </p>
        </div>

        <div className="px-4 py-3 @container">
          <div className="flex overflow-hidden rounded-xl border border-[#cfdce7] bg-slate-50">
            <table className="flex-1">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-4 py-3 text-left text-[#0d151b] w-[400px] text-sm font-medium">Task</th>
                  <th className="px-4 py-3 text-left text-[#0d151b] w-[400px] text-sm font-medium">Project</th>
                  <th className="px-4 py-3 text-left text-[#0d151b] w-60 text-sm font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {completedTasks.map((task) => (
                  <tr key={task.id} className="border-t border-[#cfdce7]">
                    <td className="h-[72px] px-4 py-2 w-[400px] text-[#0d151b] text-sm font-normal">{task.title}</td>
                    <td className="h-[72px] px-4 py-2 w-[400px] text-[#4c759a] text-sm font-normal">
                      {task.projectName || "N/A"}
                    </td>
                    <td className="h-[72px] px-4 py-2 w-60 text-sm font-normal">
                      {task.status === "COMPLETED" ? "Completed" : "In Progress"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Responsive hiding rules */}
          <style>
            {`
              @container(max-width:120px){.table-column-120{display: none;}}
              @container(max-width:240px){.table-column-240{display: none;}}
              @container(max-width:360px){.table-column-360{display: none;}}
              @container(max-width:480px){.table-column-480{display: none;}}
            `}
          </style>
        </div>
      </div>
    </div>
  );
};

export default CompletedTasks;
