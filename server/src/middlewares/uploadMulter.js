import multer from "multer";

const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE || 5 * 1024 * 1024);

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
});

const parseLogoUpload = (req, res, next) => {
  upload.single("logo")(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
          message: `File too large. Maximum allowed size is ${MAX_FILE_SIZE} bytes.`,
        });
      }

      if (error.code === "LIMIT_UNEXPECTED_FILE") {
        return res
          .status(400)
          .json({ message: 'Invalid field name. Use "logo".' });
      }
    }

    return res
      .status(400)
      .json({ message: error.message || "File upload failed" });
  });
};

export default parseLogoUpload;
