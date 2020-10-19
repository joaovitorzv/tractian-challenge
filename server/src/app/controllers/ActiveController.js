import Active from '../models/active';
import Unit from '../models/unit';
import Company from '../models/company';

import storage from '../../config/storage';

const statuses = ['available', 'inUse', 'underMaintenance'];

export default {
  index: async (req, res) => {
    const { manager_id } = req.headers;
    const { company_id, unit_id } = req.params;

    try {
      var unit = await Unit.findById(unit_id);
      unit.owner != manager_id
    } catch (err) {
      return res.status(404).json({ message: 'Unit doesn\'t exists' });
    }

    try {
      var company = await Company.findById(company_id);
      company.owner != manager_id
    } catch (err) {
      return res.status(404).json({ message: 'Company doesn\'t exists' });
    }

    const actives = await Active.find({
      propietary: company_id,
      unit: unit_id,
    });

    return res.json(actives);
  },

  create: async (req, res) => {
    const { manager_id } = req.headers;

    const { company_id, unit_id } = req.params;
    const {
      name,
      description,
      status,
      modelName,
      modelDescription
    } = req.body;

    if (req.file == undefined) {
      return res.status(400).json({ message: 'Missing active photo' });
    }
    await storage(req, res);

    try {
      var unit = await Unit.findById(unit_id);
      unit.owner != manager_id
    } catch (err) {
      return res.status(404).json({ message: 'Unit doesn\'t exists' });
    }

    if (!statuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status field value' });
    }

    const totalUnitActives = await Active.find({
      unit: unit_id
    });

    const totalUnitActivesByStatus = totalUnitActives.filter(active =>
      active.status.includes(status)
    )

    const active = await Active.create({
      name,
      description,
      propietary: company_id,
      unit: unit_id,
      status,
      model: {
        name: modelName,
        description: modelDescription,
        image: req.file.filename
      }
    });

    unit.unitAvailability.total = totalUnitActives.length + 1;
    unit.unitAvailability[status] = totalUnitActivesByStatus.length + 1;
    unit.actives.push(active);
    await unit.save();

    const company = await Company.findById(company_id);
    company.actives += 1;
    company.save();

    return res.json(active);
  },

  delete: async (req, res) => {
    const { manager_id } = req.headers;
    const { unit_id, active_id } = req.params;


    try {
      var unit = await Unit.findById(unit_id);
      unit.owner != manager_id
    } catch (err) {
      return res.status(404).json({ message: 'Unit doesn\'t exists' });
    }

    try {
      var activeById = await Active.findById(active_id);
    } catch (err) {
      return res.status(404).json({ message: 'Active doesn\'t exists' });
    }

    const totalUnitActives = await Active.find({
      unit: unit_id
    });

    const totalUnitActivesByStatus = totalUnitActives.filter(active =>
      active.status.includes(activeById.status)
    )

    unit.unitAvailability.total = totalUnitActives.length - 1;
    unit.unitAvailability[activeById.status] = totalUnitActivesByStatus.length - 1;
    unit.actives.remove(active_id);
    unit.save();

    const company = await Company.findById(unit.propietary);
    company.actives -= 1;
    company.save();

    activeById.deleteOne();

    return res.json({ message: 'Active sucessfuly deleted' });
  },

  update: async (req, res) => {
    const { manager_id } = req.headers;
    const { unit_id, active_id } = req.params;
    const {
      name,
      description,
      status,
      model
    } = req.body;

    try {
      var unit = await Unit.findById(unit_id);
      unit.owner != manager_id
    } catch (err) {
      return res.status(404).json({ message: 'Unit doesn\'t exists' });
    }

    try {
      var active = await Active.findById(active_id);
    } catch (err) {
      return res.status(404).json({ message: 'Active doesn\'t exists' });
    }


    if (!statuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status field value' });
    }

    if (status != active.status) {
      unit.unitAvailability[active.status] -= 1;
      unit.unitAvailability.total -= 1;

      active.status = status;

      unit.unitAvailability[status] += 1;
      unit.unitAvailability.total += 1;
    }

    active.name = name;
    active.description = description;
    active.model = model;

    unit.save();
    active.save();
    return res.json(active);
  }
}