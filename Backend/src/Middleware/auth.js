import jwt from "jsonwebtoken";
import { AppError } from "../../utils/appErorr.js";
import User from "../../database/models/user.model.js";

export const auth = async (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return next (new AppError('Authorization header not provided', 400))
    }
    if (!authorization.startsWith('Bearer ',)) {
      return next (new AppError('invalid bearer key', 400))
    }
  
    const token = authorization.split('Bearer ')[1];
    
    const decode = jwt.verify(token, 'mina-secret');
    if (!decode?._id) {
      return next (new AppError('invalid payload', 400))
    }
    const user = await User.findById(decode._id);
    if (!user) {
      return next (new AppError('user not found', 404))
    }
    if(user.status = 'offline'){
      return next (new AppError('user mustt login', 401))
    }
    req.user = user;
    next();

  };
