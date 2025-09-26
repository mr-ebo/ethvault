const {z} = require("zod");

const asyncErrorHandler = (fn, zodSchema = null) => (req, res, next) => {
    if (zodSchema) {
        try {
            req.validatedBody = zodSchema.parse(req.body);
        } catch (error) {
            if (error instanceof z.ZodError) {
                const message = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
                return res.status(400).json({
                    success: false,
                    error: `Validation failed: ${message}`
                });
            }
            return next(error);
        }
    }
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncErrorHandler;
