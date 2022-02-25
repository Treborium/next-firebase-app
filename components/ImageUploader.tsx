import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { ChangeEvent, useState } from 'react';
import { auth, STATE_CHANGED, storage } from '../lib/firebase';
import { Loader } from './Loader';

export const ImageUploader: React.FC<{}> = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState('0');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const uploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    // Get the file
    const file = Array.from(e.target.files)[0];
    const extension = file.type.split('/')[1];

    // Make reference to the storage bucket location
    const fileRef = ref(
      storage,
      `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`
    );
    setUploading(true);

    // Start upload
    console.error(fileRef, file);
    const task = uploadBytesResumable(fileRef, file);

    // Listen to update on upload task
    task.on(STATE_CHANGED, (snapshot) => {
      const percentage = (
        (snapshot.bytesTransferred / snapshot.totalBytes) *
        100
      ).toFixed(0);
      setProgress(percentage);
    });

    // Get download URL after task resolves (Note: this is not a native Promise)
    task
      .then(() => getDownloadURL(fileRef))
      .then((url: string) => {
        setDownloadUrl(url);
        setUploading(false);
      });
  };

  return (
    <div className="box">
      <Loader show={uploading} />
      {uploading && <h3>{progress}%</h3>}

      {!uploading && (
        <>
          <label className="btn">
            📷 Upload Image
            <input
              type="file"
              onChange={uploadFile}
              accept="image/x-png,image/gif,image/jpeg"
            />
          </label>
        </>
      )}

      {downloadUrl && (
        <code className="upload-snippet">{`![alt](${downloadUrl})`}</code>
      )}
    </div>
  );
};
