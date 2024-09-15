const Posts = require("../models/Posts");
const { ObjectId } = require("mongodb");
// const { hash, comparePass } = require("../helpers/bcrypt");
// const { signToken } = require("../helpers/jwt");
const redis = require("../config/redis")

const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  # Pascal Case , Tempat mendefinisikan key  apa yang bisa diterima


  type Posts {
    _id: ID
    content: String! # Non-nullability
    tags: [String]
    imgUrl: String
    authorId: ID!
    author: Author
    comments: [Comments]
    likes: [Likes]
    createdAt: String
    updatedAt: String
  }

  type Author {
    username: String
  }

  type Comments {
    content: String!
    username: String!
    createdAt: String
    updatedAt: String
  }

  type Likes{
    username: String!
    createdAt: String
    updatedAt: String
  }

  type SuccessResponse{
    message:String
  }


 
  ## Mirip endpoints , semua list taruh disini : Return nya mau apa 
  type Query {
    getPosts: [Posts]
    getPostById(postId: ID): Posts
  }

  # Query untuk Read operation, Write Operation gunakan Mutation
  # Di depan nama methodnya(args nya declare ada apa aja) : Return yang ingin dikembalikan apa
  type Mutation {
    addPosts(content:String,tags:[String],imgUrl:String) : SuccessResponse
    addComments(content:String,PostId: ID) : SuccessResponse
    likePost(PostId: ID) : SuccessResponse
  }
`;

// jika ingin dikosongkan parameter di depannya bisa pakai _
//dalam resolver bisa terima 4parameter : parents,args,contextValue,info
//nama di resolvers harus sama dengan nama di Type
//contextValue ngeshare ke semua resolvers
const resolvers = {
  Query: {
    getPosts: async (_, args, contextValue) => {
      try {
        const { userId, username } = await contextValue.auth();
       

        const postsCache = await redis.get("posts:all");
        // console.log('Posts Cache:', postsCache);
        // type data di redis dalam bentuk string
        // kalo ga ada skip langkah ini
        if (postsCache) {
          return JSON.parse(postsCache);
        }

        // ngambil data dari schema
        const data = await Posts.getAllWithAuthors();
     

        // nyimpen data di redis dalam bentuk string
        await redis.set("posts:all", JSON.stringify(data));
        return data;
      } catch (error) {
        console.log('Error getting posts:', error);
        throw new Error('Failed to get posts');
      }
    },
    getPostById: async (_, args, contextValue) => {
      const { userId, username } = await contextValue.auth();
console.log(args, "ini args");

// Buat kunci cache yang unik untuk setiap postId
const cacheKey = `posts:byId:${args.postId}`;

const PostIdCache = await redis.get(cacheKey);
if (PostIdCache) {
  return JSON.parse(PostIdCache);
}

const data = await Posts.getPostById(args.postId);
console.log(data, "ini data");

// Simpan data di Redis dengan kunci unik
await redis.set(cacheKey, JSON.stringify(data));
return data;
    },
  },
  Mutation: {
    addPosts: async (_, args, contextValue) => {
      // console.log(contextValue, "ini context <<<<<<<<");
      // console.log(args, "ini args <<<<<<<,");
      const { userId, username } = await contextValue.auth();
      // console.log(userId, "userId di add Posts");

      const newPosts = {
        ...args,
        authorId: new ObjectId(userId),
        username: username,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await Posts.create(newPosts);
      return { message: "Success post" };
    },
    addComments: async (_, args, contextValue) => {
      const { username,userId } = await contextValue.auth();
      // console.log(username, "ini username");
      const { content, PostId } = args;

      if (!content) {
        throw new Error("Content is required");
      }

      if (!username) {
        throw new Error("Username is required");
      }
      const postFilter = { _id: new ObjectId(PostId) };
      const updateDoc = {
        $push: {
          comments: {
            content: content,
            username: username,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
        $set: {
          updatedAt: new Date(),
        },
      };

      await Posts.addComments(postFilter, updateDoc);
      return { message: "Success add comment" };
    },
    likePost: async (_, args, contextValue) => {
      const { username,userId } = await contextValue.auth();

      if (!username) {
        throw new Error("Username is required");
      }

      const { PostId } = args;
      const postLike = { _id: new ObjectId(PostId) };
      const updateDoc = {
        $push: {
          likes: {
            username: username,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
        $set: {
          updatedAt: new Date(),
        },
      };

      await Posts.addLikes(postLike, updateDoc);
      return { message: "Success NgeLikes" };
    },
  },
};

module.exports = { typeDefs, resolvers };
