import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
	{
		text: { type: String, required: true },
		author: { type: Object, required: true },
	},
	{
		timestamps: true,
	}
);

const PostSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
		tags: { type: Array, default: [] },
		viewsCount: {
			type: Number,
			default: 0,
		},
		imageUrl: String,
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		comments: [commentSchema],
	},

	{
		timestamps: true,
	}
);

export default mongoose.model("Post", PostSchema);
