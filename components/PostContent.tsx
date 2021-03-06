import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Post } from './PostFeed';

interface PostContentProps {
  post: Post;
}

export const PostContent: React.FC<PostContentProps> = ({ post }) => {
  const createdAt =
    typeof post?.createdAt === 'number'
      ? new Date(post.createdAt)
      : post.createdAt.toDate();

  return (
    <div className="card">
      <h1>{post.title}</h1>
      <span className="text-sm">
        Writen by{' '}
        <Link href={`/${post.username}`}>
          <a className="text-info">@{post.username}</a>
        </Link>{' '}
        on {createdAt.toISOString()}
      </span>
      <ReactMarkdown>{post.content}</ReactMarkdown>
    </div>
  );
};
