
const T = THREE;

window.addEventListener('load', init);

function init () {
        const stats = initStats();
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        const webGLRenderer = new THREE.WebGLRenderer();

        // webGLRenderer.setClearColor(new THREE.Color('black', 1.0));
        webGLRenderer.setSize(window.innerWidth, window.innerHeight);
        camera.position.x = 20;
        camera.position.y = 0;
        camera.position.z = 150;
        document.getElementsByTagName("body")[0].appendChild(webGLRenderer.domElement);

        const controls = new function() {
            this.size = 8;
            this.transparent = true;
            this.opacity = 1;
            this.vertexColors = true;
            this.color = 0xffffff;
            this.sizeAttenuation = true;
            this.rotateSystem = true;

            this.redraw = function () {
                if (scene.getObjectByName("particles")) {
                    scene.remove(scene.getObjectByName("particles"));
                }
                createParticles(controls.size, controls.transparent, controls.opacity, controls.vertexColors, controls.sizeAttenuation, controls.color);
            };
        };

        let cloud;

        const gui = new dat.GUI();
        gui.add(controls, 'size', 0, 10).onChange(controls.redraw);
        gui.add(controls, 'transparent').onChange(controls.redraw);
        gui.add(controls, 'opacity', 0, 1).onChange(controls.redraw);
        gui.add(controls, 'vertexColors').onChange(controls.redraw);
        gui.addColor(controls, 'color').onChange(controls.redraw);
        gui.add(controls, 'sizeAttenuation').onChange(controls.redraw);
        gui.add(controls, 'rotateSystem');
        controls.redraw();

        render();

        function createParticles(size, transparent, opacity, vertexColors, sizeAttenuation, color) {
            const geom = new THREE.Geometry();
            const material = new THREE.PointsMaterial({
                size: size,
                transparent: transparent,
                opacity: opacity,
                vertexColors: vertexColors,
                sizeAttenuation: sizeAttenuation,
                color: color
            });

            let range = 500;
            for (let i = 0; i < 5000; i++) {
                let particle = new THREE.Vector3(Math.random() * range - range / 2, Math.random() * range - range / 2, Math.random() * range - range / 2);
                geom.vertices.push(particle);
                const [r, g, b] = [Math.ceil(Math.random() * 255), Math.ceil(Math.random() * 255), Math.ceil(Math.random() * 255)];
                let color = new THREE.Color(`rgb(${r}, ${g}, ${b})`);
                color.setHSL(color.getHSL().h, color.getHSL().s, Math.random() * color.getHSL().l);
                geom.colors.push(color);
            }

            cloud = new THREE.Points(geom, material);
            cloud.name = "particles";
            scene.add(cloud);
        }


        let step = 0;
        function render() {
            stats.update();
            if (controls.rotateSystem) {
                step += 0.004;
                cloud.rotation.x = step;
                cloud.rotation.z = -step;
                cloud.position.x = step * 0.5;
                cloud.position.y = -step * 0.6;
            }
            requestAnimationFrame(render);
            webGLRenderer.render(scene, camera);
        }

        function initStats() {
            const stats = new Stats();
            stats.setMode(0);
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.left = '0px';
            stats.domElement.style.top = '0px';
            document.getElementById("stats").appendChild(stats.domElement);
            return stats;
        }

}


function initStats() {
    const stats = new Stats();
    stats.setMode(0);
    document.getElementById('stats').appendChild(stats.domElement);
    return stats;
}