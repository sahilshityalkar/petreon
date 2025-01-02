'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { likePost, unlikePost, sharePost, fetchPosts, bookmarkPost, unbookmarkPost } from '@/lib/api'
import { useToast } from "@/components/ui/toaster"
import { PostCard } from '@/component/post-card'
import { PostModal } from '@/component/post-modal'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import type { Post } from '@/lib/api'
import { useMediaQuery } from '@/hooks/use-media-query'

export function PetFeed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const loader = useRef(null)
  const { toast } = useToast()
  const isMobile = useMediaQuery("(max-width: 640px)")

  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const newPosts = await fetchPosts(page, 3)
      if (newPosts.length === 0) {
        setHasMore(false)
      } else {
        setPosts((prevPosts) => [...prevPosts, ...newPosts])
        setPage((prevPage) => prevPage + 1)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load more posts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [loading, page, hasMore, toast])

  useEffect(() => {
    loadMorePosts()
  }, [])

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0
    }

    const observer = new IntersectionObserver((entities) => {
      const target = entities[0]
      if (target.isIntersecting && hasMore) {
        loadMorePosts()
      }
    }, options)

    if (loader.current) {
      observer.observe(loader.current)
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current)
      }
    }
  }, [loadMorePosts, hasMore])

  const handleLike = async (postId: string, liked: boolean) => {
    try {
      const response = await (liked ? likePost(postId) : unlikePost(postId))
      if (response.success) {
        setPosts(currentPosts =>
          currentPosts.map(post =>
            post.id === postId ? { ...post, isLiked: liked, likes: response.likes, comments: response.comments } : post
          )
        )
      } else {
        throw new Error("Failed to update like status")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleShare = async (postId: string, method: 'whatsapp' | 'email' | 'copy') => {
    try {
      const response = await sharePost(postId);
      if (response.success) {
        switch (method) {
          case 'whatsapp':
            window.open(`https://wa.me/?text=${encodeURIComponent(response.url)}`, '_blank');
            break;
          case 'email':
            window.location.href = `mailto:?body=${encodeURIComponent(response.url)}`;
            break;
          case 'copy':
            await navigator.clipboard.writeText(response.url);
            toast({
              title: "Link copied",
              description: "The post link has been copied to your clipboard.",
            });
            break;
        }
      } else {
        throw new Error("Failed to share post");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share the post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBookmark = async (postId: string, bookmarked: boolean) => {
    try {
      const response = await (bookmarked ? bookmarkPost(postId) : unbookmarkPost(postId))
      if (response.success) {
        setPosts(currentPosts =>
          currentPosts.map(post =>
            post.id === postId ? { ...post, isBookmarked: bookmarked } : post
          )
        )
      } else {
        throw new Error("Failed to update bookmark status")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update bookmark status. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onClick={() => setSelectedPost(post)}
            onLike={handleLike}
            onShare={handleShare}
            onBookmark={handleBookmark}
          />
        ))}
      </div>
      <div ref={loader} className="h-10 flex items-center justify-center">
        {loading && <Loader2 className="h-6 w-6 animate-spin" />}
        {!loading && hasMore && (
          <Button onClick={loadMorePosts} variant="outline">
            Load more posts
          </Button>
        )}
        {!hasMore && <p className="text-muted-foreground">No more posts to load</p>}
      </div>
      {selectedPost && (
        isMobile ? (
          <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
            <PostModal
              post={selectedPost}
              isOpen={true}
              onClose={() => setSelectedPost(null)}
              onLike={handleLike}
              onShare={handleShare}
              onBookmark={handleBookmark}
            />
          </div>
        ) : (
          <PostModal
            post={selectedPost}
            isOpen={!!selectedPost}
            onClose={() => setSelectedPost(null)}
            onLike={handleLike}
            onShare={handleShare}
            onBookmark={handleBookmark}
          />
        )
      )}
    </div>
  )
}