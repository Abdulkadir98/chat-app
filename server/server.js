const path = require('path');
const express = require('express');
var app = express();

const port = process.env.PORT || 3000;

var publicPath = path.join(__dirname, '/../public');

app.use(express.static(publicPath));

app.get('/', (req,res) => {
    res.send();
});


app.listen(port, () => {
    console.log(`Server started at ${port}`);
});