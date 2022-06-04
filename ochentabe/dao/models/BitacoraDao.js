const { db } = require('../Connection');
const DaoObject = require('../DaoObject');
module.exports = class CategoryDao extends DaoObject {
  constructor(db = null) {
    console.log('CategoryDao db: ', db);
    super(db);
  }
  async setup() {
    if (process.env.SQLITE_SETUP) {
      const createStatement = 'CREATE TABLE IF NOT EXISTS bitacora (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT, type INCOME|EXPENSES, date TEXT, amount DECIMAL, category TEXT);';
      await this.run(createStatement);
    }
  }

  getAll() {
    return this.all(
      'SELECT * from bitacora;', []
    );
  }

  getById({ codigo }) {
    const sqlstr = 'SELECT * from bitacora where id=?;';
    const sqlParamArr = [codigo];
    return this.get(sqlstr, sqlParamArr);
  }

  insertOne({ description,type,amount,category  }) {
    const date = new Date().toISOString();
    const sqlstr = 'INSERT INTO bitacora (description, type, date, amount, category) values (?, ?, ?, ?, ?);';
    const sqlParamArr = [description,type, date, amount, category];
    return this.run(sqlstr, sqlParamArr);
  }

  updateOne({ codigo, description,type, date, amount, category  }) {
    const sqlstr = 'UPDATE bitacora set description = ?, type = ? , date = ?, amount = ?, category = ?,  = ? where id = ?;';
    const sqlParamArr = [description, type, date, amount, category , codigo];
    return this.run(sqlstr, sqlParamArr);
  }

  deleteOne({ codigo }) {
    const sqlstr = 'DELETE FROM bitacora where id = ?;';
    const sqlParamArr = [codigo];
    return this.run(sqlstr, sqlParamArr);
  }

}