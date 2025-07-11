/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Team {
  id: string;
  name: string;
  memberCount: number;
  projectCount: number;
}

const TeamList = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");

  const fetchTeams = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/team/get", {
        withCredentials: true,
      });
      setTeams(res.data.teams || []);
    } catch (err) {
      console.error("Error fetching teams:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleCreate = async () => {
    if (!newTeamName.trim()) {
      alert("Team name is required");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/team/create",
        { name: newTeamName },
        { withCredentials: true }
      );
      setNewTeamName("");
      setAdding(false);
      await fetchTeams();
      alert("Team created successfully!");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Error creating team");
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Loading teams...</p>;
  }

  return (
    <div className="px-40 py-5 flex justify-center">
      <div className="flex flex-col max-w-[960px] w-full">
        <div className="flex justify-between p-4">
          <p className="text-2xl font-bold text-[#141414]">Teams</p>
          <button
            onClick={() => setAdding(true)}
            className="bg-[#ededed] text-sm rounded-full px-4 h-8"
          >
            New Team
          </button>
        </div>

        <div className="px-4 py-3">
          <div className="rounded-xl border border-[#dbdbdb] overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="text-left px-4 py-3 w-[400px]">Team</th>
                  <th className="text-left px-4 py-3 w-[400px]">Members</th>
                  <th className="text-left px-4 py-3 w-[400px]">Projects</th>
                  {adding && (
                    <th className="text-left px-4 py-3 w-[120px]">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {adding && (
                  <tr className="bg-white border-t border-[#dbdbdb]">
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                        placeholder="Team name"
                        className="w-full border p-2 rounded"
                      />
                    </td>
                    <td className="px-4 py-2 text-gray-500 text-sm">-</td>
                    <td className="px-4 py-2 text-gray-500 text-sm">-</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={handleCreate}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setAdding(false);
                          setNewTeamName("");
                        }}
                        className="bg-gray-300 px-3 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                )}

                {teams.map((team) => (
                  <tr key={team.id} className="border-t border-[#dbdbdb]">
                    <td className="px-4 py-2 text-sm text-[#141414]">
                      {team.name}
                    </td>
                    <td className="px-4 py-2 text-sm text-neutral-500">
                      {team.memberCount}
                    </td>
                    <td className="px-4 py-2 text-sm text-neutral-500">
                      {team.projectCount}
                    </td>
                    {adding && <td className="px-4 py-2" />}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamList;
