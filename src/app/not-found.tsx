import React from "react";

const NotFound = () => {
  return (
    <section className="mx-auto h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-9xl font-bold">404</h1>
        <p className="text-2xl mt-4">
          Oops! The page you are looking for does not exist.
        </p>
        <a href="/" className="mt-8 text-lg text-blue-600 hover:underline">
          Go back to the homepage.
        </a>
      </div>
    </section>
  );
};

export default NotFound;
