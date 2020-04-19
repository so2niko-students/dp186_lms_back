import { BaseHttpError } from "./base-http-error";

class Unauthorized extends BaseHttpError {
  constructor(error) {
    super(403, error);
  }
}

export default Unauthorized;
