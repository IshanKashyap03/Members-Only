const pool = require("./pool");

async function insertUser(first_name, last_name, username, password){
    await pool.query("INSERT INTO users (first_name, last_name, username, password, membership_status) VALUES ($1, $2, $3, $4, $5)", [first_name, last_name, username, password, "inactive"])
}   

async function getUserId(username){
   const {rows} =  await pool.query("SELECT id FROM users WHERE username = $1", [username]);
   return rows[0]?.id;
}

async function getMembershipStatus(username){
    const {rows} = await pool.query("SELECT membership_status FROM users WHERE username = $1", [username])
    return rows[0]?.membership_status;
}


async function updateMembershipStatus(username){
    await pool.query("UPDATE users SET membership_status = $1 WHERE username = $2", ["active", username])
}

module.exports = {
    insertUser,
    updateMembershipStatus,
    getUserId,
    getMembershipStatus
}