import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import './3d.css';

const HumanBody3D = ({ affectedBodyParts = [], onPartClick, className = '' }) => {
  const [modelLoaded, setModelLoaded] = useState(false);
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const humanBodyRef = useRef(null);

  // Create human body geometry matching the reference image exactly
  const createHumanBody = () => {
    const group = new THREE.Group();
    group.name = 'humanBody';

    // Create unique material for each body part so they can be colored independently
    const createBodyMaterial = () => new THREE.MeshLambertMaterial({ 
      color: 0xb8c4d9, // Light desaturated blue-grey
      transparent: true,
      opacity: 0.95
    });

    // Head - Smooth ovoid shape matching the reference
    const headGeometry = new THREE.SphereGeometry(0.35, 32, 32);
    const head = new THREE.Mesh(headGeometry, createBodyMaterial());
    head.position.set(0, 2.4, 0);
    head.scale.set(1, 1.3, 0.9); // More elongated ovoid like the reference
    head.userData = { part: 'head' };
    group.add(head);

    // Neck - Short and thick as in the reference
    const neckGeometry = new THREE.CylinderGeometry(0.18, 0.22, 0.25, 16);
    const neck = new THREE.Mesh(neckGeometry, createBodyMaterial());
    neck.position.set(0, 2.15, 0);
    neck.userData = { part: 'neck' };
    group.add(neck);

    // Torso - Well-defined with broader shoulders, tapering waist
    const torsoGeometry = new THREE.BoxGeometry(1.1, 2.1, 0.6);
    const torso = new THREE.Mesh(torsoGeometry, createBodyMaterial());
    torso.position.set(0, 0.9, 0);
    torso.userData = { part: 'torso' };
    group.add(torso);

    // Chest - Upper torso with more defined chest
    const chestGeometry = new THREE.BoxGeometry(1.1, 1.1, 0.6);
    const chest = new THREE.Mesh(chestGeometry, createBodyMaterial());
    chest.position.set(0, 1.5, 0);
    chest.userData = { part: 'chest' };
    group.add(chest);

    // Abdomen - Lower torso with slight taper
    const abdomenGeometry = new THREE.BoxGeometry(1.0, 1.0, 0.6);
    const abdomen = new THREE.Mesh(abdomenGeometry, createBodyMaterial());
    abdomen.position.set(0, 0.3, 0);
    abdomen.userData = { part: 'abdomen' };
    group.add(abdomen);

    // Arms - Cylindrical with T-pose, matching reference proportions
    const upperArmGeometry = new THREE.CylinderGeometry(0.13, 0.11, 0.75, 16);
    const lowerArmGeometry = new THREE.CylinderGeometry(0.11, 0.09, 0.75, 16);
    
    // Left arm
    const leftUpperArm = new THREE.Mesh(upperArmGeometry, createBodyMaterial());
    leftUpperArm.position.set(-0.65, 1.6, 0);
    leftUpperArm.rotation.z = Math.PI / 2;
    leftUpperArm.userData = { part: 'arms' };
    group.add(leftUpperArm);

    const leftLowerArm = new THREE.Mesh(lowerArmGeometry, createBodyMaterial());
    leftLowerArm.position.set(-1.4, 1.6, 0);
    leftLowerArm.rotation.z = Math.PI / 2;
    leftLowerArm.userData = { part: 'arms' };
    group.add(leftLowerArm);

    // Right arm
    const rightUpperArm = new THREE.Mesh(upperArmGeometry, createBodyMaterial());
    rightUpperArm.position.set(0.65, 1.6, 0);
    rightUpperArm.rotation.z = -Math.PI / 2;
    rightUpperArm.userData = { part: 'arms' };
    group.add(rightUpperArm);

    const rightLowerArm = new THREE.Mesh(lowerArmGeometry, createBodyMaterial());
    rightLowerArm.position.set(1.4, 1.6, 0);
    rightLowerArm.rotation.z = -Math.PI / 2;
    rightLowerArm.userData = { part: 'arms' };
    group.add(rightLowerArm);

    // Hands - Simplified paddle-like shapes as in reference
    const handGeometry = new THREE.BoxGeometry(0.22, 0.12, 0.3);
    
    // Left hand
    const leftHand = new THREE.Mesh(handGeometry, createBodyMaterial());
    leftHand.position.set(-2.15, 1.6, 0);
    leftHand.userData = { part: 'hands' };
    group.add(leftHand);

    // Right hand
    const rightHand = new THREE.Mesh(handGeometry, createBodyMaterial());
    rightHand.position.set(2.15, 1.6, 0);
    rightHand.userData = { part: 'hands' };
    group.add(rightHand);

    // Legs - Cylindrical with subtle musculature indication
    const thighGeometry = new THREE.CylinderGeometry(0.17, 0.15, 0.95, 16);
    const calfGeometry = new THREE.CylinderGeometry(0.15, 0.12, 0.95, 16);
    
    // Left leg
    const leftThigh = new THREE.Mesh(thighGeometry, createBodyMaterial());
    leftThigh.position.set(-0.2, -0.6, 0);
    leftThigh.userData = { part: 'legs' };
    group.add(leftThigh);

    const leftCalf = new THREE.Mesh(calfGeometry, createBodyMaterial());
    leftCalf.position.set(-0.2, -1.55, 0);
    leftCalf.userData = { part: 'legs' };
    group.add(leftCalf);

    // Right leg
    const rightThigh = new THREE.Mesh(thighGeometry, createBodyMaterial());
    rightThigh.position.set(0.2, -0.6, 0);
    rightThigh.userData = { part: 'legs' };
    group.add(rightThigh);

    const rightCalf = new THREE.Mesh(calfGeometry, createBodyMaterial());
    rightCalf.position.set(0.2, -1.55, 0);
    rightCalf.userData = { part: 'legs' };
    group.add(rightCalf);

    // Feet - Simplified rounded shapes
    const footGeometry = new THREE.BoxGeometry(0.32, 0.12, 0.45);
    
    // Left foot
    const leftFoot = new THREE.Mesh(footGeometry, createBodyMaterial());
    leftFoot.position.set(-0.2, -2.45, 0.02);
    leftFoot.userData = { part: 'feet' };
    group.add(leftFoot);

    // Right foot
    const rightFoot = new THREE.Mesh(footGeometry, createBodyMaterial());
    rightFoot.position.set(0.2, -2.45, 0.02);
    rightFoot.userData = { part: 'feet' };
    group.add(rightFoot);

    // Back - Separate back section
    const backGeometry = new THREE.BoxGeometry(1.1, 2.1, 0.6);
    const back = new THREE.Mesh(backGeometry, createBodyMaterial());
    back.position.set(0, 0.9, 0);
    back.userData = { part: 'back' };
    group.add(back);

    return group;
  };

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup with exact background matching reference
    const scene = new THREE.Scene();
    
    // Create gradient background matching the reference image
    const canvas = document.createElement('canvas');
    canvas.width = 2;
    canvas.height = 2;
    const context = canvas.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, 0, 2);
    gradient.addColorStop(0, '#3d1f1a'); // Muted reddish-brown
    gradient.addColorStop(1, '#1a0f1a'); // Deep black-purple
    context.fillStyle = gradient;
    context.fillRect(0, 0, 2, 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    scene.background = texture;
    sceneRef.current = scene;

    // Camera setup - slightly low angle view as in reference
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, -0.3, 5.5); // Slightly low angle
    camera.lookAt(0, 0.3, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting matching the reference image exactly
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Main directional light from above and slightly left
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(2, 4, 2); // Above and slightly left
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Subtle fill light from right for the reddish glow
    const fillLight = new THREE.DirectionalLight(0xffe6e6, 0.15);
    fillLight.position.set(-1.5, 2, 1.5);
    scene.add(fillLight);

    // Create human body
    const humanBody = createHumanBody();
    humanBodyRef.current = humanBody;
    scene.add(humanBody);

    // Smooth 360-degree rotation controls
    let isMouseDown = false;
    let mouseX = 0;
    let mouseY = 0;
    let rotationSpeed = 0.01;

    const handleMouseDown = (event) => {
      isMouseDown = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const handleMouseMove = (event) => {
      if (!isMouseDown) return;
      
      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;
      
      humanBody.rotation.y += deltaX * rotationSpeed;
      humanBody.rotation.x += deltaY * rotationSpeed;
      
      // Clamp vertical rotation to prevent flipping
      humanBody.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, humanBody.rotation.x));
      
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const handleMouseUp = () => {
      isMouseDown = false;
    };

    // Add wheel zoom
    const handleWheel = (event) => {
      const zoomSpeed = 0.1;
      const delta = event.deltaY > 0 ? 1 : -1;
      camera.position.z += delta * zoomSpeed;
      camera.position.z = Math.max(3, Math.min(10, camera.position.z));
    };

    // Add click handler for body parts
    const handleClick = (event) => {
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / mountRef.current.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / mountRef.current.clientHeight) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(scene.children, true);
      
      if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        if (clickedObject.userData && clickedObject.userData.part && onPartClick) {
          onPartClick(clickedObject.userData.part);
        }
      }
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('wheel', handleWheel);
    renderer.domElement.addEventListener('click', handleClick);

    // Auto-rotation when not interacting
    let autoRotate = true;
    let lastInteractionTime = Date.now();

    const handleInteraction = () => {
      autoRotate = false;
      lastInteractionTime = Date.now();
    };

    renderer.domElement.addEventListener('mousedown', handleInteraction);
    renderer.domElement.addEventListener('wheel', handleInteraction);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Auto-rotation after 3 seconds of no interaction
      if (autoRotate && Date.now() - lastInteractionTime > 3000) {
        humanBody.rotation.y += 0.01;
      }
      
      renderer.render(scene, camera);
    };
    animate();

    setModelLoaded(true);

    // Cleanup
    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onPartClick]);

  // Highlight affected body parts in red, keep others blue-grey
  useEffect(() => {
    if (!sceneRef.current || !modelLoaded) return;

    const scene = sceneRef.current;
    console.log('Highlighting body parts:', affectedBodyParts);
    
    // Reset all materials to blue-grey
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.color.setHex(0xb8c4d9); // Blue-grey color
        child.material.emissive = new THREE.Color(0x000000);
      }
    });

    // Highlight affected parts in red
    scene.traverse((child) => {
      if (child.isMesh && child.userData.part) {
        if (affectedBodyParts.includes(child.userData.part)) {
          console.log('Highlighting part:', child.userData.part, 'in red');
          child.material.color.setHex(0xe74c3c); // Red color
          // Add pulsing animation
          child.material.emissive = new THREE.Color(0x330000);
        }
      }
    });
  }, [affectedBodyParts, modelLoaded]);

  const resetModelView = () => {
    if (humanBodyRef.current) {
      humanBodyRef.current.rotation.set(0, 0, 0);
    }
  };

  const zoomToPart = (part) => {
    if (humanBodyRef.current) {
      // Simple zoom animation
      humanBodyRef.current.scale.set(1.2, 1.2, 1.2);
      setTimeout(() => {
        humanBodyRef.current.scale.set(1, 1, 1);
      }, 500);
    }
  };

  return (
    <div className={`human-body-3d ${className}`}>
      <div className="model-header">
        <h3>3D Human Body Model</h3>
        <div className="model-controls">
          <button className="control-btn" onClick={resetModelView}>
            Reset View
          </button>
          <span className="model-status">
            {modelLoaded ? 'Model Loaded' : 'Loading...'}
          </span>
        </div>
      </div>
      
      <div className="threejs-container" ref={mountRef}>
        {/* Three.js will render here */}
      </div>
      
      <div className="model-legend">
        <div className="legend-item">
          <div className="legend-color affected"></div>
          <span>Affected Areas (Red)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color normal"></div>
          <span>Normal Areas (Blue-Grey)</span>
        </div>
      </div>

      <div className="model-instructions">
        <h4>How to Use:</h4>
        <ul>
          <li>Click and drag to rotate the model 360°</li>
          <li>Scroll to zoom in/out</li>
          <li>Click on body parts to select them</li>
          <li>Red areas show affected body parts</li>
          <li>Blue-grey areas are normal</li>
          <li>Model auto-rotates when idle</li>
          <li>Use Reset View to return to default</li>
        </ul>
      </div>
    </div>
  );
};

export default HumanBody3D; 