import { useRef } from "react"
import { LocationMap } from "@/components/ui/expand-map"
import { DraggableCard } from "@/components/ui/draggable-card"

const LOCATIONS = [
  { location: "San Francisco, CA", coordinates: "37.7749° N, 122.4194° W", x: -220, y: -60 },
  { location: "Brooklyn, NY", coordinates: "40.6782° N, 73.9442° W", x: 200, y: 40 },
  { location: "Austin, TX", coordinates: "30.2672° N, 97.7431° W", x: -40, y: 150 },
]

export default function App() {
  const canvasRef = useRef<HTMLDivElement>(null)

  return (
    <main className="dark relative min-h-screen w-full overflow-hidden bg-background">
      {/* Ambient background wash */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(52,211,153,0.05)_0%,_transparent_70%)]" />

      <header className="relative z-10 flex flex-col items-center gap-2 pt-14 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
          Moveable Map Board
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Drag a card. Click to expand.
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Each location is a draggable, self-contained surface. Fling it around
          the board, then click to reveal the street grid and coordinates.
        </p>
      </header>

      {/* Drag canvas — cards are constrained to this area */}
      <div ref={canvasRef} className="relative z-10 mx-auto mt-10 h-[70vh] w-full max-w-5xl">
        <div className="absolute inset-0 flex items-center justify-center">
          {LOCATIONS.map((loc) => (
            <div
              key={loc.location}
              className="absolute"
              style={{ transform: `translate(${loc.x}px, ${loc.y}px)` }}
            >
              <DraggableCard constraintsRef={canvasRef}>
                <LocationMap location={loc.location} coordinates={loc.coordinates} />
              </DraggableCard>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
