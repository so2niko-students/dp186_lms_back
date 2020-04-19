import express = require('express');
import * as bodyParser from 'body-parser';
import { default as healthRoutes } from './modules/health/health.routes';
import { router as groupsRoutes } from './modules/groups/groups.routes';
import { errorHandler } from './common/middlewares/errors.middleware';
import * as dotenv from 'dotenv';
dotenv.config();
import './database';

const app: express.Express = express();
app.use(express.json());
app.use(bodyParser.json());

app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/groups', authJwt, groupsRoutes);

app.use(errorHandler);
// authorization
import passport = require ('passport');
import { strategy } from './common/passport/auth.strategy';
import { authRoute } from './modules/auth/auth.routes';
import { authJwt } from './common/middlewares/auth.middleware';
passport.use(strategy);
app.use(passport.initialize());
app.use('/auth', new authRoute().router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`);
});
