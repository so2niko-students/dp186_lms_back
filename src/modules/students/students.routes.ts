import { CreateStudentsDto } from "./students.dtos";
import { Router } from "express";
import studentsController from "./students.controller";
import { createValidator } from "../../common/middlewares/create-validator";

const router = new Router();

router.post("/", createValidator(CreateStudentsDto), studentsController.createOne);

export default router;
