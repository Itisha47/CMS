import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Fetch all posts
    try {
      const posts = await prisma.post.findMany();
      console.log(posts);
      res.status(200).json(posts);
    } catch (error) {
        console.log(error)
      res.status(500).json({ error: "Failed to fetch posts" });
    }
    
  } else if (req.method === "POST") {
        let body = req.body;
      if (typeof req.body === "string") {
        try {
          body = JSON.parse(req.body);
        } catch (error) {
          return res.status(400).json({ error: "Invalid JSON format" });
        }
      }
    
        const { id, title, slug, content, createdAt, updatedAt } = body;
        
        
        // if (typeof req.body === "string") {
        //   console.log("Body is a string, attempting to parse...");
        //   req.body = JSON.parse(req.body);
        // }
        if (!title || !slug || !content) {
          return res.status(400).json({ error: "All fields are required" });
        }
    
        try {
            const existingPost = await prisma.post.findUnique({
                where: { id: parseInt(id) },
              });
            
              if (existingPost) {
                return res.status(400).json({ error: `Post with id ${id} already exists.` });
              }
          const newPost = await prisma.post.create({
            data: {
              id: parseInt(id), // Ensure ID is an integer
              title,
              slug,
              content,
              createdAt: new Date(createdAt), // Ensure valid date format
              updatedAt: new Date(updatedAt),
            },
          });
          res.status(200).json(newPost);
        } catch (error) {
          console.error("Error creating post:", error);
          res.status(500).json({ error: "Failed to create a new post" });
        }
  } else if (req.method === "PUT") {
    let body = req.body;

    // Parse body if it's a string
    if (typeof req.body === "string") {
      try {
        body = JSON.parse(req.body);
      } catch (error) {
        return res.status(400).json({ error: "Invalid JSON format" });
      }
    }

    const { id, title, slug, content, updatedAt } = body;

    // Validate the required fields
    if (!id || !title || !slug || !content || !updatedAt) {
      return res
        .status(400)
        .json({ error: "All fields (id, title, slug, content, updatedAt) are required." });
    }

    try {
      // Update the post in the database
      const updatedPost = await prisma.post.update({
        where: { id: parseInt(id) },
        data: {
          title,
          slug,
          content,
          updatedAt: new Date(updatedAt),
        },
      });

      // Return the updated post
      res.status(200).json(updatedPost);
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ error: "Failed to update the post." });
    }
  }  else if (req.method === "DELETE") {
    const id = parseInt(req.body.id);
    console.log(id)
    if (!id) {
      return res.status(400).json({ error: "Post ID is required for deletion" });
    }

    try {
      await prisma.post.delete({
        where: { id },
      });
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.log(error);
      res.status(500).json({ error: "Failed to delete the post" });
    }
  }

  else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}


export const config = {
    api: {
      bodyParser: {
        sizeLimit: "1mb",
      },
    },
  };
  