import request from 'supertest';

import app from '../app';
import mongoose from 'mongoose';

describe('TractianChallenge', () => {
  beforeAll(done => {
    done();
  });

  afterAll(async (done) => {
    await mongoose.connection.db.dropDatabase();
    mongoose.connection.close();
    done();
  })

  var manager_id = '';
  it('Should create new manager', async () => {
    const response = await request(app).post('/manager').send({
      name: 'Jhon doe',
      email: 'Jhon@doe.com',
    });
    manager_id = response.body._id;

    expect(response.body).toMatchObject(
      expect.objectContaining({
        _id: expect.any(String)
      })
    );
  });

  it('Should return error response missing managerID header', async () => {
    const response = await request(app).get('/manager').send({
      name: 'Jhon doe',
      email: 'jhon@doe.com'
    });

    expect(response.body).toMatchObject(
      expect.objectContaining({
        message: "missing managerID header"
      })
    );
  });

  var company_id = '';
  it('Should create a new company', async () => {
    const response = await request(app)
      .post('/company')
      .set('manager_id', manager_id)
      .send({ name: 'Empresa nome' });

    company_id = response.body._id;

    expect(response.body).toMatchObject(
      expect.objectContaining({
        _id: expect.any(String)
      })
    )
  });

  var unit_id = '';
  it('should crate a new unit', async () => {
    const response = await request(app)
      .post(`/company/${company_id}/units`)
      .set('manager_id', manager_id)
      .send({ name: 'Unidade nome' });

    unit_id = response.body._id;

    expect(response.body).toMatchObject(
      expect.objectContaining({
        _id: expect.any(String)
      })
    )
  });

  var active_id = '';
  it("Should create a new active", async () => {
    const response = await request(app)
      .post(`/company/${company_id}/units/${unit_id}/active`)
      .set('manager_id', manager_id)
      .send({
        name: "Ativo nome",
        description: "descrição de ativo",
        status: "available",
        model: {
          name: "SM0 SM7894h3",
          description: "CA 220V - 3000RPM 200W com freio"
        }
      });

    active_id = response.body._id;

    expect(response.body).toMatchObject(
      expect.objectContaining({
        _id: expect.any(String)
      })
    )
  });

  it("Should change active status to inUse", async () => {
    const response = await request(app)
      .put(`/company/${company_id}/units/${unit_id}/active/${active_id}`)
      .set('manager_id', manager_id)
      .send({
        name: "Ativo nome",
        description: "descrição de ativo",
        status: "inUse",
        model: {
          name: "SM0 SM7894h3",
          description: "CA 220V - 3000RPM 200W com freio"
        }
      });

    expect(response.body).toMatchObject(
      expect.objectContaining({
        available: expect(1),
        total: expect(1),
      })
    )
  });

  it("Should show unit availability", async () => {
    const response = await request(app)
      .get(`/company/${company_id}/units`)
      .set('manager_id', manager_id)
      .send({ name: 'Unidade nome' });

    unit_id = response.body._id;

    expect(response.body[0]).toMatchObject(
      expect.objectContaining({
        unitAvailability: {
          available: expect(1)
        }
      })
    )
  });

});