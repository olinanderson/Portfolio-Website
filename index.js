const express = require("express"),
  nodemailer = require("nodemailer"),
  smtpTransport = require("nodemailer-smtp-transport"),
  multiparty = require("multiparty");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

var transporter = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  })
);

app.use(express.static(__dirname + "/public"));

// Serve the static html page
app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/public/index.html");
});

app.post("/send", (req, res) => {
  //1.
  let form = new multiparty.Form();
  let data = {};

  form.parse(req, function (err, fields) {
    if (fields !== undefined) {
      //2. You can configure the object however you want
      const mail = {
        from: `OA - ${fields.name[0]} <${fields.email[0]}>`,
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
            Message: "Something went wrong. Please try again later. :(",
            status: "fail",
          });
        } else {
          res.status(200).send({
            message: "Thanks for getting in touch!",
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
