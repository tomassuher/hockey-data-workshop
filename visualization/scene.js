import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const skinTone = 0xd4a574;
const hairTone = 0xc9a66b;
const bikiniTone = 0x7ec8e3;
const sandTone = 0xe6d2a8;

const app = document.getElementById("app");
const refsEl = document.getElementById("refs");

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
app.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x7ec8e8, 0.012);

const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(2.4, 1.55, 4.2);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1.05, 0);
controls.enableDamping = true;
controls.minDistance = 1.8;
controls.maxDistance = 9;
controls.maxPolarAngle = Math.PI * 0.49;
controls.minPolarAngle = 0.15;
controls.autoRotate = false;
controls.autoRotateSpeed = 0.7;

// --- Sky / environment ---
scene.background = new THREE.Color(0x87ccea);

const hemi = new THREE.HemisphereLight(0xb8e4ff, 0xd4b896, 0.85);
scene.add(hemi);

const sun = new THREE.DirectionalLight(0xfff0d8, 1.55);
sun.position.set(6, 10, 4);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.near = 1;
sun.shadow.camera.far = 30;
sun.shadow.camera.left = -8;
sun.shadow.camera.right = 8;
sun.shadow.camera.top = 8;
sun.shadow.camera.bottom = -8;
sun.shadow.bias = -0.0002;
scene.add(sun);

const fill = new THREE.DirectionalLight(0x9ad7ea, 0.35);
fill.position.set(-4, 3, -2);
scene.add(fill);

// Sand
const sandGeo = new THREE.CircleGeometry(28, 64);
const sandMat = new THREE.MeshStandardMaterial({
  color: sandTone,
  roughness: 0.95,
  metalness: 0.02,
});
const sand = new THREE.Mesh(sandGeo, sandMat);
sand.rotation.x = -Math.PI / 2;
sand.receiveShadow = true;
scene.add(sand);

// Wet sand strip near water
const wetGeo = new THREE.RingGeometry(5.5, 9.5, 64, 1, 0, Math.PI);
const wetMat = new THREE.MeshStandardMaterial({
  color: 0xc4b089,
  roughness: 0.55,
  metalness: 0.05,
});
const wet = new THREE.Mesh(wetGeo, wetMat);
wet.rotation.x = -Math.PI / 2;
wet.position.y = 0.005;
wet.position.z = -2;
wet.receiveShadow = true;
scene.add(wet);

// Ocean
const waterGeo = new THREE.PlaneGeometry(60, 40, 64, 32);
const waterPos = waterGeo.attributes.position;
for (let i = 0; i < waterPos.count; i++) {
  const x = waterPos.getX(i);
  const y = waterPos.getY(i);
  waterPos.setZ(i, Math.sin(x * 0.35) * 0.04 + Math.cos(y * 0.25) * 0.03);
}
waterGeo.computeVertexNormals();
const waterMat = new THREE.MeshStandardMaterial({
  color: 0x2ab8c8,
  roughness: 0.2,
  metalness: 0.35,
  transparent: true,
  opacity: 0.92,
});
const water = new THREE.Mesh(waterGeo, waterMat);
water.rotation.x = -Math.PI / 2;
water.position.set(0, 0.02, -22);
water.receiveShadow = true;
scene.add(water);

// Horizon hills / coast
const coastShape = new THREE.Shape();
coastShape.moveTo(-20, 0);
coastShape.lineTo(-18, 0.6);
coastShape.lineTo(-14, 1.1);
coastShape.lineTo(-10, 0.7);
coastShape.lineTo(-6, 1.4);
coastShape.lineTo(-2, 0.9);
coastShape.lineTo(2, 1.2);
coastShape.lineTo(6, 0.55);
coastShape.lineTo(10, 1.0);
coastShape.lineTo(14, 0.45);
coastShape.lineTo(20, 0.8);
coastShape.lineTo(20, 0);
coastShape.closePath();
const coastGeo = new THREE.ExtrudeGeometry(coastShape, { depth: 2, bevelEnabled: false });
const coastMat = new THREE.MeshStandardMaterial({ color: 0xc9b08a, roughness: 0.9 });
const coast = new THREE.Mesh(coastGeo, coastMat);
coast.position.set(0, 0, -38);
coast.rotation.x = 0;
scene.add(coast);

// Soft ground shadow disc under character
const shadowDisc = new THREE.Mesh(
  new THREE.CircleGeometry(0.55, 32),
  new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.18 })
);
shadowDisc.rotation.x = -Math.PI / 2;
shadowDisc.position.y = 0.01;
scene.add(shadowDisc);

// --- Character ---
const character = new THREE.Group();
character.position.set(0, 0, 0);
scene.add(character);

const skinMat = new THREE.MeshStandardMaterial({
  color: skinTone,
  roughness: 0.55,
  metalness: 0.05,
});
const hairMat = new THREE.MeshStandardMaterial({
  color: hairTone,
  roughness: 0.65,
  metalness: 0.08,
});
const bikiniMat = new THREE.MeshStandardMaterial({
  color: bikiniTone,
  roughness: 0.35,
  metalness: 0.25,
});
const sparkleMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.15,
  metalness: 0.9,
  emissive: 0xaadfff,
  emissiveIntensity: 0.15,
});

function limb(radiusTop, radiusBottom, height, radial = 10) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radial),
    skinMat
  );
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function ball(r, mat = skinMat, segs = 18) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, segs, segs), mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

// Hips / pelvis
const hips = new THREE.Group();
hips.position.y = 0.92;
character.add(hips);

const pelvis = ball(0.16);
pelvis.scale.set(1.35, 0.85, 1.05);
hips.add(pelvis);

// Torso
const torso = new THREE.Group();
torso.position.y = 0.22;
hips.add(torso);

const chest = new THREE.Mesh(
  new THREE.CapsuleGeometry(0.15, 0.28, 6, 12),
  skinMat
);
chest.scale.set(1.25, 1, 0.85);
chest.castShadow = true;
torso.add(chest);

const waist = ball(0.13);
waist.position.y = -0.12;
waist.scale.set(1.15, 0.7, 0.9);
torso.add(waist);

// Bust for bikini shape
const bustL = ball(0.075);
bustL.position.set(-0.08, 0.12, 0.08);
bustL.scale.set(1, 0.9, 0.85);
torso.add(bustL);
const bustR = bustL.clone();
bustR.position.x = 0.08;
torso.add(bustR);

// Bikini top
const topL = ball(0.078, bikiniMat);
topL.position.copy(bustL.position);
topL.position.z += 0.01;
topL.scale.set(1.05, 0.95, 0.7);
torso.add(topL);
const topR = topL.clone();
topR.position.x = 0.08;
torso.add(topR);

// Neck straps
const strapGeo = new THREE.TubeGeometry(
  new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.08, 0.14, 0.06),
    new THREE.Vector3(-0.04, 0.28, 0.02),
    new THREE.Vector3(0, 0.34, -0.02),
    new THREE.Vector3(0.04, 0.28, 0.02),
    new THREE.Vector3(0.08, 0.14, 0.06),
  ]),
  20,
  0.008,
  6,
  false
);
const straps = new THREE.Mesh(strapGeo, bikiniMat);
straps.castShadow = true;
torso.add(straps);

// Sparkles on top
for (let i = 0; i < 14; i++) {
  const s = ball(0.008 + Math.random() * 0.006, sparkleMat, 6);
  const side = i % 2 === 0 ? -1 : 1;
  s.position.set(side * (0.05 + Math.random() * 0.05), 0.1 + Math.random() * 0.08, 0.12 + Math.random() * 0.02);
  torso.add(s);
}

// Bikini bottom
const bottoms = new THREE.Group();
bottoms.position.y = -0.02;
hips.add(bottoms);
const bottomFront = ball(0.12, bikiniMat);
bottomFront.scale.set(1.2, 0.55, 0.7);
bottomFront.position.set(0, 0, 0.02);
bottoms.add(bottomFront);
const bottomBack = ball(0.11, bikiniMat);
bottomBack.scale.set(1.15, 0.5, 0.65);
bottomBack.position.set(0, 0, -0.04);
bottoms.add(bottomBack);

// Side ties
[-1, 1].forEach((side) => {
  const tie = new THREE.Mesh(
    new THREE.TorusGeometry(0.04, 0.008, 6, 16),
    bikiniMat
  );
  tie.position.set(side * 0.14, 0.02, 0);
  tie.rotation.y = Math.PI / 2;
  bottoms.add(tie);
});

// Head
const neck = limb(0.045, 0.05, 0.1);
neck.position.y = 0.34;
torso.add(neck);

const head = new THREE.Group();
head.position.y = 0.48;
torso.add(head);

const skull = ball(0.13, skinMat, 24);
skull.scale.set(0.95, 1.05, 0.95);
head.add(skull);

// Face features (subtle)
const nose = ball(0.02);
nose.position.set(0, 0, 0.12);
nose.scale.set(0.7, 1.1, 0.9);
head.add(nose);

const eyeGeo = new THREE.SphereGeometry(0.018, 10, 10);
const eyeMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.3 });
const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
eyeL.position.set(-0.045, 0.025, 0.105);
head.add(eyeL);
const eyeR = eyeL.clone();
eyeR.position.x = 0.045;
head.add(eyeR);

const lipMat = new THREE.MeshStandardMaterial({ color: 0xc47a72, roughness: 0.45 });
const lips = ball(0.025, lipMat, 10);
lips.scale.set(1.4, 0.45, 0.7);
lips.position.set(0, -0.04, 0.11);
head.add(lips);

// Hair
const hairCap = ball(0.14, hairMat, 20);
hairCap.scale.set(1.05, 1.0, 1.1);
hairCap.position.set(0, 0.02, -0.01);
head.add(hairCap);

const hairBack = ball(0.16, hairMat, 16);
hairBack.scale.set(1.1, 1.35, 0.7);
hairBack.position.set(0, -0.08, -0.1);
head.add(hairBack);

[-1, 1].forEach((side) => {
  const strand = ball(0.07, hairMat, 12);
  strand.scale.set(0.7, 1.8, 0.6);
  strand.position.set(side * 0.12, -0.12, -0.02);
  strand.rotation.z = side * 0.2;
  head.add(strand);
});

const bang = ball(0.08, hairMat, 12);
bang.scale.set(1.4, 0.5, 0.5);
bang.position.set(0, 0.08, 0.1);
head.add(bang);

// Arms
function makeArm(side) {
  const arm = new THREE.Group();
  arm.position.set(side * 0.2, 0.18, 0);
  torso.add(arm);

  const upper = limb(0.045, 0.04, 0.28);
  upper.position.y = -0.12;
  arm.add(upper);

  const elbow = new THREE.Group();
  elbow.position.y = -0.28;
  arm.add(elbow);

  const lower = limb(0.038, 0.032, 0.26);
  lower.position.y = -0.13;
  elbow.add(lower);

  const hand = ball(0.038);
  hand.position.y = -0.28;
  hand.scale.set(0.9, 1.1, 0.7);
  elbow.add(hand);

  // Bracelet / watch
  const band = new THREE.Mesh(
    new THREE.TorusGeometry(0.038, 0.008, 6, 16),
    new THREE.MeshStandardMaterial({
      color: side > 0 ? 0x1e3a5f : 0xc0c0c0,
      roughness: 0.4,
      metalness: side > 0 ? 0.1 : 0.7,
    })
  );
  band.position.y = -0.22;
  band.rotation.x = Math.PI / 2;
  elbow.add(band);

  arm.userData = { elbow, upper, hand };
  return arm;
}

const armL = makeArm(-1);
const armR = makeArm(1);

// Legs
function makeLeg(side) {
  const leg = new THREE.Group();
  leg.position.set(side * 0.09, -0.05, 0);
  hips.add(leg);

  const thigh = limb(0.07, 0.055, 0.38);
  thigh.position.y = -0.2;
  leg.add(thigh);

  const knee = new THREE.Group();
  knee.position.y = -0.42;
  leg.add(knee);

  const shin = limb(0.05, 0.04, 0.36);
  shin.position.y = -0.18;
  knee.add(shin);

  const foot = ball(0.05);
  foot.scale.set(0.75, 0.45, 1.4);
  foot.position.set(0, -0.38, 0.04);
  knee.add(foot);

  leg.userData = { knee, thigh, foot };
  return leg;
}

const legL = makeLeg(-1);
const legR = makeLeg(1);

// Pose helpers
const poses = {
  stand() {
    hips.rotation.set(0, 0.15, 0);
    torso.rotation.set(0.05, 0.1, 0);
    head.rotation.set(-0.05, 0.35, 0);
    armL.rotation.set(0.15, 0, 0.25);
    armL.userData.elbow.rotation.set(-0.2, 0, 0);
    armR.rotation.set(0.1, 0, -0.2);
    armR.userData.elbow.rotation.set(-0.15, 0, 0);
    legL.rotation.set(0.05, 0, 0.04);
    legL.userData.knee.rotation.set(0.05, 0, 0);
    legR.rotation.set(-0.05, 0, -0.03);
    legR.userData.knee.rotation.set(0.08, 0, 0);
    character.position.y = 0;
  },
  look() {
    hips.rotation.set(0, -0.4, 0);
    torso.rotation.set(0.08, -0.2, 0.05);
    head.rotation.set(-0.1, -0.5, 0);
    armR.rotation.set(-1.9, 0.2, -0.4);
    armR.userData.elbow.rotation.set(-1.2, 0, 0);
    armL.rotation.set(0.2, 0, 0.35);
    armL.userData.elbow.rotation.set(-0.25, 0, 0);
    legL.rotation.set(0.1, 0.1, 0.05);
    legL.userData.knee.rotation.set(0.1, 0, 0);
    legR.rotation.set(-0.15, -0.05, -0.05);
    legR.userData.knee.rotation.set(0.2, 0, 0);
    character.position.y = 0;
  },
  sit() {
    hips.rotation.set(0.15, 0.3, 0);
    torso.rotation.set(0.2, 0.15, 0);
    head.rotation.set(-0.15, 0.6, 0);
    armL.rotation.set(-0.6, 0.2, 0.5);
    armL.userData.elbow.rotation.set(-1.1, 0, 0);
    armR.rotation.set(-0.55, -0.15, -0.45);
    armR.userData.elbow.rotation.set(-1.0, 0, 0);
    legL.rotation.set(-1.35, 0.15, 0.1);
    legL.userData.knee.rotation.set(1.55, 0, 0);
    legR.rotation.set(-1.25, -0.1, -0.08);
    legR.userData.knee.rotation.set(1.45, 0, 0);
    character.position.y = -0.35;
  },
};

poses.stand();

// Gentle idle sway
let t = 0;
let currentPose = "stand";

function animateIdle(dt) {
  t += dt;
  const sway = Math.sin(t * 1.2) * 0.015;
  if (currentPose !== "sit") {
    torso.rotation.z = sway;
    hairCap.rotation.y = Math.sin(t * 0.8) * 0.04;
  }
  // Water shimmer motion
  const pos = water.geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    pos.setZ(i, Math.sin(x * 0.35 + t * 1.5) * 0.05 + Math.cos(y * 0.25 + t) * 0.04);
  }
  pos.needsUpdate = true;
  water.geometry.computeVertexNormals();
}

// Sparkle pulse
const sparkles = [];
torso.traverse((obj) => {
  if (obj.material === sparkleMat) sparkles.push(obj);
});

// UI: poses
document.querySelectorAll("[data-pose]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-pose]").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentPose = btn.dataset.pose;
    poses[currentPose]();
  });
});

const autoBtn = document.getElementById("autoRotate");
autoBtn.addEventListener("click", () => {
  controls.autoRotate = !controls.autoRotate;
  autoBtn.classList.toggle("active", controls.autoRotate);
});

document.getElementById("resetCam").addEventListener("click", () => {
  camera.position.set(2.4, 1.55, 4.2);
  controls.target.set(0, 1.05, 0);
  controls.update();
});

// Reference thumbnails (optional local refs)
const refFiles = [
  { src: "./refs/front.jpg", label: "Front" },
  { src: "./refs/profile.jpg", label: "Profil" },
  { src: "./refs/side.jpg", label: "Bok" },
  { src: "./refs/front-hat.jpg", label: "Klobouk" },
];

refFiles.forEach((ref, i) => {
  const img = document.createElement("img");
  img.src = ref.src;
  img.alt = ref.label;
  img.title = ref.label;
  img.loading = "lazy";
  img.addEventListener("error", () => img.remove());
  img.addEventListener("click", () => {
    refsEl.querySelectorAll("img").forEach((el) => el.classList.remove("active"));
    img.classList.add("active");
    // Nudge camera to complementary angle
    const angles = [
      new THREE.Vector3(0.3, 1.5, 4.0),
      new THREE.Vector3(-3.5, 1.6, 0.5),
      new THREE.Vector3(3.2, 1.4, 1.2),
      new THREE.Vector3(0.2, 1.7, 3.6),
    ];
    camera.position.copy(angles[i]);
    controls.target.set(0, 1.1, 0);
  });
  refsEl.appendChild(img);
});

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Intro camera ease
let intro = 0;
const introFrom = new THREE.Vector3(0.5, 2.8, 7.5);
const introTo = camera.position.clone();
camera.position.copy(introFrom);

const clock = new THREE.Clock();

function frame() {
  const dt = Math.min(clock.getDelta(), 0.05);
  if (intro < 1) {
    intro = Math.min(1, intro + dt * 0.45);
    const e = 1 - Math.pow(1 - intro, 3);
    camera.position.lerpVectors(introFrom, introTo, e);
  }
  animateIdle(dt);
  sparkles.forEach((s, i) => {
    s.material.emissiveIntensity = 0.1 + 0.15 * (0.5 + 0.5 * Math.sin(t * 3 + i));
  });
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

frame();
