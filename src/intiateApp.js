import connectDB from "../DB/connectionDB.js";
import * as routes from "./indexRoutes.js";
import { globalError } from "./middleware/error.js";
import { deleteFromDB } from "./utils/deleteFromDB.js";
import { deleteFromCloudnairy } from "./utils/deleteFromCloudnairy.js";
import { createHandler } from "graphql-http/lib/use/express";
import { schema } from "./modules/product/graphQL/schema.js";

export const intiateApp = (app, express) => {
  const port = process.env.PORT;

  app.use((req, res, next) => {
    if (req.originalUrl == "/orders/webhook") {
      next();
    } else {
      express.json()(req, res, next);
    }
  });

  app.use("/users", routes.userRouter);
  app.use("/categories", routes.categoryRouter);
  app.use("/subCategories", routes.subCategoryRouter);
  app.use("/brands", routes.brandRouter);
  app.use("/products", routes.productRouter);
  app.use("/coupons", routes.couponRouter);
  app.use("/cart", routes.cartRouter);
  app.use("/orders", routes.orderRouter);
  app.use("/reviews", routes.reviewRouter);

  // GraphQL
  app.use("/graphql", createHandler({ schema }));

  connectDB();

  app.use(globalError, deleteFromCloudnairy, deleteFromDB);

  // app.use("/", (req, res) => {
  //   res.json({ msg: "Welcome ^_^" });
  // });

  app.listen(port, () => {
    console.log(`server listening on port ${port}!`);
  });
};
