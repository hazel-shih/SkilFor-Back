const express = require("express")
const router = express.Router()
const ShoppingCartController = require("../controller/shoppingCart")

router.post("/", ShoppingCartController.addItem)
router.get("/", ShoppingCartController.getItem)

module.exports = router
