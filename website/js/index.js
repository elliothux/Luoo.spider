
const T = THREE;


(function () {
    const stats = initStats();
    const [W, H] = [window.innerWidth, window.innerHeight];
    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(45, W/H, 0.1, 1000);
    const renderer = new T.WebGLRenderer();
    renderer.setClearColor(0xeeeeee);
    renderer.setSize(W, H);
    renderer.shadowMapEnabled = true;
    document.getElementsByTagName('body')[0].appendChild(renderer.domElement);

    const spotLight = new T.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    // spotLight.shadowCameraFov = VIEW_ANGLE;
    spotLight.shadowBias = 0.0001;
    spotLight.shadowDarkness = 0.2;
    spotLight.shadowMapWidth = 4096;
    spotLight.shadowMapHeight = 4096;
    scene.add(spotLight);

    const axes = new T.AxisHelper(20);
    scene.add(axes);

    const planeGeometry = new T.PlaneGeometry(60, 20, 1, 1);
    const planeMaterial = new T.MeshLambertMaterial({ color: 0xcccccc });
    const plane = new T.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;
    plane.receiveShadow = true;
    scene.add(plane);

    const cubeGeometry = new T.CubeGeometry(4, 4, 4);
    const cubeMaterial = new T.MeshLambertMaterial({ color: 0xff0000 });
    const cube = new T.Mesh(cubeGeometry, cubeMaterial);
    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;
    cube.castShadow = true;
    scene.add(cube);

    const sphereGeometry = new T.SphereGeometry(4, 20, 20);
    const sphereMaterial = new T.MeshLambertMaterial({ color: 0x7777ff });
    const sphere = new T.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.x = 20;
    sphere.position.y = 4;
    sphere.position.z = 2;
    sphere.castShadow = true;
    scene.add(sphere);

    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    renderScene();


    function renderScene() {
        stats.update();

        cube.rotation.x += 0.02;
        cube.rotation.y += 0.02;
        cube.rotation.z += 0.02;

        requestAnimationFrame(renderScene);
        renderer.render(scene, camera);
    }
})();


function initStats() {
    const stats = new Stats();
    stats.setMode(0);
    document.getElementById('stats').appendChild(stats.domElement);
    return stats;
}