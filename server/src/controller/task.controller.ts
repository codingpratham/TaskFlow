import { Response } from "express";
import { AuthRequest } from "../middleware/protectedRouter";
import prisma from "../config/prisma";

export const createTask = async (req: AuthRequest, res: Response) => {
  const { title, description, assignedTo, teamId, projectId } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!title || !description || !assignedTo || !teamId || !projectId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) return res.status(404).json({ message: "Team not found" });

    const user = await prisma.user.findUnique({ where: { id: assignedTo } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const task = await prisma.task.create({
      data: {
        title,
        description,
        assignedTo,
        createdBy: userId,
        teamId,
        projectId,
      },
    });

    return res.status(201).json({ message: "Task created", task });
  } catch (error) {
    console.error("❌ Task creation error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateTask = async (req:AuthRequest, res : Response)=>{
    const { taskId } = req.params;
    const status = req.body.status;
    const userId = req.user?.userId;

    try {
        const task = await prisma.task.findUnique({

            where: {
                id: taskId
            }
        })
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        if (task.assignedTo !== userId) {
            return res.status(403).json({ message: "You are not authorized to update this task" });
        }
        const updatedTask = await prisma.task.update({
            where: {
                id: taskId
            },
            data: {
                status
            }
        })

        await prisma.notification.create({
  data: {
    userId: task.assignedTo,
    type: "TEAM_UPDATE",
    message: `Status updated for task: ${task.title}`,
  },
});

        res.status(200).json({ message: "Task updated successfully", updatedTask });
    } catch (error) {
        console.error("Error updating task:", error);
        return res.status(500).json({ message: "Internal server error" });
        
    }
}

export const getAllFormattedTasks = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;

  try {
    const tasks = await prisma.task.findMany({
      where: {
        createdBy: userId, // or assignedTo: userId
      },
      include: {
        project: { select: { name: true } },
        assignee: { select: { name: true } },
      },
    });

    const formatted = tasks.map((task) => ({
      title: task.title,
      project: task.project.name,
      assignee: task.assignee.name,
      
      status: task.status,
    }));

    return res.status(200).json({ tasks: formatted });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


