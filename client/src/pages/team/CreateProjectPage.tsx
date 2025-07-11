/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Project {
  id: string;
  name: string;
  status: string;
  team: { name: string };
}

interface Team {
  id: string;
  name: string;
}

const CreateProjectPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [teamId, setTeamId] = useState("");

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

  useEffect(() => {
    fetchProjects();
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}api/team/get`, { withCredentials: true })
      .then((res) => setTeams(res.data.teams || []))
      .catch((err) => console.error("Error fetching teams", err));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !teamId) return alert("Fill all fields!");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}api/team/projects`,
        { name, description, teamId },
        { withCredentials: true }
      );
      alert("✅ Project created!");
      setName("");
      setDescription("");
      setTeamId("");
      setShowForm(false);
      fetchProjects(); // refresh list
    } catch (err: any) {
      console.error("❌", err);
      alert(err?.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="px-40 flex justify-center py-5">
      <div className="flex flex-col max-w-[960px] w-full">
        {/* Header */}
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <p className="text-[#141414] text-[32px] font-bold leading-tight min-w-72">
            Projects
          </p>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex min-w-[84px] items-center justify-center rounded-full h-8 px-4 bg-[#ededed] text-[#141414] text-sm font-medium"
          >
            <span>New Project</span>
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <form
            onSubmit={handleCreate}
            className="space-y-4 bg-white p-4 rounded-xl border border-gray-300 mb-6"
          >
            <input
              type="text"
              placeholder="Project Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
            <select
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="">-- Select a Team --</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-lg"
            >
              Create Project
            </button>
          </form>
        )}

        {/* Table */}
        <div className="px-4 py-3">
          <div className="overflow-hidden rounded-xl border border-[#dbdbdb] bg-neutral-50">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="px-4 py-3 text-left text-[#141414] w-[400px] text-sm font-medium">
                    Project
                  </th>
                  <th className="px-4 py-3 text-left text-[#141414] w-[400px] text-sm font-medium">
                    Team
                  </th>
                  <th className="px-4 py-3 text-left text-[#141414] w-60 text-sm font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <tr key={project.id} className="border-t border-[#dbdbdb]">
                      <td className="px-4 py-2 text-[#141414] text-sm">
                        {project.name}
                      </td>
                      <td className="px-4 py-2 text-neutral-500 text-sm">
                        {project.team?.name || "N/A"}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <button className="w-full rounded-full h-8 bg-[#ededed] text-[#141414] text-sm font-medium">
                          <span className="truncate">{project.status || "Pending"}</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-4 py-4 text-gray-500 text-sm">
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

export default CreateProjectPage;
