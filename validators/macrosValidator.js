const { z } = require("zod");

const macrosSchema = z.object({
    protein: z.preprocess(
        (val) => Number(val),
        z
            .number()
            .min(0, "Protein must be a positive number")
            .max(1000, "Protein seems too high")
    ),
    carbs: z.preprocess(
        (val) => Number(val),
        z
            .number()
            .min(0, "Carbs must be a positive number")
            .max(1000, "Carbs seems too high")
    ),
    fats: z.preprocess(
        (val) => Number(val),
        z
            .number()
            .min(0, "Fats must be a positive number")
            .max(1000, "Fats seems too high")
    ),
    date: z.string().optional(),
});

function validateMacros(req, res, next) {
    const result = macrosSchema.safeParse(req.body);
    if (!result.success) {
        return res
            .status(400)
            .json({ error: "Invalid input", details: result.error.errors });
    }
    req.body = result.data;
    next();
}

module.exports = { validateMacros };