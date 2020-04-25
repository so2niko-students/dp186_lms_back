import { Router} from 'express';
import { avatarsController } from './avatars.controller';
import { createValidator } from '../../common/middlewares/create.validation';
import { setAvatarDto } from './avatars.dtos';


const router: Router = Router();

router.post('/set/:purpose', createValidator(setAvatarDto), avatarsController.setOne);

export {router};
