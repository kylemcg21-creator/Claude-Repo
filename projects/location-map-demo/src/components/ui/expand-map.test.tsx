import { describe, it, expect } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { LocationMap } from "./expand-map"

describe("LocationMap", () => {
  it("renders the default location when no props are given", () => {
    render(<LocationMap />)
    expect(screen.getByText("San Francisco, CA")).toBeInTheDocument()
  })

  it("renders a custom location", () => {
    render(<LocationMap location="Austin, TX" coordinates="30.2672° N, 97.7431° W" />)
    expect(screen.getByText("Austin, TX")).toBeInTheDocument()
  })

  it("does not show coordinates while collapsed", () => {
    render(<LocationMap location="Austin, TX" coordinates="30.2672° N, 97.7431° W" />)
    expect(screen.queryByText("30.2672° N, 97.7431° W")).not.toBeInTheDocument()
  })

  it("reveals coordinates after a click", () => {
    render(<LocationMap location="Austin, TX" coordinates="30.2672° N, 97.7431° W" />)
    fireEvent.click(screen.getByText("Austin, TX"))
    expect(screen.getByText("30.2672° N, 97.7431° W")).toBeInTheDocument()
  })

  it("hides coordinates again once a second click collapses it", async () => {
    render(<LocationMap location="Austin, TX" coordinates="30.2672° N, 97.7431° W" />)
    const title = screen.getByText("Austin, TX")

    fireEvent.click(title)
    expect(screen.getByText("30.2672° N, 97.7431° W")).toBeInTheDocument()

    fireEvent.click(title)
    await waitFor(() => {
      expect(screen.queryByText("30.2672° N, 97.7431° W")).not.toBeInTheDocument()
    })
  })

  it("toggles expanded state independently across multiple instances", () => {
    render(
      <>
        <LocationMap location="City A" coordinates="1,1" />
        <LocationMap location="City B" coordinates="2,2" />
      </>
    )

    fireEvent.click(screen.getByText("City A"))

    expect(screen.getByText("1,1")).toBeInTheDocument()
    expect(screen.queryByText("2,2")).not.toBeInTheDocument()
  })

  it("renders a click-to-expand hint", () => {
    render(<LocationMap location="Austin, TX" />)
    expect(screen.getByText("Click to expand")).toBeInTheDocument()
  })

  it("applies a custom className to the outer wrapper", () => {
    const { container } = render(<LocationMap className="custom-map-class" />)
    expect(container.firstChild).toHaveClass("custom-map-class")
  })
})
