import { Router} from 'express';
import PetDTO from "../dto/Pet.dto.js";
import { petsService, usersService } from "../services/index.js"
import req from 'express/lib/request.js';
import { logger } from '../utils/utils.js';
import { generatePets , generateUsers } from '../utils/utils.js'
const router = Router();

router.get('/mockingpets', async (req,res)=>{
    try {
        const fakePets= [];
        for (let i = 0; i <=100; i++) {
            const fakePet= generatePets();
            fakePets.push(fakePet);
        }
        res.send({status:"success",payload:fakePets})

    } catch (error) {
        
        logger.error(error)
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )
    }
})

router.get('/mockingusers', async (req, res)=>{


    try {
        const fakeUsers= [];
        for (let i = 0; i <=50; i++) {
            const fakeUser= generateUsers();
            fakeUsers.push(fakeUser);
        }
        res.send({status:"success",payload:fakeUsers})

    } catch (error) {
        
        logger.error(error)
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )
    }

})

router.post('/generatedata', async (req,res)=>{

    let {pets, users} = req.query
    if (isNaN(Number(users)) || isNaN(Number(pets)) || Number(users) <0 || Number(pets) <0) {
        logger.info('los valores para generar datos deben ser numericos y mayores o iguales a 0')
    }

    try {
        const fakePets= [];
        for (let i = 1; i <=Number(pets); i++) {
            const fakePet= generatePets();
            delete fakePet._id;
            await petsService.create(fakePet);
            fakePets.push(fakePet);
        }
        

        const fakeUsers=[];
        for (let i = 1; i <=Number(users); i++) {
            const fakeUser= generateUsers();
            delete fakeUser._id;
            await usersService.create(fakeUser);
            fakeUsers.push(fakeUser);
        }
        res.send({status:"success",payload:{fakeUsers, fakePets}})


    } catch (error) {
        
        logger.error(error)
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )
    }



})

export default router;