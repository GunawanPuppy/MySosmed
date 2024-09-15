import { gql } from "@apollo/client";

export const GET_POSTS_BY_ID = gql`
  query GetPostById($postId: ID) {
    getPostById(postId: $postId) {
      _id
      content
      tags
      imgUrl
      authorId
      author {
        username
      }
      comments {
        content
        username
      }
      likes {
        username
      }
      createdAt
      updatedAt
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComments($content: String, $postId: ID) {
    addComments(content: $content, PostId: $postId) {
      message
    }
  }
`;
