const express = require("express"),
  nodemailer = require("nodemailer"),
  smtpTransport = require("nodemailer-smtp-transport"),
  multiparty = require("multiparty");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;


app.use(express.static(__dirname + "/public"));

// Serve the static html page
app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/public/index.html");
});

app.post("/send", (req, res) => {
  //1.
  let form = new multiparty.Form();

  
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'robert.crist99@ethereal.email',
      pass: '4ZXNsS8yqxKJ74zQfa'
  }
});

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
            Message: "Something went wrong. Please try again later. :(",
            status: "fail",
          });
        } else {
          console.log("Message sent: %s", info.messageId);
          // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        
          // Preview only available when sending through an Ethereal account
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
          // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
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
