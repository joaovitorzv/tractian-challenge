import { Router } from 'express';

import ManagerController from '../app/controllers/ManagerController';
import CompanyController from '../app/controllers/CompanyController';
import UnitController from '../app/controllers/UnitController';
import ActiveController from '../app/controllers/ActiveController';
import UploadController from '../app/controllers/UploadController';

import fakeAuth from '../app/middleware/fakeAuth';
import upload from '../config/storage';

const routes = Router();

routes.post('/', (req, res) => {
  res.json({ working: true });
});

// Public routes
routes.post('/manager/signup', ManagerController.create);
routes.post('/manager/signin', ManagerController.index);
routes.get('/uploads/:filename', UploadController.show);

// Manager header is nedded to access routes below
routes.use(fakeAuth);

routes.put('/manager', ManagerController.update);

routes.get('/company', CompanyController.index);
routes.get('/company', CompanyController.show);
routes.post('/company', CompanyController.create);
routes.put('/company/:id', CompanyController.update);
routes.delete('/company/:id', CompanyController.delete);

routes.post('/company/:company_id/units', UnitController.create);
routes.get('/company/:company_id/units', UnitController.index);
routes.put('/company/:company_id/units/:unit_id', UnitController.update);
routes.delete('/company/:company_id/units/:unit_id', UnitController.delete);

routes.get('/company/:company_id/units/:unit_id/active', ActiveController.index);
routes.post('/company/:company_id/units/:unit_id/active', upload, ActiveController.create);
routes.delete('/units/:unit_id/active/:active_id', ActiveController.delete);
routes.put('/units/:unit_id/active/:active_id', ActiveController.update);



// routes.post('/uploads', upload.single('file'), UploadController.create);
// routes.get('/uploads/:filename', UploadController.show);

export default routes;