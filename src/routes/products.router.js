const express = require("express");
const router = express.Router();
const passport = require("passport");
const productsController = require("../controllers/products.controller");

router.get("/", passport.authenticate('session'), productsController.getAllProducts);
router.get("/:id", productsController.getProductById);
router.post("/", productsController.createProduct);
router.put("/:id", productsController.updateProduct);
router.delete("/:pid", productsController.deleteProduct);

module.exports = router;
