var express = require("express");

var exphbs = require("express-handlebars");
const mercadopago = require("mercadopago");
const bodyParser = require("body-parser");

mercadopago.configure({
   access_token:
      "APP_USR-8208253118659647-112521-dd670f3fd6aa9147df51117701a2082e-677408439",
   integrator_id: "dev_2e4ad5dd362f11eb809d0242ac130004",
});

datos = {
   // urlApp: "https://localhost:3001"
   urlApp: "https://davidmoreno-mp-commerce-node.herokuapp.com",
};

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.get("/", function (req, res) {
   res.render("home");
});

app.get("/detail", function (req, res) {
   res.render("detail", req.query);
});

app.get("/failure", function (req, res) {
   res.render("status", req.query);
});
app.get("/pending", function (req, res) {
   res.render("status", req.query);
});
app.get("/aproved", function (req, res) {
   res.render("status", req.query);
});

app.post("/notifications", function (req, res, next) {
   console.log("**************************↓↓WEBHOOK↓↓**************************");
   console.log(req.body);
   console.log("************************↑↑FIN WEBHOOK↑↑************************");
   console.log("------------------------------------------------------------------------------");
   let idPago = req.body.data.id;
   if (idPago) {
      console.log("**************************↓↓ID↓↓**************************");
      console.log("El ID de pago es: " + idPago);
      console.log("El app_id de pago es: " + req.body.application_id);
      console.log("************************↑↑FIN ID↑↑************************");
   }
   res.sendStatus(201);
});

app.post("/iniciar_pago", function (req, res) {
   const { title, price, img, unit } = req.body;
   // Crea un objeto de preferencia
   let preference = {
      items: [
         {
            id: 1234,
            title: title,
            unit_price: parseInt(price),
            picture_url: `${datos.urlApp}${img}`,
            description: "Dispositivo móvil de Tienda e-commerce",
            quantity: parseInt(unit),
            external_reference: "davidmorenocode@gmail.com",
         },
      ],
      payer: {
         name: "Lalo",
         surname: "Landa",
         email: "test_user_46542185@testuser.com",
         phone: {
            area_code: "52",
            number: 5549737300,
         },
         identification: {
            type: "DNI",
            number: "22334445",
         },
         address: {
            street_name: "Insurgentes Sur",
            street_number: 1602,
            zip_code: "03940",
         },
      },
      payment_methods: {
         installments: 6,
         excluded_payment_methods: [
            {
               id: "diners",
            },
         ],
         excluded_payment_types: [
            {
               id: "atm",
            },
         ],
      },
      back_urls: {
         failure: `${datos.urlApp}/failure`,
         pending: `${datos.urlApp}/pending`,
         success: `${datos.urlApp}/aproved`,
      },
      notification_url: `${datos.urlApp}/notifications`,
      auto_return: "approved",
      external_reference: "davidmorenocode@gmail.com",
   };

   
   mercadopago.preferences
      .create(preference)
      .then(function (response) {         
         global.init_point = response.body.init_point;
         res.redirect(global.init_point);
      })
      .catch(function (error) {
         console.log(error);
      });

});

app.use(express.static("assets"));

app.use("/assets", express.static(__dirname + "/assets"));

app.listen(process.env.PORT || 3001, () => {
});

