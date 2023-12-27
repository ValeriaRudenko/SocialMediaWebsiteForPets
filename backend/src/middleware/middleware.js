// middleware.js
const multer = require('multer');

const handleFileTooLarge = async (err, req, res, next) => {
    try {
        if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File size is too large. Maximum allowed size is 5 MB.' });
        }
        next(err);
    } catch (error) {
        next(error);
    }
};

const imageUpload = multer({
    storage: multer.diskStorage({
        destination: './public/images/avatars',
        filename: (req, file, cb) => {
            const originalExtension = require('path').extname(file.originalname);
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const fileName = file.fieldname + '-' + uniqueSuffix + originalExtension;
            cb(null, fileName);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 2 MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed.'));
        }
    },
});

const additionImageUpload = multer({
    storage: multer.diskStorage({
        destination: './public/images/additions/',
        filename: (req, file, cb) => {
            const originalExtension = require('path').extname(file.originalname);
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const fileName = file.fieldname + '-' + uniqueSuffix + originalExtension;
            cb(null, fileName);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed.'));
        }
    },
});

module.exports = {
    handleFileTooLarge,
    imageUpload,
    additionImageUpload,
};
