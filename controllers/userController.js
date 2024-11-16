const db = require("../models/queries");
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

async function usersGet(req, res){
    const messages = await getMessages();
    const isMember = req.session.membership_status === "active";
    const isAdmin = req.session.is_admin === "true";
    res.render("index", {username: req.session.username || null, messages : messages, isMember: isMember, isAdmin: isAdmin});
} 

async function getMessages(req, res) {
    const messages = await db.getMessages();
    return messages;
}

async function usersSignupGet(req, res){
    res.render("signup-form", {error: null});
}

async function usersSignupPost(req, res){
    const {first_name, last_name, username, password} = req.body;
    const membership_status = await db.getMembershipStatus(username);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.render("signup-form", { error: errors.array() });
    }else{
        try{
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.insertUser(first_name, last_name, username, hashedPassword);
            req.session.username = username;
            req.session.membership_status = membership_status;
            res.redirect("/");
        }catch (error){
            console.error("Error inserting user:", error);
            res.status(500).render("signup-form", { error: [{msg: "Internal Server Error. Please try again later."}] });
        }
        
    }
} 

async function usersJoinTheClubGet(req, res){
    const username = req.params.username;
    const membership_status = await db.getMembershipStatus(username);
    res.render("join-the-club", {username: username, membership_status: membership_status, error: null});
}

async function usersJoinTheClubPost(req, res){
    const username = req.params.username;
    const membership_status = await db.getMembershipStatus(username);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.render("join-the-club", { username: req.params.username, membership_status: membership_status, error: errors.array() });
    }else{
        try{
            await db.updateMembershipStatus(username);
            const membership_status = await db.getMembershipStatus(username);
            req.session.membership_status = membership_status;
            res.redirect("/");
        }catch (error){
            console.error("Error joining club", error);
            res.status(500).render("join-the-club", { username: req.params.username, membership_status: membership_status, error: [{msg: "Internal Server Error. Please try again later."}] });
        }
    }
}

async function userLoginGet(req, res){
    res.render("login-form", {error: null});
}

async function userLoginPost(req, res){
    const {username, password} = req.body;
    const membership_status = await db.getMembershipStatus(username);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.render("login-form", { error: errors.array() });
    }else{
        try{
            const hashedPassword = await db.getPassword(username);
        if (!hashedPassword) {
            return res.render("login-form", { error: [{ msg: "Invalid username or password" }] });
        }
        const isMatch = await bcrypt.compare(password, hashedPassword);
        if (!isMatch) {
            return res.render("login-form", { error: [{ msg: "Invalid username or password" }] });
        }
        req.session.username = username;
        req.session.membership_status = membership_status;
        res.redirect("/");
        }catch(error) {
            console.error("Error logging in", error);
            res.status(500).render("login-form", {error: [{msg: "Internal Server Error. Please try again later."}] });
        }
    }
}

async function userCreateMessageGet(req, res){
    const username = req.params.username;
    res.render("create-message-form", {username: username, errors: null});
}

async function userCreateMessagePost(req, res){
    const username = req.params.username;
    const {title, content} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.render("create-message-form", { error: errors.array() });
    }else{
        try{
            const user_id = await db.getUserId(username);
            if (!user_id) {
                return res.status(400).render("create-message-form", { error: [{ msg: "Invalid user." }] });
            }
            const timestamp = new Date().toISOString();
            await db.insertMessage(user_id, title, timestamp, content);
            res.redirect("/");
        }catch(error) {
            console.error("Error creating message", error);
            res.status(500).render("create-message-form", {error: [{msg: "Internal Server Error. Please try again later."}] });
        }
    }
}

async function usersBecomeAdminGet(req, res){
    const username = req.params.username;
    const isAdmin = req.session.is_admin === "true";
    res.render("become-admin-form", {username: username, isAdmin: isAdmin, error: null});
}

async function usersBecomeAdminPost(req, res){
    const username = req.params.username;
    const isAdmin = req.session.is_admin;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.render("become-admin-form", { username: username, isAdmin: isAdmin, error: errors.array() });
    }else{
        try{
            await db.adminStatusUpdate(username);
            req.session.is_admin = "true";
            res.redirect("/");
        }catch(error) {
            console.error("Error becoming an admin", error);
            res.status(500).render("become-admin-form", { username: username, isAdmin: isAdmin, error: [{msg: "Internal Server Error. Please try again later."}] });
        } 
    }
   
}

async function usersMessagesDelete(req, res){
    const username = req.params.username;
    const user_id = await db.getUserId(username);
    const messages = await getMessages();
    const isMember = req.session.membership_status === "active";
    const isAdmin = req.session.is_admin === "true";
    try{
        await db.deleteMessage(user_id);
        res.redirect("/");
    }catch(error) {
        console.error("Error deleting message", error);
        res.status(500).render("index", { username: username, messages : messages, isMember: isMember, isAdmin: isAdmin, error: [{msg: "Internal Server Error. Please try again later."}] });
    } 
}


module.exports = {
    usersGet,
    usersSignupGet,
    usersSignupPost,
    usersJoinTheClubGet,
    usersJoinTheClubPost,
    userLoginGet,
    userLoginPost,
    userCreateMessageGet,
    userCreateMessagePost,
    usersBecomeAdminGet,
    usersBecomeAdminPost,
    usersMessagesDelete
    
}