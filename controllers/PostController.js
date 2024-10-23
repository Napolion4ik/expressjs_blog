import PostModel from "../models/Post.js";

export const create = async (req, res) => {
	try {
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			imageUrl: req.body.imageUrl,
			tags: req.body.tags,
			user: req.userId,
		});

		const post = await doc.save();
		res.json(post);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Не вдалося створити статью",
		});
	}
};

export const getLastTags = async (req, res) => {
	try {
		const posts = await PostModel.find().limit(5).exec();
		const tags = posts.flatMap((obj) => obj.tags).slice(0, 5);

		res.json(tags);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Не вдалося отримати статті",
		});
	}
};

export const getAll = async (req, res) => {
	try {
		const posts = await PostModel.find().populate("user").exec();

		res.json(posts);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Не вдалося отримати статті",
		});
	}
};
export const getOne = async (req, res) => {
	try {
		const postId = req.params.id;

		const updatedPost = await PostModel.findOneAndUpdate(
			{ _id: postId },
			{ $inc: { viewsCount: 1 } },
			{ returnDocument: "after" }
		).populate("user");

		if (!updatedPost) {
			return res.status(404).json({
				message: "Стаття не знайдена",
			});
		}

		res.json(updatedPost);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Не вдалося отримати статтю",
		});
	}
};

export const getPostSortPopular = async (req, res) => {
	const sortParams = req.params.sort;

	try {
		const posts = await PostModel.find()
			.sort({ [sortParams]: -1 })
			.populate("user");

		res.json(posts);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Не вдалося отримати популярні статті",
		});
	}
};
export const getPostsTags = async (req, res) => {
	const tagParams = req.params.tag;

	try {
		const posts = await PostModel.find({
			tags: { $in: [tagParams] },
		}).populate("user");

		res.json(posts);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: `Не вдалося отримати статті по тегу ${tagParams}`,
		});
	}
};

export const remove = (req, res) => {
	try {
		const postId = req.params.id;

		PostModel.findOneAndDelete({
			_id: postId,
		})
			.then((doc) => {
				if (!doc) {
					return res.status(404).json({
						message: "Статья не знайдена",
					});
				}

				res.json({
					success: true,
				});
			})
			.catch((err) => {
				console.log(err);
				return res.status(500).json({
					message: "Не вдалося видалити статю",
				});
			});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Не вдалося отримати статті",
		});
	}
};

export const update = async (req, res) => {
	try {
		const postId = req.params.id;

		await PostModel.updateOne(
			{
				_id: postId,
			},
			{
				title: req.body.title,
				text: req.body.text,
				imageUrl: req.body.imageUrl,
				user: req.userId,
				tags: req.body.tags,
			}
		);

		res.json({
			success: true,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Не вдалося обновити статті",
		});
	}
};

export const addComment = async (req, res) => {
	try {
		const postId = req.params.id;

		const post = await PostModel.findById(postId);
		if (!post) {
			return res.status(404).json({ message: "Document not found" });
		}

		post.comments.push(req.body);
		await post.save();

		res.json({
			success: post,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Не вдалося додати коментар",
		});
	}
};
