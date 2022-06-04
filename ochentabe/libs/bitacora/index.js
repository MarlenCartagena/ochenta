const DaoObject = require('../../dao/DaoObject');
module.exports = class Bitacora {
  bitacoraDao = null;

  constructor(bitacoraDao = null) {
    if (!(bitacoraDao instanceof DaoObject)) {
      throw new Error('An Instance of DAO Object is Required');
    }
    this.bitacoraDao = bitacoraDao;
  }
  async init() {
    await this.bitacoraDao.init();
    await this.bitacoraDao.setup();
  }
  async getVersion() {
    return {
      entity: 'Bitacora',
      version: '1.0.0',
      description: 'CRUD de Bitacora'
    };
  }

  async addBitacora({
    description,
    type,
    date,
    amount,
    category
  }) {
    const result = await this.bitacoraDao.insertOne(
      {
        description,
        type,
        date,
        amount,
        category
      }
    );
    return {
      description,
      type,
      date,
      amount,
      category,
      id: result.lastID
    };
  };

  async getBitacora() {
    return this.bitacoraDao.getAll();
  }

  async getBitacoraById({ codigo }) {
    return this.bitacoraDao.getById({ codigo });
  }

  async updateBitacora({ 
    description,
    type,
    date,
    amount,
    category,
    codigo
    }) {
    const result = await this.bitacoraDao.updateOne({
      codigo,
      description,
      type,
      date,
      amount,
      category });
    return {
      description,
      type,
      date,
      amount,
      category,
      codigo,
      modified: result.changes
    }
  }

  async deleteBitacora({ codigo }) {
    const bitacoraToDelete = await this.bitacoraDao.getById({ codigo });
    const result = await this.bitacoraDao.deleteOne({ codigo });
    return {
      ...bitacoraToDelete,
      deleted: result.changes
    };
  }
}