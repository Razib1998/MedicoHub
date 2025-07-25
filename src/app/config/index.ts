import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwt: {
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_access_expiration: process.env.JWT_ACCESS_EXPIRATION,
    jwt_refresh_expiration: process.env.JWT_REFRESH_EXPIRATION,
  },
  reset_pass: {
    reset_pass_token: process.env.RESET_PASS_TOKEN,
    reset_pass_expire_in: process.env.RESET_PASS_EXPIRATION,
    reset_pass_link: process.env.RESET_PASS_LINK,
  },
  email: {
    email: process.env.EMAIL,
    app_pass: process.env.APP_PASS,
  },
};
