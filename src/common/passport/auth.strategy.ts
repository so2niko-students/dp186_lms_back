// import passport = require("passport");
import { Strategy, ExtractJwt } from "passport-jwt";
import { auth } from "../../modules/auth/auth.config";
import { studentsService } from "../../modules/students/students.service";
import teacherssService from "../../modules/teachers/teachers.service";
import { Unauthorized } from "../../common/exeptions/index";
import { Teachers } from '../../modules/teachers/teachers.model';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: auth.secretKey,
  expiresIn: auth.expiresIn,
};

export const strategy = new Strategy(opts, async (jwtPayload, done) => {
  try {
    const user: any =
      (await studentsService.findOneByEmail(jwtPayload.email)) ||
      (await teacherssService.findOneByEmail(jwtPayload.email));
    if (user) {
      user.isMentor = user instanceof Teachers;
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (err) {
    done(new Unauthorized(err.message), false);
  }
});