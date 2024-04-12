const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next)
    } catch (error) {
        console.log("ERROR - ", error);
        return error
    }
}

export default asyncHandler