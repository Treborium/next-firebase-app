import { FieldValue } from 'firebase/firestore';
import Link from 'next/link';

export interface Post {
  title: string;
  content: string;
  slug: string;
  username: string;
  uid: string;
  published: boolean;
  heartCount: number;
  createdAt: number | FieldValue;
  updatedAt: number | FieldValue;
}

interface PostFeedProps {
  posts: Post[];
  admin?: boolean;
}

export const PostFeed: React.FC<PostFeedProps> = ({ posts, admin }) => {
  return posts ? (
    <>
      {posts.map((post) => (
        <PostItem post={post} key={post.slug} admin={admin} />
      ))}
    </>
  ) : null;
};

interface PostItemProps {
  post: Post;
  admin: boolean;
}

const PostItem: React.FC<PostItemProps> = ({ post, admin = false }) => {
  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  return (
    <div className="card">
      <Link href={`/${post.username}`}>
        <a>
          <strong>By @{post.username}</strong>
        </a>
      </Link>

      <Link href={`/${post.username}/${post.slug}`} passHref>
        <h2>
          <a>{post.title}</a>
        </h2>
      </Link>

      <footer>
        <span>
          {wordCount} words. {minutesToRead} min read
        </span>
        <span className="push-left">💗 {post.heartCount || 0} Hearts</span>
      </footer>

      {/* If admin view, show extra controls for user */}
      {admin && (
        <>
          <Link href={`/admin/${post.slug}`} passHref>
            <h3>
              <button className="btn-blue">Edit</button>
            </h3>
          </Link>

          {post.published ? (
            <p className="text-success">Live</p>
          ) : (
            <p className="text-danger">Unpublished</p>
          )}
        </>
      )}
    </div>
  );
};
