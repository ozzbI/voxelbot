if(!Utils.Detector.webgl) {
    Utils.Detector.addGetWebGLMessage();
    document.getElementById('container').innerHTML = "";
}
var container;
var stats;

var camera;
var controls;
var scene;
var renderer;
var cube;

var mesh;
var texture;

var data;
var worldWidth = 256;
var worldDepth = 256;
var worldHalfWidth = worldWidth / 2;
var worldHalfDepth = worldDepth / 2;

var clock = new THREE.Clock();
init();
animate();
function init() {
    container = document.getElementById('container');
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20000);
    scene = new THREE.Scene();
    camera.position.x = -350;
    data = generateHeight(worldWidth, worldDepth);
    camera.position.y = 200;
    var geometry = new THREE.PlaneGeometry(7500, 7500, worldWidth - 1, worldDepth - 1);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    for(var i = 0, l = geometry.vertices.length; i < l; i++) {
        geometry.vertices[i].y = data[i] * 10;
    }
    texture = new THREE.Texture(generateTexture(data, worldWidth, worldDepth), new THREE.UVMapping(), THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping);
    texture.needsUpdate = true;
    mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
        map: texture
    }));
    scene.add(mesh);
    var cubeGeometry = new THREE.CubeGeometry(100, 100, 100);
    var material = new THREE.MeshBasicMaterial({
        color: 65280
    });
    cube = new THREE.Mesh(cubeGeometry, material);
    scene.add(cube);
    cube.add(camera);
    controls = new Utils.BasicControls(cube);
    controls.movementSpeed = 1000;
    controls.rotationSpeed = 1;
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    stats = new Utils.Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild(stats.domElement);
    window.addEventListener('resize', onWindowResize, false);
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function generateHeight(width, height) {
    var size = width * height;
    var data = new Float32Array(size);
    var perlin = new Utils.ImprovedNoise();
    var quality = 1;
    var z = Math.random() * 100;

    for(var i = 0; i < size; i++) {
        data[i] = 0;
    }
    return data;
}
function generateTexture(data, width, height) {
    var canvas;
    var canvasScaled;
    var context;
    var image;
    var imageData;
    var level;
    var diff;
    var vector3;
    var sun;
    var shade;

    vector3 = new THREE.Vector3(0, 0, 0);
    sun = new THREE.Vector3(1, 1, 1);
    sun.normalize();
    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    context = canvas.getContext('2d');
    context.fillStyle = '#000';
    context.fillRect(0, 0, width, height);
    image = context.getImageData(0, 0, canvas.width, canvas.height);
    imageData = image.data;
    for(var i = 0, j = 0, l = imageData.length; i < l; i += 4 , j++) {
        vector3.x = data[j - 2] - data[j + 2];
        vector3.y = 2;
        vector3.z = data[j - width * 2] - data[j + width * 2];
        vector3.normalize();
        shade = vector3.dot(sun);
        imageData[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007);
        imageData[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007);
        imageData[i + 2] = (shade * 96) * (0.5 + data[j] * 0.007);
    }
    context.putImageData(image, 0, 0);
    canvasScaled = document.createElement('canvas');
    canvasScaled.width = width * 4;
    canvasScaled.height = height * 4;
    context = canvasScaled.getContext('2d');
    context.scale(4, 4);
    context.drawImage(canvas, 0, 0);
    image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
    imageData = image.data;
    for(var i = 0, l = imageData.length; i < l; i += 4) {
        var v = ~~(Math.random() * 5);
        imageData[i] += v;
        imageData[i + 1] += v;
        imageData[i + 2] += v;
    }
    context.putImageData(image, 0, 0);
    return canvasScaled;
}
function animate() {
    requestAnimationFrame(animate);
    render();
    stats.update();
}
function render() {
    controls.update(clock.getDelta());
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    renderer.render(scene, camera);
}
