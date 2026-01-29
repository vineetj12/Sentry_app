import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma.js";
import type { Request, Response } from "express";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "123123";

router.post("/signup", async (req: Request, res: Response) => {
    try {
        const {
            name,
            age,
            emailAddress,
            phoneNumber,
            nationality,
            adhaarNumber,
            contactName,
            contactemail,
            relationship,
            password,
            destination,
        } = req.body;

        if (!emailAddress || !password)
            return res.status(400).json({ message: "Email and password are required" });

        const existingUser = await prisma.user.findUnique({ where: { emailAddress } });
        if (existingUser)
            return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name: name || "",
                age: age || 0,
                emailAddress,
                phoneNumber: phoneNumber || "",
                nationality: nationality || "",
                adhaarNumber: adhaarNumber || "",
                contactName: contactName || "",
                contactemail: contactemail || "",
                relationship: relationship || "",
                password: hashedPassword,
                destination: destination || "",
            },
        });

        const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({
            message: "Signup successful",
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.emailAddress,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/signin", async (req: Request, res: Response) => {
    try {
        const { emailAddress, password } = req.body;

        if (!emailAddress || !password)
            return res.status(400).json({ message: "Email and password are required" });

        const user = await prisma.user.findUnique({ where: { emailAddress } });
        if (!user)
            return res.status(404).json({ message: "User not found" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid)
            return res.status(401).json({ message: "Invalid password" });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "6h" });
        res.status(200).json({
            message: "Signin successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.emailAddress,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
