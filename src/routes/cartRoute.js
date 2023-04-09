import { promises as fs } from 'fs';
import { Router } from 'express'

const cartRoutePath = './carrito.json';
const router = Router();

// Ruta para crear un nuevo carrito
const readCartsFile = () => {
    try {
      const cartsData = fs.readFileSync(cartRoutePath, 'utf-8');
      return JSON.parse(cartsData);
    } catch (error) {
      // Si ocurre algún error al leer el archivo, retorna un array vacío
      return [];
    }
  };
  
  // Función para escribir los datos al archivo carrito.json
  const writeCartsFile = (data) => {
    fs.writeFileSync(cartRoutePath, JSON.stringify(data, null, 2));
  };
  
  // Ruta raíz POST /api/carts/
  router.post('/', (req, res) => {
    // Genera un nuevo id incremental para el carrito
    const cartsData = readCartsFile();
    const newCartId = cartsData.length > 0 ? cartsData[cartsData.length - 1].id + 1 : 1;
  
    // Crea un nuevo carrito con el id generado y la lista de productos vacía
    const newCart = { id: newCartId, products: [] };
  
    // Agrega el nuevo carrito a la lista de carritos y escribe los datos al archivo carrito.json
    cartsData.push(newCart);
    writeCartsFile(cartsData);
  
    res.status(201).json(newCart);
  });

// Ruta para obtener los productos de un carrito
router.get('/:cid', async (req, res) => {
  try {
    const cartsFile = await fs.readFile('./carrito.json');
    const carts = JSON.parse(cartsFile);
    
    // Buscamos el carrito que tenga el id proporcionado en la ruta
    const cart = carts.filter(c => c.id === req.params.cid)[0];
    if (!cart) {
      return res.status(404).send('Carrito no encontrado');
    }

    res.json(cart.products);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error de servidor');
  }
});
const updateCartsFile = (cartsData) => {
  fs.writeFileSync(cartRoutePath, JSON.stringify(cartsData, null, 2));
};
// Ruta para agregar un producto a un carrito
router.post('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const quantity = req.body.quantity || 1;

    const cartsFile = await fs.readFile('./carrito.json', 'utf8');
    const carts = JSON.parse(cartsFile);
    
    // Buscamos el carrito que tenga el id proporcionado en la ruta
    const cart = carts.filter(c => c.id === cid);
    if (!cart) {
      return res.status(404).send('Carrito no encontrado');
    }

    const productsFile = await fs.readFile('./products.json', 'utf-8');
    const products = JSON.parse(productsFile);
    
    // Buscamos el producto que tenga el id proporcionado en la ruta
    const product = products.filter(p => p.id === pid);
    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }

    // Verificamos si el producto ya existe en el carrito
    const existingProduct = cart.products.filter(p => p.product === pid);
    if (existingProduct) {
      // Si el producto ya existe, incrementamos la cantidad
      existingProduct.quantity += quantity;
    } else {
      // Si el producto no existe, lo agregamos al array de productos del carrito
      cart.products.push({
        product: pid,
        quantity: quantity
      });
    }

    // Actualizamos el archivo carrito.json con los cambios
    updateCartsFile(carts);

    res.json(cart.products);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error de servidor');
  }
});


export default router;
