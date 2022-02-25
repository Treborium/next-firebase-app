import {
  doc,
  DocumentData,
  DocumentReference,
  getFirestore,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AuthCheck } from '../../components/AuthCheck';
import { auth } from '../../lib/firebase';

import styles from '../../styles/Admin.module.css';
import { Post } from '../../components/PostFeed';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { ImageUploader } from '../../components/ImageUploader';

export default function AdminPostEdit() {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

const PostManager: React.FC<{}> = () => {
  const [preview, setPreview] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  const postRef = doc(
    getFirestore(),
    'users',
    auth.currentUser.uid,
    'posts',
    slug as string
  );
  const [post] = useDocumentDataOnce<Post>(postRef as DocumentReference<Post>);

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm
              postRef={postRef}
              defaultValues={post}
              preview={preview}
            />
          </section>

          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>
              {preview ? 'Edit' : 'Preview'}
            </button>
            <Link href={`/${post.username}/${post.slug}`} passHref>
              <button className="btn-blue">Live view</button>
            </Link>
          </aside>
        </>
      )}
    </main>
  );
};

interface PostFormProps {
  postRef: DocumentReference<DocumentData>;
  defaultValues: Post;
  preview: boolean;
}

const PostForm: React.FC<PostFormProps> = ({
  postRef,
  defaultValues,
  preview,
}) => {
  const {
    register,
    formState: { errors, isValid, isDirty },
    handleSubmit,
    reset,
    watch,
  } = useForm({
    defaultValues,
    mode: 'onChange',
  });

  const updatePost = async ({ content, published }: Post) => {
    const updatedData: Partial<Post> = {
      content,
      published,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(postRef, updatedData);

    reset({ content, published });
    toast.success('Post updated successfully!');
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      )}

      <div className={preview ? styles.hidden : styles.controls}>
        <ImageUploader />

        <textarea
          name="content"
          {...register('content', {
            maxLength: { value: 20000, message: 'content is too long' },
            minLength: { value: 10, message: 'content is too short' },
            required: { value: true, message: 'content is required' },
          })}
        />

        {errors.content && (
          <p className="text-danger">{errors.content.message}</p>
        )}

        <fieldset>
          <input
            className={styles.checkbox}
            name="published"
            type="checkbox"
            {...register}
          />
          <label>Published</label>
        </fieldset>

        <button
          type="submit"
          className="btn-green"
          disabled={!isDirty || !isValid}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};
