const pool = require("./pool");

async function insertUser(first_name, last_name, username, password){
    await pool.query("INSERT INTO users (first_name, last_name, username, password, membership_status) VALUES ($1, $2, $3, $4, $5)", [first_name, last_name, username, password, "inactive"])
}   

async function getUserId(username){
   const {rows} =  await pool.query("SELECT id FROM users WHERE username = $1", [username]);
   return rows[0]?.id;
}

async function getUsername(user_id){
    const {rows} =  await pool.query("SELECT username FROM users WHERE id = $1", [user_id]);
    return rows[0]?.username;
 }

async function getMembershipStatus(username){
    const {rows} = await pool.query("SELECT membership_status FROM users WHERE username = $1", [username])
    return rows[0]?.membership_status;
}


async function updateMembershipStatus(username){
    await pool.query("UPDATE users SET membership_status = $1 WHERE username = $2", ["active", username])
}

async function getPassword(username){
    const {rows} = await pool.query("SELECT password FROM users WHERE username = $1", [username])
    return rows[0]?.password;
}

async function insertMessage(user_id, title, timestamp, content){
    await pool.query("INSERT into messages (user_id, title, timestamp, content) VALUES ($1, $2, $3, $4)", [user_id, title, timestamp, content])
}

async function getMessages(){
    const {rows} = await pool.query("SELECT user_id, username, membership_status, title, timestamp, content FROM messages INNER JOIN users ON users.id = messages.user_id");
    return rows;
}

module.exports = {
    insertUser,
    updateMembershipStatus,
    getUserId,
    getMembershipStatus,
    getPassword,
    insertMessage,
    getMessages
}