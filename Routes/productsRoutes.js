const express = require("express")
const router = express.Router();
const { productController } = require("../Controller/controllers");

router.post("/newcategory", productController.createNewCatagory)
router.get("/category", productController.getCategories)
router.post("/newmastercategory", productController.createNewMasterCatagory)
router.get("/mastercategory", productController.getMasterCategories)
module.exports = router;