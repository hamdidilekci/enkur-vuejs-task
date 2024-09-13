import { Router } from "express";

import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import episDataRoutes from "./episData.routes.js";
import counterDataRoutes from "./counterData.routes.js";
import multiplicationRoutes from "./multiplication.routes.js";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/user", userRoutes);
routes.use("/epis-data", episDataRoutes);
routes.use("/counter-data", counterDataRoutes);
routes.use("/multiplication", multiplicationRoutes);

export default routes;
