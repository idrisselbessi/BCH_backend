import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Signup (Register)
export const signup = async (req, res) => {
    try {
        const { email, password, tel, societe, nom, prenom, role } = req.body;

        console.log(email, password, tel, societe, nom, prenom, role);

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            email,
            password: hashedPassword,
            tel,
            societe,
            nom,
            prenom,
            role
        });

        await newUser.save();

          // Generate JWT token
          const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" } // Token expires in 7 days
        );
        res.status(201).json({ message: "success" , 
                                token,
                                user:{
                                    email: newUser.email,
                                    role:newUser.role
                                } });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Signin (Login)
export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" } // Token expires in 7 d
        );

        res.status(200).json({
            message: "success",
            token,
            user: {
               
                email: user.email,
                role: user.role,
                
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


// Signout (Logout)
export const signout = async (req, res) => {
    try {
        res.status(200).json({ message: "User signed out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get all users
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}, "email role"); // Sélectionner uniquement email et rôle
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
// Update user role
export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const { id } = req.params;

        // Vérifier si l'utilisateur existe
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Vérifier si le rôle est valide
        if (!["admin", "user", "moderator"].includes(role)) {
            return res.status(400).json({ message: "Rôle invalide" });
        }

        // Mettre à jour le rôle
        user.role = role;
        await user.save();

        res.status(200).json({ message: "Rôle mis à jour avec succès", user });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};
