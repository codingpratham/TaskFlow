import { NextFunction, Response } from "express";
import { AuthRequest } from "./protectedRouter";

export const allowUser = (req:AuthRequest, res:Response, next:NextFunction) => {
   if(req.user?.role === "TEAM_ADMIN") {
         return res.status(403).json({ message: "Forbidden: User role not allowed" });
   }
   
   next();
};
