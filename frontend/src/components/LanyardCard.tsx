/* eslint-disable react/no-unknown-property */
'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

import cardGLB from './card.glb';
import lanyard from './lanyard.png';
import './LanyardCard.css';

extend({ MeshLineGeometry, MeshLineMaterial });

// 1x1 transparent pixel
const BLANK_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

interface LanyardCardProps {
  name: string;
  profession: string;
  profileImage?: string;
}

export default function LanyardCard({ name, profession, profileImage }: LanyardCardProps) {
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [lanyardImage, setLanyardImage] = useState<string | null>(null);

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // 1. Generate Custom Textures dynamically on Canvas
  useEffect(() => {
    // A. Generate Lanyard Strap texture with custom cursive repeating text
    const lCanvas = document.createElement('canvas');
    lCanvas.width = 512;
    lCanvas.height = 64;
    const lCtx = lCanvas.getContext('2d');
    if (lCtx) {
      const grad = lCtx.createLinearGradient(0, 0, 512, 0);
      grad.addColorStop(0, '#09090b');
      grad.addColorStop(0.2, '#18181b');
      grad.addColorStop(0.5, '#27272a');
      grad.addColorStop(0.8, '#18181b');
      grad.addColorStop(1, '#09090b');
      lCtx.fillStyle = grad;
      lCtx.fillRect(0, 0, 512, 64);

      lCtx.font = "bold 24px 'Dancing Script', cursive";
      lCtx.fillStyle = '#ffffff';
      lCtx.textAlign = 'center';
      lCtx.textBaseline = 'middle';
      // Draw repeating texts
      lCtx.fillText('Al Hasby', 128, 32);
      lCtx.fillText('Al Hasby', 384, 32);

      setLanyardImage(lCanvas.toDataURL());
    }

    // B. Generate Card Front texture
    const cCanvas = document.createElement('canvas');
    cCanvas.width = 512;
    cCanvas.height = 740;
    const cCtx = cCanvas.getContext('2d');

    if (cCtx) {
      const drawCard = (img?: HTMLImageElement) => {
        // Card base gradient
        const bgGrad = cCtx.createLinearGradient(0, 0, 512, 740);
        bgGrad.addColorStop(0, '#131326');
        bgGrad.addColorStop(1, '#090915');
        cCtx.fillStyle = bgGrad;
        cCtx.fillRect(0, 0, 512, 740);

        // Neon border
        cCtx.strokeStyle = 'rgba(99, 102, 241, 0.45)';
        cCtx.lineWidth = 6;
        cCtx.strokeRect(6, 6, 500, 728);

        // Header stripe
        const stripeGrad = cCtx.createLinearGradient(0, 0, 512, 0);
        stripeGrad.addColorStop(0, '#6366f1');
        stripeGrad.addColorStop(0.5, '#a855f7');
        stripeGrad.addColorStop(1, '#ec4899');
        cCtx.fillStyle = stripeGrad;
        cCtx.fillRect(0, 0, 512, 16);

        // Header Title
        cCtx.font = "bold 20px monospace";
        cCtx.fillStyle = '#818cf8';
        cCtx.textAlign = 'center';
        cCtx.fillText('PORTFOLIO ID CARD', 256, 60);

        // Profile Image Area
        const imgX = 64;
        const imgY = 100;
        const imgW = 384;
        const imgH = 448;

        if (img) {
          cCtx.save();
          cCtx.beginPath();
          // Draw round rect for image mask
          cCtx.arc(imgX + 24, imgY + 24, 24, Math.PI, 1.5 * Math.PI);
          cCtx.lineTo(imgX + imgW - 24, imgY);
          cCtx.arc(imgX + imgW - 24, imgY + 24, 24, 1.5 * Math.PI, 2 * Math.PI);
          cCtx.lineTo(imgX + imgW, imgY + imgH - 24);
          cCtx.arc(imgX + imgW - 24, imgY + imgH - 24, 24, 0, 0.5 * Math.PI);
          cCtx.lineTo(imgX + 24, imgY + imgH);
          cCtx.arc(imgX + 24, imgY + imgH - 24, 24, 0.5 * Math.PI, Math.PI);
          cCtx.closePath();
          cCtx.clip();

          // Cover scaling
          const scale = Math.max(imgW / img.width, imgH / img.height);
          const dx = imgX + (imgW - img.width * scale) / 2;
          const dy = imgY + (imgH - img.height * scale) / 2;
          cCtx.drawImage(img, dx, dy, img.width * scale, img.height * scale);
          cCtx.restore();
        } else {
          // Fallback solid gradient & initials
          cCtx.save();
          cCtx.beginPath();
          cCtx.arc(imgX + 24, imgY + 24, 24, Math.PI, 1.5 * Math.PI);
          cCtx.lineTo(imgX + imgW - 24, imgY);
          cCtx.arc(imgX + imgW - 24, imgY + 24, 24, 1.5 * Math.PI, 2 * Math.PI);
          cCtx.lineTo(imgX + imgW, imgY + imgH - 24);
          cCtx.arc(imgX + imgW - 24, imgY + imgH - 24, 24, 0, 0.5 * Math.PI);
          cCtx.lineTo(imgX + 24, imgY + imgH);
          cCtx.arc(imgX + 24, imgY + imgH - 24, 24, 0.5 * Math.PI, Math.PI);
          cCtx.closePath();
          cCtx.clip();

          const fallbackGrad = cCtx.createLinearGradient(imgX, imgY, imgX + imgW, imgY + imgH);
          fallbackGrad.addColorStop(0, '#6366f1');
          fallbackGrad.addColorStop(1, '#a855f7');
          cCtx.fillStyle = fallbackGrad;
          cCtx.fillRect(imgX, imgY, imgW, imgH);

          cCtx.font = "bold 96px sans-serif";
          cCtx.fillStyle = '#ffffff';
          cCtx.textAlign = 'center';
          cCtx.textBaseline = 'middle';
          cCtx.fillText(initials, 256, imgY + imgH / 2);
          cCtx.restore();
        }

        // Draw profile outline
        cCtx.strokeStyle = 'rgba(255,255,255,0.1)';
        cCtx.lineWidth = 3;
        cCtx.beginPath();
        cCtx.arc(imgX + 24, imgY + 24, 24, Math.PI, 1.5 * Math.PI);
        cCtx.lineTo(imgX + imgW - 24, imgY);
        cCtx.arc(imgX + imgW - 24, imgY + 24, 24, 1.5 * Math.PI, 2 * Math.PI);
        cCtx.lineTo(imgX + imgW, imgY + imgH - 24);
        cCtx.arc(imgX + imgW - 24, imgY + imgH - 24, 24, 0, 0.5 * Math.PI);
        cCtx.lineTo(imgX + 24, imgY + imgH);
        cCtx.arc(imgX + 24, imgY + imgH - 24, 24, 0.5 * Math.PI, Math.PI);
        cCtx.closePath();
        cCtx.stroke();

        // Name
        cCtx.font = "bold 34px sans-serif";
        cCtx.fillStyle = '#ffffff';
        cCtx.textAlign = 'center';
        cCtx.fillText(name, 256, 600);

        // Role
        cCtx.font = "24px sans-serif";
        cCtx.fillStyle = '#a5b4fc';
        cCtx.textAlign = 'center';
        cCtx.fillText(profession, 256, 650);

        setFrontImage(cCanvas.toDataURL());
      };

      if (profileImage) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = profileImage;
        img.onload = () => drawCard(img);
        img.onerror = () => drawCard();
      } else {
        drawCard();
      }
    }
  }, [name, profession, profileImage, initials]);

  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="lanyard-wrapper">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 20 }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: true }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), 0)}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={[0, -40, 0]} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band
            isMobile={isMobile}
            frontImage={frontImage}
            backImage={frontImage} // Mirror front on the back side as well
            lanyardImage={lanyardImage}
            lanyardWidth={1}
          />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  lanyardImage?: string | null;
  lanyardWidth?: number;
}

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1
}: BandProps) {
  const band = useRef<any>(),
    fixed = useRef<any>(),
    j1 = useRef<any>(),
    j2 = useRef<any>(),
    j3 = useRef<any>(),
    card = useRef<any>();
  const vec = new THREE.Vector3(),
    ang = new THREE.Vector3(),
    rot = new THREE.Vector3(),
    dir = new THREE.Vector3();
  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 4, linearDamping: 4 } as any;
  const { nodes, materials } = useGLTF(cardGLB) as any;
  const texture = useTexture(lanyardImage || lanyard);
  
  const frontTex = useTexture(frontImage || BLANK_PIXEL);
  const backTex = useTexture(backImage || BLANK_PIXEL);

  const cardMap = useMemo(() => {
    const baseMap = materials.base.map;
    if (!frontImage && !backImage) return baseMap;

    const baseImg = baseMap.image;
    const W = baseImg.width;
    const H = baseImg.height;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return baseMap;
    ctx.drawImage(baseImg, 0, 0, W, H);

    const drawFitted = (img: HTMLImageElement, rect: any) => {
      const rx = rect.x * W;
      const ry = rect.y * H;
      const rw = rect.w * W;
      const rh = rect.h * H;
      const pick = imageFit === 'contain' ? Math.min : Math.max;
      const scale = pick(rw / img.width, rh / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = rx + (rw - dw) / 2;
      const dy = ry + (rh - dh) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.rect(rx, ry, rw, rh);
      ctx.clip();
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
    };

    if (frontImage && frontTex.image) drawFitted(frontTex.image as any, FRONT_UV_RECT);
    if (backImage && backTex.image) drawFitted(backTex.image as any, BACK_UV_RECT);

    const composite = new THREE.CanvasTexture(canvas);
    composite.colorSpace = THREE.SRGBColorSpace;
    composite.flipY = baseMap.flipY;
    composite.anisotropy = 16;
    composite.needsUpdate = true;
    return composite;
  }, [frontImage, backImage, imageFit, frontTex, backTex, materials.base.map]);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );
  const [dragged, drag] = useState<any>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1.4]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1.4]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1.4]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 2.0, 0]
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current) {
      [j1, j2].forEach(ref => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 5.5, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.7, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.4, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2.1, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2.8, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[1.05, 1.5, 0.01]} />
          <group
            scale={3.0}
            position={[0, -1.6, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={e => {
              e.stopPropagation();
              if (e.target) {
                (e.target as any).releasePointerCapture(e.pointerId);
              }
              drag(false);
            }}
            onPointerDown={e => {
              e.stopPropagation();
              if (e.target) {
                (e.target as any).setPointerCapture(e.pointerId);
              }
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardMap}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={lanyardWidth}
        />
      </mesh>
    </>
  );
}

useGLTF.preload(cardGLB);
