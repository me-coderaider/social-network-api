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
  static async insert() {}
  static async update() {}
  static async delete() {}
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
