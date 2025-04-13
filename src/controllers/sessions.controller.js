import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/User.dto.js';
import { logger } from "../utils/utils.js";
import { now } from "mongoose";

const register = async (req, res) => {

    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password){
        logger.debug("Valores incompletos")
        return res.status(400).send({ status: "error", error: "Incomplete values" });
    } 

    try {
        const exists = await usersService.getUserByEmail(email);
        if (exists) return res.status(400).send({ status: "error", error: "User already exists" });
        const hashedPassword = await createHash(password);
        const user = {
            first_name,
            last_name,
            email,
            password: hashedPassword
        }
        let result = await usersService.create(user);
        console.log(result);
        res.send({ status: "success", payload: result._id });
    } catch (error) {
        logger.error(error)
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle:`${error.message}`
            }
        )
        
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" });

    try {
        const user = await usersService.getUserByEmail(email);
        if (!user) return res.status(404).send({ status: "error", error: "User doesn't exist" });
        const isValidPassword = await passwordValidation(user, password);
        if (!isValidPassword) return res.status(400).send({ status: "error", error: "Incorrect password" });
        user.last_connection = Date.now()
        const userDto = UserDTO.getUserTokenFrom(user);
        console.log(userDto)
        const token = jwt.sign(userDto, 'tokenSecretJWT', { expiresIn: "1h" });
        res.cookie('coderCookie', token, { maxAge: 3600000 }).send({ status: "success", message: "Logged in" })
    } catch (error) {
        logger.error(error)
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle:`${error.message}`
            }
        )
        
    }
    
}

const current = async(req,res) =>{
    const cookie = req.cookies['coderCookie']
    try {
        const user = jwt.verify(cookie, 'tokenSecretJWT');
        if (user)
            return res.send({ status: "success", payload: user })
    } catch (error) {
        logger.error(error)
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle:`${error.message}`
            }
        )
        
    }
    
}

const unprotectedLogin  = async(req,res) =>{
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" });

    try {
        const user = await usersService.getUserByEmail(email);
        if (!user) return res.status(404).send({ status: "error", error: "User doesn't exist" });
        const isValidPassword = await passwordValidation(user, password);
        if (!isValidPassword) return res.status(400).send({ status: "error", error: "Incorrect password" });
        const token = jwt.sign(user, 'tokenSecretJWT', { expiresIn: "1h" });
        res.cookie('unprotectedCookie', token, { maxAge: 3600000 }).send({ status: "success", message: "Unprotected Logged in" })
    } catch (error) {
        logger.error(error)
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle:`${error.message}`
            }
        )
        
    }
    
}
const unprotectedCurrent = async(req,res)=>{
    const cookie = req.cookies['unprotectedCookie']
    try {
        const user = jwt.verify(cookie, 'tokenSecretJWT');
        if (user)
            return res.send({ status: "success", payload: user })
    } catch (error) {
        logger.error(error)
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle:`${error.message}`
            }
        )
        
    }
    
}
export default {
    current,
    login,
    register,
    current,
    unprotectedLogin,
    unprotectedCurrent
}