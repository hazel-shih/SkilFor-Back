const express = require("express")
const router = express.Router()
const ShoppingCartController = require("../controller/shoppingCart")
const { checkIsStudent } = require("../middlewares/identity/identity")

router.use(checkIsStudent)
router.post("/", ShoppingCartController.addItem)
router.get("/", ShoppingCartController.getItem)
router.delete("/", ShoppingCartController.deleteItem)

module.exports = router
