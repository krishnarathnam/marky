export default function Home({ username }) {

  return (
    <div className='flex min-h-screen flex-col justify-center items-center'>
      <h1 className='font-bold text-4xl font-[family-name: "Cal sans"]'>Welcome back {username}</h1>
      <p className="text-2xl mt-2.5">let's go back to work!</p>
    </div>
  );
}
