import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import App from "./App"

describe("App", () => {
  it("renders a card for each configured location", () => {
    render(<App />)
    expect(screen.getByText("San Francisco, CA")).toBeInTheDocument()
    expect(screen.getByText("Brooklyn, NY")).toBeInTheDocument()
    expect(screen.getByText("Austin, TX")).toBeInTheDocument()
  })

  it("renders the page heading", () => {
    render(<App />)
    expect(screen.getByText("Drag a card. Click to expand.")).toBeInTheDocument()
  })
})
