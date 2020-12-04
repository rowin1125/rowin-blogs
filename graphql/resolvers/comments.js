const { UserInputError } = require("apollo-server");
const Post = require("../../models/Post");
const checkAuth = require("../../utils/check-auth");

module.exports = {
  Mutation: {
    async createComment(_, { postId, body }, ctx) {
      const { username } = checkAuth(ctx);
      if (body.trim() === "") {
        throw new UserInputError("Please dont post an empty commit", {
          errors: {
            body: "Comment body must never be empty 🙃",
          },
        });
      }

      const post = await Post.findById(postId);
      if (post) {
        post.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString(),
        });
        await post.save();
        return post;
      } else
        throw new UserInputError(
          `Post with title of: ${post.title} is not found!`
        );
    },
    async deleteComment(_, { postId, commentId }, ctx) {
      const { username } = checkAuth(ctx);

      const post = await Post.findById(postId);
      if (post) {
        const commentIndex = post.comments.findIndex((c) => c.id === commentId);
        if (!post.comments[commentIndex])
          throw new UserInputError("Comment not found");
        if (post.comments[commentIndex].username === username) {
          post.comments.splice(commentIndex, 1);
          await post.save();
          return post;
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } else {
        throw new UserInputError("Post not found");
      }
    },
  },
};
