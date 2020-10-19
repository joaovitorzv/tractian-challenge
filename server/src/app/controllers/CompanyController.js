import Company from '../models/company';
import Manager from '../models/manager'
import Unit from '../models/unit';
import Active from '../models/active';

export default {
  index: async (req, res) => {
    const { manager_id } = req.headers;

    if (!await Manager.findById(manager_id)) {
      return res.status(401).json({ message: 'Invalid managerID header' });
    };

    const companies = await Company.find({ owner: manager_id });

    return res.json(companies);
  },

  show: async (req, res) => {

  },

  create: async (req, res) => {
    const { name } = req.body;
    const { manager_id } = req.headers

    try {
      var managerById = await Manager.findById(manager_id)
    } catch (e) {
      return res.status(401).json({ message: 'Invalid managerID header' })
    };

    const company = await Company.create({
      name,
      owner: manager_id,
    });
    await company.save();

    managerById.companies.push(company);
    await managerById.save();

    res.json(company);
  },

  update: async (req, res) => {
    const { name } = req.body;
    const { id } = req.params;

    let company = await Company.findById(id);
    company.name = name;
    await company.save();

    res.json(company);
  },

  delete: async (req, res) => {
    const { id } = req.params;

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ message: 'company not exists' });
    }

    await company.deleteOne();

    const managerByCompanyId = await Manager.findOne({
      companies: { $in: [id] }
    });

    const index = managerByCompanyId.companies.indexOf(id);
    if (index > -1) {
      managerByCompanyId.companies.splice(index, 1);
    }

    await Active.deleteMany({ propietary: id });
    await Unit.deleteMany({ propietary: id });

    await managerByCompanyId.save();

    return res.status(200).json({ message: 'Company sucessfuly deleted' });
  }

}