"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { CatmullRomCurve3, Color, ExtrudeGeometry, MathUtils, PMREMGenerator, Shape, TubeGeometry, Vector3, type DirectionalLight, type Group, type MeshStandardMaterial, type Texture } from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import type { CoreSceneProgressRef } from "./core-scene-progress";

type Props = {
  active: boolean; compact: boolean; dark: boolean;
  pointer: RefObject<{ x: number; y: number }>;
  progress: CoreSceneProgressRef | null;
  onReady: (ready: boolean) => void;
  onFailure: () => void;
};

function roundedSection(width: number, depth: number) {
  const shape = new Shape();
  const x = width / 2, y = depth / 2, radius = Math.min(.075, y * .7);
  shape.moveTo(-x + radius, -y); shape.lineTo(x - radius, -y);
  shape.quadraticCurveTo(x, -y, x, -y + radius); shape.lineTo(x, y - radius);
  shape.quadraticCurveTo(x, y, x - radius, y); shape.lineTo(-x + radius, y);
  shape.quadraticCurveTo(-x, y, -x, y - radius); shape.lineTo(-x, -y + radius);
  shape.quadraticCurveTo(-x, -y, -x + radius, -y);
  return shape;
}

function createFlow(compact: boolean) {
  const paths = [
    [[-5,-4,-.8],[-.4,-3.1,.2],[2.8,-1.8,.6],[3.6,1.5,-.3],[1.5,3.5,-1.2],[6,4.6,-1.6]],
    [[-1,4.5,-1.2],[2,2.7,-.5],[4.6,.7,-.9],[3.5,-1.2,.8],[1,-3,.3],[5,-4.5,-1]],
    [[7,2.9,-1.6],[4.5,2,.4],[2.2,.8,.8],[1.3,-1.2,.2],[3.5,-3.5,-.6],[7,-3.3,-1]],
  ].map(points => new CatmullRomCurve3(points.map(point => new Vector3(...point)), false, "centripetal"));
  const steps = compact ? 64 : 112;
  const ribbons = paths.map((curve, index) => {
    const extrusion = new ExtrudeGeometry(roundedSection(index === 1 ? .78 : .62, .2), { steps, bevelEnabled: false, extrudePath: curve, curveSegments: 3 });
    // ExtrudeGeometry duplicates vertices per face. Weld the untextured surface so
    // studio reflections flow continuously along the curve instead of each step.
    extrusion.deleteAttribute("normal"); extrusion.deleteAttribute("uv");
    const smooth = mergeVertices(extrusion);
    smooth.computeVertexNormals(); extrusion.dispose();
    return smooth;
  });
  // The continuous orange seam follows the silver ribbon's outer edge.
  const frames = paths[0].computeFrenetFrames(steps, false);
  const seamPoints = Array.from({ length: steps + 1 }, (_, index) => paths[0].getPointAt(index / steps).addScaledVector(frames.normals[index], .325));
  const seam = new TubeGeometry(new CatmullRomCurve3(seamPoints), steps, .024, 5, false);
  return { ribbons, seam };
}

function Studio({ onReady, onFailure }: Pick<Props, "onReady" | "onFailure">) {
  const { gl, invalidate } = useThree();
  const [environment, setEnvironment] = useState<Texture | null>(null);
  useEffect(() => {
    const room = new RoomEnvironment();
    const generator = new PMREMGenerator(gl);
    const target = generator.fromScene(room, .04, .1, 100, { size: 64 });
    const readyFrame = requestAnimationFrame(() => { setEnvironment(target.texture); onReady(true); invalidate(); });
    room.dispose(); generator.dispose();
    const canvas = gl.domElement;
    const lose = (event: Event) => { event.preventDefault(); onFailure(); };
    canvas.addEventListener("webglcontextlost", lose);
    return () => { cancelAnimationFrame(readyFrame); canvas.removeEventListener("webglcontextlost", lose); target.dispose(); onReady(false); };
  }, [gl, onReady, onFailure, invalidate]);
  return environment ? <primitive object={environment} attach="environment" /> : null;
}

type StoryFrame = { at: number; x: number; y: number; scale: number; rx: number; ry: number; rz: number; upper: number; lower: number; third: number; camera: number; light: number; seam: number };

// One original assembly seen as identity, perspective, structure, process, evidence and resolution.
const STORY: readonly StoryFrame[] = [
  { at: 0, x: -.04, y: 0, scale: 1, rx: .05, ry: -.14, rz: -.04, upper: 0, lower: 0, third: 0, camera: 10, light: 4.2, seam: .35 },
  { at: 1, x: -.29, y: -.25, scale: .8, rx: .18, ry: -1.12, rz: .32, upper: .15, lower: -.1, third: .2, camera: 10.2, light: 3.4, seam: .3 },
  { at: 2, x: .2, y: -.1, scale: .72, rx: -.2, ry: .38, rz: .96, upper: .6, lower: -.55, third: .35, camera: 10.6, light: 4.5, seam: .45 },
  { at: 2.55, x: -.46, y: -.1, scale: .75, rx: .12, ry: -.45, rz: .4, upper: .8, lower: -.75, third: -.4, camera: 10.4, light: 3.8, seam: .4 },
  { at: 3, x: .01, y: -.15, scale: .8, rx: .12, ry: -.28, rz: -.5, upper: 1.1, lower: -1, third: .65, camera: 10.8, light: 3.7, seam: .5 },
  { at: 3.25, x: .04, y: -.1, scale: .79, rx: .08, ry: -.18, rz: -.33, upper: .7, lower: -.8, third: .45, camera: 10.6, light: 3.9, seam: .48 },
  { at: 3.5, x: -.01, y: -.05, scale: .78, rx: .04, ry: -.07, rz: -.16, upper: .35, lower: -.35, third: .2, camera: 10.4, light: 4.2, seam: .43 },
  { at: 3.75, x: .08, y: 0, scale: .76, rx: .02, ry: .05, rz: -.04, upper: 0, lower: 0, third: 0, camera: 10.2, light: 4.3, seam: .36 },
  { at: 4, x: .43, y: -.8, scale: .42, rx: .2, ry: 1.1, rz: .05, upper: 0, lower: 0, third: 0, camera: 11, light: 2.5, seam: .12 },
  { at: 5, x: .2, y: -1.6, scale: .83, rx: -.22, ry: .12, rz: 1.35, upper: .1, lower: -.1, third: -.1, camera: 10.4, light: 4.5, seam: .55 },
];

function Flow({ compact, dark, pointer, progress }: Pick<Props, "compact" | "dark" | "pointer" | "progress">) {
  const assembly = useRef<Group>(null);
  const lower = useRef<Group>(null);
  const upper = useRef<Group>(null);
  const third = useRef<Group>(null);
  const graphite = useRef<MeshStandardMaterial>(null);
  const seam = useRef<MeshStandardMaterial>(null);
  const light = useRef<DirectionalLight>(null);
  const { viewport, camera, invalidate } = useThree();
  const cameraRef = useRef(camera);
  const bridgeRef = useRef(progress);
  const geometry = useMemo(() => createFlow(compact), [compact]);
  const darkColor = useMemo(() => new Color("#343d47"), []);
  const lightColor = useMemo(() => new Color("#424c56"), []);
  useEffect(() => () => { geometry.ribbons.forEach(item => item.dispose()); geometry.seam.dispose(); }, [geometry]);
  useEffect(() => {
    const bridge = bridgeRef.current;
    if (bridge) bridge.invalidate = invalidate;
    invalidate();
    return () => { if (bridge?.invalidate === invalidate) delete bridge.invalidate; };
  }, [progress, invalidate]);
  useEffect(() => { invalidate(); }, [dark, compact, invalidate]);

  useFrame((_, delta) => {
    const group = assembly.current;
    if (!group) return;
    const dt = Math.min(delta, .05);
    const chapter = Math.max(0, Math.min(5, progress?.current ?? 0));
    const frameIndex = Math.max(0, STORY.findIndex((frame, index) => index < STORY.length - 1 && chapter < STORY[index + 1].at));
    const start = chapter >= 5 ? STORY[STORY.length - 1] : STORY[frameIndex];
    const end = chapter >= 5 ? start : STORY[frameIndex + 1];
    const t = MathUtils.smoothstep(chapter, start.at, end.at || .001);
    const value = (key: Exclude<keyof StoryFrame, "at">) => MathUtils.lerp(start[key], end[key], t);
    const px = compact ? 0 : pointer.current.x;
    const py = compact ? 0 : pointer.current.y;
    let unsettled = false;
    const damp = (current: number, target: number) => {
      if (Math.abs(current - target) > .0005) unsettled = true;
      return MathUtils.damp(current, target, 5, dt);
    };
    group.rotation.x = damp(group.rotation.x, value("rx") * (compact ? .45 : 1) + py * .035);
    group.rotation.y = damp(group.rotation.y, value("ry") * (compact ? .55 : 1) + px * .085);
    group.rotation.z = damp(group.rotation.z, value("rz") * (compact ? .45 : 1));
    group.position.x = damp(group.position.x, compact ? viewport.width * (value("x") * .4 + .03) : viewport.width * value("x"));
    group.position.y = damp(group.position.y, value("y") + (compact ? .55 : 0));
    group.scale.setScalar(damp(group.scale.x, value("scale") * (compact ? .66 : 1)));
    if (upper.current) upper.current.position.y = damp(upper.current.position.y, value("upper"));
    if (lower.current) lower.current.position.y = damp(lower.current.position.y, value("lower"));
    if (third.current) third.current.position.x = damp(third.current.position.x, value("third"));
    cameraRef.current.position.z = damp(cameraRef.current.position.z, compact ? 10.5 : value("camera"));
    if (light.current) light.current.intensity = damp(light.current.intensity, value("light"));
    if (seam.current) seam.current.emissiveIntensity = damp(seam.current.emissiveIntensity, value("seam"));
    if (graphite.current) {
      const target = dark ? darkColor : lightColor;
      if (Math.abs(graphite.current.color.r - target.r) + Math.abs(graphite.current.color.g - target.g) + Math.abs(graphite.current.color.b - target.b) > .0005) unsettled = true;
      graphite.current.color.lerp(target, 1 - Math.exp(-dt * 5));
    }
    // Render only while the existing scroll owner, pointer or theme changes the scene.
    if (unsettled) invalidate();
  });
  return (
    <>
      <directionalLight ref={light} position={[6,1,-2]} intensity={4.2} color="#dce6ef" />
      <group ref={assembly}>
        <group ref={lower}><mesh geometry={geometry.ribbons[0]}><meshStandardMaterial color="#b9c1c7" metalness={.94} roughness={.23} envMapIntensity={1.65} /></mesh><mesh geometry={geometry.seam}><meshStandardMaterial ref={seam} color="#FF6A13" metalness={.15} roughness={.3} emissive="#FF6A13" emissiveIntensity={.35} /></mesh></group>
        <group ref={upper}><mesh geometry={geometry.ribbons[1]}><meshStandardMaterial ref={graphite} color="#424c56" metalness={.7} roughness={.3} envMapIntensity={1.5} /></mesh></group>
        <group ref={third}><mesh geometry={geometry.ribbons[2]}><meshStandardMaterial color="#9da6ae" metalness={.96} roughness={.19} envMapIntensity={1.75} /></mesh></group>
      </group>
    </>
  );
}

export default function EngineeredFlowCanvas(props: Props) {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 38, near: .1, far: 35 }} dpr={props.compact ? .8 : .85} frameloop={props.active ? "demand" : "never"} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} style={{ pointerEvents: "none" }}>
      <ambientLight intensity={.4} />
      <directionalLight position={[-4,6,5]} intensity={3.8} color="#f5f8ff" />
      <directionalLight position={[1,-4,3]} intensity={1.3} color="#ffb078" />
      <Studio onReady={props.onReady} onFailure={props.onFailure} />
      <Flow compact={props.compact} dark={props.dark} pointer={props.pointer} progress={props.progress} />
    </Canvas>
  );
}
