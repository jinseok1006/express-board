import { IPost, IComment } from '../models/boardModel';

const creator = () => {
  let id = 1;

  return (
    title: string,
    content: string,
    writer: string,
    password: string,
    ipAddr: string
  ): IPost => ({
    id: id++,
    title,
    content,
    writer,
    password,
    date: new Date(),
    fullIpAddr: ipAddr,
    ipAddr: ipAddr.split('.').slice(0, 2).join('.'),
    comments: [],
    commentId: 0,
  });
};
const updator = (oldPost: IPost, partial: Partial<IPost>): IPost => {
  const updatedPost = { ...oldPost };
  Object.assign(updatedPost, partial);
  return updatedPost;
};

const commentUtils = {
  createComment() {},
};

const postUtils = {
  updatePost: updator,
  createPost: creator(),
};

export { postUtils, commentUtils };
