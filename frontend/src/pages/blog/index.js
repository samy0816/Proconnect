import React from "react";
import UserLayout from "@/layout/UserLayout";
import styles from './blog.module.css';

const blogPosts = [
    {
        id: 1,
        title: "The Future of Artificial Intelligence in Social Networking",
        author: "AI Insights Team",
        date: "October 26, 2023",
        content: "Artificial Intelligence is no longer a futuristic concept; it's a present-day reality that is reshaping how we interact online. From personalized content feeds to intelligent comment moderation, AI is enhancing user experience on social platforms. This post explores the upcoming trends and ethical considerations of AI in the social media landscape."
    },
    {
        id: 2,
        title: "Crafting the Perfect Professional Profile",
        author: "Career Coaches Inc.",
        date: "October 20, 2023",
        content: "Your online professional profile is your digital handshake. In this article, we'll guide you through the essential steps to build a compelling profile that attracts recruiters and showcases your expertise. We cover everything from writing a powerful bio to selecting the right profile picture."
    },
    {
        id: 3,
        title: "Networking in the Digital Age: Beyond the Handshake",
        author: "ConnectSphere",
        date: "October 15, 2023",
        content: "The art of networking has transformed in the age of remote work and digital platforms. Discover effective strategies to build meaningful professional relationships online. We'll discuss virtual coffee chats, engaging in online communities, and leveraging platforms like this one to expand your network."
    }
];

const BlogPage = () => {
  return (
    <UserLayout>
        <div className={styles.blogContainer}>
            <h1 className={styles.title}>Our Blog</h1>
            {blogPosts.map(post => (
                <article key={post.id} className={styles.post}>
                    <h2 className={styles.postTitle}>{post.title}</h2>
                    <p className={styles.postMeta}>By {post.author} on {post.date}</p>
                    <p className={styles.postContent}>{post.content}</p>
                </article>
            ))}
        </div>
    </UserLayout>
  );
};

export default BlogPage;
