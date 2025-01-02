import Image from 'next/image'
import { Heart, MessageCircle, Bookmark, Share } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import type { Post } from '@/lib/api'
import { FALLBACK_USER } from '@/lib/api'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface PostCardProps {
  post: Post
  onClick: () => void
  onLike: (postId: string, liked: boolean) => void
  onShare: (postId: string, method: 'whatsapp' | 'email' | 'copy') => void
  onBookmark: (postId: string, bookmarked: boolean) => void
}

export function PostCard({ post, onClick, onLike, onShare, onBookmark }: PostCardProps) {
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 }
  }

  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-md w-full max-w-xl mx-auto">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={post.author?.avatar || '/placeholder-avatar.png'} alt={post.author?.name || 'User'} />
            <AvatarFallback>{post.author?.name?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{post.author?.name || 'Unknown User'}</p>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      </div>
      <motion.div 
        className="relative aspect-square bg-white cursor-pointer"
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Image
          src={post.image}
          alt={post.caption}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </motion.div>
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-4">
            <motion.button
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              onClick={(e: { stopPropagation: () => void }) => {
                e.stopPropagation();
                onLike(post.id, !post.isLiked);
              }}
              className={cn(
                "p-2 rounded-full transition-colors duration-200",
                post.isLiked ? "text-red-500 bg-red-100" : "text-gray-500 hover:bg-gray-100"
              )}
            >
              <Heart className={cn("h-6 w-6", post.isLiked && "fill-current")} />
              <span className="sr-only">Like</span>
            </motion.button>
            <motion.button
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              onClick={onClick}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
            >
              <MessageCircle className="h-6 w-6" />
              <span className="sr-only">Comment</span>
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
                  <span className="sr-only">Share</span>
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
          </div>
          <motion.button
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            onClick={(e: { stopPropagation: () => void }) => {
              e.stopPropagation();
              onBookmark(post.id, !post.isBookmarked);
            }}
            className={cn(
              "p-2 rounded-full transition-colors duration-200",
              post.isBookmarked ? "text-blue-500 bg-blue-100" : "text-gray-500 hover:bg-gray-100"
            )}
          >
            <Bookmark className={cn("h-6 w-6", post.isBookmarked && "fill-current")} />
            <span className="sr-only">Bookmark</span>
          </motion.button>
        </div>
        <p className="font-semibold mb-2">{post.likes} likes</p>
        <p className="mb-2 line-clamp-2"><span className="font-semibold">{post.author?.name || 'Unknown User'}</span> {post.caption}</p>
        <button className="text-sm text-gray-500 hover:text-blue-500 transition-colors duration-200" onClick={onClick}>
          {post.comments > 0 
            ? `View all ${post.comments} comment${post.comments === 1 ? '' : 's'}`
            : "Be the first to comment"}
        </button>
      </div>
    </div>
  )
}