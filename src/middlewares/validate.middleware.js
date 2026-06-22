
const zodValidate = (schema, target = 'body') => {
    return (req, res, next) => {
        const result = schema.safeParse(req[target]);

        if (!result.success) {
            const errors = result.error.issues.map(issue => ({
                path: issue.path.join('.'),
                message: issue.message,
                code: issue.code
            }));

            return res.status(422).json({
                error: 'invalid Body',
                details: errors
            });
        };



        req[target] = result.data

        next()
    }
}

module.exports = zodValidate