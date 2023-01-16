const ServicesFactory = require('../../services');

async function setUser(req, userId) {
  const userService = ServicesFactory.createUserService();
  const user = await userService.getUserById(userId);

  if (!user) {
    req.user = { userId, claims: [], };
  }

  req.user = { userId, claims: user.role.claims.map((item) => item.type), };
}

async function authMiddleware(req, res, next) {
  try {
    const { userId } = req.session;

    if (!userId) {
      res.status(401).send();
    } else {
      await setUser(req, userId);
      await next();
    }
  } catch (err) {
    await next(err);
  }
}

module.exports = authMiddleware;