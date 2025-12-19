const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'public')));

let products;


app.get('/products', (req, res) => {
    res.json(products);
});


app.get('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);

    if (!product) {
        return res.json({ message: "Product not found" });
    }

    res.json(product);
});



app.post('/products', (req, res) => {
    products.push(req.body);

    fs.writeFileSync('products.json', JSON.stringify(products, null, 2));

    res.send("Product added successfully");
});


fs.readFile('products.json', (err, data) => {
    if (!err) {
        products = JSON.parse(data);
        console.log(products);
        app.listen(8080, () => {
            console.log("Server running on port 8080");
        });
    }
});
