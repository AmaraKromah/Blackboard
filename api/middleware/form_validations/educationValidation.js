const {body, validationResult} = require('express-validator');

exports.educationValidationRules = () => {
    return [
        body('name').trim().isLength({min: 1}).withMessage('Enter a genre'),
            // .isAlphanumeric().withMessage('Enter a valid genre'),
        body('name').escape(),

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

    // console.log("ERROR ARRAY, ",errors.array())
    res.status(422).json({
        Error: 'Creation Error',
        errors_details:  extractedErrors
    })


}