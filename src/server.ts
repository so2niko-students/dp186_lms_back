import express = require('express');
import * as bodyParser from 'body-parser';
import { default as healthRoutes } from './modules/health/health.routes';
import { router as groupsRoutes } from './modules/groups/groups.routes';
import { router as studentsRoutes } from './modules/students/students.routes';
import { router as teachersRoutes } from './modules/teachers/teachers.routes';
import { errorHandler } from './common/middlewares/errors.middleware';
import { authJwt } from './common/middlewares/auth.middleware';
import passport = require ('passport');
import { strategy } from './common/passport/auth.strategy';
import { AuthRoute } from './modules/auth/auth.routes';
import * as dotenv from 'dotenv';

dotenv.config();
import './database';

const app: express.Express = express();
app.use(express.json());
app.use(bodyParser.json());

app.use('/api/v1/health', healthRoutes);
app.use('/groups', authJwt, groupsRoutes);
app.use('/students', studentsRoutes);

// Krivobok
app.use("/teachers", authJwt, teachersRoutes);

//authorization
passport.use(strategy);
app.use(passport.initialize());
app.use('/auth', new AuthRoute().router);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`)
});