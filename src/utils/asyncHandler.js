const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next)
    } catch (error) {
        res.status( error.code ).json({
            success: false,
            message: message.error
        })
    }
}

export default asyncHandler