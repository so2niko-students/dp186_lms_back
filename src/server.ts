import express = require('express');
import cors = require('cors');
import * as bodyParser from 'body-parser';
import * as swaggerUi from 'swagger-ui-express';
import { specs }  from './config/swagger.config'
import { router as groupsRoutes } from './modules/groups/groups.routes';
import { router as studentsRoutes } from './modules/students/students.routes';
import { router as teachersRoutes } from './modules/teachers/teachers.routes';
import { router as solutionsRoutes } from './modules/solutions/solutions.routes';
import { router as commentsRoutes } from './modules/comments/comments.routes';
import { router as tasksRoutes} from './modules/tasks/tasks.routes';
import { errorHandler } from './common/middlewares/errors.middleware';
import { authJwt } from './common/middlewares/auth.middleware';
import passport = require('passport');
import { strategy } from './common/passport/auth.strategy';
import { AuthRoute } from './modules/auth/auth.routes';
import * as dotenv from 'dotenv';
dotenv.config();
import './database';

const app: express.Express = express();
app.use(bodyParser.json({limit: '100mb'}));
//app.use(bodyParser.urlencoded({limit: '60mb', extended: true}))

app.use(cors());

app.use('/groups', authJwt, groupsRoutes);
app.use('/solutions', authJwt, solutionsRoutes);
app.use('/comments', authJwt, commentsRoutes);
app.use('/students', studentsRoutes);
app.use('/teachers', teachersRoutes);
app.use('/tasks', authJwt, tasksRoutes);

// authorization
passport.use(strategy);
app.use(passport.initialize());
app.use('/auth', new AuthRoute().router);
app.use(errorHandler);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`);
});
