/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useEffect, useState } from "react";

// Optional: Define user/team types
type User = {
  id: string;
  email: string;
};

type Team = {
  id: string;
  name: string;
};

const InviteUser = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamId, setTeamId] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/get", {
          withCredentials: true,
        });
        console.log("Fetched users:", res.data);
        setUsers(res.data.user || []);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      }
    };

    const fetchTeams = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/team/get", {
          withCredentials: true,
        });
        console.log("Fetched teams:", res.data);
        setTeams(res.data.teams || []);
      } catch (error) {
        console.error("Error fetching teams:", error);
        setTeams([]);
      }
    };

    getUsers();
    fetchTeams();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !teamId) {
      alert("Please select a user and a team");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/team/invite",
        { email, teamId },
        { withCredentials: true }
      );

      console.log("User invited:", res.data);
      alert("✅ User Invited Successfully!");
      setEmail("");
      setTeamId("");
    } catch (error: any) {
      console.error("Error inviting user:", error);
      if (error.response) {
        alert(`❌ ${error.response.data.message || "Failed to invite user"}`);
      } else {
        alert("❌ Network or server error");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">📨 Invite User to Team</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Select User</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          >
            <option value="">-- Select User --</option>
            {users.map((user) => (
              <option key={user.id} value={user.email}>
                {user.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Select Team</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            required
          >
            <option value="">-- Select Team --</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          >
            Invite
          </button>
        </div>
      </form>
    </div>
  );
};

export default InviteUser;
