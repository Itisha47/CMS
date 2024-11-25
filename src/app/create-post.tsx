"use client"; // This marks this file as a client-side component
import { useState, useEffect} from "react";
import "../../styles.css"

export default function CreatePost() {
  const [id, setId] = useState<number | undefined>(undefined);;
  const [title, setTitle] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<string>("");
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [posts, setPosts] = useState([]);
  const [load, setLoad] = useState<Boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [editPostId, setEditPostId] = useState<number | null>(null);


  

  useEffect(() => {
  
    const fetchPosts = async () => {
      const response = await fetch("/api/posts"); // Fetch posts from your API
      const data = await response.json();
      setPosts(data); // Save the posts to state
    };
    setLoad(false)
    fetchPosts();
  }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create post object
    const postData = {
      id,
      title,
      slug,
      content,
      createdAt,
      updatedAt,
    };

    const url = `/api/posts/`;
    const method = editMode ? "PUT" : "POST";
    
    // Send POST request to your API
    const response = await fetch(`/api/posts`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });
    console.log(url,method, editMode)
    const result = await response.json();
    if (response.ok) {
    setLoad(true);
    setId(undefined);
    alert(editMode ? "Post updated successfully!" : "Post created successfully!");
    setEditMode(false);
    setEditPostId(null);
    setTitle("");
    setSlug("");
    setContent("");
    setCreatedAt("");
    setUpdatedAt("");
    } else {
      alert("Error: " + result.error);
    }
   
  };
  const deletePost = async (id: number) => {
    const response = await fetch("/api/posts", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
  
    if (response.ok) {
      setLoad(true)
      alert("Post deleted successfully");
    } else {
      alert("Failed to delete post");
    }
  };

  return (
    <div className="container">
    <h1>{editMode ? "Edit Post" : "Create a New Post"}</h1>
  <form className="post-form" onSubmit={handleSubmit}>
    <div>
      <label>ID:</label>
      <input
        type="number"
        value={id || ''}
        onChange={(e) => setId(e.target.value ? Number(e.target.value) : undefined)}
        required
        readOnly={editMode} // Make ID readonly during editing
      />
    </div>
    <div>
      <label>Title:</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
    </div>
    <div>
      <label>Slug:</label>
      <input
        type="text"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        required
      />
    </div>
    <div>
      <label>Content:</label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
    </div>
    <div>
      <label>Created At:</label>
      <input
        type="datetime-local"
        value={createdAt}
        onChange={(e) => setCreatedAt(e.target.value)}
        required
      />
    </div>
    <div>
      <label>Updated At:</label>
      <input
        type="datetime-local"
        value={updatedAt}
        onChange={(e) => setUpdatedAt(e.target.value)}
        required
      />
    </div>
    <button type="submit">{editMode ? "Update Post" : "Create Post"}</button>
    </form>
    <div className="posts">
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post["id"]}>
            <h2>{post["title"]}</h2>
            <p>{post["content"]}</p>
            <button onClick={() => {
              setEditMode(true);
              setEditPostId(post["id"]);
              setId(post["id"])
              setTitle(post["title"]);
              setSlug(post["slug"]);
              setContent(post["content"]);
              setCreatedAt(post["createdAt"]);
              setUpdatedAt(new Date().toISOString());
            }}>Edit</button>
            <button onClick={() => deletePost(post["id"])}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
 </div>
 
  );
}
