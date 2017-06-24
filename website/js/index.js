const [windowWidth, windowHeight] = [window.innerWidth, window.innerHeight];



window.addEventListener('load', () => {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(400, 300);
    renderer.setClearColor('black');
    document.getElementsByTagName('body')[0].appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera  = new THREE.OrthographicCamera(-1, 1, 1.5, -1.5, 1, 10);
    camera.position.set(4, -3, 5);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);

    const cube = new THREE.Mesh(
        new THREE.CubeGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({ color: 'blue' , wireframe: true})
    );
    scene.add(cube);
    renderer.render(scene, camera)
});
