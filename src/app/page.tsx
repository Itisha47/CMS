import CreatePost from "./create-post"; // This assumes create-post.tsx exists in the same directory

export default function Home() {
  return (
    <div>
      <CreatePost /> {/* This will render your create post form */}
    </div>
  );
}