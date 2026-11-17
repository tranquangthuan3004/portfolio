"use client";

import { useEffect, useMemo } from "react";
import {
  IcosahedronGeometry,
  MeshPhysicalMaterial,
  TorusGeometry,
} from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import type { CoreVisualCanvasProps } from "./core-visual-stage";
import { CoreVisualStage } from "./core-visual-stage";

type Geometry = TorusGeometry | RoundedBoxGeometry | IcosahedronGeometry;

export default function OrbitalArchitectureCanvas(props: CoreVisualCanvasProps) {
  const { pointerTarget, fallback, onContextLoss, active, compact } = props;
  const materials = useMemo(
    () => ({
      silver: new MeshPhysicalMaterial({
        color: "#aeb2b6",
        metalness: 0.9,
        roughness: 0.23,
        clearcoat: 0.68,
        clearcoatRoughness: 0.2,
        envMapIntensity: 1.25,
      }),
      graphite: new MeshPhysicalMaterial({
        color: "#55595d",
        metalness: 0.86,
        roughness: 0.29,
        clearcoat: 0.48,
        envMapIntensity: 0.9,
      }),
    }),
    [],
  );
  const geometries = useMemo(() => {
    const radial = compact ? 5 : 7;
    const segments = compact ? 42 : 64;
    const bevel = compact ? 1 : 2;

    return [
      new TorusGeometry(0.96, 0.045, radial, segments, Math.PI * 1.28),
      new TorusGeometry(0.64, 0.046, radial, Math.round(segments * 0.84), Math.PI * 1.14),
      new TorusGeometry(1.16, 0.035, radial, Math.round(segments * 0.9), Math.PI * 0.94),
      new RoundedBoxGeometry(0.38, 0.105, 0.18, bevel, 0.035),
      new RoundedBoxGeometry(0.32, 0.13, 0.16, bevel, 0.04),
      new RoundedBoxGeometry(0.24, 0.12, 0.2, bevel, 0.035),
      new RoundedBoxGeometry(0.34, 0.09, 0.14, bevel, 0.03),
      new IcosahedronGeometry(0.145, 0),
    ] as Geometry[];
  }, [compact]);

  useEffect(() => () => geometries.forEach((geometry) => geometry.dispose()), [geometries]);
  useEffect(
    () => () => {
      materials.silver.dispose();
      materials.graphite.dispose();
    },
    [materials],
  );

  return (
    <CoreVisualStage
      fallback={fallback}
      onContextLoss={onContextLoss}
      onCanvasReady={props.onCanvasReady}
      active={active}
      pointerTarget={pointerTarget}
      interactive={props.interactive}
      rotationControlsRef={props.rotationControlsRef}
    >
      <group>
        <mesh
          geometry={geometries[0]}
          material={materials.silver}
          position={[-0.1, 0.02, -0.08]}
          rotation={[0.18, 0.22, -0.48]}
        />
        <mesh
          geometry={geometries[1]}
          material={materials.silver}
          position={[0.2, 0.11, 0.18]}
          rotation={[0.94, -0.32, 0.7]}
        />
        <mesh
          geometry={geometries[2]}
          material={materials.silver}
          position={[0.06, -0.14, -0.2]}
          rotation={[0.28, 0.82, 1.08]}
        />
        <mesh
          geometry={geometries[3]}
          material={materials.graphite}
          position={[-0.91, 0.54, 0.16]}
          rotation={[0.15, -0.18, -0.38]}
        />
        <mesh
          geometry={geometries[4]}
          material={materials.graphite}
          position={[0.82, 0.68, -0.23]}
          rotation={[-0.08, 0.2, 0.62]}
        />
        <mesh
          geometry={geometries[5]}
          material={materials.graphite}
          position={[-0.78, -0.62, 0.2]}
          rotation={[0.26, 0.12, 0.38]}
        />
        <mesh
          geometry={geometries[6]}
          material={materials.graphite}
          position={[0.86, -0.48, 0.24]}
          rotation={[-0.24, 0.38, -0.22]}
        />
        <mesh
          geometry={geometries[7]}
          material={materials.silver}
          position={[0.12, 0.06, 0.34]}
          rotation={[0.22, 0.2, 0.1]}
        />
      </group>
    </CoreVisualStage>
  );
}
