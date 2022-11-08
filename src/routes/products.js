const express = require("express");
const multer = require("multer");

const productsRouter = express.Router();
const {
  get,
  add,
  edit,
  drop,
  
} = require("../controllers/products");

const isLogin = require("../middleware/isLogin");
const imgUpload = require("../middleware/upload");
const validate = require("../middleware/validate");
const isAllowed = require("../middleware/allowedRole")

function uploadFile(req, res, next) {
  const upload = imgUpload.single("imageUrl");
  upload(req, res, function (err) {
    if (err) {
      console.log("error found : ", err);
      if (err.code === "LIMIT_FILE_SIZE")
        return res.status(400).json({
          status: 400,
          msg: "File too large, image must be 2MB or lower",
          err: err.code,
        });
      if (err.code === "WRONG_EXSTENSION")
        return res.status(415).json({
          status: 415,
          msg: "Only .jpg, .jpeg and .png format allowed",
          error: err.code,
        });
      return res.status(500).json({
        msg: `Internal Server Errors`,
        err,
      });
    }
    next();
  });
}



productsRouter.get("/all", get);
productsRouter.post(
  "/add",
  isLogin(),
  isAllowed("admin"),
  imgUpload.single("imageUrl"),
  // validate.body("name", "category", "imageUrl", "price", "quantity", "sold"),
  add
);

productsRouter.patch(
  "/modify/:id", 
  isLogin(),
  isAllowed("admin"),
  uploadFile,
  // validate.body("name", "category", "imageUrl", "price", "quantity", "sold"),
  edit
  );

// productsRouter.patch(
//   "/:id",
//   isLogin(),
//   allowedRoles("Admin"),
//   uploads,
//   // validate.patchBody(...allowed.body),
//   update
// );


productsRouter.delete("/del/:id", drop);


module.exports = productsRouter;



