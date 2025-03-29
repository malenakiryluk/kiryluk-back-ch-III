import { usersService } from "../services/index.js"
import { logger } from "../utils/utils.js";

const getAllUsers = async(req,res)=>{

    try {
        const users = await usersService.getAll();
        res.send({status:"success",payload:users})
        
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

const getUser = async(req,res)=> {

    const userId = req.params.uid;

    try {
        const user = await usersService.getUserById(userId);
        if (!user) return res.status(404).send({ status: "error", error: "User not found" })
        res.send({ status: "success", payload: user })
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

const updateUser =async(req,res)=>{
    const updateBody = req.body;
    const userId = req.params.uid;
    try {
        const user = await usersService.getUserById(userId);
        if (!user) return res.status(404).send({ status: "error", error: "User not found" })
        const result = await usersService.update(userId, updateBody);
        res.send({ status: "success", message: "User updated" })
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

const deleteUser = async(req,res) =>{
    const userId = req.params.uid;
    try {
        const result = await usersService.getUserById(userId);
        res.send({status:"success",message:"User deleted"})
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
    deleteUser,
    getAllUsers,
    getUser,
    updateUser
}