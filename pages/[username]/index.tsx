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
import { Post, PostFeed } from '../../components/Postfeed';
import { UserProfile } from '../../components/UserProfile';
import { FirestoreUsersDocument, getUserWithUsername, postToJson } from '../../lib/firebase';

interface UserProfileProps {
  user: FirestoreUsersDocument;
  posts: Post[];
}

export default function UserProfilePage({ user, posts }: UserProfileProps) {
  return <main>
    <UserProfile user={user} />
    <PostFeed posts={posts} />
  </main>;
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
