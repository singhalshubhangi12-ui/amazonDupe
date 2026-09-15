import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
    try {
        const tokenHeader = req.headers["authorization"];

        const token =
            req.cookies.token ||
            (tokenHeader ? tokenHeader.split(" ")[1] : null);

        if (!token) {
            return next();
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        return next();

    } catch (error) {
        next();
    }
};