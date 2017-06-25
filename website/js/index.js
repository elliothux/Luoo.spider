
let scene, renderer, camera, light;
const [windowWidth, windowHeight] = [window.innerWidth, window.innerHeight];

window.addEventListener('load', threeStart);


function threeStart() {
    initRenderer();
    initCamera();
    initScene();
    initLight();
    initObject();
    render()
}


function initScene() {
    scene = new THREE.Scene()
}


function initRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(windowWidth, windowHeight);
    renderer.setClearColor('black', 1.0);
    document.getElementsByTagName('body')[0].appendChild(renderer.domElement);
}


function initCamera() {
    camera  = new THREE.PerspectiveCamera(75, windowWidth/windowHeight, 0.1, 1000);
    [camera.position.x, camera.position.y, camera.position.z] = [0, 1000, 0];
    [camera.up.x, camera.up.y, camera.up.z] = [0, 0, 0];
    camera.lookAt({
        x: 0,
        y: 0,
        z: 0
    })
}


function initLight() {
    light = new THREE.DirectionalLight(0xff0000, 1.0, 0);
    light.position.set(100, 100, 200);
    scene.add(light);
}

function initObject() {
    const geometry = new THREE.Geometry();
    const material = new THREE.LineBasicMaterial({
        vertexColors: THREE.VertexColors
    });
    const [color1, color2] = [new THREE.Color(0x4444), new THREE.Color(0xFF0000)];
    const [p1, p2] = [new THREE.Vector3(-100, 0, 100), new THREE.Vector3(100, 9, -100)];
    geometry.vertices.push(p1);
    geometry.vertices.push(p2);
    const line = new THREE.Line(geometry, material, THREE.LineSegments);
    scene.add(line);
}


function render() {
    renderer.clear();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}


// function init() {
//
//     const scene = new THREE.Scene();
//     let enlarge = 1;
//
//
//     const geometry = new THREE.CubeGeometry(1, 1, 1);
//     const material = new THREE.MeshBasicMaterial({ color: 'green' });
//     const cube = new THREE.Mesh(geometry, material);
//     scene.add(cube);
//     camera.position.z = 5;
//
//     render();
//
//     function render() {
//         if (camera.position.z > 10 || camera.position.z < 5) enlarge = -1 * enlarge;
//         camera.position.z += enlarge * 0.15;
//         console.log(camera.position.z);
//
//         cube.rotation.x += 0.02;
//         cube.rotation.y += 0.05;
//         renderer.render(scene, camera);
//         requestAnimationFrame(render);
//     }
// }
