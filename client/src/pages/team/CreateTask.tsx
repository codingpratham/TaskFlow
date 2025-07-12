
import { useEffect, useState } from "react";
import axios from "axios";

// ------------------ Types ------------------
interface User {
  id: string;
  name: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
}

interface Team {
  id: string;
  name: string;
  members?: { user: User }[];
  projects?: Project[];
}

interface Task {
  title: string;
  project: string;
  assignee: string;
  dueDate: string;
  status: string;
}

const TaskPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [teamId, setTeamId] = useState("");
  const [assignee, setAssignee] = useState("");
  const [projectId, setProjectId] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Load teams
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}api/team/get`, { withCredentials: true })
      .then((res) => {
        const teamList: Team[] = res.data.teams || [];
        setTeams(teamList);

        const selectedTeam = teamList.find((team) => team.id === teamId);
        if (selectedTeam) {
          const memberUsers = selectedTeam.members?.map((m) => m.user) || [];
          const projectList = selectedTeam.projects || [];
          setUsers(memberUsers);
          setProjects(projectList);
        } else {
          setUsers([]);
          setProjects([]);
        }
      })
      .catch((err) => console.error("Error fetching teams:", err));
  }, [teamId]);

  // Load tasks
  const fetchTasks = () => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}api/task/get`, { withCredentials: true })
      .then((res) => setTasks(res.data.tasks))
      .catch((err) => console.error("Error fetching tasks:", err));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !teamId || !assignee || !projectId) {
      return alert("Fill all fields");
    }

    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}api/task/create`,
        { title, description, teamId, projectId, assignedTo: assignee },
        { withCredentials: true }
      );
      alert("Task created");
      setTitle("");
      setDescription("");
      setTeamId("");
      setAssignee("");
      setProjectId("");
      setUsers([]);
      setProjects([]);
      setShowModal(false);
      fetchTasks(); // 🔄 Refresh task list
    } catch (err) {
      console.error("Task create error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 md:px-40 py-6">
      <div className="flex flex-col max-w-[960px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-[#141414] text-3xl font-bold">Tasks</p>
          <button
            className="rounded-full bg-[#ededed] h-8 px-4 text-sm font-medium text-[#141414]"
            onClick={() => setShowModal(true)}
          >
            New Task
          </button>
        </div>

        {/* Task Table */}
        <div className="overflow-x-auto mb-10">
          <div className="overflow-hidden rounded-xl border border-[#dbdbdb] bg-neutral-50">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50 text-sm font-medium text-[#141414]">
                  <th className="px-4 py-3 text-left w-[300px]">Task</th>
                  <th className="px-4 py-3 text-left w-[300px]">Project</th>
                  <th className="px-4 py-3 text-left w-[200px]">Assignee</th>
                  <th className="px-4 py-3 text-left w-40">Status</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, idx) => (
                  <tr key={idx} className="border-t border-[#dbdbdb] text-sm">
                    <td className="px-4 py-2">{task.title}</td>
                    <td className="px-4 py-2 text-neutral-500">{task.project}</td>
                    <td className="px-4 py-2 text-neutral-500">{task.assignee}</td>

                    <td className="px-4 py-2">
                      <span
                        className={`rounded-full px-4 py-1 text-sm font-medium`}
                      >
                        {task.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-xl relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-4 text-xl font-bold text-gray-400 hover:text-gray-600"
              >
                ×
              </button>

              <h2 className="text-xl font-bold mb-4">📝 Create Task</h2>
              <form onSubmit={handleCreateTask}>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Select Team</label>
                  <select
                    value={teamId}
                    onChange={(e) => setTeamId(e.target.value)}
                    className="w-full p-3 bg-gray-200 rounded-lg"
                  >
                    <option value="">-- Select a team --</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium">Select Project</label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full p-3 bg-gray-200 rounded-lg"
                    disabled={!projects.length}
                  >
                    <option value="">-- Select project --</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium">Assign To</label>
                  <select
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    className="w-full p-3 bg-gray-200 rounded-lg"
                    disabled={!users.length}
                  >
                    <option value="">-- Select member --</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium">Task Name</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 bg-gray-200 rounded-lg"
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 bg-gray-200 rounded-lg min-h-[100px]"
                  />
                </div>

                <div className="text-right">
                  <button
                    type="submit"
                    className="bg-black text-white py-2 px-6 rounded-full"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Task"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskPage;
