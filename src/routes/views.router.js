const express = require("express");
const router = express.Router();
const productsController = require("../controllers/products.controller.js");
const messagesController = require("../controllers/messages.controller.js");

// Rutas para vistas de productos
router.get("/products", productsController.getProductsView);
router.get("/realTimeProducts", productsController.getRealTimeProductsView);

// Ruta para cargar la página de chat
router.get("/chat", messagesController.getChatView);

// Rutas para registro y login
router.get('/register', (req, res) => res.render('register'));
router.get('/login', (req, res) => res.render('login'));

module.exports = router;
