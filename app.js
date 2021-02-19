var express = require("express");
var exphbs = require("express-handlebars");
var body_parser = require("body-parser");
const mercadopago = require("mercadopago");
var port = process.env.PORT || 3000;

// Agrega credenciales
mercadopago.configure({
   access_token:
      "APP_USR-8208253118659647-112521-dd670f3fd6aa9147df51117701a2082e-677408439",
   integrator_id:'dev_2e4ad5dd362f11eb809d0242ac130004'
});

var app = express();
app.use(body_parser.urlencoded({ extended: true }));

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(express.static("assets"));

app.use("/assets", express.static(__dirname + "/assets"));

app.get("/", function (req, res) {
   res.render("home");
});

app.get("/detail", function (req, res) {
   res.render("detail", req.query);
});

app.post("/pagar", function (req, res) {

	const {title, price, img, unit} = req.body;
   // Crea un objeto de preferencia
	// const host = `${req.protocol}://${req.get('host')}`
	const host = "http://localhost:3000"
   let preference = {
      items: [
         {	
				id: "1234",
            title: title,
            unit_price: parseInt(price),
            picture_url: img,
				description: "Dispositivo móvil de Tienda e-commerce",
            quantity: parseInt(unit),
         },
      ],
		payer:{
			name: "Lalo",
			surname: "Landa",
			email: "test_user_46542185@testuser.com",
			phone:{
				area_code: "52",
				number: 5549737300
			},
			identification:{
				type: "DNI",
				number: "22334445"
			},
			address:{
				street_name: "Insurgentes Sur",
				street_number: 1602,
				zip_code: "03940"
			}
		},
		payment_methods:{
			installments: 6,
         excluded_payment_methods:[
            {
               id: "atm"
            }
         ],
         excluded_payment_types:[
            {
               id: "diners"
            }
         ]
      },
      back_urls:{
         success: `${host}/success`,
         pending: `${host}/pending`,
         failure: `${host}/failure`
      },
      notification_url: `${host}/notifications`,
      auto_return: "approved",
		external_reference: "davidmorenosoft@gmail.com"
   };

   mercadopago.preferences
      .create(preference)
      .then(function (response) {
         // Este valor reemplazará el string "<%= global.id %>" en tu HTML
         
         // console.log(response.body.init_point);

         res.redirect(response.body.init_point);
      })
      .catch(function (error) {
         console.log(error);
      });
});

app.get("/success", function (req, res) {
   res.render("success");

});
app.get("/pending", function (req, res) {
   res.render("pending");

});
app.get("/failure", function (req, res) {
   res.render("failure");
});

app.post("/notifications", function (req, res) {
   res.render("notifications", req.query);
   console.log('Notificación:');
   console.log(req.body.data);
   console.log('Fin notificación');
   res.sendStatus(201);
});
app.listen(port);
