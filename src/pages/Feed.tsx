import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

interface PostDislike {
  id: number;
  post_urn: string;
  dislike_count: number;
  created_at: string;
  updated_at: string;
}

export default function Feed() {
  const [posts, setPosts] = useState<PostDislike[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('post_dislikes')
        .select('*')
        .order('dislike_count', { ascending: false })
        .limit(50);

      if (error) throw error;

      setPosts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-[120px]">
        <div className="text-2xl text-foreground/60">Loading feed...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-[120px] px-[40px]">
        <Card className="p-[40px] max-w-md">
          <CardHeader className="p-0 mb-[20px]">
            <CardTitle className="text-2xl text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-foreground/70">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[120px] pb-[80px] px-[40px]">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          className="mb-[80px] text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-[20px]">
            Most <span className="text-primary">Disliked</span> Posts
          </h1>
          <p className="text-xl text-foreground/70">
            The community has spoken. Here are the posts with the most dislikes.
          </p>
        </motion.div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-[40px] text-center">
              <CardContent className="p-0">
                <i className="hn hn-thumbs-down text-6xl text-foreground/20 mb-[20px]"></i>
                <p className="text-xl text-foreground/60">
                  No disliked posts yet. Be the first to dislike a post!
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px]">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-[40px] flex flex-col aspect-auto">
                  <CardHeader className="p-0 mb-[20px]">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Post #{index + 1}</CardTitle>
                      <div className="px-[20px] py-[10px] bg-primary/10 text-primary border border-primary/20 card-corners relative">
                        <span className="corner-bottom-left">+</span>
                        <span className="corner-bottom-right">+</span>
                        <span className="font-bold">{post.dislike_count}</span> dislikes
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0 flex-1 flex flex-col">
                    {/* LinkedIn Post Iframe */}
                    <div className="relative w-full h-[800px] bg-background/50 border border-foreground/20 mb-[20px]">
                      <iframe
                        src={`https://www.linkedin.com/embed/feed/update/${post.post_urn}`}
                        className="w-full h-full"
                        allowFullScreen
                        title={`LinkedIn Post ${post.post_urn}`}
                        onError={(e) => {
                          // If iframe fails to load, show fallback
                          const target = e.target as HTMLIFrameElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling;
                          if (fallback) {
                            (fallback as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                      {/* Fallback if iframe blocked */}
                      <div className="hidden absolute inset-0 w-full h-full items-center justify-center flex-col gap-[20px] p-[20px]">
                        <i className="hn hn-linkedin text-4xl text-foreground/40"></i>
                        <p className="text-sm text-foreground/60 text-center">
                          Cannot embed this post
                        </p>
                        <a
                          href={`https://www.linkedin.com/feed/update/${post.post_urn}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-[20px] py-[10px] bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors text-sm card-corners relative"
                        >
                          <span className="corner-bottom-left">+</span>
                          <span className="corner-bottom-right">+</span>
                          View on LinkedIn →
                        </a>
                      </div>
                    </div>

                    {/* Post URN */}
                    <div className="text-xs text-foreground/40 break-all">
                      URN: {post.post_urn}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
