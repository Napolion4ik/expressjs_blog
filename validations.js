import { body } from "express-validator";

export const registerValidator = [
	body("email", "Не правильний формат почти").isEmail(),
	body("password", "Пароль повинен бути мінімум 5 символів").isLength({
		min: 5,
	}),
	body("fullName", "Ім'я повинно бути мінімум 3 символа").isLength({
		min: 3,
	}),
	body("avatarUrl", "Повинно бути посиланням").optional().isURL(),
];

export const loginValidator = [
	body("email", "Не правильний формат почти").isEmail(),
	body("password", "Пароль повинен бути мінімум 5 символів").isLength({
		min: 5,
	}),
];

export const postCreateValidation = [
	body("title", "Введіть заголовк статті").isLength({ min: 3 }).isString(),
	body("text", "Введіть текст статті").isLength({ min: 5 }).isString(),
	body("tags", "Невірний вормат тегов(вкажіть масив)").optional().isArray(),
	body("imageUrl", "Невірне посилання на зображення").optional().isString(),
];
