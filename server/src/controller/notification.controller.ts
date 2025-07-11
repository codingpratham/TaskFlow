import { Response } from "express";
import { AuthRequest } from "../middleware/protectedRouter";
import prisma from "../config/prisma";

export const getNotifications = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }
    try {
        const notifications = await prisma.notification.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        if (notifications.length === 0) {
            return res.status(404).json({ message: "No notifications found for this user" });
        }

        const formattedNotifications = notifications.map((notification) => ({
            id: notification.id,
            message: notification.message,
            read: notification.read,
            createdAt: notification.createdAt,
        }));

        return res.status(200).json({ notifications: formattedNotifications });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return res.status(500).json({ message: "Internal server error" });
        
    }
}

export const markAsRead = async (req: AuthRequest, res: Response) => {
    const { notificationId } = req.params;
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }
    try {
        const notification = await prisma.notification.update({
            where: {
                id: notificationId,
                userId: userId,
            },
            data: {
                read: true,
            },
        });

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        return res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return res.status(500).json({ message: "Internal server error" });
        
    }
}