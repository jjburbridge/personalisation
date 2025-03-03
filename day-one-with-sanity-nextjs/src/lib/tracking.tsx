"use client";
import { useEffect } from "react";

// Helper component to track experiment views from server components
export function Tracking({
  userGroup,
  userId,
}: {
  userGroup: string;
  userId: string;
}) {
  useEffect(() => {
    if (!userId || !userGroup) return;
    // TODO: track with Google Analytics, Segment, etc.
    console.log("Viewed Experiment, send tracking", {
      userGroup: userGroup,
      userId: userId,
    });
  }, [userId, userGroup]);

  return null;
}
