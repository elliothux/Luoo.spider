

window.addEventListener('load', () => {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor('red');
    document.getElementsByTagName('body')[0].appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera  = new THREE.PerspectiveCamera(45, 4/3, 1, 1000);
    camera.position.set(0, 0, 5);
    scene.add(camera);

    const cube = new THREE.Mesh(
        new THREE.CubeGeometry(1, 2, 3),
        new THREE.MeshBasicMaterial({ color: 'blue' })
    );
    scene.add(cube);
    renderer.render(scene, camera)
});
