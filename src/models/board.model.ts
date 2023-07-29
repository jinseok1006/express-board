export interface IPost {
  id: number;
  title: string;
  content: string;
  writer: string;
  password: string;
  date: Date;
  ipAddr: string;
  fullIpAddr: string;
  comments: IComment[];
  commentId: number;
}

export interface IComment {
  id: number;
  writer: string;
  content: string;
  date: Date;
  fullIpAddr: string;
  ipAddr: string;
  password: string;
}

export class BoardModel {
  private postId: number; // 각 게시물의 고유 아이디
  private posts: IPost[]; // commentId: 게시물마다 댓글의 고유 아이디
  constructor() {
    this.posts = [
      {
        title: '타이틀',
        content: '내용',
        writer: 'ㅇㅇ',
        ipAddr: '127.0',
        fullIpAddr: '127.0.0.1',
        id: 0,
        password: '1234',
        date: new Date(),
        comments: [
          {
            id: 0,
            writer: 'ㅇㅇ',
            content: '댓글',
            date: new Date(),
            fullIpAddr: '127.0.0.1',
            ipAddr: '127.0',
            password: '1234',
          },
        ],
        commentId: 0,
      },
    ];
    this.postId = 1;
  }

  getAllPosts(): IPost[] {
    return this.posts;
  }

  addPost(inputPost: InputPost): void {
    const post: IPost = {
      ...inputPost,
      id: this.postId++,
      ipAddr: inputPost.fullIpAddr.split('.').slice(0, 2).join('.'),
      date: new Date(),
      comments: [],
      commentId: 0,
    };
    this.posts.push(post);
  }

  getPostById(id: number): IPost | undefined {
    return this.posts.find((post) => post.id === id);
  }

  deletePost(id: number): boolean {
    const postIndex = this.posts.findIndex((post) => post.id === id);
    if (postIndex === -1) return false;
    this.posts.splice(postIndex, 1);
    return true;
  }

  modifyPost(id: number, partial: Partial<IPost>): boolean {
    const postIndex = this.posts.findIndex((post) => post.id === id);
    if (postIndex === -1) return false;
    this.posts[postIndex] = Object.assign(this.posts[postIndex], partial);
    return true;
  }

  getCommentsByPostId(postId: number): IComment[] | undefined {
    const post = this.posts.find((post) => post.id === postId);
    return post?.comments;
  }
  getCommentById(postId: number, commentId: number): IComment | undefined {
    const post = this.posts.find((post) => post.id === postId);
    const comment = post?.comments.find((comment) => comment.id === commentId);
    return comment;
  }

  addComment(postId: number, inputComment: InputComment): boolean {
    const postIndex = this.posts.findIndex((post) => post.id === postId);
    if (postIndex === -1) return false;
    const comment: IComment = {
      ...inputComment,
      id: this.posts[postIndex].commentId++,
      date: new Date(),
      ipAddr: inputComment.fullIpAddr.split('.').slice(0, 2).join('.'),
    };
    this.posts[postIndex].comments.push(comment);
    return true;
  }

  deleteComment(postId: number, commentId: number): boolean {
    const postIndex = this.posts.findIndex((post) => post.id === postId);
    if (postIndex === -1) return false;
    const comments = this.posts[postIndex].comments;
    const commentIndex = comments.findIndex(
      (comment) => comment.id === commentId
    );
    comments.splice(commentIndex, 1);
    return true;
  }
}

interface InputComment {
  writer: string;
  content: string;
  password: string;
  fullIpAddr: string;
}

interface InputPost {
  writer: string;
  title: string;
  content: string;
  password: string;
  fullIpAddr: string;
}
