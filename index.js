const express = require("express"),
  nodemailer = require("nodemailer"),
  multiparty = require("multiparty");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const user = process.env.USER
const password = process.env.PASSWORD


app.use(express.static(__dirname + "/public"));

// Serve the static html page
app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/public/index.html");
});

app.post("/send", (req, res) => {
  //1.
  let form = new multiparty.Form();

  let mailerConfig = {
    host: "smtpout.secureserver.net",
    secureConnection: false,
    port: 587,
    auth: {
      user: user,
      pass: password
    }
  };

  let transporter = nodemailer.createTransport(mailerConfig);

  form.parse(req, function (err, fields) {
    if (fields !== undefined) {
      //2. You can configure the object however you want
      const mail = {
        from: `Portfolio - ${fields.name[0]} <${fields.email[0]}>`,
        to: "olin.anderson@ucalgary.ca",
        subject: fields.subject[0],
        text: `${fields.message[0]}`,
        html: `<body><strong>Name:</strong> ${fields.name[0]}<br><strong>Subject:</strong> ${fields.subject[0]}<br><strong>Message:</strong><br><br>${fields.message[0]}</body>`,
      };

      //3.
      transporter.sendMail(mail, (err, info) => {
        if (err) {
          console.log(err);
          res.status(500).send({
            message: "Something went wrong. Please try a different email.",
            status: "fail",
          });
        } else {
          res.status(200).send({
            message: "Your message was sent successfully.",
            status: "success",
          });
        }
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
