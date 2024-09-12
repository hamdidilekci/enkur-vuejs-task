import express from "express";

import {
  publicRouter as authPublicRoutes,
  privateRouter as authPrivateRoutes,
} from "./auth.routes.js";

import isAuthenticated from "../middleware/is-authenticated.js";

const router = express.Router();

router.use("/auth", authPublicRoutes);
// To use routes below isAuthenticated you need to be an authenticated user
router.use(isAuthenticated);
router.use("/auth", authPrivateRoutes);

export default router;
