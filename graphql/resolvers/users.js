const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../utils/validators");

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_KEY,
    { expiresIn: "1h" }
  );
}

module.exports = {
  Mutation: {
    async login(_parent, { username, password }) {
      // Validate incomming user
      const { valid, errors } = validateLoginInput(username, password);
      if (!valid) throw new UserInputError("Errors", { errors });

      // Check if user is in the db
      const user = await User.findOne({ username });
      if (user) {
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          errors.general = "Wrong credentials";
          throw new UserInputError("Wrong credentials", { errors });
        }
      } else {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      // User is validated and can get a jwt token
      const token = generateToken(user);

      // Return result
      return {
        ...user._doc,
        id: user.id,
        token,
      };
    },
    async register(
      _parent,
      { registerInput: { username, email, password, confirmPassword } }
    ) {
      // Validate the user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      // Make sure user doesnt exist
      const user = await User.findOne({ username });
      if (user)
        throw new UserInputError("Username is taken", {
          error: {
            username: "This username is taken",
          },
        });

      // Has the password argument from args
      const encryptedPassword = await bcrypt.hash(password, 12);

      // Create new User Object based on the User Model
      const newUser = new User({
        email,
        username,
        password: encryptedPassword,
        createdAt: new Date().toISOString(),
      });

      // Save the new User to the DB
      const result = await newUser.save();

      // Create a JWT token with new User data
      const token = generateToken(result);

      // return the newly created User as well as the id and Token
      return {
        ...result._doc,
        id: result.id,
        token,
      };
    },
  },
};
