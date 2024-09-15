const { database } = require("../config/mongodb");
const { ObjectId } = require("mongodb");

class Posts {
  static async create(newPosts) {
    const posts = database.collection("Posts");
    const newPost = await posts.insertOne(newPosts);
    return newPost;
  }

  static async addComments(postFilter, updateDoc) {
    const posts = database.collection("Posts");
    const newComment = await posts.updateOne(postFilter, updateDoc);
    return newComment;
  }

  static async addLikes(postLike, updateDoc) {
    const posts = database.collection("Posts");
    const newLikes = await posts.updateOne(postLike, updateDoc);
    return newLikes;
  }

  static async getAllWithAuthors() {
    const posts = database.collection("Posts");
    const allPosts = await posts
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $unwind: "$author",
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $project: {
            _id: 1,
            content: 1,
            tags: 1,
            imgUrl: 1,
            authorId: "$authorId", 
            author: {
              username: "$author.username",
            },
            comments: 1,
            likes: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ])
      .toArray();
      console.log(allPosts, "ini allPosts<<<<<<");
    return allPosts;
  }
  
   static async getPostById(postId) {
    const posts = database.collection("Posts");
    const post = await posts
      .aggregate([
        {
          $match: {
            _id: new ObjectId(postId),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $unwind: "$author",
        },
        {
          $project: {
            _id: 1,
            content: 1,
            tags: 1,
            imgUrl: 1,
            authorId: "$authorId",
            author: {
              username: "$author.username",
            },
            comments: 1,
            likes: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ])
      .toArray();
    return post[0];
  }


  // Metode lainnya seperti getByAuthor dapat diperbarui sesuai kebutuhan
}

module.exports = Posts;
