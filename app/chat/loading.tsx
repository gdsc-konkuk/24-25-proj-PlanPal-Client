import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="flex flex-col items-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading chat...</p>
      </div>
    </div>
  )
}

