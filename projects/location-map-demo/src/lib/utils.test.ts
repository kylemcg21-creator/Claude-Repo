import { describe, it, expect } from "vitest"
import { cn } from "./utils"

describe("cn", () => {
  it("merges plain class name strings", () => {
    expect(cn("a", "b")).toBe("a b")
  })

  it("drops falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b")
  })

  it("resolves conflicting Tailwind classes, keeping the last one", () => {
    expect(cn("p-2", "p-4")).toBe("p-4")
  })

  it("merges conditional object syntax", () => {
    expect(cn("base", { active: true, hidden: false })).toBe("base active")
  })

  it("returns an empty string when given nothing", () => {
    expect(cn()).toBe("")
  })
})
