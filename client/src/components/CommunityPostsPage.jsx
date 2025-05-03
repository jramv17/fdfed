import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Snackbar } from '@mui/material';
const CommunityPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostDescription, setNewPostDescription] = useState('');
  const [newPostFile, setNewPostFile] = useState(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [open, setOpen] = React.useState(false);
  const { apartment_id } = useParams();
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/posts/${apartment_id}`
      );
      console.log(response.data);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/posts/${postId}/like`
      );

      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleAddComment = async (postId, text) => {
    try {
      await axios.post(`http://localhost:5000/api/posts/${postId}/comment`, {
        text,
      });
      fetchPosts(); // Refresh posts to update comments count
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleNewPostSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newPostTitle);
    formData.append('description', newPostDescription);
    formData.append('file', newPostFile);
    formData.append('apartment_id', apartment_id);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/posts',
        formData
      );
      if (response.status === 201) {
        setNewPostTitle('');
        setNewPostDescription('');
        setNewPostFile(null);
        setShowPostForm(false);
        fetchPosts();
        setOpen(true);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className="bg-black text-white min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Community Posts</h1>

      {/* Button to trigger the new post form */}
      <button
        onClick={() => setShowPostForm(true)}
        className="bg-white hover:bg-blue-600 text-black px-4 py-2 rounded mb-6"
      >
        New Post
      </button>

      {/* New Post Form (popup) */}
      {showPostForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-gray-100 p-6 rounded-lg w-1/3">
            <h2 className="text-black text-2xl font-bold mb-4">
              Create New Post
            </h2>
            <form onSubmit={handleNewPostSubmit}>
              <input
                type="text"
                placeholder="Title"
                className="bg-black text-white p-2 rounded w-full mb-4"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                required
              />
              <textarea
                placeholder="Description"
                className="bg-black text-white p-2 rounded w-full mb-4"
                value={newPostDescription}
                onChange={(e) => setNewPostDescription(e.target.value)}
                required
              />
              <input
                type="file"
                className="bg-black text-white p-2 rounded w-full mb-4"
                onChange={(e) => setNewPostFile(e.target.files[0])}
                required
              />
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  onClick={() => setShowPostForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.length === 0 && (
          <div className="text-center">
            <p>No posts found. Be the first to create one.</p>
          </div>
        )}
        {posts.map((post) => (
          <div key={post._id} className="bg-gray-800 rounded-lg p-4 shadow-md">
            <img
              src={`${'http://localhost:5000'}${post.fileUrl}`}
              alt={post.title}
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            <p className="text-gray-400 mb-4">{post.description}</p>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => handleLike(post._id)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                👍 {post.likes}
              </button>
              <span>{post.comments.length} Comments</span>
            </div>
            <div>
              <input
                type="text"
                placeholder="Add a comment..."
                className="bg-gray-700 text-white p-2 rounded w-full mb-2"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddComment(post._id, e.target.value);
                    e.target.value = ''; // Clear the input
                  }
                }}
              />
              <div className="text-sm text-gray-500">
                {post.comments.map((comment, index) => (
                  <p key={index}>- {comment.text}</p>
                ))}
              </div>
            </div>
            <Snackbar
              open={open}
              autoHideDuration={5000}
              onClose={handleClose}
              message="Post Added Successfully"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityPostsPage;
