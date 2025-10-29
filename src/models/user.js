const models = {};
const db = require("../configs/db");

// Registration
models.registration = ({ email, first_name, last_name, password }) => {
  return db.query(
    `INSERT INTO users (email, first_name, last_name, password)
     VALUES($1, $2, $3, $4)`,
    [email, first_name, last_name, password]
  );
};

// Login
models.getPassByEmail = (email) => {
  return db.query(`SELECT * FROM users WHERE email = $1`, [email]);
};

// Get profile
models.getProfile = async (email) => {
  const result = await db.query(
    `SELECT email, first_name, last_name, profile_image FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0];
};

// Update profile
models.updateProfile = async (
  { password, first_name, last_name, profile_image },
  email
) => {
  const result = await db.query(
    `UPDATE users 
     SET 
      password = COALESCE(NULLIF($1, ''), password),
      first_name = COALESCE(NULLIF($2, ''), first_name),
      last_name = COALESCE(NULLIF($3, ''), last_name),
      profile_image = COALESCE(NULLIF($4, ''), profile_image), 
      updated_on = NOW()
     WHERE email = $5
     RETURNING email, first_name, last_name, profile_image
     `,
    [password, first_name, last_name, profile_image, email]
  );
  return result.rows[0];
};

module.exports = models;
