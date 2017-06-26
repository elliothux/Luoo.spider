
const T = THREE;
const controls = new function() {
    this.rotationSpeed = 0.02;
    this.bouncingSpeed = 0.03;
    this.posZ = 0;
};


(function () {
    const stats = initStats();
    const [W, H] = [window.innerWidth, window.innerHeight];
    const gui = new dat.GUI();
    gui.add(controls, 'rotationSpeed', 0, 0.5);
    gui.add(controls, 'bouncingSpeed', 0, 0.5);
    gui.add(controls, 'posZ', 0, 20);

    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(45, W/H, 0.1, 1000);
    const renderer = new T.WebGLRenderer();
    renderer.setClearColor(0xeeeeee);
    renderer.setSize(W, H);
    document.getElementsByTagName('body')[0].appendChild(renderer.domElement);

    const axes = new T.AxisHelper(W);
    scene.add(axes);

    // const cubeGeometry = new T.CubeGeometry(4, 4, 4);
    // const cubeMaterial = new T.MeshBasicMaterial({ color: 0xff0000 });
    // const cube = new T.Mesh(cubeGeometry, cubeMaterial);
    // cube.position.x = 0;
    // cube.position.y = 0;
    // cube.position.z = 0;
    // scene.add(cube);


    const plane = new T.Mesh(
        new T.PlaneGeometry(W/10, W/10),
        new T.MeshBasicMaterial({ map: T.ImageUtils.loadTexture('./pic/cover.png') })
    );
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    scene.add(plane);

    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 1000;
    camera.lookAt(scene.position);

    renderScene();


    let step = 0;

    function renderScene() {
        stats.update();
        plane.position.z = 499 * Math.abs(Math.cos(step)) + 1;
        step += 0.03;
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