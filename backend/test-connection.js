// const mysql = require("mysql2/promise");
// require("dotenv").config();

// async function testConnection() {
//   // Common ports and passwords to try
//   const configs = [
//     { port: 3306, password: "" },      // XAMPP/WAMP default
//     { port: 3306, password: "root" }, // MAMP default
//     { port: 8889, password: "root" },  // MAMP alternative port
//     { port: 3307, password: "" },     // Alternative port
//     { port: 3307, password: "root" },
//   ];

//   const host = process.env.DB_HOST || "localhost";
//   const user = process.env.DB_USER || "root";
//   const dbName = process.env.DB_NAME || "A_to_Z_Auto_Repair";

//   console.log("Testing MySQL connection...\n");
//   console.log(`Host: ${host}`);
//   console.log(`User: ${user}`);
//   console.log(`Database: ${dbName}\n`);

//   for (const config of configs) {
//     console.log(`Trying port ${config.port} with password "${config.password || "(empty)"}"...`);
//     try {
//       const connection = await mysql.createConnection({
//         host,
//         port: config.port,
//         user,
//         password: config.password,
//       });

//       // Test basic connection
//       const [rows] = await connection.query("SELECT VERSION() as version");
//       console.log(`✅ Successfully connected!`);
//       console.log(`   Port: ${config.port}`);
//       console.log(`   Password: ${config.password || "(empty)"}`);
//       console.log(`   MySQL Version: ${rows[0].version}`);

//       // Check if database exists
//       const [databases] = await connection.query(
//         "SHOW DATABASES LIKE ?",
//         [dbName]
//       );
//       if (databases.length > 0) {
//         console.log(`✅ Database '${dbName}' exists`);
//       } else {
//         console.log(`⚠️  Database '${dbName}' does not exist`);
//       }

//       await connection.end();
      
//       console.log(`\n✅ Use these settings in your .env file:`);
//       console.log(`DB_HOST=localhost`);
//       console.log(`DB_PORT=${config.port}`);
//       console.log(`DB_USER=root`);
//       console.log(`DB_PASSWORD=${config.password || ""}`);
//       console.log(`DB_NAME=${dbName}`);
//       return;
//     } catch (error) {
//       if (error.code === "ECONNREFUSED") {
//         console.log(`   ❌ Connection refused`);
//       } else if (error.code === "ER_ACCESS_DENIED_ERROR") {
//         console.log(`   ❌ Access denied (wrong password)`);
//       } else {
//         console.log(`   ❌ Error: ${error.message}`);
//       }
//     }
//   }

//   console.log("\n❌ Could not connect to MySQL with any configuration.");
//   console.log("\nPlease check:");
//   console.log("1. MySQL server is running (XAMPP/WAMP/MAMP Control Panel)");
//   console.log("2. MySQL service is started");
//   console.log("3. Check the MySQL port in your control panel preferences");
// }

// testConnection()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error("Test failed:", error);
//     process.exit(1);
//   });

