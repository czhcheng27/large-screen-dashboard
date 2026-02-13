import React, { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import css from "./index.module.scss";

const MovingDot = () => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const sceneRef = useRef(null);
  const statsRef = useRef(null);
  const frameIdRef = useRef(null);

  // 使用 useRef 保持 materials 引用以便后续更新颜色
  const materialsRef = useRef([]);
  // 使用 useRef 保持 parameters 引用
  const parametersRef = useRef([
    [[0, 1, 1], 6], // Cyan
    [[0, 0, 1], 5], // Blue
    [[1, 0, 1], 4], // Magenta
    [[0, 0, 1], 3], // Blue
  ]);

  const createCanvasMaterial = (color, size) => {
    const matCanvas = document.createElement("canvas");
    matCanvas.width = matCanvas.height = size;
    const matContext = matCanvas.getContext("2d");
    const texture = new THREE.Texture(matCanvas);
    const center = size / 2;

    matContext.beginPath();
    matContext.arc(center, center, size / 2, 0, 2 * Math.PI, false);
    matContext.closePath();
    matContext.fillStyle = color;
    matContext.fill();

    texture.needsUpdate = true;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  };

  const initScene = useCallback(() => {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0008);
    sceneRef.current = scene;

    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    // 生成 1000 个随机点
    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * 2000 - 1000;
      const y = Math.random() * 2000 - 1000;
      const z = Math.random() * 2000 - 1000;
      vertices.push(x, y, z);
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3),
    );

    const parameters = parametersRef.current;

    parameters.forEach((param, i) => {
      const colorArr = param[0]; // [r, g, b]
      const size = param[1];

      const colorObj = new THREE.Color(colorArr[0], colorArr[1], colorArr[2]);
      const hexColor = "#" + colorObj.getHexString();

      // 创建材质
      const material = new THREE.PointsMaterial({
        size: size,
        map: createCanvasMaterial(hexColor, 256),
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        color: colorObj,
      });

      materialsRef.current[i] = material;

      const particles = new THREE.Points(geometry, material);

      // 给每个粒子系统设置不同的随机旋转角度
      particles.rotation.x = Math.random() * 6;
      particles.rotation.y = Math.random() * 6;
      particles.rotation.z = Math.random() * 6;

      scene.add(particles);
    });
  }, []);

  const initCamera = useCallback((width, height) => {
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(0, 0, 24);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;
  }, []);

  const initRenderer = useCallback((width, height) => {
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.setClearAlpha(0);

    if (containerRef.current) {
      containerRef.current.appendChild(renderer.domElement);
    }
    rendererRef.current = renderer;
  }, []);

  const renderScene = useCallback(() => {
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;

    if (renderer && scene && camera) {
      renderer.clear();

      const time = Date.now() * 0.00005;

      // 旋转粒子系统
      scene.children.forEach((object, i) => {
        if (object instanceof THREE.Points) {
          object.rotation.y = time * (i < 4 ? i + 1 : -(i + 1));
        }
      });

      // 动态变色逻辑
      const parameters = parametersRef.current;
      materialsRef.current.forEach((material, i) => {
        const baseColor = parameters[i][0]; // [r, g, b]
        // 简单的色相偏移计算
        const h = ((360 * (baseColor[0] + time)) % 360) / 360;
        material.color.setHSL(
          h,
          baseColor[1],
          baseColor[2],
          THREE.SRGBColorSpace,
        );
      });

      renderer.render(scene, camera);
    }
  }, []);

  const animate = useCallback(() => {
    const loop = () => {
      frameIdRef.current = requestAnimationFrame(loop);
      if (statsRef.current) statsRef.current.update();
      renderScene();
    };
    loop();
  }, [renderScene]);

  const handleResize = useCallback(() => {
    if (!containerRef.current || !rendererRef.current || !cameraRef.current)
      return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    rendererRef.current.setSize(width, height);
    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    initScene();
    initCamera(width, height);
    initRenderer(width, height);
    animate();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }

      // 清理资源
      if (rendererRef.current) {
        rendererRef.current.dispose();
        const domElement = rendererRef.current.domElement;
        if (domElement && domElement.parentNode) {
          domElement.parentNode.removeChild(domElement);
        }
      }

      // 释放材质和几何体
      materialsRef.current.forEach((mat) => {
        if (mat.map) mat.map.dispose();
        mat.dispose();
      });
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object.geometry) object.geometry.dispose();
        });
      }
    };
  }, [initScene, initCamera, initRenderer, animate, handleResize]);

  return (
    <div className={css.movingDot} id="movingDot" ref={containerRef}></div>
  );
};

export default MovingDot;
