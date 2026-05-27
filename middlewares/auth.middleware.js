import jwt from 'jsonwebtoken';


export const authMiddleware = async (req, res, next) => {
    try {
        const tokenHeader = req.headers['authorization'];

        if (!tokenHeader) {
            return next();
        }

        const token = tokenHeader.split(' ')[1];

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