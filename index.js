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

app.get('/pay/:priceProduct/:name', async (req, res) => {
  

  try{
    const {priceProduct, name} = req.params;
    const stripe = require('stripe')('sk_test_51KP75OHR4mumGY8iJTRnia6tVLbBiBy1cCzh5CfdZngEURzvGs6PyYkw7SXLiWk04XdoiDC2kj48Kons7zhw85K000fpGYDOvY');
    const product = await stripe.products.create({
      name: name,
    });
    const price = await stripe.prices.create({
      unit_amount: priceProduct*100,
      currency: 'usd',
      recurring: {interval: 'month'},
      product: product.id
    });
   
const paymentLink = await stripe.paymentLinks.create({
  line_items: [
    {
      price: price.id,
      quantity: 1,
    },
  ],
  after_completion: {type: 'redirect', redirect: {url: 'https://google.com'}},
});
res.send({link : paymentLink});
  }catch(e){
    res.send({err: e.message});
  }
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
        subject: accept == "Accepter" ? "Belgium Transfer : Acceptation de la demande de réservation de taxi.":"Belgium Transfer : Refus de la demande de réservation de taxi.",
        html:accept == "Accepter" ? `
        Bonjour,

Suite à votre demande de réservation effectuée via notre site Belgium Transfer, nous avons le plaisir de vous informer que votre demande a été acceptée.
Vous pouvez passer à l'étape de paiement en cliquant sur le lien ${url}.
Et nous sommes à votre disposition pour toute information supplémentaire que vous souhaiteriez de notre part.

Bon voyage.
Belgium Transfer 
        ` : `
        Bonjour,

Suite à votre demande de réservation effectuée via notre site Belgium Transfer, nous sommes désolés de vous informer que votre demande a été refusée pour des raisons fonctionnelles.
Veuillez réessayer la prochaine fois, et nous serons à votre disposition pour toute information supplémentaire que vous souhaiteriez de notre part.

Bon voyage.
Belgium Transfer.
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
