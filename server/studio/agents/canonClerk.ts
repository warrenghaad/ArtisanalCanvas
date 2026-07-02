import type { Critique, StudioStatus } from "@shared/schema";

// Canon Clerk: decides the lifecycle status for a generated image based on the
// critique. Nothing becomes canon automatically — strong, reusable, on-goal
// work becomes "reviewed"; weak work stays "candidate" or is "deprecated".
export function canonClerk(critique: Critique): StudioStatus {
  if (critique.canonStatus === "canon") {
    // The crew never auto-promotes to canon; cap at reviewed pending human sign-off.
    return "reviewed";
  }
  if (critique.score >= 4 && critique.reusable && !critique.tooDecorative) {
    return "reviewed";
  }
  if (critique.score <= 1 || (critique.tooDecorative && !critique.primitivesClear)) {
    return "deprecated";
  }
  return "candidate";
}
