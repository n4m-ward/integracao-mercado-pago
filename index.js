const express = require("express");
const MercadoPago = require("mercadopago"); 
const { setTimeout } = require("timers");
const app = express();
const port = process.env.PORT || 3333;

MercadoPago.configure({
    sandbox: true,
    access_token: "TEST-3260321011293596-061906-6cdf2c22206e79007f91b8f5642b3cf2-267336909"
});


app.get("/", (req, res) => {



      MercadoPago.payment.search({
      }).then(function (data) {
        res.send(data);
      }).catch(function (error) {
        res.send(error);
      });

    
});

app.get("/pagar",async (req, res) => {
    var id = "" + Date.now();
    var emailDoPagador = "victordevtb@outlook.com";

    var dados = {
        items: [
            item = {
                id: id,
                title: "2x video games;3x camisas",
                quantity: 1,
                currency_id: 'BRL',
                unit_price: parseFloat(150)
            }
        ],
        payer:{
            email: emailDoPagador
        },
        external_reference: id
    }

    try{
        var pagamento = await MercadoPago.preferences.create(dados);
        return res.redirect(pagamento.body.init_point);
    }catch(err){
        return res.send(err.message);
    }
});

app.post("/not",(req, res) => {
    var id = req.query.id;

    setTimeout(() => {

        var filtro = {
            "order.id": id
        }

        MercadoPago.payment.search({
            qs: filtro
        }).then(data => {
            var pagamento = data.body.results[0];

            if(pagamento != undefined){
                console.log(pagamento.external_reference);
                console.log(pagamento.status); // approved
            }else{
                console.log("Pagamento não existe!");
            }
        }).catch(err => {
            console.log(err);
        });

    },20000)

    res.send("OK");
});


app.listen(port,(req, res) => {

    console.log("Servidor rodando!");

});