const Post = require("../Models/PostModel")
const createPost = async (req, res)=>{
  try {
    const {title, content, image, author}= req.body;
    const post = await Post.create({
      title,
      content,
      image,
      author: req.user.id
    })
    res.json(post);
    
  } catch (error) {
    res.status(500).json({message: "Error Creating Post"})
  }};

  const getPosts =async(req, res)=>{
    try {
      const posts = await Post.find().populate("author","name");
      res.json(posts);
    } catch (error) {
      res.status(500).json({message: "Error fetching posts"})
    }};
  
  const getPostById = async(req, res)=>{
    try {
      const post = await Post.findById(req.params.id).populate("autor","name");
      if(!post){
        return res.status(404).json({message:"Post not found"})
      };
      res.json(post)
    } catch (error) {
      res.status(500).json("Server Error")
    }
  };

  const deletePost = async(req, res)=>{
    try {
      await Post.findByIdAndDelete(req.params.id);
      res.json({message: "post deleted"})
    } catch (error) {
      res.status(500).json({message: "error to delete posts"})
    }
  }

  module.exports= {createPost, getPosts, getPostById, deletePost};