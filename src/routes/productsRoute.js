import { promises as fs } from 'fs'
import { Router } from 'express';

const router = Router();
const productsFilePath = './products.json';

// Mostrar todos los productos
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; 
    const productsFile = await fs.readFile(productsFilePath);
    const products = JSON.parse(productsFile);
    const filteredProducts = products.slice(0, limit);
    res.json(filteredProducts);
  } catch (error) {
    res.status(500).json({ message: 'Error listando los productos', error });
  }
});

// Traer producto por id
router.get('/:pid', async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = products.find(p => p.id === pid);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error lsitando el producto', error });
  }
});

// Agregar nuevo producto
router.post('/', async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }
    const id = Math.floor(Math.random() * 1000).toString(); // Generar id random
    const newProduct = { id, title, description, code, price, status: true, stock, category, thumbnails };

    // Leer el contenido del archivo JSON en una variable
    const productsFile = await fs.readFile(productsFilePath, 'utf-8');

    // Parsear el contenido del archivo JSON a un objeto
    const products = JSON.parse(productsFile);

    // Agregar el nuevo producto al objeto
    products.push(newProduct);

    // Escribir el objeto actualizado al archivo JSON
    await fs.writeFile(productsFilePath, JSON.stringify(products));

    res.status(201).json({ message: 'Producto creado satisfactoriamente', product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error de servidor' });
  }
});

// Actualizar producto por id
router.put('/:pid', async (req, res) => {
    try {
      const pid = req.params.pid;
      const updatedProduct = req.body;
      let products = JSON.parse(fs.readFile(productsFilePath));
  
      const index = products.findIndex((product) => product.id == pid);
  
      if (index === -1) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
  
      const oldProduct = products[index];
      const newProduct = { ...oldProduct, ...updatedProduct, id: oldProduct.id };
  
      products[index] = newProduct;
      fs.writeFile(productsFilePath, JSON.stringify(products));
      res.status(200).json({ message: `Producto con el id: ${pid} actualizado satisfactoriamente`, product: newProduct });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error de servidor' });
    }
  });

// Borrar producto por id

router.delete('/:pid', async (req, res) => {
  try {
    const pid = req.params.pid;
    let products = JSON.parse(fs.readFile(productsFilePath));

    const index = products.findIndex((product) => product.id == pid);

    if (index === -1) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    products.splice(index, 1);
    fs.writeFile(productsFilePath, JSON.stringify(products));
    res.status(200).json({ message: `Producto con el id: ${pid} borrado satisfactoriamente` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error de servidor' });
  }
});

export default router;