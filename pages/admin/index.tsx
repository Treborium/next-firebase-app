import {
  collection,
  doc,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { useRouter } from 'next/router';
import { FormEvent, useContext, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import kebabCase from 'lodash.kebabcase';
import toast from 'react-hot-toast';

import { AuthCheck } from '../../components/AuthCheck';
import { Post, PostFeed } from '../../components/PostFeed';
import { UserContext } from '../../lib/context';
import { auth } from '../../lib/firebase';
import styles from '../../styles/Admin.module.css';

export default function AdminPostsPage() {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}

const PostList: React.FC<{}> = () => {
  const ref = collection(
    getFirestore(),
    'users',
    auth.currentUser.uid,
    'posts'
  );
  const postQuery = query(ref, orderBy('createdAt'));
  const [querySnapshot] = useCollection(postQuery);
  const posts = querySnapshot?.docs.map((document) => document.data() as Post);

  return (
    <>
      <h1>Manage your Posts</h1>
      <PostFeed posts={posts} admin />
    </>
  );
};

const CreateNewPost: React.FC<{}> = () => {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState('');

  const slug = encodeURI(kebabCase(title));
  const isValid = title.length > 3 && title.length < 100;

  const createPost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    const ref = doc(getFirestore(), 'users', uid, 'posts', slug);

    const data: Post = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: '# Hello World!',
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
      heartCount: 0,
    };

    await setDoc(ref, data);
    toast.success('Post created');

    router.push(`/admin/${slug}`);
  };

  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My Awesome Article!"
        className={styles.input}
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Create new post
      </button>
    </form>
  );
};
