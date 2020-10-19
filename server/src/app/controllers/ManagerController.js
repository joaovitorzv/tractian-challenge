import Manager from '../models/manager';

export default {
  index: async (req, res) => {
    const { email } = req.body;

    const managerExists = await Manager.findOne({ email });

    if (!managerExists) {
      return res.status(401).json({ message: 'Email not found' });
    }

    return res.json(managerExists);
  },

  create: async (req, res) => {
    const { name, email } = req.body;

    const managerExists = await Manager.findOne({ email });

    if (managerExists) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const manager = await Manager.create({
      name,
      email
    });

    return res.json(manager);
  },

  update: async (req, res) => {
    const { name } = req.body;
    const { manager_id } = req.headers;

    let manager = await Manager.findById(manager_id);
    if (!manager) {
      return res.status(401).json({ message: 'Invalid managerID header' })
    }

    manager.name = name;
    manager.save();

    return res.json(manager);
  }
}