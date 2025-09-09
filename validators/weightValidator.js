const { z } = require("zod");

const weightsSchema = z.object({
  weight: z.preprocess(
    (val) => Number(val),
    z
      .number()
      .min(0, "Weight must be a positive number")
      .max(500, "Weight seems too high")
  ),
  date: z.string().optional(),
});

function validateWeight(req, res, next) {
  const result = weightsSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ error: "Invalid input", details: result.error.errors });
  }
  req.body = result.data;
  next();
}

module.exports = { validateWeight };
