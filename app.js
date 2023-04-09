import express from 'express';
import productsRoute from './src/routes/productsRoute.js';
import cartRoute from './src/routes/cartRoute.js';
import ProductManager from './src/components/productManager.js';

const port = 8080;
const app = express();

const productManager = new ProductManager('./products.json');

app.use(express.json())
app.use(express.urlencoded({extended:true}))



app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});

app.use("/api/products", productsRoute);
app.use("/api/carts", cartRoute);