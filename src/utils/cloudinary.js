const cloudinary = require("../config/cloudinary");

const deleteImage = async (imageUrl) => {
  try {
    const parts = imageUrl.split("/");
    const fileName = parts[parts.length - 1];
    const publicId = `blog_posts/${fileName.split(".")[0]}`;

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log("Cloudinary delete error:", error);
  }
};

module.exports = deleteImage;
