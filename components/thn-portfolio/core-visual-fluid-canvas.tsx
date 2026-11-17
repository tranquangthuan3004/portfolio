"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { RefObject } from "react";
import {
  BufferGeometry,
  CatmullRomCurve3,
  DoubleSide,
  Float32BufferAttribute,
  IcosahedronGeometry,
  MeshPhysicalMaterial,
  OctahedronGeometry,
  Vector3,
} from "three";
import type { Group } from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import type { CoreVisualCanvasProps } from "./core-visual-stage";
import { CoreVisualStage } from "./core-visual-stage";

type FluidGeometry = BufferGeometry | RoundedBoxGeometry | OctahedronGeometry | IcosahedronGeometry;
type FluidMaterials = { silver: MeshPhysicalMaterial; graphite: MeshPhysicalMaterial };
type GroupRef = RefObject<Group | null>;

function FluidPieces({
  geometries,
  materials,
  ribbons,
  fragments,
}: {
  geometries: FluidGeometry[];
  materials: FluidMaterials;
  ribbons?: readonly [GroupRef, GroupRef, GroupRef];
  fragments?: readonly [GroupRef, GroupRef, GroupRef, GroupRef];
}) {
  return (
    <group rotation={[0.08, -0.18, 0.04]}>
      <group ref={ribbons?.[0]}>
        <mesh geometry={geometries[0]} material={materials.silver} position={[-0.02, 0.04, 0.03]} />
      </group>
      <group ref={ribbons?.[1]}>
        <mesh geometry={geometries[1]} material={materials.silver} position={[0.06, 0.03, -0.02]} />
      </group>
      <group ref={ribbons?.[2]}>
        <mesh geometry={geometries[2]} material={materials.silver} position={[0.03, -0.02, 0.08]} />
      </group>
      <group ref={fragments?.[0]}>
        <mesh
          geometry={geometries[3]}
          material={materials.graphite}
          position={[-0.48, 0.34, 0.28]}
          rotation={[0.34, -0.28, -0.6]}
        />
      </group>
      <group ref={fragments?.[1]}>
        <mesh
          geometry={geometries[4]}
          material={materials.graphite}
          position={[0.62, -0.42, 0.3]}
          rotation={[-0.24, 0.36, 0.76]}
        />
      </group>
      <group ref={fragments?.[2]}>
        <mesh
          geometry={geometries[5]}
          material={materials.silver}
          position={[-0.88, -0.14, -0.12]}
          rotation={[0.22, 0.18, 0.26]}
        />
      </group>
      <group ref={fragments?.[3]}>
        <mesh
          geometry={geometries[6]}
          material={materials.graphite}
          position={[0.92, 0.4, -0.08]}
          rotation={[-0.24, 0.12, -0.35]}
        />
      </group>
      <mesh
        geometry={geometries[7]}
        material={materials.silver}
        position={[0.12, 0.08, 0.4]}
        rotation={[0.28, 0.2, -0.16]}
      />
    </group>
  );
}

function FluidChapterPieces({
  geometries,
  materials,
  chapterMotionRef,
}: {
  geometries: FluidGeometry[];
  materials: FluidMaterials;
  chapterMotionRef: { current: number };
}) {
  const ribbonA = useRef<Group | null>(null);
  const ribbonB = useRef<Group | null>(null);
  const ribbonC = useRef<Group | null>(null);
  const fragmentA = useRef<Group | null>(null);
  const fragmentB = useRef<Group | null>(null);
  const fragmentC = useRef<Group | null>(null);
  const fragmentD = useRef<Group | null>(null);

  useFrame(() => {
    const progress = chapterMotionRef.current;
    ribbonA.current?.position.set(-progress * 0.18, progress * 0.075, 0);
    ribbonB.current?.position.set(progress * 0.12, progress * 0.14, 0);
    ribbonC.current?.position.set(progress * 0.04, -progress * 0.18, progress * 0.035);
    fragmentA.current?.position.set(-progress * 0.065, progress * 0.05, 0);
    fragmentB.current?.position.set(progress * 0.065, -progress * 0.05, 0);
    fragmentC.current?.position.set(-progress * 0.05, -progress * 0.03, 0);
    fragmentD.current?.position.set(progress * 0.05, progress * 0.03, 0);

    if (ribbonA.current) ribbonA.current.rotation.z = progress * 0.08;
    if (ribbonB.current) ribbonB.current.rotation.z = -progress * 0.06;
    if (ribbonC.current) ribbonC.current.rotation.x = progress * 0.065;
  });

  return (
    <FluidPieces
      geometries={geometries}
      materials={materials}
      ribbons={[ribbonA, ribbonB, ribbonC]}
      fragments={[fragmentA, fragmentB, fragmentC, fragmentD]}
    />
  );
}

function createRibbonGeometry(points: Vector3[], halfWidth: number, segments: number, phase: number) {
  const curve = new CatmullRomCurve3(points, false, "centripetal", 0.5);
  const positions: number[] = [];
  const indices: number[] = [];
  const reference = new Vector3(0, 0, 1);
  const alternate = new Vector3(0, 1, 0);

  for (let index = 0; index <= segments; index += 1) {
    const t = index / segments;
    const center = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t).normalize();
    const axis = Math.abs(tangent.dot(reference)) > 0.92 ? alternate : reference;
    const side = tangent.clone().cross(axis).normalize();
    const normal = tangent.clone().cross(side).normalize();
    const twist = Math.sin(t * Math.PI * 2 + phase) * 0.22;
    side.applyAxisAngle(tangent, twist).normalize();
    center.addScaledVector(normal, Math.sin(t * Math.PI * 2 + phase) * 0.025);
    const width = halfWidth * (0.78 + Math.sin(t * Math.PI + phase) * 0.22);
    const edgeA = center.clone().addScaledVector(side, width);
    const edgeB = center.clone().addScaledVector(side, -width);
    positions.push(edgeA.x, edgeA.y, edgeA.z, edgeB.x, edgeB.y, edgeB.z);

    if (index < segments) {
      const first = index * 2;
      indices.push(first, first + 1, first + 2, first + 1, first + 3, first + 2);
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function vec(x: number, y: number, z: number) {
  return new Vector3(x, y, z);
}

export default function FluidConstructCanvas(props: CoreVisualCanvasProps) {
  const {
    pointerTarget,
    fallback,
    onContextLoss,
    onCanvasReady,
    active,
    compact,
    interactive,
    rotationControlsRef,
    chapterProgressRef,
  } = props;
  const chapterMotionRef = useRef(0);
  const materials = useMemo(
    () => ({
      silver: new MeshPhysicalMaterial({
        color: "#c0c1c3",
        metalness: 0.89,
        roughness: 0.2,
        clearcoat: 0.78,
        clearcoatRoughness: 0.16,
        envMapIntensity: 1.32,
        side: DoubleSide,
      }),
      graphite: new MeshPhysicalMaterial({
        color: "#4e5357",
        metalness: 0.82,
        roughness: 0.28,
        clearcoat: 0.55,
        envMapIntensity: 1.0,
      }),
    }),
    [],
  );
  const geometries = useMemo(() => {
    const segments = compact ? 28 : 44;
    const bevel = compact ? 1 : 2;
    return [
      createRibbonGeometry(
        [
          vec(-1.18, 0.52, -0.2),
          vec(-0.72, 0.78, 0.14),
          vec(-0.12, 0.63, 0.34),
          vec(0.32, 0.12, 0.2),
          vec(0.81, -0.26, -0.08),
          vec(1.12, -0.05, -0.24),
        ],
        0.23,
        segments,
        0.15,
      ),
      createRibbonGeometry(
        [
          vec(-0.92, -0.5, 0.2),
          vec(-0.74, -0.12, 0.34),
          vec(-0.27, 0.17, -0.03),
          vec(0.2, 0.58, -0.3),
          vec(0.79, 0.55, -0.02),
          vec(1.05, 0.2, 0.27),
        ],
        0.17,
        segments,
        1.1,
      ),
      createRibbonGeometry(
        [
          vec(-0.46, 0.18, -0.25),
          vec(-0.4, -0.26, -0.4),
          vec(0.05, -0.68, -0.08),
          vec(0.6, -0.62, 0.33),
          vec(0.98, -0.22, 0.1),
        ],
        0.13,
        segments,
        2.25,
      ),
      new RoundedBoxGeometry(0.28, 0.09, 0.16, bevel, 0.032),
      new RoundedBoxGeometry(0.24, 0.11, 0.15, bevel, 0.035),
      new OctahedronGeometry(0.12, 0),
      new OctahedronGeometry(0.095, 0),
      new IcosahedronGeometry(0.135, 0),
    ] as FluidGeometry[];
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
      onCanvasReady={onCanvasReady}
      active={active}
      pointerTarget={pointerTarget}
      interactive={interactive}
      touchRotation={props.touchRotation}
      rotationControlsRef={rotationControlsRef}
      chapterProgressRef={chapterProgressRef}
      chapterMotionRef={chapterMotionRef}
      dpr={interactive && chapterProgressRef && !compact ? 0.85 : 1}
    >
      {interactive && chapterProgressRef ? (
        <FluidChapterPieces geometries={geometries} materials={materials} chapterMotionRef={chapterMotionRef} />
      ) : (
        <FluidPieces geometries={geometries} materials={materials} />
      )}
    </CoreVisualStage>
  );
}
