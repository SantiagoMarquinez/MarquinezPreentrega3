const express = require("express");
const router = express.Router(); 
const CartManager = require("../controllers/cartManager");
const cartManager = new CartManager(); //"./src/models/carts.json"


// Crear un carrito
router.post ("/", async (req, res)=>{
    try {
        const newCart = await cartManager.createNewCart();
        res.json(newCart)
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        });
        console.error("Error al crear el carrito");
    }
});


// Mostrar todos los carritos
router.get("/", async (req,res)=>{
    try{
        const carts = await cartManager.getCarts();
        res.status(200).send(carts);
    }catch(error){
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
});

// Mostrar los detalles completos de un carrito por su ID
router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await cartManager.getProductsFromCart(cartId);
        if (!cart) {
            return res.status(404).json({ error: `No se encontró el carrito con ID ${cartId}` });
        }
        console.log("Productos del carrito:", cart.cart);
        console.log(cart)
        // Enviar solo los productos del carrito
        res.render('carts', { cart: cart.cart });
    } catch (error) {
        console.error(`Error al obtener el carrito con ID ${cartId}:`, error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});




// Agregar un producto a un carrito con un ID determinado
router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1; 

    try {
        const updateCart = await cartManager.addProductToCart (cartId, {_id: productId}, quantity);
        res.json(updateCart.products);
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        });
        console.error("Error - El producto no fue agregado al carrito", error);
    }
});

// Eliminar un producto del carrito 
router.delete("/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const result = await cartManager.deleteProductById(cartId, productId);
        
        if (result.success) {
            res.status(200).send("Producto eliminado correctamente");
        } else {
            res.status(404).send("No se pudo eliminar el producto");
        }
    } catch (error) {
        console.error(`Error al eliminar el producto ${productId} del carrito ${cartId}`, error);
        res.status(500).send("Error interno del servidor");
    }
});

// Actualizar carrito
router.put ("/:cid", async(req, res)=>{
    const cartId = req.params.cid;
    const products = req.body.products;
    try {
        const updatedCart = await cartManager.updateCart(cartId, products);
        if (!updatedCart) {
            return res.status(404).json({ error: `No se encontró el carrito con ID ${cartId}` });
        }
        res.json(updatedCart.products);
    } catch (error) {
        console.error(`Error al actualizar el carrito con ID ${cartId}:`, error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Vaciar carrito
router.delete ("/:cid", async(req, res)=>{
    const cartId = req.params.cid;
    try {
        const updatedCart = await cartManager.clearCart(cartId);
        if (!updatedCart) {
            return res.status(404).json({ error: `No se encontró el carrito con ID ${cartId}` });
        }
        res.json(updatedCart.products);
    } catch (error) {
        console.error(`Error al vaciar el carrito con ID ${cartId}:`, error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


//eliminar un producto del carrito por id
router.delete("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const updatedCart = await cartManager.deleteProductById(cartId, productId);
        
        if (!updatedCart) {
            return res.status(404).json({ error: `No se encontró el carrito con ID ${cartId}` });
        }

        res.json(updatedCart);
    } catch (error) {
        console.error(`Error al eliminar el producto del carrito con ID ${cartId}:`, error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

module.exports = router;
