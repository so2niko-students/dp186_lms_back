import { FORBIDDEN } from "http-status-codes";
import { BaseHttpError } from "./base-http-error";

class Unauthorized extends BaseHttpError {
  constructor(error) {
    super(FORBIDDEN, error);
  }
}

export default Unauthorized;
