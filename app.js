const express = require("express");
const bodyParser = require("body-parser");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mailchimp.setConfig({
  apiKey: "1ceb48dd3d6c16e03028a75f5683fe1f-us13",
  server: "us13",
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000");
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  console.log(req.body.firstName);
  console.log(req.body.lastName);
  console.log(req.body.email);

  const listId = "d238db2486";
  const subscribingUser = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
  };

  async function run() {
    try {
      const response = await mailchimp.lists.addListMember(listId, {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName,
        },
      });

      res.sendFile(__dirname + "/success.html");
    } catch (e) {
      res.sendFile(__dirname + "/failure.html");
    }
  }

  run();
});





app.post("/failure", function (req, res) {
  console.log("redirect failure");
  res.redirect("/");
});
app.post("/success", function (req, res) {
  console.log("redirect success");
  res.redirect("/");
});

// API Key: 1ceb48dd3d6c16e03028a75f5683fe1f-us13

//List id: d238db2486
