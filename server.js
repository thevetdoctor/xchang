// require('dotenv').config(); // read .env files
const express = require('express');
const path = require('path');



const app = express();
const port = 1234;

app.use(express.static('./'));

// app.use((req, res) => res.render(`/fetch/fetch`));
app.use((req, res) => res.sendFile(`${__dirname}/index.html`));

// app.get('/', (req, res) => {
// 	res.send('Welcome here!');
// })


// app.listen(port, () => {
// 	'Server started on 1234';
// })

var server = app.listen(port, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})