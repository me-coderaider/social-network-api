const { randomBytes } = require("crypto");
const { default: migrate } = require("node-pg-migrate");
const format = require("pg-format");
const pool = require("../pool");

const DEFAULT_OPTS = {
  host: "localhost",
  port: 5432,
  database: "socialnetwork-test", // connecting to test database now.
  user: "postgres",
  password: "postgres",
};

class Context {
  static async build() {
    // 1. randomly generating a role to connect to PG as
    // NOTE -- roleName should start with a letter
    const roleName = "a" + randomBytes(4).toString("hex");

    // 2. connect to pg as usual
    await pool.connect(DEFAULT_OPTS);

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

  async close() {
    // 1. Disconnect from PG
    await pool.close();

    // 2. Reconnect as our root user
    await pool.connect(DEFAULT_OPTS);

    // 3. Delete the role and schema we created as with same user we can not delete the role and schema
    await pool.query(format("DROP SCHEMA %I CASCADE;", this.roleName));
    await pool.query(format("DROP ROLE %I;", this.roleName));
    // 4. Disconnect

    await pool.close();
  }
}

module.exports = Context;
