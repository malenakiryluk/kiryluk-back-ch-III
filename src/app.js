import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js'
import { logger, middLog } from './utils/utils.js';
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { config } from './config/config.js';



const app = express();
const PORT = process.env.PORT||8080;
const connection = mongoose.connect(config.MONGO_URL)
if (connection) {
    logger.info("db ok")
}


app.use(express.json());
app.use(cookieParser());
app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);
app.use('/api/mocks', mocksRouter)
app.use(middLog); 

const options = {
    definition:{
        openapi:"3.0.0",
        info:{
            title: "API Pets",
            version: "1.0.0",
            description: "API-rest Pets"
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: "Testing"
            }
        ]
    },
    apis: ["./src/docs/*.yaml"]

}

const spec=swaggerJsdoc(options)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec))



app.listen(PORT,()=>logger.info(`Listening on ${PORT}`))
