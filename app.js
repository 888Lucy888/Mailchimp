const express = require("express");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);


app.get("/",(req,res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/",(req,res) => {
    const fName = req.body.fName;
    const lName = req.body.lName;
    const email = req.body.email;
    
    const apiKey = "34e566059f4511c789f6b1d80d74e161-us5";
    const list_id = "6bc01b5b79";
    const url = "https://us5.api.mailchimp.com/3.0/lists/" + list_id;

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    }
    var jsonData = JSON.stringify(data);
    console.log(JSON.parse(jsonData));
    const options = {
        method: "POST",
        auth: "888Lucy888:" + apiKey
    }
    const name = "<li>item 1</li><li>item 2</li>";
    var mailRequest = https.request(url, options, (response) => {
        if(response.statusCode === 200) {
            response.on("data", (data) => {
                var jsonResp = JSON.parse(data);
                console.log(jsonResp);
                if(jsonResp["error_count"] === 0) {
                    res.render(__dirname + "/success.html", {name:name});
                } else {
                    res.render(__dirname + "/failure.html", {name:name});
                    console.log(JSON.stringify(jsonResp.errors[0]));
                    console.log(jsonResp.errors[0]["error_code"]);
                    console.log(jsonResp.errors[0]["error"]);
                }
            }).on("error", (e) => {
                res.render(__dirname + "/failure.html", {name:name});
            });
        } else {
            res.render(__dirname + "/failure.html", {name:name});
        }
    });

    mailRequest.write(jsonData);
    mailRequest.end();

});


app.listen(3000, () => {
    console.log("Listening on port 3000");
});


app.get("/failure", (req, res) => {
    res.redirect("/");
});

app.get("/success", (req, res) => {
    res.redirect("/");
});





