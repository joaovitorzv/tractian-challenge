export default function fakeAuth(req, res, next) {
  if (!req.headers.manager_id) {
    return res.status(401).json({ message: 'missing managerID header' });
  }

  next();
}