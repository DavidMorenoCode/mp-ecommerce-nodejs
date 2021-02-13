const mercadopago = require("mercadopago");

// Agrega credenciales
mercadopago.configure({
   access_token:
      "APP_USR-8208253118659647-112521-dd670f3fd6aa9147df51117701a2082e-677408439",
});

// Crea un objeto de preferencia
let preference = {
   items: [
      {
         title: "Mi producto",
         unit_price: 100,
         quantity: 1,
      },
   ],
};

mercadopago.preferences
   .create(preference)
   .then(function (response) {
      // Este valor reemplazará el string "<%= global.id %>" en tu HTML
      global.id = response.body.id;
   })
   .catch(function (error) {
      console.log(error);
   });
