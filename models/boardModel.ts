export interface IPost {
  id: number;
  title: string;
  content: string;
  writer: string;
  password: string;
  date: Date;
  // comments: IComment[];
}

export interface IComment {
  writer: string;
  content: string;
  date: Date;
}

const creator = () => {
  let id = 1;

  return (
    title: string,
    content: string,
    writer: string,
    password: string
  ): IPost => ({
    id: id++,
    title,
    content,
    writer,
    password,
    date: new Date(),
  });
};

export const createPost = creator();

export class BoardModel {
  private posts: IPost[];
  constructor() {
    this.posts = [
      {
        id: 0,
        title: '타이틀',
        writer: '작성자',
        content: '콘텐츠',
        password: '1234',
        date: new Date(),
      },
    ];
  }

  getAllPosts(): IPost[] {
    return this.posts;
  }

  addPost(post: IPost): void {
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

  modifyPost(id: number, post: IPost) {
    const postIndex = this.posts.findIndex((post) => post.id === id);

    if (postIndex === -1) return false;

    this.posts[postIndex] = post;
    return true;
  }
}
