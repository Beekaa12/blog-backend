const { createPost, getPosts, getPostById, deletePost, updatePost, searchPosts, getPostsByUser, toggleLike, addComment } = require("../Controllers/postController")
const {admin, auth} = require("../Middlewares/authMiddleware")
const upload = require("../Middlewares/upload")
const router = require("express").Router()

router.post("/",auth,admin,upload.array("image", 5), createPost)
router.get("/", getPosts)
router.get("/:id", getPostById)
router.delete("/:id", auth, admin, deletePost)
router.put("/:id", auth,upload.array("image", 5), updatePost);
router.get("/search", searchPosts);
router.get("/user/:userId", getPostsByUser);
router.put("/:id/like", auth, toggleLike);
router.post("/:id/comment", auth, addComment);

module.exports = router;