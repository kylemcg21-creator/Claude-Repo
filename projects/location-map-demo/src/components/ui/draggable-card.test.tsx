import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { DraggableCardBody, DraggableCardContainer } from "./draggable-card"

describe("DraggableCardContainer", () => {
  it("renders its children", () => {
    render(
      <DraggableCardContainer>
        <span>child content</span>
      </DraggableCardContainer>
    )
    expect(screen.getByText("child content")).toBeInTheDocument()
  })

  it("merges a custom className with the base perspective class", () => {
    const { container } = render(<DraggableCardContainer className="custom-class" />)
    expect(container.firstChild).toHaveClass("custom-class")
    expect(container.firstChild).toHaveClass("[perspective:3000px]")
  })
})

describe("DraggableCardBody", () => {
  it("renders its children", () => {
    render(
      <DraggableCardBody>
        <span>card content</span>
      </DraggableCardBody>
    )
    expect(screen.getByText("card content")).toBeInTheDocument()
  })

  it("merges a custom className with the base card classes", () => {
    render(
      <DraggableCardBody className="custom-card">
        <span>card content</span>
      </DraggableCardBody>
    )
    expect(screen.getByText("card content").parentElement).toHaveClass("custom-card")
    expect(screen.getByText("card content").parentElement).toHaveClass("rounded-md")
  })

  it("renders without a custom className", () => {
    render(
      <DraggableCardBody>
        <span>plain card</span>
      </DraggableCardBody>
    )
    expect(screen.getByText("plain card").parentElement).toHaveClass("rounded-md")
  })
})
