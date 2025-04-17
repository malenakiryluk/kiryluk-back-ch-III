import { fileURLToPath } from 'url';
import { dirname } from 'path';
import winston, { createLogger } from "winston"
import { config } from '../../src/config/config.js';
import { fakerES_MX as faker} from "@faker-js/faker"

//const __filename = fileURLToPath(import.meta.url);
//const __dirname = dirname(__filename);

//export default __dirname

const nivelesPersonalizados = {
    levels: { fatal: 0, error: 1, warning: 2, info: 3, http: 4, debug: 5}
}

const transporteDev = new winston.transports.Console({
    level: "debug",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple()
    )
})

export const logger = winston.createLogger(
    {
        levels: nivelesPersonalizados.levels,
        transports: [

            new winston.transports.Console({
                level: "info",
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.simple()
                )
            }),

            new winston.transports.File({
                level: "error",
                filename: "./src/logs/errors.log",
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.json()
                )
            })
        ]
    }
)

if (config.MODE == "DEV") {
    logger.add(transporteDev)
}

export const middLog = (req, res, next) =>{
    req.logger= logger
    next();
}

export const generatePets = () => {
    const name = faker.person.firstName();
    const specie = faker.animal.type();
    const birthDate = faker.date.recent();
    const adopted = false;
    const _id = faker.database.mongodbObjectId();

    const fakePet = {
        name,
        specie,
        birthDate,
        adopted,
        _id
    }

    return fakePet;
}

export const generateUsers = () => {
    const first_name = faker.person.firstName();
    const last_name = faker.person.lastName();
    const email = faker.internet.email({ firstName: first_name, lastName: last_name });
    const password = "coder123";
    const role = faker.helpers.arrayElement(["admin", "user"])
    const pets = [];
    const _id = faker.database.mongodbObjectId();

    const fakeUser = {
        first_name,
        last_name,
        email,
        password,
        role,
        pets,
        _id
    }

    return fakeUser;
}


