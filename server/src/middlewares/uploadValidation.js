const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE || 5 * 1024 * 1024);
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const validateLogoUpload = (req, res, next) => {
  if (req.file) {
    if (req.file.fieldname !== "logo") {
      return res
        .status(400)
        .json({ message: 'Invalid field name. Use "logo".' });
    }

    if (!ALLOWED_MIME_TYPES.has(req.file.mimetype)) {
      return res.status(415).json({
        message: "Invalid file type. Only jpeg, png, and webp are allowed.",
      });
    }

    if (req.file.size > MAX_FILE_SIZE) {
      return res.status(413).json({
        message: `File too large. Maximum allowed size is ${MAX_FILE_SIZE} bytes.`,
      });
    }

    return next();
  }

  if (req.files) {
    const hasLogoField = Object.prototype.hasOwnProperty.call(
      req.files,
      "logo",
    );

    if (!hasLogoField) {
      return res
        .status(400)
        .json({ message: 'Invalid field name. Use "logo".' });
    }

    const logoFile = req.files.logo;

    if (!ALLOWED_MIME_TYPES.has(logoFile.mimetype)) {
      return res.status(415).json({
        message: "Invalid file type. Only jpeg, png, and webp are allowed.",
      });
    }

    if (logoFile.size > MAX_FILE_SIZE) {
      return res.status(413).json({
        message: `File too large. Maximum allowed size is ${MAX_FILE_SIZE} bytes.`,
      });
    }

    return next();
  }

  return res.status(400).json({ message: "No logo file uploaded." });
};

export default validateLogoUpload;
