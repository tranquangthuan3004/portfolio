"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import type { Group, OrthographicCamera, Texture } from "three";
import { Euler, MathUtils, PMREMGenerator, Quaternion, Vector3 } from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import type { ThreeEvent } from "@react-three/fiber";
import type { CoreSceneProgressRef } from "./core-scene-progress";

export type CoreVisualConcept = "orbital" | "fluid";

export type CoreVisualCanvasProps = {
  pointerTarget: RefObject<{ x: number; y: number }>;
  fallback: ReactNode;
  onContextLoss: () => void;
  onCanvasReady: (ready: boolean) => void;
  active: boolean;
  compact: boolean;
  interactive: boolean;
  touchRotation?: boolean;
  rotationControlsRef: { current: CoreRotationControls | null };
  chapterProgressRef?: CoreSceneProgressRef | null;
  chapterMotionRef?: CoreSceneProgressRef;
  dpr?: number;
};

export type CoreRotationControls = {
  rotate: (axis: "x" | "y", angle: number) => void;
  reset: () => void;
};

type StageProps = Pick<
  CoreVisualCanvasProps,
  | "fallback"
  | "onContextLoss"
  | "onCanvasReady"
  | "active"
  | "pointerTarget"
  | "interactive"
  | "touchRotation"
  | "rotationControlsRef"
  | "chapterProgressRef"
  | "chapterMotionRef"
  | "dpr"
> & {
  children: ReactNode;
};

function ContextLossHandler({ onContextLoss }: Pick<CoreVisualCanvasProps, "onContextLoss">) {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const canvas = gl.domElement;
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      onContextLoss();
    };
    canvas.addEventListener("webglcontextlost", handleContextLost, { once: true });
    return () => canvas.removeEventListener("webglcontextlost", handleContextLost);
  }, [gl, onContextLoss]);

  return null;
}

function CanvasReady({ onCanvasReady }: Pick<CoreVisualCanvasProps, "onCanvasReady">) {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    onCanvasReady(true);
    return () => onCanvasReady(false);
  }, [gl, onCanvasReady]);

  return null;
}

function StudioReflection() {
  const gl = useThree((state) => state.gl);
  const [environment, setEnvironment] = useState<Texture | null>(null);

  useEffect(() => {
    const room = new RoomEnvironment();
    const generator = new PMREMGenerator(gl);
    const target = generator.fromScene(room, 0.04);
    room.dispose();

    let disposed = false;
    const frame = requestAnimationFrame(() => {
      if (!disposed) setEnvironment(target.texture);
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      target.dispose();
      generator.dispose();
    };
  }, [gl]);

  return environment ? <primitive object={environment} attach="environment" /> : null;
}

function CameraFit() {
  const { camera, size } = useThree();
  const cameraRef = useRef(camera as OrthographicCamera);

  useLayoutEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const height = 3.15 / Math.max(aspect, 0.1);
    const orthographic = cameraRef.current;
    orthographic.left = -height * aspect * 0.5;
    orthographic.right = height * aspect * 0.5;
    orthographic.top = height * 0.5;
    orthographic.bottom = -height * 0.5;
    orthographic.position.set(0, 0, 5.5);
    orthographic.lookAt(0, 0, 0);
    orthographic.updateProjectionMatrix();
  }, [size.height, size.width]);

  return null;
}

function CommonMotion({ pointerTarget, children }: Pick<CoreVisualCanvasProps, "pointerTarget"> & { children: ReactNode }) {
  const assembly = useRef<Group>(null);

  useFrame(({ clock }, delta) => {
    const group = assembly.current;
    if (!group) return;

    const step = Math.min(delta, 0.05);
    const pointer = pointerTarget.current;
    const targetX = Math.sin(clock.elapsedTime * 0.2) * 0.012 + pointer.y * 0.035;
    const targetY = Math.sin(clock.elapsedTime * 0.17) * 0.022 + pointer.x * 0.055;
    group.rotation.x = MathUtils.damp(group.rotation.x, targetX, 3, step);
    group.rotation.y = MathUtils.damp(group.rotation.y, targetY, 3, step);
  });

  return <group ref={assembly}>{children}</group>;
}

function HeroChapterMotion({
  chapterProgressRef,
  chapterMotionRef,
  children,
}: {
  chapterProgressRef: CoreSceneProgressRef;
  chapterMotionRef: CoreSceneProgressRef;
  children: ReactNode;
}) {
  const assembly = useRef<Group>(null);

  useFrame((_, delta) => {
    const group = assembly.current;
    if (!group) return;

    const target = MathUtils.smoothstep(chapterProgressRef.current, 0, 1);
    const step = Math.min(delta, 0.05);
    const progress = MathUtils.damp(chapterMotionRef.current, target, 8.5, step);
    chapterMotionRef.current = progress;

    group.rotation.set(progress * 0.045, progress * -0.26, progress * 0.02);
    group.position.set(progress * 0.035, progress * 0.04, 0);
  }, -1);

  return <group ref={assembly}>{children}</group>;
}

const DRAG_SENSITIVITY = 0.0042;
const MAX_ANGULAR_SPEED = 1.65;
const MIN_INERTIA_SPEED = 0.025;
const ROTATION_DAMPING = 3.8;
const ORIENTATION_DAMPING = 24;

type CaptureTarget = {
  setPointerCapture: (pointerId: number) => void;
  releasePointerCapture: (pointerId: number) => void;
};

function DragMotion({
  active,
  touchRotation = false,
  rotationControlsRef,
  children,
}: Pick<CoreVisualCanvasProps, "active" | "rotationControlsRef" | "touchRotation"> & { children: ReactNode }) {
  const assembly = useRef<Group>(null);
  const gl = useThree((state) => state.gl);
  const camera = useThree((state) => state.camera);
  const motion = useRef({
    target: new Quaternion(),
    yawStep: new Quaternion(),
    pitchStep: new Quaternion(),
    idle: new Quaternion(),
    idleEuler: new Euler(),
    desired: new Quaternion(),
    dragging: false,
    inertia: false,
    pointerId: -1,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    velocityX: 0,
    velocityY: 0,
    idleBlend: 1,
    captureTarget: null as CaptureTarget | null,
    removePointerListeners: null as (() => void) | null,
  });
  const cameraAxes = useRef({
    cameraWorld: new Quaternion(),
    parentWorld: new Quaternion(),
    inverseParentWorld: new Quaternion(),
    horizontal: new Vector3(),
    vertical: new Vector3(),
  });

  const setRotationMarker = useCallback((name: string, value: string | null) => {
    const canvas = gl.domElement;
    if (value === null) canvas.removeAttribute(name);
    else canvas.setAttribute(name, value);
  }, [gl]);

  const snapshotTarget = useCallback(() => {
    const { x, y, z, w } = motion.current.target;
    return [x, y, z, w].map((component) => component.toFixed(5)).join(",");
  }, []);

  const getCameraPlaneAxes = useCallback((group: Group) => {
    const axes = cameraAxes.current;
    if (group.parent) group.parent.getWorldQuaternion(axes.parentWorld);
    else axes.parentWorld.identity();
    axes.inverseParentWorld.copy(axes.parentWorld).invert();
    camera.getWorldQuaternion(axes.cameraWorld);
    axes.horizontal.set(0, 1, 0).applyQuaternion(axes.cameraWorld).applyQuaternion(axes.inverseParentWorld).normalize();
    axes.vertical.set(1, 0, 0).applyQuaternion(axes.cameraWorld).applyQuaternion(axes.inverseParentWorld).normalize();
    return axes;
  }, [camera]);

  const finishDrag = useCallback((pointerId: number, releaseCapture: boolean, keepInertia = false) => {
    const state = motion.current;
    if (!state.dragging || pointerId !== state.pointerId) return;

    state.dragging = false;
    state.pointerId = -1;
    state.inertia = keepInertia && Math.hypot(state.velocityX, state.velocityY) >= MIN_INERTIA_SPEED;
    if (!state.inertia) {
      state.velocityX = 0;
      state.velocityY = 0;
    }
    state.idleBlend = 0;
    state.removePointerListeners?.();
    state.removePointerListeners = null;
    setRotationMarker("data-thn-dragging", null);
    setRotationMarker("data-thn-rotation-release", snapshotTarget());
    if (state.inertia) setRotationMarker("data-thn-inertia-active", "true");
    else setRotationMarker("data-thn-inertia-active", null);

    if (releaseCapture && state.captureTarget) {
      try {
        state.captureTarget.releasePointerCapture(pointerId);
      } catch {
        // Pointer capture may already have been released by the browser.
      }
    }
    state.captureTarget = null;
  }, [setRotationMarker, snapshotTarget]);

  const startDrag = useCallback((event: ThreeEvent<PointerEvent>) => {
    const nativeEvent = event.nativeEvent;
    if (
      !active ||
      (nativeEvent.pointerType === "touch" && !touchRotation) ||
      nativeEvent.button !== 0 ||
      nativeEvent.isPrimary === false
    ) {
      return;
    }

    const group = assembly.current;
    const view = gl.domElement.ownerDocument.defaultView;
    if (!group || !view) return;

    event.stopPropagation();

    const state = motion.current;
    state.target.copy(group.quaternion);
    state.dragging = true;
    state.inertia = false;
    state.pointerId = nativeEvent.pointerId;
    state.lastX = nativeEvent.clientX;
    state.lastY = nativeEvent.clientY;
    state.lastTime = nativeEvent.timeStamp || performance.now();
    state.velocityX = 0;
    state.velocityY = 0;
    state.idleBlend = 0;
    state.captureTarget = event.target as unknown as CaptureTarget;
    try {
      state.captureTarget.setPointerCapture(nativeEvent.pointerId);
    } catch {
      state.dragging = false;
      state.pointerId = -1;
      state.captureTarget = null;
      return;
    }

    const move = (pointerEvent: PointerEvent) => {
      if (!state.dragging || pointerEvent.pointerId !== state.pointerId) return;
      const now = pointerEvent.timeStamp || performance.now();
      const elapsed = Math.max(1 / 240, (now - state.lastTime) / 1000);
      const deltaX = Math.max(-120, Math.min(120, pointerEvent.clientX - state.lastX));
      const deltaY = Math.max(-120, Math.min(120, pointerEvent.clientY - state.lastY));
      const yaw = deltaX * DRAG_SENSITIVITY;
      const pitch = deltaY * DRAG_SENSITIVITY;
      const axes = getCameraPlaneAxes(group);

      state.yawStep.setFromAxisAngle(axes.horizontal, yaw);
      state.pitchStep.setFromAxisAngle(axes.vertical, pitch);
      state.target.premultiply(state.yawStep).premultiply(state.pitchStep).normalize();
      state.velocityY = Math.max(-MAX_ANGULAR_SPEED, Math.min(MAX_ANGULAR_SPEED, yaw / elapsed));
      state.velocityX = Math.max(-MAX_ANGULAR_SPEED, Math.min(MAX_ANGULAR_SPEED, pitch / elapsed));
      state.lastX = pointerEvent.clientX;
      state.lastY = pointerEvent.clientY;
      state.lastTime = now;
      pointerEvent.preventDefault();
    };
    const up = (pointerEvent: PointerEvent) => finishDrag(pointerEvent.pointerId, true, true);
    const cancel = (pointerEvent: PointerEvent) => finishDrag(pointerEvent.pointerId, true);
    const lost = (pointerEvent: PointerEvent) => finishDrag(pointerEvent.pointerId, false);
    const canvas = gl.domElement;

    view.addEventListener("pointermove", move, { passive: false });
    view.addEventListener("pointerup", up, true);
    view.addEventListener("pointercancel", cancel, true);
    canvas.addEventListener("lostpointercapture", lost as EventListener, true);
    state.removePointerListeners = () => {
      view.removeEventListener("pointermove", move);
      view.removeEventListener("pointerup", up, true);
      view.removeEventListener("pointercancel", cancel, true);
      canvas.removeEventListener("lostpointercapture", lost as EventListener, true);
    };
    setRotationMarker("data-thn-dragging", "true");
    setRotationMarker("data-thn-inertia-active", null);
    setRotationMarker("data-thn-rotation-release", null);
    setRotationMarker("data-thn-rotation-settled", null);
    setRotationMarker("data-thn-rotation-command", null);
  }, [active, finishDrag, getCameraPlaneAxes, gl, setRotationMarker, touchRotation]);

  const pointerUp = useCallback((event: ThreeEvent<PointerEvent>) => {
    finishDrag(event.pointerId, true, true);
  }, [finishDrag]);

  const pointerCancel = useCallback((event: ThreeEvent<PointerEvent>) => {
    finishDrag(event.pointerId, true);
  }, [finishDrag]);

  const lostPointerCapture = useCallback((event: ThreeEvent<PointerEvent>) => {
    finishDrag(event.pointerId, false);
  }, [finishDrag]);

  useLayoutEffect(() => {
    const controls: CoreRotationControls = {
      rotate: (axis, angle) => {
        const state = motion.current;
        const group = assembly.current;
        if (!group) return;
        const axes = getCameraPlaneAxes(group);
        state.yawStep.setFromAxisAngle(axis === "y" ? axes.horizontal : axes.vertical, angle);
        state.target.premultiply(state.yawStep).normalize();
        state.velocityX = 0;
        state.velocityY = 0;
        state.inertia = false;
        state.idleBlend = 0;
        setRotationMarker("data-thn-inertia-active", null);
        setRotationMarker("data-thn-rotation-command", snapshotTarget());
      },
      reset: () => {
        const state = motion.current;
        state.target.identity();
        state.velocityX = 0;
        state.velocityY = 0;
        state.inertia = false;
        state.idleBlend = 0;
        setRotationMarker("data-thn-inertia-active", null);
        setRotationMarker("data-thn-rotation-command", snapshotTarget());
      },
    };
    rotationControlsRef.current = controls;
    return () => {
      rotationControlsRef.current = null;
    };
  }, [getCameraPlaneAxes, rotationControlsRef, setRotationMarker, snapshotTarget]);

  const clearMotion = useCallback(() => {
    const state = motion.current;
    if (state.dragging) {
      finishDrag(state.pointerId, true);
      return;
    }
    state.inertia = false;
    state.velocityX = 0;
    state.velocityY = 0;
    setRotationMarker("data-thn-inertia-active", null);
  }, [finishDrag, setRotationMarker]);

  useEffect(() => {
    if (!active) clearMotion();
  }, [active, clearMotion]);

  useEffect(() => {
    const view = gl.domElement.ownerDocument.defaultView;
    if (!view) return;
    view.addEventListener("blur", clearMotion);
    return () => view.removeEventListener("blur", clearMotion);
  }, [clearMotion, gl]);

  useEffect(() => () => {
    clearMotion();
    rotationControlsRef.current = null;
  }, [clearMotion, rotationControlsRef]);

  useFrame(({ clock }, delta) => {
    const group = assembly.current;
    const state = motion.current;
    if (!group) return;
    const step = Math.min(delta, 0.05);

    if (!state.dragging && state.inertia) {
      const axes = getCameraPlaneAxes(group);
      state.yawStep.setFromAxisAngle(axes.horizontal, state.velocityY * step);
      state.pitchStep.setFromAxisAngle(axes.vertical, state.velocityX * step);
      state.target.premultiply(state.yawStep).premultiply(state.pitchStep).normalize();
      const decay = Math.exp(-ROTATION_DAMPING * step);
      state.velocityX *= decay;
      state.velocityY *= decay;

      if (Math.hypot(state.velocityX, state.velocityY) < MIN_INERTIA_SPEED) {
        state.velocityX = 0;
        state.velocityY = 0;
        state.inertia = false;
        setRotationMarker("data-thn-inertia-active", null);
        setRotationMarker("data-thn-rotation-settled", snapshotTarget());
      }
    } else if (!state.dragging) {
      state.idleBlend = MathUtils.damp(state.idleBlend, 1, 0.62, step);
    }

    const blend = state.dragging ? 0 : state.idleBlend;
    state.idleEuler.set(
      Math.sin(clock.elapsedTime * 0.2) * 0.011 * blend,
      Math.sin(clock.elapsedTime * 0.17) * 0.018 * blend,
      Math.sin(clock.elapsedTime * 0.12) * 0.003 * blend,
    );
    state.idle.setFromEuler(state.idleEuler);
    state.desired.copy(state.target).multiply(state.idle);
    group.quaternion.slerp(state.desired, 1 - Math.exp(-ORIENTATION_DAMPING * step));
  });

  return (
    <group
      ref={assembly}
      onPointerDown={startDrag}
      onPointerUp={pointerUp}
      onPointerCancel={pointerCancel}
      onLostPointerCapture={lostPointerCapture}
    >
      {children}
    </group>
  );
}

export function CoreVisualStage({
  fallback,
  onContextLoss,
  onCanvasReady,
  active,
  pointerTarget,
  interactive,
  touchRotation,
  rotationControlsRef,
  chapterProgressRef,
  chapterMotionRef,
  dpr = 1,
  children,
}: StageProps) {
  const scene = interactive ? (
    <DragMotion active={active} touchRotation={touchRotation} rotationControlsRef={rotationControlsRef}>
      {children}
    </DragMotion>
  ) : (
    <CommonMotion pointerTarget={pointerTarget}>{children}</CommonMotion>
  );

  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 5.5], zoom: 1 }}
      dpr={dpr}
      frameloop={active ? "always" : "never"}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      fallback={fallback}
      aria-hidden="true"
    >
      <ambientLight intensity={0.58} />
      <directionalLight color="#ffffff" intensity={2.15} position={[-2.5, 3.8, 4]} />
      <directionalLight color="#c5c7c9" intensity={0.76} position={[3, -1.5, 2]} />
      <StudioReflection />
      <ContextLossHandler onContextLoss={onContextLoss} />
      <CanvasReady onCanvasReady={onCanvasReady} />
      <CameraFit />
      {interactive && chapterProgressRef && chapterMotionRef ? (
        <HeroChapterMotion
          chapterProgressRef={chapterProgressRef}
          chapterMotionRef={chapterMotionRef}
        >
          {scene}
        </HeroChapterMotion>
      ) : (
        scene
      )}
    </Canvas>
  );
}
