async function validateExpanse(req, res, next) {
    if(!req.body.amount){
        return res.status(400).json({
            success: false,
            message: 'Amount is required',
            error: {},
            data: {},
        });
    }
    if(!req.body.category){
        return res.status(400).json({
            success: false,
            message: 'Category is required',
            error: {},
            data: {},
        });
    }
    if(!req.body.Date){
        return res.status(400).json({
            success: false,
            message: 'Date is required',
            error: {},
            data: {},
        });
    }
    if(!req.body.note){
        return res.status(400).json({
            success: false,
            message: 'note is required',
            error: {},
            data: {},
        });
    }
    next();
}

module.exports = {
    validateExpanse
};