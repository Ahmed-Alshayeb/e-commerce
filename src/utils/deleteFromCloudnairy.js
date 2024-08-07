import cloudinary from "./cloudinary.js";

export const deleteFromCloudnairy = async (req, res, next) => {
  if (req?.filePath) {
    await cloudinary.api.delete_resources_by_prefix(req.filePath);
    await cloudinary.api.delete_folder(req.filePath);
  }
  next();
};
