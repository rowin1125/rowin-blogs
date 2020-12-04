const Post = require("../../models/Post");
const checkAuth = require("../../utils/check-auth");
const { AuthenticationError, UserInputError } = require("apollo-server");

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) return post;
        throw new Error("Post not found");
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    async createPost(_, { title, body }, ctx) {
      // Check authentication
      const user = checkAuth(ctx);

      // Check if values are filled in
      const titleIsEmpty = title.trim() === "";
      const bodyIsEmpty = body.trim() === "";
      if (titleIsEmpty) throw new Error("Post title must not be empty");
      if (bodyIsEmpty) throw new Error("Post body must not be empty");

      // Create Post from model
      const newPost = new Post({
        title,
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      // Save it to the db
      const post = await newPost.save();

      return post;
    },
    async deletePost(_, { postId }, ctx) {
      const user = checkAuth(ctx);
      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          (await post).deleteOne();
          return `Post (title of: "${post.title}") deleted succesfully`;
        } else {
          throw new AuthenticationError(
            "This is not your post to delete, shooeee!"
          );
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    async likePost(_, { postId }, ctx) {
      const { username } = checkAuth(ctx);

      const post = await Post.findById(postId);
      if (post) {
        if (post.likes.find((like) => like.username === username)) {
          // Post already like, unlike it
          post.likes = post.likes.filter((like) => like.username !== username);
        } else {
          // Not liked post, like post!
          post.likes.push({
            username,
            createdAt: new Date().toISOString(),
          });
        }
        await post.save();
        return post;
      } else throw new UserInputError("No Post found");
    },
  },
};
