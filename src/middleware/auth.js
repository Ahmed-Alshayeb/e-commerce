import jwt from "jsonwebtoken";
import userModel from "../../DB/models/user.model.js";

export const auth = () => {
  return async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
      return res.status(404).json({ msg: "token not found" });
    }
    if (!token.startsWith(process.env.BEARER_TOKEN)) {
      return res.status(400).json({ msg: "token not valid" });
    }
    const newToken = await token.split(process.env.BEARER_TOKEN)[1];
    if (!newToken) {
      return res.status(404).json({ msg: "token not found" });
    }
    const decoded = await jwt.verify(newToken, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(400).json({ msg: "invalid payload" });
    }
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }

    if (parseInt(user?.passwordChangedAt?.getTime() / 1000) > decoded.iat) {
      return res.status(400).json({ msg: "password changed please login again" });
    }

    req.user = user;
    next();
  };
};
