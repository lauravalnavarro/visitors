const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { urlencoded, bodyParser } = require("body-parser");

app.set('view engine', 'pug');
app.set('views', 'views');
app.use(bodyParser, urlencoded({extended: true}));

mongoose.connect(process.env.MONGODB_URL ||'mongodb://localhost:27017/visitor', { useNewUrlParser: true });
mongoose.connection.on("error", function(e) { console.error(e); });

// definimos el schema
const schema = mongoose.Schema({
  name: {type: String, default: 'Anónimo'},
  count: { type: Number, default: 1}
});

// definimos el modelo
var Visitor = mongoose.model('Visitor', schema);

app.get('/', async (req, res) => {
  const visitorName = req.query.name;
  const existVisitor = await Visitor.findOne({name: visitorName}).catch(error => console.log(error));
  
  if (existVisitor && visitorName){
    await countVisits(visitorName).catch(error => console.log(error)); 
  } else {
    await Visitor.create({name: visitorName}); 
  }

  await Visitor.find(function(err, visitors){
    if(err) return console.error(err, visitors);
    console.log("pintando" + visitors);
    res.render('index', {visitors: visitors});
  });

  
});

function countVisits(visitorName){
  Visitor.findOne({name: visitorName}, function(err, visitor){
    if(err) return console.error(err);
    visitor.count +=1;
    visitor.save(function(err){
      if (err) return console.log(err);
    });
  })
}

app.listen(3000, () => console.log('Listening on port 3000!'));