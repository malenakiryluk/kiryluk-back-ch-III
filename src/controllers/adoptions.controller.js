import { adoptionsService, petsService, usersService } from "../services/index.js"
import { logger } from "../utils/utils.js";

const getAllAdoptions = async(req,res)=>{
    try {
        const result = await adoptionsService.getAll();
        res.send({status:"success",payload:result})
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

const getAdoption = async(req,res)=>{
    const adoptionId = req.params.aid;

    try {
        const adoption = await adoptionsService.getBy({ _id: adoptionId })
        if (!adoption){
            logger.debug("no se pudo encontrar la adopcion")
            return res.status(404).send({ status: "error", error: "Adoption not found" })
        } 
        res.send({ status: "success", payload: adoption })
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

const createAdoption = async(req,res)=>{
    const {uid,pid} = req.params;

    try {
        const user = await usersService.getUserById(uid);
        if (!user) return res.status(404).send({ status: "error", error: "user Not found" });

        const pet = await petsService.getBy({ _id: pid });
        if (!pet) return res.status(404).send({ status: "error", error: "Pet not found" });

        if (pet.adopted) return res.status(400).send({ status: "error", error: "Pet is already adopted" });
        user.pets.push(pet._id);
        await usersService.update(user._id, { pets: user.pets })
        await petsService.update(pet._id, { adopted: true, owner: user._id })
        await adoptionsService.create({ owner: user._id, pet: pet._id })
        res.send({ status: "success", message: "Pet adopted" })
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
    createAdoption,
    getAllAdoptions,
    getAdoption
}