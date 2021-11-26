const router = require('express').Router();

// Use api routes
const apiRoutes = require('./api')
router.use('/api', apiRoutes)

// Use home routes
const homeRoutes = require('./homeRoutes')
router.use('/', homeRoutes)

module.exports = router