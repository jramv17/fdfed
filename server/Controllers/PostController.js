const Post = require('../Models/PostModel');
const path = require('path');

exports.createPost = async (req, res) => {
    try {
        const { title, description, apartment_id } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: 'File is required' });
        }

        const newPost = new Post({
            title,
            description,
            fileUrl: `/communitypost/${file.filename}`,
            apartment_id
        });

        await newPost.save();
        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create post', error });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const { apartment_id } = req.params;
        const posts = await Post.find({ apartment_id }).sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch posts', error });
    }
};

exports.likePost = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);
        const user_id = req.id;

        if (!post) return res.status(404).json({ message: 'Post not found' });
        if (post.likedIPs.includes(user_id)) {
            return res.status(200).json({ message: 'User has already liked this post' });
        }
        post.likes += 1;
        post.likedIPs.push(user_id);

        await post.save();
        res.status(200).json({ message: 'Post liked', likes: post.likes });
    } catch (error) {
        res.status(500).json({ message: 'Failed to like post', error });
    }
};

exports.addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { text } = req.body;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        post.comments.push({ text });
        await post.save();

        res.status(200).json({ message: 'Comment added', comments: post.comments });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add comment', error });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const { apartment_id } = req.params;
        const posts = await Post.find({ apartment_id: apartment_id })
            .sort({ createdAt: -1 })
            .select('title description fileUrl likes comments createdAt');

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch posts', error });
    }
};
