"use client"; // This marks this file as a client-side component
import { useState, useEffect } from "react";
import ImageEmbed from "../../plugins/imageEmbed/components/ImageEmbed"; // Adjust the import path as needed
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
  const [imagecontent, setImageContent] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>(""); // State for holding image URL
  const [showImageModal, setShowImageModal] = useState<boolean>(false); // State for controlling image modal visibility
  

  const [editPostId, setEditPostId] = useState<number | null>(null);

  const handleEmbedImage = (imageUrl: string) => {
    setImageContent((prevContent) => `${prevContent}<img src="${imageUrl}" alt="Embedded Image" />`);
  };
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/posts"); // Fetch posts from your API
      const data = await response.json();
      setPosts(data); // Save the posts to state
    };
    setLoad(false)
    fetchPosts();
  }, [load]);

  const addImageToContent = () => {
    if (imageUrl) {
      setImageContent((prevContent) => prevContent + `<img src="${imageUrl}" alt="Embedded Image" />`);
      setImageUrl(""); // Clear image URL input after embedding the image
      setShowImageModal(false); // Close the modal after adding the image

    }
  };

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
    console.log(url, method, editMode)
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
  const scrolltoTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
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
              <p>{`Click edit to edit you slug: ${post["slug"]}`}</p>
              <button onClick={() => {
                setEditMode(true);
                setEditPostId(post["id"]);
                setId(post["id"])
                setTitle(post["title"]);
                setSlug(post["slug"]);
                setContent(post["content"]);
                setCreatedAt(post["createdAt"]);
                setUpdatedAt(new Date().toISOString());
                scrolltoTop()
              }}>Edit</button>
              <button onClick={() => deletePost(post["id"])}>Delete</button>
              <button
                onClick={() => {
                  setShowImageModal(true); // Show image URL input when clicked
                }}
              >
                Add Image
              </button>
              {showImageModal && (
                <div className="image-modal">
                  <div className="modal-content">
                    {/* <div> */}

                    <div dangerouslySetInnerHTML={{ __html: imagecontent }} />
                    {/* </div> */}

                    <ImageEmbed onEmbed={handleEmbedImage}/>

                    {/* <button onClick={addImageToContent}>Add Image</button> */}
                    <div className="Delete">
                      <button onClick={() => setShowImageModal(false)}>Close</button>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}
