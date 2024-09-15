const {database} = require("../config/mongodb")
const {ObjectId} = require("mongodb")

class Follow {
    static async goFollow(data){
        const follow = database.collection("follows")
        
        const newFollow = await follow.insertOne(data)
        return newFollow
    }

    static async findOne(data){
        const follow = database.collection("follows")
        const validation = await follow.findOne(data)
    }

    static async getFollowers(followingId){
        const follow = database.collection("follows")
        const results = await follow
        .aggregate([
          {
            $match: {
                followingId: new ObjectId(followingId),
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "followerId",
                foreignField: "_id",
                as: "follower",
              },
            },
            {
              $unwind: {
                path: "$follower",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                "following.password": 0,
              },
          },
        ])
        .toArray();
        console.log(results, "getFollower di di models");
      return results;
    }

    static async getFollowing(followerId){
        const follow = database.collection("follows")
        const results = await follow
        .aggregate([
          {
            $match: {
                followerId: new ObjectId(followerId),
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "followingId",
                foreignField: "_id",
                as: "following",
              },
            },
            {
              $unwind: {
                path: "$following",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                "following.password": 0,
              },
          },
        ])
        .toArray();
        console.log(results, "getFollowing di models");
      return results;
    }
   
}

module.exports = Follow