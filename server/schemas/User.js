const User = require("../models/User");
const { hash, comparePass } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const redis = require("../config/redis");

const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  # Pascal Case , Tempat mendefinisikan key  apa yang bisa diterima
  type User
  {
    _id : ID
    name: String! # Non-nullability
    username: String!
    email : String!
    password: String!
  }

  type AuthLogin {
    access_token: String
  }
 
  ## Mirip endpoints , semua list taruh disini
  type Query {
    getUser: [User]
    getUsersByUsername(username: String) : User
    getUserById(_id:ID) : User
  }

  # Query untuk Read operation, Write Operation gunakan Mutation
  # Di depan nama methodnya(args nya declare ada apa aja) : Return yang ingin dikembalikan apa
  type Mutation {
    addUser(name:String,username:String,email:String,password:String): User
    login(email:String,password:String) : AuthLogin
  }
`;

// jika ingin dikosongkan parameter di depannya bisa pakai _
//dalam resolver bisa terima 4parameter : parents,args,contextValue,info
//nama di resolvers harus sama dengan nama di Type
//contextValue ngeshare ke semua resolvers
const resolvers = {
  Query: {
    getUser: async (_, args, contextValue) => {
      //pasang authentication begini
      // contextValue.auth()
      const { username, userId } = await contextValue.auth();

      const UsersCache = await redis.get("users:all");
      if (UsersCache) {
        return JSON.parse(UsersCache);
      }

      const data = await User.getAll();
      await redis.set("users:all", JSON.stringify(data));
      return data;
    },
    getUsersByUsername: async (_, args, contextValue) => {
      // const { username, userId } = await contextValue.auth();

      // Buat kunci cache yang unik untuk setiap username
      const cacheKey = `user:byUsername:${args.username}`;

      const UsernameCache = await redis.get(cacheKey);
      if (UsernameCache) {
        return JSON.parse(UsernameCache);
      }

      const data = await User.findByUsername(args.username);
      
      await redis.set(cacheKey, JSON.stringify(data));

      console.log(data, "ini username bro");
      return data;
    },
    getUserById: async (_, args, contextValue) => {
      // const { userId, username } = await contextValue.auth();
      const { _id } = args;

      // Buat kunci cache yang unik untuk setiap userId
      const cacheKey = `user:byId:${_id}`;

      const UserIdCache = await redis.get(cacheKey);
      if (UserIdCache) {
        return JSON.parse(UserIdCache);
      }

      const data = await User.findById(_id);
      // console.log(data, "ini data di schemas getUserById");

      // Simpan data di Redis dengan kunci unik
      await redis.set(cacheKey, JSON.stringify(data));

      return data;
    },
  },
  Mutation: {
    addUser: async (_, args) => {
      const newUser = { ...args };
      newUser.password = hash(newUser.password);

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      //validasi email kosong
      if (!args.email) {
        throw new Error("Email is required.");
      }
      //validasi email forma`t
      if (!emailRegex.test(args.email)) {
        throw new Error("Invalid email format.");
      }

      //Validasi password kosong
      if (!args.password) {
        throw new Error("Password is required");
      }
      //Validasi  password minimum 5
      if (args.password.length < 5) {
        throw new Error("Password minimum 5 characters");
      }

      //Validasi unique email
      // const existingUserByEmail = await User.findOneByEmail(args.email);
      // if (existingUserByEmail) {
      //   throw new Error("Email already exists.");
      // }

      //Validasi unique username
      const existingUserByUsername = await User.findByUsername(
        args.username,
      );
      if (existingUserByUsername) {
        throw new Error("Username already exists.");
      }

      await User.register(newUser);

      console.log(newUser, "ini newUser");
      return newUser;
    },
    login: async (_, args) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Improved regex for stricter email validation
      if (!emailRegex.test(args.email)) {
        throw new Error("Invalid email format");
      }

      // Check email kosong
      if (!args.email) {
        throw new Error("Email is required");
      }
      //Check password kosong
      if (!args.password) {
        throw new Error("Password is required ");
      }

      //cek password kalo kurang dari lima maka throw error
      if (args.password.length < 5) {
        throw new Error("Password must be at least 5 characters long.");
      }

      const findUser = await User.login(args.email);
      if (!findUser) {
        throw new Error("Invalid Email/password");
      }

      const compare = comparePass(args.password, findUser.password);
      if (!compare) {
        throw new Error("Invalid email/password");
      }

      const access_token = signToken({
        _id: findUser._id,
        username: findUser.username,
      });

      return {
        access_token,
      };
    },
  },
};

module.exports = { typeDefs, resolvers };
