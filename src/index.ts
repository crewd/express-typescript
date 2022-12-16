import "dotenv/config";
import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import userRouter from "./user/user.router";
import { tokenUtils } from "./middleware/token.utils";

const app = express();
const port = 3000;

app.use(express.json());

createConnection()
  .then(async () => {
    console.log("Inserting a new user into the database...");

    app.use((req, res, next) => {
      if (req.url === "/user/login" || req.url === "/user/signup") {
        return next();
      }
      const token = req.headers["authorization"].split("Bearer ")[1];
      const verifyToken = tokenUtils.verify(token);
      if (!verifyToken.success) {
        return res.status(400).send(verifyToken);
      }
      return next();
    });

    // user router
    app.use("/user", userRouter);

    app.listen(port, () => {
      console.log(`app listening on port ${port}`);
    });
  })
  .catch((error) => console.log(error));

// 요청&응답 컨트롤러 / 데이터 모델(엔티티) / 서비스(로직)
// 유저 목록 조회 - 로그인한 유저만 유저 목록 조회
// createdAt updatedAt user에 추가 typeorm 데코레이트 / date 변환 'iso8601'
// 타임존 저장이 db에 어떻게 되는지 - datetime / timestamp
