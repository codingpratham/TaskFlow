import { useEffect, useState } from "react";
import axios from "../../utils/axios";

interface Task {
  id: string;
  title: string;
  description?: string;
  projectName: string;
  dueDate?: string;
  status: string;
}

const MyTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user/getTasks", {
          withCredentials: true,
        });

        console.log("Fetched tasks:", response.data);
        if (response.data.tasks) {
          setTasks(response.data.tasks);
        } else {
          setTasks([]);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Update task status
  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/task/status/${taskId}`,
        { status: newStatus },
        { withCredentials: true }
      );

      console.log("Task status updated:", response.data);

      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <p className="text-[#0d151b] tracking-light text-[32px] font-bold leading-tight min-w-72">
            My Tasks
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
                {loading ? (
                  <tr>
                    <td colSpan={3} className="text-center p-4">Loading...</td>
                  </tr>
                ) : tasks.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center p-4">No tasks found</td>
                  </tr>
                ) : (
                  tasks.map((task) => (
                    <tr key={task.id} className="border-t border-[#cfdce7]">
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#0d151b] text-sm font-normal">{task.title}</td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#4c759a] text-sm font-normal">
                        {task.projectName || "N/A"}
                      </td>
                      <td className="h-[72px] px-4 py-2 w-60 text-sm font-normal">
                        <select
                          value={task.status}
                          onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                          className="w-full h-8 rounded-full bg-[#e7eef3] px-3 text-[#0d151b] text-sm font-medium"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Optional responsive column hiding */}
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

export default MyTasks;
