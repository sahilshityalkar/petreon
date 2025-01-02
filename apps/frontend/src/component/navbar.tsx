'use client'

import Link from 'next/link'
import { PawPrint, Plus, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { CreatePostModal } from './create-post-modal'

export function Navbar() {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <PawPrint className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">Petreon</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCreatePostOpen(true)}
          >
            <Plus className="h-5 w-5" />
            <span className="sr-only">Create Post</span>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/profile">
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Link>
          </Button>
        </div>
      </div>
      <CreatePostModal
              isOpen={isCreatePostOpen}
              onClose={() => setIsCreatePostOpen(false)} onPostCreated={function (): void {
                  throw new Error('Function not implemented.')
              } }      />
    </nav>
  )
}

