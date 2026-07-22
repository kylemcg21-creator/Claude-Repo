import { LocationMap } from "@/components/ui/expand-map"
import { DraggableCardBody, DraggableCardContainer } from "@/components/ui/draggable-card"

const LOCATIONS = [
  { location: "San Francisco, CA", coordinates: "37.7749° N, 122.4194° W", pos: "left-[12%] top-[14%]" },
  { location: "Brooklyn, NY", coordinates: "40.6782° N, 73.9442° W", pos: "right-[14%] top-[26%]" },
  { location: "Austin, TX", coordinates: "30.2672° N, 97.7431° W", pos: "left-[38%] bottom-[16%]" },
]

export default function App() {
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
          Each location rides Aceternity's Draggable Card (via 21st.dev) — fling
          it with momentum and it tilts as you move, then click to reveal the
          street grid and coordinates.
        </p>
      </header>

      {/* Drag canvas — Aceternity DraggableCardContainer sets the 3D perspective */}
      <DraggableCardContainer className="relative z-10 mx-auto mt-8 h-[74vh] w-full max-w-5xl">
        {LOCATIONS.map((loc) => (
          <DraggableCardBody
            key={loc.location}
            className={`absolute ${loc.pos} min-h-0 w-auto overflow-visible rounded-2xl bg-transparent p-0 shadow-none`}
          >
            <LocationMap location={loc.location} coordinates={loc.coordinates} />
          </DraggableCardBody>
        ))}
      </DraggableCardContainer>
    </main>
  )
}
