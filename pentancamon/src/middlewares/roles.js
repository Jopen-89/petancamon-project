import { HttpError } from "../utils/httpError";


function isAdmin (user) {

    const { role } = user;
    if (role !== "admin") {
        throw new HttpError(401, "access denied")
    }
    return true
}


