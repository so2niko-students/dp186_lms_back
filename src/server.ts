import express = require('express');
import { default as healthRoutes } from './modules/health/health.routes';
import { router as studentsRoutes } from './modules/students/students.routes';
import * as dotenv from 'dotenv';
dotenv.config();
import './database';
import { errorHandler } from './common/middlewares/errors.middleware';
import passport = require('passport');
import { strategy } from './common/passport/auth.strategy';
import { AuthRoute } from './modules/auth/auth.routes';
import { authJwt } from './common/middlewares/auth.middleware';

const app: express.Express = express();
app.use(express.json());
app.use(bodyParser.json());

app.use('/api/v1/health', healthRoutes);
app.use('/students', studentsRoutes);
app.use(errorHandler);

// authorization
passport.use(strategy);
app.use(passport.initialize());
app.use('/auth', new AuthRoute().router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
