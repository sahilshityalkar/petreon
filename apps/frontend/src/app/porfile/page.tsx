'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Pencil, Trash2, Heart, MessageCircle, Share2, ArrowLeft, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { PostCard } from '@/components/post-card'
import { VisuallyHidden } from '@/components/ui/visually-hidden'
import { motion, AnimatePresence } from 'framer-motion'

interface Post {
  id: string
  image: string
  caption: string
  likes: number
  comments: Comment[]
}

interface Comment {
  id: string
  username: string
  text: string
}

const samplePosts: Post[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80',
    caption: 'Max enjoying his weekend at the park! 🐕',
    likes: 42,
    comments: [
      { id: 'c1', username: 'dogLover', text: 'What a happy pup!' },
      { id: 'c2', username: 'pawsome', text: 'I wish I could join!' },
    ],
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    caption: 'Beach day with my best friend! 🏖️🐾',
    likes: 65,
    comments: [
      { id: 'c3', username: 'beachBum', text: 'Perfect day for the beach!' },
      { id: 'c4', username: 'surfDog', text: 'Hope you brought treats!' },
    ],
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    caption: 'Morning run with Rover! 🏃‍♂️🐕',
    likes: 78,
    comments: [
      { id: 'c5', username: 'fitFido', text: 'Great way to start the day!' },
      { id: 'c6', username: 'runnerPup', text: 'How many miles today?' },
    ],
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    caption: 'Fluffy\'s favorite napping spot 😴',
    likes: 53,
    comments: [
      { id: 'c7', username: 'catNapper', text: 'So cozy!' },
      { id: 'c8', username: 'whiskers', text: 'I wish I could sleep like that' },
    ],
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80',
    caption: 'Kitty\'s judging face 😼',
    likes: 92,
    comments: [
      { id: 'c9', username: 'judgmentalCat', text: 'I know that look!' },
      { id: 'c10', username: 'catWhisperer', text: 'What did you do to deserve that face?' },
    ],
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1686&q=80',
    caption: 'Caught in a sunbeam, living her best life 😺',
    likes: 89,
    comments: [
      { id: 'c11', username: 'sunWorshipper', text: 'Nothing better than a warm sunbeam!' },
      { id: 'c12', username: 'lazyDaisy', text: 'I\'m jealous of that nap spot' },
    ],
  },
]

const users = [
  { name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=7' },
  // ... other users
]

export default function ProfilePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [showComments, setShowComments] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 9

  useEffect(() => {
    setPosts(samplePosts)
  }, [])

  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
          <Dialog>
            <DialogTrigger asChild>
              <Avatar className="w-32 h-32 cursor-pointer">
                <AvatarImage src={users[3]?.avatar || ''} alt={users[3]?.name || 'User'} />
                <AvatarFallback>{users[3]?.name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Profile Photo</DialogTitle>
              </DialogHeader>
              <div className="flex justify-center py-4">
                <Avatar className="w-64 h-64">
                  <AvatarImage src={users[3]?.avatar || ''} alt={users[3]?.name || 'User'} />
                  <AvatarFallback>{users[3]?.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" className="flex items-center">
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="destructive" className="flex items-center">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">{users[3]?.name || 'User'}</h1>
            <p className="text-muted-foreground mt-2">Proud pet parent of Max the Golden Retriever</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
              <Button variant="outline">Edit Profile</Button>
              <Button variant="outline">Settings</Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-7xl mx-auto">
          {posts && posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onClick={() => {
                setSelectedPost(post)
                setShowComments(false)
              }}
            />
          ))}
        </div>

        <div className="flex justify-center mt-8">
          {Array.from({ length: Math.ceil(posts.length / postsPerPage) }, (_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "default" : "outline"}
              className="mx-1"
              onClick={() => paginate(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden bg-background rounded-lg">
          <DialogHeader>
            <VisuallyHidden>
              <DialogTitle>Post Details</DialogTitle>
            </VisuallyHidden>
          </DialogHeader>
          <AnimatePresence>
            {selectedPost && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col md:flex-row h-[90vh] md:h-[85vh]"
              >
                <div className="relative w-full md:w-2/3 bg-black">
                  <Image
                    src={selectedPost.image}
                    alt={selectedPost.caption}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="w-full md:w-1/3 flex flex-col bg-background">
                  <div className="p-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="https://i.pravatar.cc/150?img=7" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">John Doe</p>
                        <p className="text-sm text-muted-foreground">Original poster</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    {showComments ? (
                      <>
                        <Button
                          variant="ghost"
                          className="mb-4"
                          onClick={() => setShowComments(false)}
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Back
                        </Button>
                        <div className="space-y-4">
                          {selectedPost.comments.map((comment) => (
                            <div key={comment.id} className="flex items-start space-x-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback>{comment.username[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold">{comment.username}</p>
                                <p className="text-sm">{comment.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="mb-4">{selectedPost.caption}</p>
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="sm" className="space-x-2">
                            <Heart className="w-4 h-4" />
                            <span>{selectedPost.likes}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="space-x-2"
                            onClick={() => setShowComments(true)}
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>{selectedPost.comments.length}</span>
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="p-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Input placeholder="Add a comment..." className="flex-1" />
                      <Button>Post</Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            className="absolute right-2 top-2 z-50 p-2 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={() => setSelectedPost(null)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-4 w-4" />
          </motion.button>
        </DialogContent>
      </Dialog>
    </div>
  )
}