// middleware/roleMiddleware.js
const roleMiddleware = (roles) => {
    return (req, res, next) => {
        if (req.user && roles.includes(req.user.role)) {
            next();
        } else {
            res.status(403).json({ message: 'У вас нет прав для выполнения этого действия.' });
        }
    };
};

module.exports = roleMiddleware;