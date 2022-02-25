import {
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  query,
} from 'firebase/firestore';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { useContext } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { AuthCheck } from '../../components/AuthCheck';
import { HeartButton } from '../../components/HeartButton';
import { Metatags } from '../../components/Metatags';
import { PostContent } from '../../components/PostContent';
import { Post } from '../../components/PostFeed';
import { UserContext } from '../../lib/context';
import { getUserWithUsername, postToJson } from '../../lib/firebase';

interface PostPageProps {
  path: string;
  post: Post;
}

export default function PostPage(props: PostPageProps) {
  const { user } = useContext(UserContext);
  const postRef = doc(getFirestore(), props.path);
  const [realtimePost] = useDocumentData(postRef);

  const post = (realtimePost as Post) || props.post;

  return (
    <main>
      <Metatags
        title={post.title}
        description={`"${post.title}" written by ${
          user?.displayName || 'an awesome person'
        }!`}
      />

      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} ❤️</strong>
        </p>

        <AuthCheck
          fallback={
            <Link href="/enter" passHref>
              <button>💗 Sign up</button>
            </Link>
          }
        >
          <HeartButton postRef={postRef} />
        </AuthCheck>

        {user?.uid == post.uid && (
          <Link href={`/admin/${post.slug}`} passHref>
            <button className="btn-blue">Edit post</button>
          </Link>
        )}
      </aside>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { username, slug } = context.params;
  const revalidate = 100;
  const userDoc = await getUserWithUsername(username as string);

  if (userDoc) {
    const postRef = doc(
      getFirestore(),
      userDoc.ref.path,
      'posts',
      slug as string
    );
    return {
      props: {
        post: postToJson(await getDoc(postRef)),
        path: postRef.path,
      },
      revalidate,
    };
  }

  return {
    props: {
      post: undefined,
      path: undefined,
    },
    revalidate,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const q = query(collectionGroup(getFirestore(), 'posts'), limit(20));
  const snapshot = await getDocs(q);

  const paths = snapshot.docs.map((document) => {
    const { slug, username } = document.data() as Post;
    return {
      params: { username, slug },
    };
  });

  return {
    paths,
    fallback: 'blocking',
  };
};
