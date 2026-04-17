const Post = require("../Models/PostModel")
const deleteImage = require("../utils/cloudinary");
const createPost = async (req, res)=>{
  try {
    const {title, content, author}= req.body;
    const imageUrls = req.files.map((file) => file.path);
    const post = await Post.create({
      title,
      content,
      image: imageUrls,
      author: req.user.id
    })
    res.json(post);
    
  } catch (error) {
    res.status(500).json({message: "Error Creating Post"})
  }};

  const getPosts =async(req, res)=>{
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

      const posts = await Post.find()
      .populate("author","name")
      .sort({createdAt: -1})
      .skip(skip)
      .limit(limit);
      res.json(posts);
    } catch (error) {
      res.status(500).json({message: "Error fetching posts"})
    }};
  
  const getPostById = async(req, res)=>{
    try {
      const post = await Post.findById(req.params.id).populate("author","name");
      if(!post){
        return res.status(404).json({message:"Post not found"})
      };
      res.json(post)
    } catch (error) {
      res.status(500).json("Server Error")
    }
  };

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
      if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
      }
    if (post.image) {
      await deleteImage(post.image);
    }

    await post.deleteOne();

    res.json({ message: "Post and image deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
};

 const updatePost = async (req, res) => {
   try {
     const { title, content } = req.body;

     const post = await Post.findById(req.params.id);

     if (!post) {
       return res.status(404).json({ message: "Post not found" });
     }
     if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
       return res.status(403).json({ message: "Not authorized" });
     }
     if (req.files && req.files.length > 0) {
       for (let img of post.images) {
         await deleteImage(img);
       }
       post.images = req.files.map((file) => file.path);
     }

     post.title = title || post.title;
     post.content = content || post.content;

     await post.save();

     res.json(post);
   } catch (error) {
     res.status(500).json({ message: "Error updating post" });
   }
 };

  const searchPosts = async (req, res) => {
    try {
      const keyword = req.query.keyword || "";
      const page = parseInt(req.query.page) || 1;
      const limit = 5;

      const skip = (page - 1) * limit;

      const query = {
        title: { $regex: keyword, $options: "i" },
      };

      const total = await Post.countDocuments(query);

      const posts = await Post.find(query).skip(skip).limit(limit);

      res.json({
        total,
        page,
        totalPages: Math.ceil(total / limit),
        posts,
      });
    } catch (error) {
      res.status(500).json({ message: "Search error" });
    }
  };

  const getPostsByUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;

    const skip = (page - 1) * limit;

    const query = { author: req.params.userId };

    const total = await Post.countDocuments(query);

    const posts = await Post.find(query)
      .skip(skip)
      .limit(limit);
    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      posts
    });

  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};

  const toggleLike = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const userId = req.user.id;

      const isLiked = post.likes.includes(userId);

      if (isLiked) {
        post.likes = post.likes.filter((id) => id.toString() !== userId);
      } else {
        post.likes.push(userId);
      }

      await post.save();

      res.json({ likes: post.likes.length });
    } catch (error) {
      res.status(500).json({ message: "Error liking post" });
    }
  };

  const addComment = async (req, res) => {
    try {
      const { text } = req.body;

      const post = await Post.findById(req.params.id);

      post.comments.push({
        user: req.user.id,
        text,
      });

      await post.save();

      res.json(post.comments);
    } catch (error) {
      res.status(500).json({ message: "Error adding comment" });
    }
  };

  module.exports= { 
    createPost, 
    getPosts, 
    getPostById, 
    deletePost, 
    updatePost, 
    searchPosts, 
    getPostsByUser, 
    toggleLike, 
    addComment};