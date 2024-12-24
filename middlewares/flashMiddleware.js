module.exports = (req, res, next) => {
    console.log('Middleware flash:', req.session.flash);
    res.locals.flash = req.session.flash || {};
    delete req.session.flash;
    next();
};
