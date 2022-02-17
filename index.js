const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const app = express();

app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server started at port ${port}`);
});

app.get('/', (req, res) => {
    res.json({msg: "Welcome"});
})

app.post('/send', async (req, res) => {

    console.log(req.body);

    const {clientEmail, url, accept} = await req.body;
    var transporter = nodemailer.createTransport({
        service: "gmail",
        host: `smtp.gmail.com`,
        auth: {
          user:"jackbadas01@gmail.com",
          pass: "KfCCL5EyFMh3imePQcwt"
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      let mailOptions = {
        from: "mohamedfadelmoumeni@gmail.com",
        to: clientEmail,
        subject: "Réponse",
        html:accept == "Accepter" ? `
        Votre demande a ete accepté .
        Vous pouvez effecuter le paiement  : ${url}
        ` : `
        Votre demande a ete refuser .
        `
      };
      
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return res.send({status: false, error});
        } else {
          return res.send({status : true});
        
        }
    
      });

});
