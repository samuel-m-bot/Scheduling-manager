const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path')
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const {logger} = require('./middleware/logger')

// Replace <username>, <password>, and <your-db-name> with your own values
const uri = process.env.MONGO_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to Database');
    // Add your routes and middleware here
  })
  .catch(err => console.error(err));
app.use(express.json())
app.use(logger)
app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))

app.all('*', (req,res) =>{
  res.status(404)
  if(req.accepts('html')){
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  }else if(req.accepts('json')){
    res.json({message: '404 Not Found'})
  }else{
    res.type('txt').send('404 Not Found')
  }
})
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
