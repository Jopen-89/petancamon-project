import { HttpError } from "../utils/httpError.js";


export function isLoggedIn(req, res, next) {

  if (req.isAuthenticated()) {
    return next();
  }
  next(new HttpError(401, "Not authenticated"));
}

export function isloggedOut (req, res, next) {
  if (!req.isAuthenticated()) {
    return next()
  }
  return next(new HttpError(403, "Already authenticated"))
} 