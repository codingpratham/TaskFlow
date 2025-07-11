import { Response } from "express";
import prisma from "../config/prisma";

import { AuthRequest } from "../middleware/protectedRouter";


export const createTeam = async (req : AuthRequest, res:Response) => {
    try {
        const user = req.user;
        const {name} = req.body

        if(!user || !user.userId ) {
            return res.status(401).json({message: "Unauthorized"})
        }

        if( user.role !=="TEAM_ADMIN"){
            return res.status(403).json({ message: "Only TEAM_ADMINs can create a team" })
        }
        
        const team = await prisma.team.create({
            data:{
                name,
                createdBy: user.userId,
                members : {
                    create: {
                        userId: user.userId,
                        isAdmin: true

                    }
                }
            }
        })

        res.status(201).json({ message: "Team created successfully", team });

    } catch (error) {
        console.error("Error creating team:", error);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getTeam = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;

  try {
    const teams = await prisma.team.findMany({
      where: {
        members: {
          some: {
            userId,
            isAdmin: true,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            description: true,
            createdBy: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            members: true,
            project: true,
          },
        },
      },
    });

    if (!teams || teams.length === 0) {
      return res.status(404).json({ message: "No teams found for this user" });
    }

    // Format and flatten projects and counts for frontend
    const formattedTeams = teams.map((team) => ({
      id: team.id,
      name: team.name,
      members: team.members,
      projects: team.project.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        createdBy: p.createdBy,
        createdAt: p.createdAt,
      })),
      memberCount: team._count.members,
      projectCount: team._count.project,
    }));

    return res.status(200).json({ teams: formattedTeams });
  } catch (error) {
    console.error("Error fetching teams:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getTeamMembers = async (req: AuthRequest, res: Response) => {
  const teamId = req.params.teamId;

  try {
    const members = await prisma.teamMembers.findMany({
      where: {
        teamId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });


    const users = members.map((member) => member.user);

    return res.status(200).json({
      members: users,
    });
  } catch (error) {
    console.error("Error fetching team members:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const inviteToTeam = async (req : AuthRequest, res:Response) => {
    const {teamId, email} = req.body;
    const CurrentUserId = req.user?.userId;

    try {
        const adminEntry = await prisma.teamMembers.findFirst({
            where:{
                teamId,
                userId: CurrentUserId,
                isAdmin: true
            }
        })
        if(!adminEntry){
            return res.status(403).json({ message: "Only team admins can invite members" })
        }

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if(!user){
            return res.status(404).json({ message: "User not found" })
        }

        const teamMember = await prisma.teamMembers.create({
            data: {
                teamId,
                userId: user.id,
                isAdmin: false
            }
        })

        const team = await prisma.team.findUnique({
            where: {
                id: teamId
            }
        })

        await prisma.notification.create({
  data: {
    userId: user.id,
    type: "TEAM_INVITE",
    message: `You have been invited to join team: ${team?.name}`,
  },
});
    
        
        res.status(200).json({ message: "User invited to team successfully", teamMember });
        
    } catch (error) {
        console.error("Error inviting to team:", error);
        res.status(500).json({ message: "Internal server error" })
        
    }

}


export const createProject = async (req: AuthRequest, res: Response) => {
  const { teamId, name, description } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!teamId || !name || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const isAdmin = team.members.find(
      (member) => member.userId === userId && member.isAdmin
    );

    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "Only Team Admins can create projects" });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        createdBy: userId,
        team: {
          connect: { id: teamId },
        },
      },
    });

    return res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllProjects = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const projects =  await prisma.project.findMany({
      where: {
        team: {
          members: {
            some: {
              userId: userId,
              isAdmin: true
            }
          }
        }
      },
      include: {
        team: {
          select: {
            name: true,
            id: true
          }
        }
      }
    })

    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: "No projects found for this user" });
    }
    return res.status(200).json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({ message: "Internal server error" });
    
  }
}

