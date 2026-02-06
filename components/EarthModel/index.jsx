import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import css from "./index.module.scss";

const earchImg = "/earth.png";
const ringImg = "/ring.png";
const RADIUS = 5;
// 降低球体面数：50 段足以保证视觉效果，比原来 100 段减少 75% 面数
const SPHERE_SEGMENTS = 50;
// 限制最大像素比，避免高分屏渲染压力过大
const MAX_PIXEL_RATIO = 2;

// 自定义刷新图标组件
const RefreshIcon = ({ className, onClick }) => (
  <svg
    className={className}
    onClick={onClick}
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ cursor: "pointer" }}
  >
    <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
  </svg>
);

const EarthModel = () => {
  // 使用 ref 管理所有 Three.js 实例，避免模块级变量导致多实例冲突与内存泄漏
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const sceneRef = useRef(null);
  const controlsRef = useRef(null);
  const groupRef = useRef(new THREE.Group());
  const groupHaloRef = useRef(new THREE.Group());
  const animFrameRef = useRef(null);
  const resizeTimerRef = useRef(null);

  const getSize = useCallback(() => {
    const el = containerRef.current;
    return {
      width: el?.clientWidth || 1,
      height: el?.clientHeight || 1,
    };
  }, []);

  const initScene = useCallback(() => {
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);
    sceneRef.current = scene;
  }, []);

  const initCamera = useCallback(() => {
    const { width, height } = getSize();
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(0, 0, 24);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;
  }, [getSize]);

  const initLight = useCallback(() => {
    const scene = sceneRef.current;
    // 环境光
    scene.add(new THREE.AmbientLight(0xcccccc, 1.1));
    // 平行光模拟太阳
    const dirLight1 = new THREE.DirectionalLight(0xff2ffff, 0.2);
    dirLight1.position.set(1, 0.1, 0.1).normalize();
    scene.add(dirLight1);
    // 半球光
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.2);
    hemiLight.position.set(0, 1, 0);
    scene.add(hemiLight);
    // 主平行光
    const dirLight2 = new THREE.DirectionalLight(0xffffff);
    dirLight2.position.set(100, 500, 20);
    scene.add(dirLight2);
  }, []);

  const initRenderer = useCallback(() => {
    const { width, height } = getSize();
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false, // 关闭抗锯齿，大幅降低 GPU 负担
      powerPreference: "low-power", // 优先低功耗 GPU
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
    renderer.setSize(width, height);
    renderer.setClearAlpha(0);
    containerRef.current?.appendChild(renderer.domElement);
    rendererRef.current = renderer;
  }, [getSize]);

  const initControls = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.dispose();
    }
    const controls = new OrbitControls(
      cameraRef.current,
      rendererRef.current.domElement,
    );
    controls.enableDamping = true;
    controlsRef.current = controls;
  }, []);

  const initEarth = useCallback(() => {
    const scene = sceneRef.current;
    const group = groupRef.current;
    const groupHalo = groupHaloRef.current;
    const loader = new THREE.TextureLoader();

    // 光环
    loader.load(ringImg, (texture) => {
      const geo = new THREE.PlaneGeometry(26, 26);
      const mat = new THREE.MeshLambertMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
      });
      groupHalo.add(new THREE.Mesh(geo, mat));
    });
    groupHalo.position.set(0, 0.5, 0);
    groupHalo.rotation.set(1.8, 0, 0);
    scene.add(groupHalo);

    // 地球 — 使用降低后的面数，并用 MeshPhongMaterial 替代 MeshStandardMaterial（更轻量）
    loader.load(earchImg, (texture) => {
      const geo = new THREE.SphereGeometry(
        RADIUS,
        SPHERE_SEGMENTS,
        SPHERE_SEGMENTS,
      );
      const mat = new THREE.MeshPhongMaterial({ map: texture });
      group.add(new THREE.Mesh(geo, mat));
    });
    group.rotation.set(0, 0, 0.1);
    group.position.set(0, 2, 0);
    scene.add(group);
  }, []);

  const render = useCallback(() => {
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }, []);

  const animate = useCallback(() => {
    const group = groupRef.current;
    const groupHalo = groupHaloRef.current;
    const controls = controlsRef.current;

    const loop = () => {
      animFrameRef.current = requestAnimationFrame(loop);
      if (controls) controls.update();
      group.rotation.y += 0.001;
      groupHalo.rotation.z += 0.001;
      render();
    };
    loop();
  }, [render]);

  // 重置相机和控制器到初始状态
  const resizeEarth = useCallback(() => {
    if (resizeTimerRef.current) return;
    resizeTimerRef.current = setTimeout(() => {
      resizeTimerRef.current = null;
      const renderer = rendererRef.current;
      const camera = cameraRef.current;
      const controls = controlsRef.current;
      if (!renderer || !camera) return;

      const { width, height } = getSize();
      renderer.setSize(width, height);
      camera.aspect = width / height;

      // 重置相机位置和朝向
      camera.position.set(0, 0, 24);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();

      // 重置 OrbitControls 状态
      if (controls) {
        controls.reset();
      }

      render();
    }, 200);
  }, [getSize, render]);

  useEffect(() => {
    // 初始化
    initScene();
    initCamera();
    initLight();
    initEarth();
    initRenderer();
    // 首次渲染
    render();
    initControls();
    animate();

    // 监听
    window.addEventListener("resize", resizeEarth);
    document.addEventListener("fullscreenchange", resizeEarth);
    document.addEventListener("webkitfullscreenchange", resizeEarth);

    // 清理：销毁所有 Three.js 资源，防止内存泄漏
    return () => {
      window.removeEventListener("resize", resizeEarth);
      document.removeEventListener("fullscreenchange", resizeEarth);
      document.removeEventListener("webkitfullscreenchange", resizeEarth);

      // 停止动画循环
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      // 清除 resize 计时器
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
      // 销毁控制器
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      // 递归释放场景中的 geometry 和 material
      sceneRef.current?.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => {
              m.map?.dispose();
              m.dispose();
            });
          } else {
            obj.material.map?.dispose();
            obj.material.dispose();
          }
        }
      });
      // 销毁渲染器并移除 canvas
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.domElement?.remove();
      }
    };
  }, [
    initScene,
    initCamera,
    initLight,
    initEarth,
    initRenderer,
    initControls,
    animate,
    render,
    resizeEarth,
  ]);

  return (
    <div ref={containerRef} id="earthBox" className={css.earthBox}>
      <RefreshIcon className={css.refreshPosition} onClick={resizeEarth} />
    </div>
  );
};

export default EarthModel;
