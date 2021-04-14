const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL ||'mongodb://localhost:27017/visitor', { useNewUrlParser: true });
mongoose.connection.on("error", function(e) { console.error(e); });

// definimos el schema
const visitorSchema = mongoose.Schema({
  name: String,
  date: { type: Date}
});

// definimos el modelo
const Visitor = mongoose.model("Visitor", visitorSchema);

app.get('/', (req, res) =>{

  if (req.query.name === undefined){
      Visitor.create({name: 'Anónimo', date: Date.now()}, function(err){
        if(err) return console.error(err);
      });
  } else {
    Visitor.create({name: req.query.name, date: Date.now()}, function(err){
      if(err) return console.error(err);
    });
  }   

    res.send(`<h1>El visitante fue almacenado con éxito</h1>`);
});

app.listen(3000, () => console.log('Listening on port 3000!'));