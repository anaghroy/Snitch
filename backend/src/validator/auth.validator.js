import { body, validationResult } from "express-validator";

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
}

export const validateRegisterUser = [
  body("email").isEmail().withMessage("Invalid email format").normalizeEmail(),
  body("contact")
    .notEmpty()
    .withMessage("Contact is required")
    .isMobilePhone("en-IN")
    .withMessage("Contact must be a valid Indian phone number"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number"),
  body("fullname")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters long"),
  body("isSeller")
    .optional()
    .isBoolean()
    .withMessage("isSeller must be a boolean value"),
  validateRequest,
];

export const validateLoginUser = [
  body("email").isEmail().withMessage("Invalid email format").normalizeEmail(),
  body("password").trim().notEmpty().withMessage("Password is required"),
  validateRequest,
];
