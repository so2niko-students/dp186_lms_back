import express = require('express');
import * as bodyParser from 'body-parser';
import { default as healthRoutes } from './modules/health/health.routes';
import { router as groupsRoutes } from './modules/groups/groups.routes';
import errorHandler from './common/middlewares/errors.middleware';
import jwtAuth from './common/middlewares/auth.middleware';
import * as dotenv from 'dotenv';
dotenv.config();
import './database';

const app: express.Express = express();
app.use(express.json());
app.use(bodyParser.json());

app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/groups', /*jwtAuth,*/ groupsRoutes);

app.use(errorHandler);
//authorization
import passport = require ('passport');
import { errorHandler } from './common/middlewares/errors.middleware';
import { strategy } from './common/passport/auth.strategy';
passport.use(strategy);
app.use(passport.initialize());
import { authRoute } from './modules/auth/auth.routes'; 
app.use('/auth', new authRoute().router);
import { authJwt } from './common/middlewares/auth.middleware';

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`);
});
