const express = require('express');


const app = express();

//Dos parametros de los requests URLs y HTTP method
// URLs --> lo que esta detras del /, si solo / es la root, la url base 

//http method --> GET, POST

//GET method
 

//middleware (hace todo lo de dentro de la carpeta public accesible)

app.use(express.static('public'))

//our first route

app.get('/home', (request, response, next) =>
    response.sendFile(__dirname + '/views/home-page.html'));


//Nueva ruta

app.get('/cat', (request, response, next) => 
    response.sendFile(__dirname + '/views/cat-pages.html'));

  
//no hemos usado next (middleware function)

//Start the server!

app.listen(3000, () => console.log('My first app listening on port 3000! '));



