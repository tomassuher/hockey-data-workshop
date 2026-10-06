import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

/* Palette from reference photos */
const SKIN = 0xe0b892;
const SKIN_SHADOW = 0xc9956e;
const HAIR = 0xd4b06a;
const HAIR_LIGHT = 0xe8c98a;
const BIKINI = 0x8fd4e8;
const SAND = 0xe8d4b0;
const SEA = 0x2bb8c9;

const app = document.getElementById("app");
const refsEl = document.getElementById("refs");

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
renderer.outputColorSpace = THREE.SRGBColorSpace;
app.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x7ec8e8);
scene.fog = new THREE.FogExp2(0x7ec8e8, 0.014);

const camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.1, 200);
camera.position.set(0.35, 1.45, 4.4);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1.1, 0);
controls.enableDamping = true;
controls.minDistance = 1.6;
controls.maxDistance = 10;
controls.maxPolarAngle = Math.PI * 0.48;
controls.minPolarAngle = 0.12;
controls.autoRotate = false;
controls.autoRotateSpeed = 0.65;

/* Lights */
scene.add(new THREE.HemisphereLight(0xbde8ff, 0xd8c09a, 0.9));

const sun = new THREE.DirectionalLight(0xfff2dc, 1.6);
sun.position.set(5.5, 9.5, 5);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { near: 1, far: 30, left: -8, right: 8, top: 8, bottom: -8 });
sun.shadow.bias = -0.00025;
scene.add(sun);

const fill = new THREE.DirectionalLight(0x9ad4ea, 0.4);
fill.position.set(-5, 3, -3);
scene.add(fill);

const rim = new THREE.DirectionalLight(0xffe0b0, 0.35);
rim.position.set(-2, 4, -6);
scene.add(rim);

/* Beach */
const sand = new THREE.Mesh(
  new THREE.CircleGeometry(30, 72),
  new THREE.MeshStandardMaterial({ color: SAND, roughness: 0.96, metalness: 0.02 })
);
sand.rotation.x = -Math.PI / 2;
sand.receiveShadow = true;
scene.add(sand);

const wet = new THREE.Mesh(
  new THREE.RingGeometry(6, 11, 72, 1, Math.PI * 0.15, Math.PI * 0.7),
  new THREE.MeshStandardMaterial({ color: 0xc4ae82, roughness: 0.5, metalness: 0.08 })
);
wet.rotation.x = -Math.PI / 2;
wet.position.set(0, 0.008, -3);
wet.receiveShadow = true;
scene.add(wet);

const waterGeo = new THREE.PlaneGeometry(70, 48, 80, 40);
const water = new THREE.Mesh(
  waterGeo,
  new THREE.MeshStandardMaterial({
    color: SEA,
    roughness: 0.18,
    metalness: 0.4,
    transparent: true,
    opacity: 0.9,
  })
);
water.rotation.x = -Math.PI / 2;
water.position.set(0, 0.03, -24);
water.receiveShadow = true;
scene.add(water);

/* Distant coast */
const coastPts = [];
for (let i = 0; i <= 24; i++) {
  const x = -22 + i * 1.85;
  const y = 0.4 + Math.abs(Math.sin(i * 0.7)) * 0.9 + (i % 3) * 0.15;
  coastPts.push(new THREE.Vector2(x, y));
}
coastPts.push(new THREE.Vector2(24, 0), new THREE.Vector2(-22, 0));
const coastShape = new THREE.Shape(coastPts);
const coast = new THREE.Mesh(
  new THREE.ExtrudeGeometry(coastShape, { depth: 3, bevelEnabled: false }),
  new THREE.MeshStandardMaterial({ color: 0xcbb08a, roughness: 0.92 })
);
coast.position.set(0, 0, -40);
scene.add(coast);

const shadowDisc = new THREE.Mesh(
  new THREE.CircleGeometry(0.5, 32),
  new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.16 })
);
shadowDisc.rotation.x = -Math.PI / 2;
shadowDisc.position.y = 0.012;
scene.add(shadowDisc);

/* Materials */
const skinMat = new THREE.MeshStandardMaterial({ color: SKIN, roughness: 0.52, metalness: 0.04 });
const skinDeep = new THREE.MeshStandardMaterial({ color: SKIN_SHADOW, roughness: 0.58, metalness: 0.04 });
const hairMat = new THREE.MeshStandardMaterial({ color: HAIR, roughness: 0.62, metalness: 0.06 });
const hairLite = new THREE.MeshStandardMaterial({ color: HAIR_LIGHT, roughness: 0.55, metalness: 0.08 });
const bikiniMat = new THREE.MeshStandardMaterial({ color: BIKINI, roughness: 0.32, metalness: 0.28 });
const sparkleMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.12,
  metalness: 0.95,
  emissive: 0xb8e8ff,
  emissiveIntensity: 0.2,
});
const eyeWhite = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.4 });
const irisMat = new THREE.MeshStandardMaterial({ color: 0x4a3a2a, roughness: 0.25 });
const lipMat = new THREE.MeshStandardMaterial({ color: 0xc97870, roughness: 0.4 });

function mesh(geo, mat) {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

function sphere(r, mat = skinMat, w = 20, h = 16) {
  return mesh(new THREE.SphereGeometry(r, w, h), mat);
}

function cyl(rt, rb, h, mat = skinMat, seg = 12) {
  return mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
}

/* ===== Character ===== */
const character = new THREE.Group();
scene.add(character);

const hips = new THREE.Group();
hips.position.y = 0.95;
character.add(hips);

const pelvis = sphere(0.15);
pelvis.scale.set(1.45, 0.9, 1.1);
hips.add(pelvis);

/* Torso */
const torso = new THREE.Group();
torso.position.y = 0.2;
hips.add(torso);

const ribcage = mesh(new THREE.CapsuleGeometry(0.14, 0.26, 8, 14), skinMat);
ribcage.scale.set(1.35, 1.05, 0.88);
torso.add(ribcage);

const abdomen = sphere(0.12, skinDeep);
abdomen.position.y = -0.1;
abdomen.scale.set(1.2, 0.75, 0.95);
torso.add(abdomen);

/* Bust */
const bustL = sphere(0.078);
bustL.position.set(-0.09, 0.14, 0.09);
bustL.scale.set(1.05, 0.95, 0.9);
torso.add(bustL);
const bustR = bustL.clone();
bustR.position.x = 0.09;
torso.add(bustR);

/* Bikini top — triangle cups */
function triangleCup(side) {
  const g = new THREE.Group();
  const cup = sphere(0.082, bikiniMat);
  cup.scale.set(1.1, 1.0, 0.55);
  cup.position.set(side * 0.09, 0.14, 0.11);
  g.add(cup);
  /* side tie nub */
  const nub = sphere(0.02, bikiniMat, 8, 8);
  nub.position.set(side * 0.15, 0.12, 0.06);
  g.add(nub);
  return g;
}
torso.add(triangleCup(-1), triangleCup(1));

/* neck strap */
const strapCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-0.09, 0.16, 0.1),
  new THREE.Vector3(-0.05, 0.3, 0.04),
  new THREE.Vector3(0, 0.38, -0.01),
  new THREE.Vector3(0.05, 0.3, 0.04),
  new THREE.Vector3(0.09, 0.16, 0.1),
]);
torso.add(mesh(new THREE.TubeGeometry(strapCurve, 24, 0.007, 6, false), bikiniMat));

/* back strap */
const backStrap = mesh(new THREE.TorusGeometry(0.14, 0.007, 6, 24, Math.PI), bikiniMat);
backStrap.position.set(0, 0.12, -0.05);
backStrap.rotation.x = Math.PI / 2;
backStrap.rotation.z = Math.PI;
torso.add(backStrap);

/* sparkles */
const sparkles = [];
for (let i = 0; i < 18; i++) {
  const s = sphere(0.006 + Math.random() * 0.007, sparkleMat, 6, 6);
  const side = i % 2 === 0 ? -1 : 1;
  s.position.set(
    side * (0.05 + Math.random() * 0.06),
    0.1 + Math.random() * 0.1,
    0.14 + Math.random() * 0.02
  );
  torso.add(s);
  sparkles.push(s);
}

/* Bikini bottoms */
const bottoms = new THREE.Group();
bottoms.position.y = -0.02;
hips.add(bottoms);

const frontPanel = sphere(0.115, bikiniMat);
frontPanel.scale.set(1.25, 0.55, 0.65);
frontPanel.position.set(0, 0.01, 0.04);
bottoms.add(frontPanel);

const backPanel = sphere(0.11, bikiniMat);
backPanel.scale.set(1.2, 0.5, 0.6);
backPanel.position.set(0, 0.01, -0.05);
bottoms.add(backPanel);

[-1, 1].forEach((side) => {
  const hipTie = mesh(new THREE.TorusGeometry(0.035, 0.007, 6, 14), bikiniMat);
  hipTie.position.set(side * 0.145, 0.03, 0);
  hipTie.rotation.y = Math.PI / 2;
  bottoms.add(hipTie);
  const end = sphere(0.015, bikiniMat, 8, 8);
  end.position.set(side * 0.18, 0.0, 0.02);
  bottoms.add(end);
});

/* Neck + head */
const neck = cyl(0.042, 0.048, 0.11);
neck.position.y = 0.36;
torso.add(neck);

const head = new THREE.Group();
head.position.y = 0.5;
torso.add(head);

const skull = sphere(0.128, skinMat, 28, 22);
skull.scale.set(0.95, 1.08, 0.95);
head.add(skull);

const jaw = sphere(0.09, skinMat, 16, 12);
jaw.position.set(0, -0.06, 0.02);
jaw.scale.set(0.95, 0.7, 0.9);
head.add(jaw);

const nose = sphere(0.018);
nose.position.set(0, 0.01, 0.125);
nose.scale.set(0.65, 1.15, 0.95);
head.add(nose);

function makeEye(side) {
  const g = new THREE.Group();
  g.position.set(side * 0.045, 0.03, 0.108);
  const white = sphere(0.018, eyeWhite, 10, 8);
  white.scale.set(1.1, 0.85, 0.6);
  g.add(white);
  const iris = sphere(0.01, irisMat, 8, 8);
  iris.position.z = 0.01;
  g.add(iris);
  return g;
}
head.add(makeEye(-1), makeEye(1));

const lips = sphere(0.024, lipMat, 10, 8);
lips.scale.set(1.45, 0.4, 0.65);
lips.position.set(0, -0.045, 0.115);
head.add(lips);

/* Blonde shoulder-length hair */
const hairRoot = new THREE.Group();
head.add(hairRoot);

const hairCap = sphere(0.14, hairMat, 22, 18);
hairCap.scale.set(1.08, 1.02, 1.12);
hairCap.position.set(0, 0.025, -0.015);
hairRoot.add(hairCap);

const fringe = sphere(0.075, hairLite, 14, 10);
fringe.scale.set(1.55, 0.45, 0.55);
fringe.position.set(0, 0.09, 0.1);
hairRoot.add(fringe);

const hairBack = sphere(0.155, hairMat, 16, 14);
hairBack.scale.set(1.15, 1.5, 0.75);
hairBack.position.set(0, -0.1, -0.1);
hairRoot.add(hairBack);

[-1, 1].forEach((side) => {
  const lock = sphere(0.075, side > 0 ? hairLite : hairMat, 12, 10);
  lock.scale.set(0.75, 2.0, 0.65);
  lock.position.set(side * 0.125, -0.14, 0.0);
  lock.rotation.z = side * 0.18;
  hairRoot.add(lock);

  const lower = sphere(0.055, hairMat, 10, 8);
  lower.scale.set(0.7, 1.6, 0.55);
  lower.position.set(side * 0.11, -0.28, -0.02);
  lower.rotation.z = side * 0.12;
  hairRoot.add(lower);
});

const ponytailHint = sphere(0.07, hairLite, 12, 10);
ponytailHint.scale.set(1.0, 1.3, 0.7);
ponytailHint.position.set(0, -0.22, -0.14);
hairRoot.add(ponytailHint);

/* Arms */
function makeArm(side) {
  const arm = new THREE.Group();
  arm.position.set(side * 0.22, 0.2, 0);
  torso.add(arm);

  const upper = cyl(0.048, 0.042, 0.3);
  upper.position.y = -0.13;
  arm.add(upper);

  const elbow = new THREE.Group();
  elbow.position.y = -0.3;
  arm.add(elbow);

  const lower = cyl(0.04, 0.032, 0.27);
  lower.position.y = -0.135;
  elbow.add(lower);

  const hand = sphere(0.04);
  hand.scale.set(0.85, 1.15, 0.65);
  hand.position.y = -0.29;
  elbow.add(hand);

  const band = mesh(
    new THREE.TorusGeometry(0.036, 0.007, 6, 14),
    new THREE.MeshStandardMaterial({
      color: side > 0 ? 0x1a3355 : 0xd0d0d0,
      roughness: 0.35,
      metalness: side > 0 ? 0.15 : 0.75,
    })
  );
  band.rotation.x = Math.PI / 2;
  band.position.y = -0.22;
  elbow.add(band);

  arm.userData = { elbow };
  return arm;
}

const armL = makeArm(-1);
const armR = makeArm(1);

/* Legs */
function makeLeg(side) {
  const leg = new THREE.Group();
  leg.position.set(side * 0.095, -0.04, 0);
  hips.add(leg);

  const thigh = cyl(0.075, 0.058, 0.4);
  thigh.position.y = -0.21;
  leg.add(thigh);

  const knee = new THREE.Group();
  knee.position.y = -0.44;
  leg.add(knee);

  const shin = cyl(0.052, 0.04, 0.38);
  shin.position.y = -0.19;
  knee.add(shin);

  const ankle = sphere(0.04, skinDeep, 10, 8);
  ankle.position.y = -0.38;
  knee.add(ankle);

  const foot = sphere(0.048);
  foot.scale.set(0.7, 0.4, 1.45);
  foot.position.set(0, -0.4, 0.05);
  knee.add(foot);

  leg.userData = { knee };
  return leg;
}

const legL = makeLeg(-1);
const legR = makeLeg(1);

/* Poses matching photo set */
const poses = {
  stand() {
    hips.rotation.set(0, 0.2, 0);
    torso.rotation.set(0.04, 0.12, 0);
    head.rotation.set(-0.05, 0.45, 0.05);
    armL.rotation.set(0.12, 0, 0.28);
    armL.userData.elbow.rotation.set(-0.18, 0, 0);
    armR.rotation.set(-0.9, 0.1, -0.35);
    armR.userData.elbow.rotation.set(-1.0, 0.2, 0);
    legL.rotation.set(0.06, 0.05, 0.04);
    legL.userData.knee.rotation.set(0.06, 0, 0);
    legR.rotation.set(-0.08, -0.04, -0.03);
    legR.userData.knee.rotation.set(0.1, 0, 0);
    character.position.set(0, 0, 0);
    hairRoot.rotation.set(0, 0.1, 0);
  },
  look() {
    hips.rotation.set(0, -0.55, 0);
    torso.rotation.set(0.06, -0.25, 0.04);
    head.rotation.set(-0.12, -0.35, 0);
    armR.rotation.set(-2.05, 0.35, -0.55);
    armR.userData.elbow.rotation.set(-0.9, 0, 0.2);
    armL.rotation.set(0.15, 0, 0.4);
    armL.userData.elbow.rotation.set(-0.2, 0, 0);
    legL.rotation.set(0.12, 0.12, 0.06);
    legL.userData.knee.rotation.set(0.08, 0, 0);
    legR.rotation.set(-0.2, -0.08, -0.05);
    legR.userData.knee.rotation.set(0.22, 0, 0);
    character.position.set(0, 0, 0);
    hairRoot.rotation.set(0, -0.15, 0.05);
  },
  sit() {
    hips.rotation.set(0.2, 0.35, 0);
    torso.rotation.set(0.25, 0.2, 0);
    head.rotation.set(-0.2, 0.7, 0);
    armL.rotation.set(-0.7, 0.25, 0.55);
    armL.userData.elbow.rotation.set(-1.15, 0, 0);
    armR.rotation.set(-0.65, -0.2, -0.5);
    armR.userData.elbow.rotation.set(-1.05, 0, 0);
    legL.rotation.set(-1.4, 0.2, 0.12);
    legL.userData.knee.rotation.set(1.6, 0, 0);
    legR.rotation.set(-1.3, -0.12, -0.1);
    legR.userData.knee.rotation.set(1.5, 0, 0);
    character.position.set(0, -0.38, 0);
    hairRoot.rotation.set(0.05, 0.2, 0);
  },
};

let currentPose = "stand";
poses.stand();

/* UI */
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
  camera.position.set(0.35, 1.45, 4.4);
  controls.target.set(0, 1.1, 0);
});

const refFiles = [
  { src: "./refs/front.jpg", cam: [0.2, 1.5, 4.2] },
  { src: "./refs/profile.jpg", cam: [-3.6, 1.55, 0.4] },
  { src: "./refs/side.jpg", cam: [3.4, 1.4, 1.0] },
  { src: "./refs/front-hat.jpg", cam: [0.15, 1.65, 3.8] },
];

refFiles.forEach((ref, i) => {
  const img = document.createElement("img");
  img.src = ref.src;
  img.alt = `Ref ${i + 1}`;
  img.loading = "lazy";
  img.addEventListener("error", () => img.remove());
  img.addEventListener("click", () => {
    refsEl.querySelectorAll("img").forEach((el) => el.classList.remove("active"));
    img.classList.add("active");
    camera.position.set(...ref.cam);
    controls.target.set(0, 1.15, 0);
  });
  refsEl.appendChild(img);
});

addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

/* Animation */
let t = 0;
let intro = 0;
const introFrom = new THREE.Vector3(1.2, 2.6, 7.2);
const introTo = camera.position.clone();
camera.position.copy(introFrom);

const clock = new THREE.Clock();
const waterPos = water.geometry.attributes.position;

function frame() {
  const dt = Math.min(clock.getDelta(), 0.05);
  t += dt;

  if (intro < 1) {
    intro = Math.min(1, intro + dt * 0.5);
    const e = 1 - (1 - intro) ** 3;
    camera.position.lerpVectors(introFrom, introTo, e);
  }

  if (currentPose !== "sit") {
    torso.rotation.z = Math.sin(t * 1.15) * 0.012;
    hairRoot.rotation.y += (Math.sin(t * 0.7) * 0.04 - hairRoot.rotation.y) * 0.05;
  }

  for (let i = 0; i < waterPos.count; i++) {
    const x = waterPos.getX(i);
    const y = waterPos.getY(i);
    waterPos.setZ(i, Math.sin(x * 0.3 + t * 1.4) * 0.045 + Math.cos(y * 0.22 + t * 0.9) * 0.035);
  }
  waterPos.needsUpdate = true;
  water.geometry.computeVertexNormals();

  sparkles.forEach((s, i) => {
    s.material.emissiveIntensity = 0.12 + 0.18 * (0.5 + 0.5 * Math.sin(t * 3.2 + i));
  });

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

frame();
