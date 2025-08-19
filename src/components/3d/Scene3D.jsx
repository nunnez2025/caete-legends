import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  Stars, 
  Cloud, 
  CloudInstance,
  Text3D,
  Float,
  Sparkles,
  useTexture,
  Sky
} from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

// Componente de partículas flutuantes
function FloatingParticles({ count = 100 }) {
  const mesh = useRef();
  
  useFrame((state) => {
    mesh.current.rotation.y = state.clock.elapsedTime * 0.1;
    mesh.current.rotation.x = state.clock.elapsedTime * 0.05;
  });

  return (
    <Sparkles 
      ref={mesh}
      count={count}
      scale={[50, 50, 50]}
      size={2}
      speed={0.3}
      opacity={0.6}
      color="#ffd700"
    />
  );
}

// Componente de nuvens brasileiras
function BrazilianClouds() {
  const cloudsRef = useRef();
  
  useFrame((state) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <group ref={cloudsRef}>
      <Cloud
        opacity={0.5}
        speed={0.4}
        width={10}
        depth={1.5}
        segments={20}
        position={[-20, 15, -10]}
      />
      <Cloud
        opacity={0.3}
        speed={0.3}
        width={8}
        depth={2}
        segments={15}
        position={[15, 20, -15]}
      />
      <Cloud
        opacity={0.4}
        speed={0.5}
        width={12}
        depth={1}
        segments={25}
        position={[-10, 25, -20]}
      />
    </group>
  );
}

// Componente de terreno brasileiro
function BrazilianTerrain() {
  const terrainRef = useRef();
  const [terrainGeometry] = useState(() => new THREE.PlaneGeometry(100, 100, 50, 50));
  
  useEffect(() => {
    // Criar elevações do terreno
    const vertices = terrainGeometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const z = vertices[i + 2];
      vertices[i + 1] = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 5;
    }
    terrainGeometry.attributes.position.needsUpdate = true;
    terrainGeometry.computeVertexNormals();
  }, [terrainGeometry]);

  return (
    <mesh 
      ref={terrainRef}
      geometry={terrainGeometry}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -5, 0]}
    >
      <meshStandardMaterial 
        color="#2d5016"
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
}

// Componente de árvores brasileiras
function BrazilianTrees() {
  const trees = [];
  
  for (let i = 0; i < 20; i++) {
    const x = (Math.random() - 0.5) * 80;
    const z = (Math.random() - 0.5) * 80;
    const height = 3 + Math.random() * 5;
    
    trees.push(
      <group key={i} position={[x, 0, z]}>
        {/* Tronco */}
        <mesh position={[0, height / 2, 0]}>
          <cylinderGeometry args={[0.3, 0.5, height]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Copa */}
        <mesh position={[0, height + 1, 0]}>
          <sphereGeometry args={[2, 8, 8]} />
          <meshStandardMaterial color="#228B22" />
        </mesh>
      </group>
    );
  }
  
  return <group>{trees}</group>;
}

// Componente de água (rios brasileiros)
function BrazilianWater() {
  const waterRef = useRef();
  
  useFrame((state) => {
    if (waterRef.current) {
      waterRef.current.material.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh 
      ref={waterRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -4.9, 0]}
    >
      <planeGeometry args={[30, 10]} />
      <meshStandardMaterial 
        color="#006994"
        transparent
        opacity={0.6}
        metalness={0.1}
        roughness={0.1}
      />
    </mesh>
  );
}

// Componente de texto 3D flutuante
function FloatingText({ text, position, color = "#ffffff" }) {
  return (
    <Float
      speed={1.5}
      rotationIntensity={0.5}
      floatIntensity={0.5}
      position={position}
    >
      <Text3D
        font="/fonts/helvetiker_regular.typeface.json"
        size={2}
        height={0.2}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.02}
        bevelOffset={0}
        bevelSegments={5}
      >
        {text}
        <meshStandardMaterial color={color} />
      </Text3D>
    </Float>
  );
}

// Componente principal da cena
function SceneContent({ gameState }) {
  const { camera } = useThree();
  
  useEffect(() => {
    // Configurar câmera para mobile
    camera.position.set(0, 15, 20);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      {/* Iluminação */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#ffd700" />
      
      {/* Céu brasileiro */}
      <Sky 
        distance={450000}
        sunPosition={[0, 1, 0]}
        inclination={0.5}
        azimuth={0.25}
        rayleigh={0.5}
        turbidity={10}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />
      
      {/* Estrelas */}
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={1}
      />
      
      {/* Partículas flutuantes */}
      <FloatingParticles count={200} />
      
      {/* Nuvens brasileiras */}
      <BrazilianClouds />
      
      {/* Terreno */}
      <BrazilianTerrain />
      
      {/* Árvores */}
      <BrazilianTrees />
      
      {/* Água */}
      <BrazilianWater />
      
      {/* Texto flutuante baseado no estado do jogo */}
      {gameState.phase === 'duel' && (
        <FloatingText 
          text={`Turno ${gameState.turnCount}`}
          position={[0, 10, 0]}
          color="#ffd700"
        />
      )}
      
      {/* Controles de órbita para mobile */}
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
        minDistance={10}
        maxDistance={50}
      />
      
      {/* Ambiente */}
      <Environment preset="sunset" />
    </>
  );
}

// Componente principal da cena 3D
export default function Scene3D({ gameState, className = '' }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        shadows
        camera={{ position: [0, 15, 20], fov: 60 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <SceneContent gameState={gameState} />
      </Canvas>
    </div>
  );
}