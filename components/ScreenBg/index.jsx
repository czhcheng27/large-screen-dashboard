import React, { useEffect, useCallback } from "react";
import * as THREE from "three";

const bgBand = "/bgBand.png";
const gridImg = "/gridImg.png";
const bgArrow = "/bgArrow.png";
const endImg = "/endImg.png";

let width, height, renderer, camera, scene, stats, controls, containerDom;
const group = new THREE.Group();
const groupArrow1 = new THREE.Group();
const groupArrow2 = new THREE.Group();
const groupFloor = new THREE.Group();
const groupEnd = new THREE.Group();

const ScreenBg = (props) => {
  // 纵向中心偏移量（控制背景线条的汇聚点）
  // 负值表示向下看，从而使汇聚点（视平线）在屏幕上抬高
  const centerYOffset = -0.45;

  const initRenderer = useCallback(() => {
    if (!containerDom) return;
    if (renderer) {
      renderer.setSize(width, height);
      return;
    }
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.setClearAlpha(0);
    containerDom.appendChild(renderer.domElement);
  }, []);

  const initCamera = useCallback(() => {
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    // 相机高度保持在 1.2
    // 通过调整 lookAt 的 Y 值来控制消失点。lookAt.y 低于 camera.y 时，消失点向上移
    camera.position.set(0, 1.2, 5);
    camera.lookAt(0, 1.2 + centerYOffset, 0);
  }, [centerYOffset]);

  const initScene = useCallback(() => {
    scene = new THREE.Scene();
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.MeshPhongMaterial({ depthWrite: false });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  }, []);

  const initBand = useCallback(() => {
    const globeTextureLoader = new THREE.TextureLoader();
    globeTextureLoader.load(bgBand, (texture) => {
      const globeShape = new THREE.PlaneGeometry(1, 4);
      const globeMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
      });
      const globeMeshList = [];
      for (let i = 1; i <= 5; i++) {
        globeMeshList.push(new THREE.Mesh(globeShape, globeMaterial));
        globeMeshList[i - 1].position.set(
          Math.ceil((i - 1) / 2) * (2.7 * (i % 2 == 1 ? -1 : 1)),
          0,
          6 + Math.ceil((i - 1) / 2) * 2,
        );
        globeMeshList[i - 1].rotation.set(-Math.PI / 2, 0, 0);
        group.add(globeMeshList[i - 1]);
      }
    });
    globeTextureLoader.load(gridImg, (texture) => {
      const globeShape = new THREE.PlaneGeometry(12, 30);
      const globeMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
      });
      const globeMesh = new THREE.Mesh(globeShape, globeMaterial);
      globeMesh.position.set(0, -0.01, -10);
      globeMesh.rotation.set(-Math.PI / 2, 0, 0);
      groupFloor.add(globeMesh);
    });
    globeTextureLoader.load(endImg, (texture) => {
      const globeShape = new THREE.PlaneGeometry(60, 1);
      const globeMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
      });
      const globeMesh = new THREE.Mesh(globeShape, globeMaterial);
      globeMesh.position.set(0, -2, -100);
      groupEnd.add(globeMesh);
    });
  }, []);

  const getArrowPositionX = (i) => {
    return Math.ceil((i - 1) / 2) * (2.7 * (i % 2 == 1 ? -1 : 1));
  };

  const initArrow = useCallback(() => {
    const globeTextureLoader = new THREE.TextureLoader();
    globeTextureLoader.load(bgArrow, (texture) => {
      const globeShape = new THREE.PlaneGeometry(0.7, 1.4);
      const globeMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
      });
      const globeMeshList = [];
      for (let i = 1; i <= 10; i++) {
        globeMeshList.push(new THREE.Mesh(globeShape, globeMaterial));
      }
      for (let i = 1; i <= 5; i++) {
        globeMeshList[i - 1].position.set(
          getArrowPositionX(i),
          0,
          i == 2 || i == 3 ? 10 : 2,
        );
        globeMeshList[i + 4].position.set(
          getArrowPositionX(i),
          0,
          i == 2 || i == 3 ? 10 : 2,
        );
        globeMeshList[i - 1].rotation.set(-Math.PI / 2, 0, 0);
        globeMeshList[i + 4].rotation.set(-Math.PI / 2, 0, 0);
        groupArrow1.add(globeMeshList[i - 1]);
        groupArrow2.add(globeMeshList[i + 4]);
      }
      groupArrow2.position.set(0, 0, 16);
    });
  }, []);

  const addScene = useCallback(() => {
    scene.add(group);
    scene.add(groupArrow1);
    scene.add(groupArrow2);
    scene.add(groupFloor);
    scene.add(groupEnd);
  }, []);

  const renders = useCallback(() => {
    if (renderer && scene && camera) {
      renderer.clear();
      renderer.render(scene, camera);
    }
  }, []);

  const animate = useCallback(() => {
    const loop = () => {
      stats?.update();
      group.position.z = group.position.z < -25 ? 0 : group.position.z - 0.05;
      groupArrow1.position.z =
        groupArrow1.position.z < -30 ? 0 : groupArrow1.position.z - 0.12;
      groupArrow2.position.z =
        groupArrow2.position.z < -30 ? 0 : groupArrow2.position.z - 0.12;
      renders();
      requestAnimationFrame(loop);
    };
    loop();
  }, [renders]);

  const resizeScreenBg = useCallback(() => {
    const ele = document.getElementById("screenBg");
    if (!ele || !renderer || !camera) return;
    width = ele.clientWidth;
    height = ele.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renders();
  }, [renders]);

  useEffect(() => {
    containerDom = document.querySelector("#screenBg");
    if (!containerDom) return;
    width = containerDom.clientWidth;
    height = containerDom.clientHeight;

    initCamera();
    initScene();
    initBand();
    initArrow();
    addScene();
    initRenderer();
    animate();

    window.addEventListener("resize", resizeScreenBg);
    document.addEventListener("fullscreenchange", resizeScreenBg);
    document.addEventListener("webkitfullscreenchange", resizeScreenBg);

    return () => {
      window.removeEventListener("resize", resizeScreenBg);
      document.removeEventListener("fullscreenchange", resizeScreenBg);
      document.removeEventListener("webkitfullscreenchange", resizeScreenBg);
    };
  }, [initCamera, initScene, initBand, initArrow, addScene, initRenderer, animate, resizeScreenBg]);

  return <div className="w-full h-full top-0 left-0 absolute opacity-40" id="screenBg"></div>;
};

export default ScreenBg;
