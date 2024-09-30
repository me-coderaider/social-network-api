const { randomBytes } = require("crypto");
const { default: migrate } = require("node-pg-migrate");
const format = require("pg-format");
const pool = require("../pool");

class Context {
  static async build() {
    // 1. randomly generating a role to connect to PG as
    // NOTE -- roleName should start with a letter
    const roleName = "a" + randomBytes(4).toString("hex");

    // 2. connect to pg as usual
    await pool.connect({
      host: "localhost",
      port: 5432,
      database: "socialnetwork-test", // connecting to test database now.
      user: "postgres",
      password: "postgres",
    });

    // 3. create a new role
    //   await pool.query(`
    //         CREATE ROLE ${roleName} WITH LOGIN PASSWORD '${roleName}';
    //         `);
    // to avoid SQL INJECTION
    await pool.query(
      format("CREATE ROLE %I WITH LOGIN PASSWORD %L;", roleName, roleName)
    );

    //  4. create a schema with the same schema
    //   await pool.query(`
    //         CREATE SCHEMA ${roleName} AUTHORIZATION ${roleName};
    //         `);
    // to avoid SQL INJECTION
    await pool.query(
      format("CREATE SCHEMA %I AUTHORIZATION %I;", roleName, roleName)
    );

    //  5. disconnect entirely from pg
    await pool.close();

    // 6. run our migration file in new schema
    await migrate({
      schema: roleName,
      direction: "up",
      log: () => {},
      noLock: true,
      dir: "migrations",
      databaseUrl: {
        host: "localhost",
        port: 5432,
        database: "socialnetwork-test", // connecting to test database now.
        user: roleName,
        password: roleName,
      },
    });

    //  7. connect to pg as the newly generated role
    await pool.connect({
      host: "localhost",
      port: 5432,
      database: "socialnetwork-test", // connecting to test database now.
      user: roleName,
      password: roleName,
    });

    return new Context(roleName);
  }
  constructor(roleName) {
    this.roleName = roleName;
  }
}

module.exports = Context;
