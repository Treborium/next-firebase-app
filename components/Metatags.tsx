import Head from 'next/head';

interface MetatagsProps {
  title?: string;
  description?: string;
  image?: string;
}

export const Metatags: React.FC<MetatagsProps> = ({
  title = 'Social blogging platform written in Next.js',
  description = 'read 👓, write ✏️, and like ❤️ beautiful blog posts',
  image = 'https://fireship.io/courses/react-next-firebase/img/featured.png',
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@treborium" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Head>
  );
};
