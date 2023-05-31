const { check } = require('express-validator');
 
exports.signupValidation = [
    check('email', 'Please include a valid email').isEmail().normalizeEmail({ gmail_remove_dots: true }),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    check('phone_number', 'Please include a valid phone number').isLength({ max: 12 }),
    check('location', 'Location is requied').not().isEmpty()
]
 
exports.loginValidation = [
     check('email', 'Please include a valid email').isEmail().normalizeEmail({ gmail_remove_dots: true }),
     check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
 
]

