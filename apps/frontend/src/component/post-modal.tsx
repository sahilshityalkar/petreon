'use client'

import { useState, useEffect, useRef, SetStateAction } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
    
import { Heart, Share, X, Bookmark, Send, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { fetchComments, addComment, likeComment, unlikeComment } from '@/lib/api'
import { useToast } from "@/components/ui/toaster"
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import type { Post, Comment, User } from '@/lib/api.ts'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { VisuallyHidden } from "@/component/ui/visually-hidden"

// Fallback user data
const FALLBACK_USER: User = {
  id: 'fallback',
  name: 'Unknown User',
  username: 'unknown',
  avatar: '/placeholder-avatar.png'
}

interface PostModalProps {
  post: Post
  isOpen: boolean
  onClose: () => void
  onLike: (postId: string, liked: boolean) => void
  onShare: (postId: string, method: 'whatsapp' | 'email' | 'copy') => void
  onBookmark: (postId: string, bookmarked: boolean) => void
}

export function PostModal({ post, isOpen, onClose, onLike, onShare, onBookmark }: PostModalProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [newComment, setNewComment] = useState('')
  const [isLiked, setIsLiked] = useState(post.isLiked)
  const [likesCount, setLikesCount] = useState(post.likes)
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked)
  const [commentsCount, setCommentsCount] = useState(post.comments)
  const { toast } = useToast()
  const commentsEndRef = useRef<HTMLDivElement>(null)
  const commentsContainerRef = useRef<HTMLDivElement>(null)
  const commentInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      loadComments()
    } else {
      setComments([])
      setPage(1)
    }
  }, [isOpen])

  useEffect(() => {
    setIsLiked(post.isLiked)
    setLikesCount(post.likes)
    setIsBookmarked(post.isBookmarked)
    setCommentsCount(post.comments)
  }, [post.isLiked, post.likes, post.isBookmarked, post.comments])

  const loadComments = async () => {
    if (loading) return
    setLoading(true)
    try {
      const newComments = await fetchComments(post.id, page)
      setComments(prev => [...prev, ...newComments])
      setPage(p => p + 1)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load comments. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    try {
      const comment = await addComment(post.id, newComment)
      setComments(prev => [comment, ...prev])
      setNewComment('')
      setCommentsCount(prev => prev + 1)
      if (commentsEndRef.current) {
        commentsEndRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleLikeComment = async (commentId: string, liked: boolean) => {
    try {
      const response = await (liked ? likeComment(commentId) : unlikeComment(commentId))
      if (response.success) {
        setComments(prev => prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, isLiked: liked, likes: response.likes } 
            : comment
        ))
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update comment like status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleLike = async () => {
    const newLikedState = !isLiked
    setIsLiked(newLikedState)
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1)

    try {
      await onLike(post.id, newLikedState)
    } catch (error) {
      setIsLiked(!newLikedState)
      setLikesCount(prev => newLikedState ? prev - 1 : prev + 1)
    }
  }

  const handleBookmark = async () => {
    const newBookmarkedState = !isBookmarked
    setIsBookmarked(newBookmarkedState)

    try {
      await onBookmark(post.id, newBookmarkedState)
    } catch (error) {
      setIsBookmarked(!newBookmarkedState)
      toast({
        title: "Error",
        description: "Failed to update bookmark status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const focusCommentInput = () => {
    if (commentInputRef.current) {
      commentInputRef.current.focus()
    }
  }

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 }
  }

  const postAuthor = post.author || FALLBACK_USER

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background w-[95%] sm:w-full" aria-describedby="post-modal-description">
        <VisuallyHidden>
          <DialogTitle>Post Details</DialogTitle>
        </VisuallyHidden>
        <div id="post-modal-description" className="sr-only">Detailed view of the post with comments and interactions</div>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col md:flex-row h-[90vh] md:h-[85vh]"
          >
            <div className="relative w-full md:w-3/5 bg-white">
              <Image
                src={post.image}
                alt={post.caption}
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="w-full md:w-2/5 flex flex-col bg-background">
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={postAuthor.avatar || '/placeholder-avatar.png'} alt={postAuthor.name} />
                    <AvatarFallback>{postAuthor.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-semibold">{postAuthor.name}</span>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-4 bg-white">
                  <p className="text-sm">{post.caption}</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={commentsContainerRef}>
                  {comments.map((comment) => {
                    const commentAuthor = comment.author || FALLBACK_USER;
                    return (
                      <div key={comment.id} className="flex items-start space-x-3 group animate-fadeIn">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={commentAuthor.avatar} alt={commentAuthor.name} />
                          <AvatarFallback>{commentAuthor.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">{commentAuthor.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{comment.text}</p>
                          <div className="mt-2 text-xs text-muted-foreground flex items-center space-x-2">
                            <button 
                              className="hover:underline"
                              onClick={() => handleLikeComment(comment.id, !comment.isLiked)}
                            >
                              {comment.isLiked ? 'Unlike' : 'Like'}
                            </button>
                            <span>{comment.likes} likes</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={commentsEndRef} />
                  {loading && <p className="text-center text-muted-foreground py-2">Loading comments...</p>}
                  {!loading && comments.length > 0 && comments.length < commentsCount && (
                    <Button
                      variant="outline"
                      className="w-full text-muted-foreground hover:bg-gray-100"
                      onClick={loadComments}
                    >
                      Load more comments
                    </Button>
                  )}
                </div>
              </div>
              <div className="p-4 bg-white border-t space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <motion.button
                      variants={buttonVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                      onClick={handleLike}
                      className={cn(
                        "p-2 rounded-full transition-colors duration-200",
                        isLiked ? "text-red-500 bg-red-100" : "text-gray-500 hover:bg-gray-100"
                      )}
                    >
                      <Heart className={cn("h-6 w-6", isLiked && "fill-current")} />
                    </motion.button>
                    <motion.button
                      variants={buttonVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                      onClick={focusCommentInput}
                      className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
                    >
                      <MessageCircle className="h-6 w-6" />
                    </motion.button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <motion.button
                          variants={buttonVariants}
                          initial="initial"
                          whileHover="hover"
                          whileTap="tap"
                          className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
                        >
                          <Share className="h-6 w-6" />
                        </motion.button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => onShare(post.id, 'whatsapp')}>
                          Share on WhatsApp
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onShare(post.id, 'email')}>
                          Share via Email
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onShare(post.id, 'copy')}>
                          Copy Link
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <motion.button
                      variants={buttonVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                      onClick={handleBookmark}
                      className={cn(
                        "p-2 rounded-full transition-colors duration-200",
                        isBookmarked ? "text-blue-500 bg-blue-100" : "text-gray-500 hover:bg-gray-100"
                      )}
                    >
                      <Bookmark className={cn("h-6 w-6", isBookmarked && "fill-current")} />
                    </motion.button>
                  </div>
                </div>
                <p className="font-semibold">{likesCount} likes</p>
                <div className="flex items-center space-x-2">
                  <Input
                    ref={commentInputRef}
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e: { target: { value: SetStateAction<string> } }) => setNewComment(e.target.value)}
                    className="flex-1"
                    onKeyPress={(e: { key: string; preventDefault: () => void }) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddComment()
                      }
                    }}
                  />
                  <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        <motion.button
          className="absolute right-4 top-4 z-50 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-gray-100 transition-colors duration-200"
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="h-5 w-5 text-gray-500" />
        </motion.button>
      </DialogContent>
    </Dialog>
  )
}

