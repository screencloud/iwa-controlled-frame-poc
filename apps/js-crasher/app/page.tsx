'use client';

export default function Home() {
  const crashMe = () => {
    let largeArray: number[][] = [];

    // This loop will continuously create large arrays and push them into
    // the largeArray variable, which will increase the memory usage rapidly.
    while (true) {
      largeArray.push(new Array(10000000).fill(0));
    }
  };

  const unresponsiveMe = () => {
    const start = Date.now();
    while (Date.now() - start < 30000) {
      // Blocking Loop for 10 seconds
    }
  };

  return (
    <main className='flex h-screen justify-center items-center'>
      <div className='text-center'>
        <p className='text-2xl font-bold mb-4'>JS Crasher</p>
        <button
          className='bg-red-600 text-white font-bold py-2 px-4 rounded mb-2 mr-2 hover:bg-red-700'
          onClick={crashMe}>
          Crash Me
        </button>
        <button
          className='bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-600'
          onClick={unresponsiveMe}>
          Unresponsive Me
        </button>
      </div>
    </main>
  );
}
