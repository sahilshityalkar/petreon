import { PetFeed } from '@/component/pet-feed'

export default function Home() {
  return (
    <div className="max-w-xl mx-auto space-y-8 py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center">Petreon Feed</h1>
      <PetFeed />
    </div>
  )
}

