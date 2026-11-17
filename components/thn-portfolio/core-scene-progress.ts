"use client";

import { createContext } from "react";

export type CoreSceneProgressRef = { current: number; invalidate?: () => void };

export const CoreSceneProgressContext = createContext<CoreSceneProgressRef | null>(null);
