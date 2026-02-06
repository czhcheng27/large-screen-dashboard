import React, { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import classNames from "classnames";
// Next.js 中 import 图片返回对象，需要使用 .src 属性
// 或者直接使用 public 目录的路径
const earchImg = "/earth.png";
const ringImg = "/ring.png";
import css from "./index.module.scss";

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

let width, height, renderer, camera, scene, stats, controls, containerDom;
const radius = 5;
const group = new THREE.Group();
const groupHalo = new THREE.Group();

const EarthModel = (props) => {
  useEffect(() => {
    containerDom = document.querySelector("#earthBox");
    width = containerDom?.clientWidth;
    height = containerDom?.clientHeight;
    // console.log(`containerDom`, containerDom, width, height);
    initScene();
    initCamera();
    initLight();
    initEarth();
    initRenderer();
    initControls();
    animate();

    // 监听窗口变化
    window.addEventListener("resize", resizeEarth);

    // 监听全屏模式变化
    document.addEventListener("fullscreenchange", resizeEarth);
    document.addEventListener("webkitfullscreenchange", resizeEarth);
    document.addEventListener("mozfullscreenchange", resizeEarth);
    document.addEventListener("MSFullscreenChange", resizeEarth);

    return () => {
      window.removeEventListener("resize", resizeEarth);
      document.removeEventListener("fullscreenchange", resizeEarth);
      document.removeEventListener("webkitfullscreenchange", resizeEarth);
      document.removeEventListener("mozfullscreenchange", resizeEarth);
      document.removeEventListener("MSFullscreenChange", resizeEarth);
    };
  }, []);

  const initRenderer = () => {
    renderer = new THREE.WebGLRenderer({ alpha: true });
    // 设置显示比例
    renderer.setPixelRatio(window.devicePixelRatio);
    console.log(`renderer.setSize(width, height)`, width, height);
    renderer.setSize(width, height);
    renderer.setClearAlpha(0);
    renderer.render(scene, camera);
    containerDom?.appendChild(renderer.domElement);
  };

  const initScene = () => {
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

    //创建一个长方体几何对象Geometry
    const geometry = new THREE.BufferGeometry();

    //创建一个材质对象Material
    const material = new THREE.MeshPhongMaterial({ depthWrite: false });

    // 两个参数分别为几何体geometry、材质material
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  };

  const initCamera = () => {
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(0, 0, 24);
    camera.lookAt(0, 0, 0);
  };

  const initLight = () => {
    // 环境光会均匀的照亮场景中的所有物体。环境光不能用来投射阴影，因为它没有方向。
    const ambientLight = new THREE.AmbientLight(0xcccccc, 1.1);
    scene.add(ambientLight);

    // 平行光是沿着特定方向发射的光。从它发出的光线都是平行的。常常用平行光来模拟太阳光的效果
    const directionalLight2 = new THREE.DirectionalLight(0xff2ffff, 0.2);
    directionalLight2.position.set(1, 0.1, 0.1).normalize();
    scene.add(directionalLight2);

    // 半球光, 光源直接放置于场景之上，光照颜色从天空光线颜色渐变到地面光线颜色。半球光不能投射阴影。
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.2);
    hemiLight.position.set(0, 1, 0);
    scene.add(hemiLight);

    let directionalLight;
    directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(100, 500, 20);
    scene.add(directionalLight);
  };

  const initControls = () => {
    // 设置相机控件轨道监控器 OrbitControls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // 阻尼惯性，要使得这一值生效，必须在动画循环里调用.update()
    // controls.addEventListener("change", function () {
    //   renderer.render(scene, camera);
    // });
  };

  const initEarth = () => {
    // 初始化一个加载器
    const globeTextureLoader = new THREE.TextureLoader();
    // 加载一个资源
    globeTextureLoader.load(ringImg, function (texture) {
      const geometry = new THREE.PlaneGeometry(26, 26); //平面缓冲几何体, 一个用于生成平面几何体的类。
      const material = new THREE.MeshLambertMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geometry, material);
      groupHalo.add(mesh);
    });
    // 光环位置调整：从 -1.5 上移 2 个单位到 0.5
    groupHalo.position.set(0, 0.5, 0);
    groupHalo.rotation.set(1.8, 0, 0);
    scene.add(groupHalo);
    globeTextureLoader.load(earchImg, function (texture) {
      const globeGgeometry = new THREE.SphereGeometry(radius, 100, 100); // 球缓冲几何体, 一个用于生成球体的类。
      // 在实践中，该材质提供了比MeshLambertMaterial 或MeshPhongMaterial 更精确和逼真的结果，代价是计算成本更高
      const globeMaterial = new THREE.MeshStandardMaterial({ map: texture });
      const globeMesh = new THREE.Mesh(globeGgeometry, globeMaterial);
      group.rotation.set(0, 0, 0.1);
      group.add(globeMesh);
    });
    // 地球位置调整：上移 2 个单位
    group.position.set(0, 2, 0);
    scene.add(group);
  };

  const animate = () => {
    window.requestAnimationFrame(() => {
      if (controls) controls.update();
      if (stats) stats.update();
      group.rotation.y = group.rotation.y + 0.001;
      groupHalo.rotation.z = groupHalo.rotation.z + 0.001;
      renders();
      animate();
    });
  };

  const renders = () => {
    renderer.clear();
    renderer.render(scene, camera);
  };

  const resizeEarth = () => {
    if (!renderer || !camera) {
      console.warn("渲染器或相机未初始化");
      return;
    }
    const ele = document.querySelector("#earthBox");
    width = ele?.clientWidth;
    height = ele?.clientHeight;
    console.log(`renderer.setSize(width, height)`, width, height);
    renderer.setSize(width, height);
    camera.updateProjectionMatrix();
    initCamera();
    renders();
    initControls();
  };

  return (
    <div id="earthBox" className={css.earthBox}>
      <RefreshIcon className={css.refreshPosition} onClick={resizeEarth} />
    </div>
  );
};

export default EarthModel;
