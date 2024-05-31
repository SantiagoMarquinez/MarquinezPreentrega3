const express = require("express");
const router = express.Router();
const productsController = require("../controllers/products.controller");
const messagesController = require("../controllers/messages.controller");

router.get("/products", productsController.getProductsView);
router.get("/realTimeProducts", productsController.getRealTimeProductsView);
router.get("/chat", messagesController.getChatView);
router.get('/register', (req, res) => res.render('register'));
router.get('/login', (req, res) => res.render('login'));

module.exports = router;







//ruta /realTimeProducts: ruta a realTimeProducts.handlebars
router.get("/realTimeProducts", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render("realTimeProducts", { products: products });
    } catch (error) {
        console.error("Error al obtener productos en tiempo real:", error);
        res.status(500).send("Error interno del servidor");
    }
});

// Ruta para cargar la página de chat
router.get("/chat", async (req, res) => {
    try {
        // Obtener todos los mensajes de la base de datos
        const messages = await messageManager.getAllMessages();
        // Renderizar la vista de chat y pasar los mensajes a la plantilla
        res.render("chat", { messages });
    } catch (error) {
        console.error("Error al cargar la página de chat:", error);
        res.status(500).send("Error interno del servidor");
    }
});

//rutas register y login

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

module.exports = router;