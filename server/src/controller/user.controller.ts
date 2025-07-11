import { Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../middleware/protectedRouter";

export const noTeam = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: User ID missing" });
  }

  try {
    const teams =  await prisma.teamMembers.findMany({
        where : {
            userId: userId,
        },
        include: {
            team:true
        }
    })

    return res.status(200).json({ teams });
  } catch (error) {
    console.error("Error fetching teams with no membership:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  console.log("👉 Logged in user ID:", userId);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: User ID missing" });
  }

  try {
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { assignedTo: userId },
          { createdBy: userId }
        ]
      },
      include: {
        team: {
          select: {
            name: true
          }
        },
        creator: {
            select: {
                name: true
            }
        },
        assignee: {
            select: {
                name: true
            }
        },
        project: {
          select: {
            name: true
          }
        }
      }
    });

    if (tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found for this user" });
    }

    const formattedTasks = tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      createdBy: task.creator?.name,
      teamName: task.team?.name || "No Team",
      projectName: task.project?.name || "No Project",
      status: task.status,
    }));

    return res.status(200).json({ status: true, tasks: formattedTasks });

  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



export const getUser=async(req:AuthRequest, res:Response)=>{
    try {
        const user = await prisma.user.findMany({
            where: {
                role:"USER"
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Internal server error" });
        
    }
}
