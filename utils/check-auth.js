const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server");

module.exports = (context) => {
  // Get the authorizations headers from the context
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    // Confention is to put Bearer before the token to easily get the token
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        // Get the user from jwt
        const user = jwt.verify(token, process.env.JWT_KEY);
        return user;
      } catch (error) {
        // Return if the jwt token is either incorrect or expires
        throw new AuthenticationError("Invalid/expired token!");
      }
    }
    // If the format is wrong
    throw new Error("Authentication token must be 'Bearer [token]'");
  }
  throw new Error("Authorization header must be provided");
};
