const { createPost, getPosts, getPostById, deletePost } = require("../Controllers/postController")
const {admin, auth} = require("../Middlewares/authMiddleware")
const router = require("express").Router()

router.post("/",auth,admin, createPost)
router.get("/", getPosts)
router.get("/:id", getPostById)
router.delete("/:id", auth, admin, deletePost)

module.exports = router;