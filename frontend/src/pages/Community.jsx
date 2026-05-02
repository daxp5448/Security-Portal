import React, { useState, useEffect, useRef } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { MessageSquare, ThumbsUp, Share2, Send, MoreHorizontal, Trash2 } from "lucide-react";
import LoginModal from "../components/LoginModal";
import { communityService } from "../services/communityService";
import gsap from 'gsap';
import PageTransition from '../components/PageTransition';
import FloatingCard from '../components/FloatingCard';

export default function Community() {
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const postRefs = useRef({});

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem("isAuthenticated") === "true");
    setIsAdmin(localStorage.getItem("role") === "admin");
    fetchPosts();

    // Animate posts when they load
    const tl = gsap.timeline();
    tl.fromTo('.community-header',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );
    return () => tl.kill();
  }, []);

  useEffect(() => {
    // Animate posts when they change
    if (posts.length > 0) {
      gsap.fromTo('.post-card',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
      );
    }
  }, [posts]);

  const fetchPosts = async () => {
    try {
      const data = await communityService.getPosts();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    }
  };

  const blogs = [
    {
      id: 1,
      title: "Top 10 Cyber Safety Tips",
      content:
        "Always use strong passwords, enable two-factor authentication, avoid clicking unknown links, and never share OTP. Keep your apps updated and use antivirus software.",
    },
    {
      id: 2,
      title: "How Hackers Steal OTP",
      content:
        "Hackers use fake calls, fake refund messages, and phishing links. They pretend to be bank staff and trick people into sharing OTP.",
    },
    {
      id: 3,
      title: "Why Public WiFi is Dangerous",
      content:
        "Public WiFi can be monitored by attackers. They can steal your passwords, bank details, and personal data if you log in on unsafe networks.",
    },
  ];

  const handlePost = async () => {
    if (!postContent.trim()) return;
    try {
      const newPost = await communityService.createPost({
        title: "Community Post", // You might want to add a title input
        description: postContent,
        tags: ["General"],
        author: isAdmin ? "Admin" : "User", // dynamic user name in real app
        avatar: `https://ui-avatars.com/api/?name=${isAdmin ? "Admin" : "User"}`
      });
      setPosts([newPost, ...posts]);
      setPostContent("");
    } catch (error) {
      alert("Failed to post");
    }
  };

  const handleLike = async (id) => {
    try {
      const updatedPost = await communityService.likePost(id);
      setPosts(posts.map((p) => (p._id === id ? updatedPost : p)));
    } catch (error) {
      console.error("Failed to like", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await communityService.deletePost(id);
      setPosts(posts.filter((p) => p._id !== id));
    } catch (error) {
      alert("Failed to delete");
    }
  };

  const handleReply = async (id) => {
    const text = replyText[id];
    if (!text?.trim()) return;
    try {
      const updatedPost = await communityService.replyToPost(id, {
        author: isAdmin ? "Admin" : "User",
        content: text,
        avatar: `https://ui-avatars.com/api/?name=${isAdmin ? "Admin" : "User"}`
      });
      setPosts(posts.map((p) => (p._id === id ? updatedPost : p)));
      setReplyText({ ...replyText, [id]: "" });
      setActiveReplyId(null);
    } catch (error) {
      alert("Failed to reply");
    }
  };

  const handleShare = (post) => {
    const text = `${post.author}: ${post.title} - ${post.description}`;
    navigator.clipboard.writeText(text);
    alert("Post copied to clipboard!");
  };

  const handleTrendingClick = (topic) => {
    alert(`Filtering by ${topic} (Not implemented in demo)`);
  };

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        {/* Non-intrusive login prompt for non-authenticated users */}
        {!isAuthenticated && (
          <div className="lg:col-start-1 lg:col-end-3 mb-4 glass-panel p-4 rounded-xl flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              💡 Login to post, like, and engage with the community
            </p>
            <a href="/login" className="text-sm text-primary hover:underline font-medium">
              Login
            </a>
          </div>
        )}

        {/* Feed */}
        <div className="space-y-6 max-w-3xl">
          <div className="community-header">
            <h1 className="text-2xl font-bold">Community</h1>
          </div>

        <div className="glass-card p-4 rounded-xl">
          <Input
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="Share your experience..."
          />
          <div className="flex justify-end mt-2">
            <Button onClick={handlePost}>Post</Button>
          </div>
        </div>

        {posts.map((post) => (
          <div
            key={post._id}
            ref={(el) => (postRefs.current[post._id] = el)}
            className="post-card glass-card p-6 rounded-xl relative group hover:-translate-y-1 transition-all duration-300"
          >
            {isAdmin && (
              <button
                onClick={() => handleDelete(post._id)}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} />
              </button>
            )}

            <div className="flex justify-between">
              <div className="flex gap-3">
                <img src={post.avatar || `https://ui-avatars.com/api/?name=${post.author}`} className="h-10 w-10 rounded-full" />
                <div>
                  <p className="font-semibold">{post.author}</p>
                  <p className="text-xs text-muted-foreground">{new Date(post.created_at).toLocaleString()}</p>
                </div>
              </div>
              {!isAdmin && <MoreHorizontal className="text-muted-foreground" />}
            </div>

            <h3 className="mt-3 text-lg font-bold">{post.title}</h3>
            <p className="text-foreground/80">{post.description}</p>

            <div className="flex flex-wrap gap-2 mt-2">
              {post.tags.map((tag, i) => (
                <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex gap-6 mt-4 text-sm text-muted-foreground">
              <button onClick={() => handleLike(post._id)} className="hover:text-primary transition-colors duration-200">
                <ThumbsUp className="inline h-4 w-4" /> {post.likes}
              </button>
              <button onClick={() => setActiveReplyId(activeReplyId === post._id ? null : post._id)} className="hover:text-primary transition-colors duration-200">
                <MessageSquare className="inline h-4 w-4" /> {post.replies?.length || 0}
              </button>
              <button onClick={() => handleShare(post)} className="ml-auto hover:text-primary transition-colors duration-200">
                <Share2 className="inline h-4 w-4" /> Share
              </button>
            </div>

            {(activeReplyId === post._id || (post.replies && post.replies.length > 0)) && (
              <div className="mt-4 space-y-3 pt-4 border-t border-border">
                {post.replies?.map((r) => (
                  <div key={r.id} className="flex gap-2 text-sm pl-4 border-l-2 border-border">
                    <img src={r.avatar} className="h-6 w-6 rounded-full" />
                    <div>
                      <p className="font-semibold">
                        {r.author} <span className="text-xs text-muted-foreground">{new Date(r.time).toLocaleTimeString()}</span>
                      </p>
                      <p className="text-foreground/80">{r.content}</p>
                    </div>
                  </div>
                ))}

                {activeReplyId === post._id && (
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={replyText[post._id] || ""}
                      onChange={(e) => setReplyText({ ...replyText, [post._id]: e.target.value })}
                      placeholder="Write a reply..."
                      className="glass-panel"
                    />
                    <Button onClick={() => handleReply(post._id)} size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <div className="space-y-6 sticky top-24 h-fit">
        {/* Trending */}
        <div className="glass-card p-6 rounded-xl">
          <h3 className="font-semibold mb-4">Trending</h3>
          {["UPI Fraud Prevention", "WhatsApp Privacy"].map((t, i) => (
            <div key={i} onClick={() => handleTrendingClick(t)} className="cursor-pointer hover:text-primary transition-colors duration-200 mb-2">
              #{t}
            </div>
          ))}
        </div>

        {/* Blog */}
        <div className="glass-card p-6 rounded-xl">
          <h3 className="font-semibold mb-4">Awareness Blog</h3>
          {blogs.map((b) => (
            <div key={b.id} className="mb-4">
              <p className="font-medium hover:text-primary transition-colors duration-200 cursor-pointer">{b.title}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{b.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    </PageTransition>
  );
}
