const Follow = require("../models/Follow");

const { ObjectId } = require("mongodb");
const redis = require("../config/redis")

const typeDefs = `#graphql
  # Pascal Case , Tempat mendefinisikan key  apa yang bisa diterima
  type Follow
  {
    _id : ID
    followingId: ID
    followerId : ID
    createdAt : String
    updatedAt : String
  }

  type Followers {
    follower: User
  }
  
  type Followings{
    following: User
  }

  type User {
    username: String
  }

  type SuccessResponse {
    message: String
  }

  input followUser{
    followingId: ID!
  }


 
  ## Mirip endpoints , semua list taruh disini
  type Query {
    getFollower(followingId:ID!): [Followers]
    getFollowing(followerId: ID!): [Followings]
  }

  # Query untuk Read operation, Write Operation gunakan Mutation
  # Di depan nama methodnya(args nya declare ada apa aja) : Return yang ingin dikembalikan apa
  type Mutation {
    addFollow(input:followUser) : SuccessResponse
  }
`;

// jika ingin dikosongkan parameter di depannya bisa pakai _
//dalam resolver bisa terima 4parameter : parents,args,contextValue,info
//nama di resolvers harus sama dengan nama di Type
//contextValue ngeshare ke semua resolvers
const resolvers = {
  Query: {
    getFollower: async (_, args, contextValue) => {
        // const {username,userId} = await contextValue.auth()
        const{followingId} = args
        const data = await Follow.getFollowers(followingId)
        return data
    },
    getFollowing: async (_,args,contextValue) => {
        // const{userId,username} = await contextValue.auth()
        const {followerId} = args

        const data = await Follow.getFollowing(followerId)
        return data
    }
  },
  Mutation: {
    addFollow: async (_, args, contextValue) => {
      const { userId, username } = await contextValue.auth();
      //Destructuring following Id dari args yg nerima parameter input berisi followingId
      const { followingId } = args.input;

      const followUser = {
        followingId: new ObjectId(followingId),
        followerId: new ObjectId(userId),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      // Pastikan pengguna tidak mengikuti dirinya sendiri
      if (followingId.toString() === userId.toString()) {
        throw new Error("You cannot follow yourself.");
      }

      // Cek apakah pengguna sudah mengikuti followingId sebelumnya
      const alreadyFollow = {
        followerId: new ObjectId(userId),
        followingId: new ObjectId(followingId),
      };

      if (alreadyFollow) {
        throw new Error("You are already following this user.");
      }
      await Follow.findOne(alreadyFollow);

      await Follow.goFollow(followUser);
      return { message: "Success Follow " };
    },
  },
};

module.exports = { typeDefs, resolvers };
