const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();

(async function () {
  cloudinary.config({
    cloud_name: "dkfltzjgk",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  const images = [
    "./images/mcaloo.png",
  ];
  try {
    for (const image of images) {
      const result = await cloudinary.uploader.upload(image);
      console.log(result);
    }
  } catch (error) {
    console.log("error in uploading file:", error);
  }
})();
