const authzStatus = async (req, res, next) => {
    try {
        const role = req.additionalData.role
        //console.log(role, "ini role");

        if (role !== "admin") {
            throw new Error("NOT_ALLOWED")
        }
    
        next()
    }
    catch (err) {
        next(err)
    }
}
module.exports = authzStatus
