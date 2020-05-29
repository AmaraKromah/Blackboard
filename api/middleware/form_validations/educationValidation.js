const {body, validationResult} = require('express-validator');

exports.educationValidationRules = () => {
    return [
        body('name').trim().isLength({min: 1}).withMessage('name is required'),
            // .isAlphanumeric().withMessage('Enter a valid genre'),
            body('begin_date').trim().isLength({min: 1}).withMessage('begin date is required'),
            body('end_date').trim().isLength({min: 1}).withMessage('end date is required'),

        body('name').escape(),
        body('begin_date').escape(),
        body('end_date').escape(),

    ]
}


//////////////        VALIIDATE            ///////////////////////

exports.validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({[err.param]: err.msg}))

    res.status(422).json({
        Error: 'Creation Error',
        errors_details:  extractedErrors
    })


}