const express = require("express")
const router = express.Router()
const ShoppingCartController = require("../controller/shoppingCart")

router.post("/", ShoppingCartController.addItem)
router.get("/", ShoppingCartController.getItem)
router.delete("/", ShoppingCartController.deleteItem)
router.put("/", ShoppingCartController.editItem)

module.exports = router
