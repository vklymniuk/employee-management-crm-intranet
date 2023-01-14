const ServicesFactory = require('../../services');
const { config } = require('../../config');

const yearInMilliseconds = 31540000000;

async function signIn(req, res, next) {
  try {

    const authService = ServicesFactory.createAuthService();
    const { email, password, remember } = req.body;
    const { userId } = await authService.signIn(email, password);
    req.session.userId = userId;

    if (remember) {
      req.session.cookie.maxAge = yearInMilliseconds;
    }

    res.send();
  } catch (err) {
    next(err);
  }
}

async function signOut(req, res, next) {
  try {
    req.session.destroy((err) => next(err));
    res.clearCookie(config.session.name);
    res.status(200).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { signIn, signOut };