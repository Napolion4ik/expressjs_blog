import express from "express";
import mongoose from "mongoose";
import fs from "fs";
import multer from "multer";
import dotenv from "dotenv";
import cors from "cors";

import { PostController, UserController } from "./controllers/index.js";

import {
	registerValidator,
	loginValidator,
	postCreateValidation,
} from "./validations.js";

import { checkAuth, handleValidationErrors } from "./utils/index.js";

dotenv.config();

// DB CONNECT
mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => {
		console.log("DB OK");
	})
	.catch((err) => {
		console.log("DB error", err);
	});
//

const app = express();

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		if (!fs.existsSync("uploads")) {
			fs.mkdirSync("uploads");
		}
		cb(null, "uploads");
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage });

// MIDELLWARE
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.post(
	"/auth/login",
	loginValidator,
	handleValidationErrors,
	UserController.login
);

app.post(
	"/auth/register",
	registerValidator,
	handleValidationErrors,
	UserController.register
);

app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	});
});

// Posts

app.post(
	"/posts",
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	PostController.create
);
app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.get("/posts/sort/:sort", PostController.getPostSortPopular);
app.get("/tags", PostController.getLastTags);
app.patch("/comments/:id", PostController.addComment);
app.get("/tags/:tag", PostController.getPostsTags);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
	"/posts/:id",
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	PostController.update
);

app.listen(process.env.PORT || 3333, (err) => {
	if (err) {
		return console.log(err);
	}

	console.log("Server OK and run port 3333");
});
