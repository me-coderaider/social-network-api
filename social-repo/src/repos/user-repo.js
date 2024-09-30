const pool = require("../pool");
const toCamelCase = require("./utils/to-camel-case");
// option 3: defining user-repo as a class with STATIC METHODs
// at the bottom NO NEED TO CREATE INSTANCE and export it without new keyword.
class UserRepo {
  static async find() {
    const { rows } = await pool.query("SELECT * FROM users;");

    return toCamelCase(rows);
  }
  static async findById(id) {
    // WARNING: REALLY BIG SECURITY ISSUE, DON'T WRITE CODE LIKE THIS
    const { rows } = await pool.query(`SELECT * FROM users WHERE id=$1;`, [id]);

    return toCamelCase(rows)[0];
  }
  static async insert(username, bio) {
    const { rows } = await pool.query(
      `INSERT INTO users (username, bio) VALUES ($1, $2) RETURNING *;`,
      [username, bio]
    );

    return toCamelCase(rows)[0];
  }
  static async update(id, username, bio) {
    const { rows } = await pool.query(
      `UPDATE users SET username = $1, bio = $2 
            WHERE ID = $3 RETURNING *;
        `,
      [username, bio, id]
    );
    return toCamelCase(rows)[0];
  }
  static async delete(id) {
    const { rows } = await pool.query(
      `
            DELETE FROM users WHERE id=$1 RETURNING *;
        `,
      [id]
    );

    return toCamelCase(rows)[0];
  }

  static async count(){
    const {rows}= await pool.query('SELECT COUNT(*) FROM users;');

    return rows[0].count;
  }
}
module.exports = UserRepo;
// at the bottom NO NEED TO CREATE INSTANCE and export it without new keyword.
// option 2: defining user-repo as class having different instance method in it
// at the bottom we could create instance of class and export it.
/*class UserRepo{
    find(){

    }
    findById(){

    }
    insert(){

    }
}
module.exports=new UserRepo(); */

// option 1. defining user-repo as plain object and have functions defined in it
/*module.exports={
    find(){

    },
    findById(){

    },
    insert(){

    }
} */
