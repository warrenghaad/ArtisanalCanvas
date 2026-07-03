import type { Critique, StudioStatus } from "@shared/schema";

// Canon Clerk: decides the lifecycle status for a generated image based on the
// critique. Nothing becomes canon automatically — strong, reusable, on-goal
// work becomes "reviewed"; weak work stays "candidate" or is "deprecated".
export function canonClerk(critique: Critique): StudioStatus {
  // Promotion beyond "candidate" requires that the critique actually judged the
  // rendered image (vision), not manifest metadata alone.
  const canPromote = critique.basedOnImage;
  if (critique.canonStatus === "canon" && canPromote) {
    // The crew never auto-promotes to canon; cap at reviewed pending human sign-off.
    return "reviewed";
  }
  if (canPromote && critique.score >= 4 && critique.reusable && !critique.tooDecorative) {
    return "reviewed";
  }
  if (critique.score <= 1 || (critique.tooDecorative && !critique.primitivesClear)) {
    return "deprecated";
  }
  return "candidate";
}
