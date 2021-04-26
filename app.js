
const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.set('view engine', 'pug');
app.set('views', 'views');

mongoose.connect(process.env.MONGODB_URL ||'mongodb://localhost:27017/visitor', { useNewUrlParser: true });
mongoose.connection.on("error", function(e) { console.error(e); });

// definimos el schema
const visitorSchema = mongoose.Schema({
  name: 
    {type: String, 
    default: 'Anónimo'},
  count: 
    {type: Number, 
      default : 1}
});

// definimos el modelo
const Visitor = mongoose.model("Visitor", visitorSchema);

app.get('/', async (req, res) =>{
  const currentVisitor = await Visitor.findOne({name: req.query.name});

  if (currentVisitor && currentVisitor.name !== 'Anónimo'){
      currentVisitor.count += 1;
      currentVisitor.save();
  } else {
      await Visitor.create({name: req.query.name || 'Anónimo'});
  }   
  const visitors = await Visitor.find();
  return res.render('index', {
    pageTitle: 'Visitantes recurrentes',
    visitors});
});


app.listen(3000, () => console.log('Listening on port 3000!'));