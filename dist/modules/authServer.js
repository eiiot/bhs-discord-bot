import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const expressApp = express();
const authServer = (client, admin, app) => {
    // on request recieved validate discord + google token
    expressApp.get("/discord", async (req, res) => {
        try {
            let discordCode = req.query.discordCode;
            let googleToken = req.query.googleToken;
            // validate google token
            const decodedToken = await admin.auth().verifyIdToken(googleToken);
            let userEmail = decodedToken.email;
            let userName = decodedToken.name;
            // validate discord token
            let data = `client_id=${process.env.DISCORD_CLIENT_ID}&client_secret=${process.env.DISCORD_CLIENT_SECRET}&grant_type=authorization_code&code=${discordCode}&redirect_uri=https://auth.bhs.sh`;
            const discordToken = await axios.post("https://discord.com/api/v8/oauth2/token", data);
            // get user ID
            const usersConfig = {
                headers: {
                    Authorization: `Bearer ${discordToken.data.access_token}`,
                },
            };
            const discordUser = await axios.get(`https://discord.com/api/v8/users/@me`, usersConfig);
            const discordUserID = discordUser.data.id;
            // check if email ends in berkeley.net
            if (!(userEmail.endsWith(".berkeley.net") ||
                userEmail.endsWith("@berkeley.net"))) {
                throw new Error("invalid_email");
            }
            const db = app.firestore();
            const doc = await db.collection("emails").doc(discordUserID).get();
            // check if user is already in database
            if (doc.exists) {
                throw new Error("user_exists");
            }
            // otherwise verify user and add to database
            let member;
            try {
                member = await client.guilds.cache
                    .get("762412666521124866")
                    .members.fetch(discordUserID);
                member.roles.add("762720121205555220");
            }
            catch (err) {
                console.log(err);
                throw new Error("discord_error");
            }
            if (userEmail.endsWith("@berkeley.net")) {
                member.roles.add("765670230747381790");
            }
            try {
                await member.setNickname(userName);
            }
            catch (err) {
                console.log(err);
                throw new Error("discord_error");
            }
            const userObject = {
                id: discordUserID,
                email: userEmail,
                name: userName,
                date: new Date(),
                version: 2.0,
            };
            try {
                await db.collection("emails").doc(discordUserID).set(userObject);
            }
            catch (err) {
                console.log(err);
                throw new Error("database_error");
            }
            const logEmbed = {
                color: 0xeff624,
                title: "Verification",
                description: `<@${discordUserID}> was verified!`,
                timestamp: new Date(),
            };
            const adminChannel = (await client.guilds.cache
                .get("762412666521124866")
                .channels.fetch("877376896311132210"));
            await adminChannel.send({
                embeds: [logEmbed],
            });
            // redirect user to /success using express
            res.redirect("https://auth.bhs.sh/success");
            return;
        }
        catch (err) {
            console.log(err);
            let errorType;
            if (err.message.toLowerCase().includes("request failed with status code")) {
                errorType = "discord_error";
            }
            else if (err.message.toLowerCase().includes("firebase")) {
                errorType = "google_error";
            }
            else if (err.message) {
                errorType = err.message;
            }
            else {
                errorType = "unknown_error";
            }
            res.redirect(`https://auth.bhs.sh?error=${errorType}`);
            return;
        }
    });
    expressApp.listen(80, () => {
        console.log(`Listening on port ${80}`);
    });
};
export default authServer;
