import Company from '../models/company';
import Unit from '../models/unit';
import Active from '../models/active';

const unitAvailabilityCounter = async (unit_id) => {
  const available = await Active.find({
    unit: unit_id,
    status: 'available'
  });

  const underMaintenance = await Active.find({
    unit: unit_id,
    status: 'underMaintenance'
  });


  const inUse = await Active.find({
    unit: unit_id,
    status: 'inUse'
  });

  const total = available.length + underMaintenance.length + inUse.length;

  const unitAvailability = {
    available: available.length,
    underMaintenance: underMaintenance.length,
    inUse: inUse.length,
    total
  }

  await Unit.updateMany(
    { "_id": unit_id },
    { $set: { unitAvailability } }
  )
}

export default {
  index: async (req, res) => {
    const { manager_id } = req.headers;
    const { company_id } = req.params;

    try {
      await Company.findById(company_id);
    } catch (err) {
      return res.status(401).json({ message: 'Company not found' });
    }

    const unit = await Unit.find({
      propietary: company_id,
      owner: manager_id
    });

    return res.json(unit);
  },

  create: async (req, res) => {
    const { manager_id } = req.headers;
    const { company_id } = req.params;
    const { name } = req.body;

    try {
      await Company.find({
        id: company_id,
        owner: manager_id
      });
    } catch (err) {
      return res.status(401).json({ message: 'Can\'t create unit, this company doesn\'t belongs to you' });
    }

    const company = await Company.findById(company_id);
    company.unitsCreated += 1;
    company.save();

    const unit = await Unit.create({
      name,
      propietary: company_id,
      owner: manager_id
    });

    return res.json(unit);
  },

  update: async (req, res) => {
    const { manager_id } = req.headers;
    const { company_id, unit_id } = req.params;
    const { name } = req.body;

    try {
      await Company.find({
        id: company_id,
        owner: manager_id
      });
    } catch (err) {
      return res.status(401).json({ message: 'Can\'t create unit, this company doesn\'t belongs to you' });
    }

    const unit = await Unit.findById(unit_id);
    if (!unit) {
      return res.status(404).json({ message: 'Unit doesn\'t exists' });
    }

    unit.name = name;
    unit.save();

    return res.json(unit);
  },

  delete: async (req, res) => {
    const { manager_id } = req.headers;
    const { company_id, unit_id } = req.params;

    try {
      await Company.find({
        id: company_id,
        owner: manager_id
      });
    } catch (err) {
      return res.status(401).json({ message: 'Can\'t create unit, this company doesn\'t belongs to you' });
    }

    const unit = await Unit.findById(unit_id);
    if (!unit) {
      return res.json({ message: 'Unit doesn\'t exists' })
    }

    unit.deleteOne();
    await Active.deleteMany({ unit: unit_id });

    const company = await Company.findById(company_id);
    company.unitsCreated -= 1;
    company.save();

    return res.json({ message: 'Unit Sucessfuly deleted' });
  }
}