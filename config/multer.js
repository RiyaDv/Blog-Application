const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "MERN-Blog-Project",
    allowedFormats: ["jpg", "png"],
  },
});

const upload = multer({ storage });

module.exports = upload;
