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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`);
});
