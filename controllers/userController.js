const db = require("../models/queries");
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

async function usersGet(req, res){
    res.render("index", {username: req.session.username || null});
} 

async function usersSignupGet(req, res){
    res.render("signup-form", {error: null});
} 

async function usersSignupPost(req, res){
    const {first_name, last_name, username, password} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.render("signup-form", { error: errors.array() });
    }else{
        try{
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.insertUser(first_name, last_name, username, hashedPassword);
            req.session.username = username;
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
            res.redirect("/");
        }catch (error){
            console.error("Error joining club", error);
            res.status(500).render("join-the-club", { username: req.params.username, membership_status: membership_status, error: [{msg: "Internal Server Error. Please try again later."}] });
        }
    }
}

module.exports = {
    usersGet,
    usersSignupGet,
    usersSignupPost,
    usersJoinTheClubGet,
    usersJoinTheClubPost
}