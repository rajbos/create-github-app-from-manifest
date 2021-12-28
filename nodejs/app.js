const express = require('express')
const path = require('path')
const app = express()

// Static Middleware
let staticDirectory = __dirname + '/public';
app.use(express.static(path.join('..', 'html')))

// View Engine Setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
  
app.listen(8080, function(error){
    if(error) throw error
    console.log("Server created Successfully")
    console.log("Open a browser on http://localhost:8080/")
})