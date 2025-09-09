const { z } = require("zod");

const hydrationSchema = z.object({
    amount: z.preprocess(
        (val) => Number(val),
        z
            .number()
            .min(0, "Amount must be a positive number")
            .max(10000, "Amount seems too high")
    ),
    date: z.string().optional(),
});

function validateHydration(req, res, next) {
    const result = hydrationSchema.safeParse(req.body);
    if (!result.success) {
        return res
            .status(400)
            .json({ error: "Invalid input", details: result.error.errors });
    }
    req.body = result.data;
    next();
}

module.exports = { validateHydration };