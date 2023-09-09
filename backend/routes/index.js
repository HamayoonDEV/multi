import express from "express";
import authController from "../controller/authController.js";
import auth from "../middleWare/auth.js";
import blogController from "../controller/blogController.js";
import commentController from "../controller/commentController.js";

const router = express.Router();

//authController endPoints
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", auth, authController.logout);
router.get("/refresh", authController.refresh);

//blogController endPoints
router.post("/blog", auth, blogController.createBlog);
router.get("/blog/all", auth, blogController.getAll);
router.get("/blog/:id", auth, blogController.getById);
router.put("/blog", auth, blogController.update);
router.delete("/blog/:id", auth, blogController.delete);

//commentController endPoints
router.post("/comment", auth, commentController.createComment);
router.get("/comment/:id", auth, commentController.readComments);
router.delete("/comment/:id", auth, commentController.deleteComment);

export default router;
