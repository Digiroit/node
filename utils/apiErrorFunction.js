

module.exports = (res, error) => {
    console.log(error)
    return res.status(error ? error.st : error || 500).json({
        success: false,
        message: error?error.msg:error || process.env.COMMON_ERR_MSG
    })
}