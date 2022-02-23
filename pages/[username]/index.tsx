import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { GetServerSideProps } from 'next';
import { Metatags } from '../../components/Metatags';
import { Post, PostFeed } from '../../components/PostFeed';
import { UserProfile } from '../../components/UserProfile';
import {
  FirestoreUsersDocument,
  getUserWithUsername,
  postToJson,
} from '../../lib/firebase';

interface UserProfileProps {
  user: FirestoreUsersDocument;
  posts: Post[];
}

export default function UserProfilePage({ user, posts }: UserProfileProps) {
  const username = user.username;

  return (
    <main>
      <Metatags
        title={`${username}'s blog`}
        description={`Read blog posts wirtten by @${username}`}
      />
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { username } = context.query;
  const userDoc = await getUserWithUsername(username as string);

  // If no user, short circuit to 404 page
  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  const postsQuery = query(
    collection(getFirestore(), userDoc.ref.path, 'posts'),
    where('published', '==', true),
    orderBy('createdAt', 'desc'),
    limit(5)
  );

  return {
    props: {
      user: userDoc.data(),
      posts: (await getDocs(postsQuery)).docs.map(postToJson),
    },
  };
};
