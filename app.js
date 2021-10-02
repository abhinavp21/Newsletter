require('dotenv').config()
const express = require('express')
const app = express()
const mailchimp = require("@mailchimp/mailchimp_marketing");
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded()); //Parse URL-encoded bodies

app.use(express.static(__dirname+"/public"))

mailchimp.setConfig({
    apiKey: process.env.API_KEY,
    server: "us5",
});
async function run() {
    try{
        const response = await mailchimp.ping.get();
        console.log(response);
    }
    catch(err){
        console.log(err);
    }
}

run();
app.get('/favicon.ico', (req, res) => {
    return 'your faveicon'
})
app.get("/", (req, res) => {
    console.log("get method ");
    res.sendFile(__dirname + "/signup.html")       
})

app.post("/", function (req, res) {

    const listId = process.env.LIST_ID;
    const subscribingUser = {
        firstName: req.body.fName,
        lastName: req.body.lName,
        email: req.body.email
    };
    async function run() {
        try {
            const response = await mailchimp.lists.addListMember(listId, {
                email_address: subscribingUser.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: subscribingUser.firstName,
                    LNAME: subscribingUser.lastName
                }
            });
            console.log(
                `Successfully added contact as an audience member. The contact's id is ${response.id}.`
            );
            res.sendFile(__dirname + "/success.html");
        } catch (e) {
            console.log(e);
            res.sendFile(__dirname + "/failure.html");
        }
    }
    run();
})

app.post("/failure.html", function (req, res) {
    res.redirect("/")
})
app.listen(process.env.PORT || 3000, () => {
    console.log("server is listening on port 3000");
})

