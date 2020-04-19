//import * as express from 'express';
import express = require('express'); 
import  { default as healthRoutes } from './modules/health/health.routes';
import * as dotenv from 'dotenv';
dotenv.config();
import "./database";

const app: express.Express = express();
app.use(express.json());

app.use('/api/v1/health', healthRoutes);

//authorization
import passport = require ('passport');
import { errorHandler } from './common/middlewares/errors.middleware';
import { strategy } from './common/passport/auth.strategy';
passport.use(strategy);
app.use(errorHandler);
app.use(passport.initialize());
import { authRoute } from './modules/auth/auth.routes'; 
app.use('/auth', new authRoute().router);
import { authJwt } from './common/middlewares/auth.middleware';


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`)
});