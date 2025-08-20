import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

export default function Card3D({ 
  card, 
  position = [0, 0, 0], 
  rotation = [0, 0, 0],
  scale = 1,
  isSelected = false,
  isHovered = false,
  onClick,
  isPlayable = true,
  isEnemy = false
}) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const { camera } = useThree();

  // Animações
  useEffect(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.position, {
        y: isSelected ? position[1] + 2 : position[1],
        duration: 0.3,
        ease: "power2.out"
      });

      gsap.to(meshRef.current.rotation, {
        y: isSelected ? Math.PI : rotation[1],
        duration: 0.3,
        ease: "power2.out"
      });

      gsap.to(meshRef.current.scale, {
        x: isSelected ? scale * 1.2 : scale,
        y: isSelected ? scale * 1.2 : scale,
        z: isSelected ? scale * 1.2 : scale,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, [isSelected, position, rotation, scale]);

  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  // Cores baseadas na raridade
  const getRarityColor = (rarity) => {
    const colors = {
      common: '#8B8B8B',
      rare: '#4169E1',
      super_rare: '#9932CC',
      legendary: '#FFD700'
    };
    return colors[rarity] || colors.common;
  };

  // Cores baseadas no elemento
  const getElementColor = (element) => {
    const colors = {
      'Terra': '#8B4513',
      'Água': '#006994',
      'Fogo': '#FF4500',
      'Floresta': '#228B22',
      'Vento': '#87CEEB',
      'Espírito': '#9370DB'
    };
    return colors[element] || '#FFFFFF';
  };

  const handleClick = () => {
    if (isPlayable && onClick) {
      setClicked(true);
      onClick();
      
      // Reset do estado de clique
      setTimeout(() => setClicked(false), 200);
    }
  };

  const handlePointerOver = () => {
    if (isPlayable) {
      setHovered(true);
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'default';
  };

  return (
    <group
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={[scale, scale, scale]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Carta base */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3, 4.2, 0.1]} />
        <meshStandardMaterial 
          color={getRarityColor(card.rarity)}
          metalness={0.3}
          roughness={0.7}
          emissive={isSelected ? getRarityColor(card.rarity) : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </mesh>

      {/* Borda da carta */}
      <mesh position={[0, 0, 0.06]}>
        <boxGeometry args={[2.8, 4, 0.02]} />
        <meshStandardMaterial 
          color="#000000"
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>

      {/* Conteúdo da carta */}
      <group position={[0, 0, 0.07]}>
        {/* Título da carta */}
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.3}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          font="/fonts/helvetiker_regular.typeface.json"
          maxWidth={2.5}
        >
          {card.name}
        </Text>

        {/* Arte da carta */}
        <Text
          position={[0, 0.5, 0]}
          fontSize={1.5}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          {card.art}
        </Text>

        {/* Tipo da carta */}
        <Text
          position={[0, -0.5, 0]}
          fontSize={0.25}
          color={getElementColor(card.element)}
          anchorX="center"
          anchorY="middle"
          font="/fonts/helvetiker_regular.typeface.json"
        >
          {card.type}
        </Text>

        {/* Stats para monstros */}
        {card.type === 'Monster' && (
          <group position={[0, -1.2, 0]}>
            <Text
              position={[-0.8, 0, 0]}
              fontSize={0.2}
              color="#FF4444"
              anchorX="center"
              anchorY="middle"
              font="/fonts/helvetiker_regular.typeface.json"
            >
              ATK: {card.attack}
            </Text>
            <Text
              position={[0.8, 0, 0]}
              fontSize={0.2}
              color="#4444FF"
              anchorX="center"
              anchorY="middle"
              font="/fonts/helvetiker_regular.typeface.json"
            >
              DEF: {card.defense}
            </Text>
          </group>
        )}

        {/* Custo de mana */}
        <group position={[-1.2, 1.2, 0]}>
          <mesh>
            <circleGeometry args={[0.3, 32]} />
            <meshStandardMaterial color="#0066CC" />
          </mesh>
          <Text
            position={[0, 0, 0.01]}
            fontSize={0.25}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            font="/fonts/helvetiker_regular.typeface.json"
          >
            {card.manaCost}
          </Text>
        </group>

        {/* Elemento */}
        <group position={[1.2, 1.2, 0]}>
          <mesh>
            <circleGeometry args={[0.3, 32]} />
            <meshStandardMaterial color={getElementColor(card.element)} />
          </mesh>
          <Text
            position={[0, 0, 0.01]}
            fontSize={0.2}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            font="/fonts/helvetiker_regular.typeface.json"
          >
            {card.element.charAt(0)}
          </Text>
        </group>
      </group>

      {/* Efeitos visuais */}
      {isSelected && (
        <mesh position={[0, 0, 0.2]}>
          <ringGeometry args={[2, 2.5, 32]} />
          <meshStandardMaterial 
            color="#FFD700"
            transparent
            opacity={0.6}
            emissive="#FFD700"
            emissiveIntensity={0.5}
          />
        </mesh>
      )}

      {hovered && (
        <mesh position={[0, 0, 0.15]}>
          <ringGeometry args={[1.8, 2.3, 32]} />
          <meshStandardMaterial 
            color="#FFFFFF"
            transparent
            opacity={0.4}
            emissive="#FFFFFF"
            emissiveIntensity={0.3}
          />
        </mesh>
      )}

      {/* Indicador de não jogável */}
      {!isPlayable && (
        <mesh position={[0, 0, 0.1]}>
          <boxGeometry args={[3.2, 4.4, 0.05]} />
          <meshStandardMaterial 
            color="#FF0000"
            transparent
            opacity={0.3}
          />
        </mesh>
      )}

      {/* Indicador de inimigo */}
      {isEnemy && (
        <mesh position={[0, 0, 0.12]}>
          <boxGeometry args={[3.2, 4.4, 0.02]} />
          <meshStandardMaterial 
            color="#FF4444"
            transparent
            opacity={0.2}
          />
        </mesh>
      )}

      {/* Tooltip HTML */}
      {hovered && (
        <Html position={[0, 2.5, 0]} center>
          <div className="bg-black/90 text-white p-2 rounded-lg text-xs whitespace-nowrap border border-white/20">
            <div className="font-bold">{card.name}</div>
            <div className="text-gray-300">{card.type}</div>
            {card.type === 'Monster' && (
              <div className="text-gray-300">
                ATK: {card.attack} | DEF: {card.defense}
              </div>
            )}
            <div className="text-blue-300">Mana: {card.manaCost}</div>
          </div>
        </Html>
      )}
    </group>
  );
}