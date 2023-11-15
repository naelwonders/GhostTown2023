let renderer, scene, camera;
let cameraSpeed = 1;
let cameraX = -50; // on débute à - 100 pour avancer vers max 50
let cameraY = 15; // haut bas, limite du bas, plane
let cameraZ = 0; // gauche droite, taille du plane sont les limites
let mouseX = 0;
let mouseY = 0;
let planeWidth = 50;
let planeHeight = 50;
let planeMargin = 50;

//blender ship thanks to JamesWhite (https://opengameart.org/content/low-poly-pirate-ship)
//cute pigeons: https://opengameart.org/content/pigeon-blue-bird-rework

init();

function init() {
    //creation de la scene qui contient tous les elements graphiques (caméra, objets, lumière)
    scene = new THREE.Scene();

    //pour que ma scene s'adapte à ma fenetre 
    //window.addEventListener('resize', onResize, false); 

    // Set the background color of the scene to taupe gray (adjust the RGB values as needed)
    scene.background = new THREE.Color(0x588084);

    //creation de la camera
    //le premier argument est l'angle, généralement  fixée entre 45 et 75
    //les deux derniers c'est le near far on utilisera raisonnablement des valeurs de 0.1 et 100 (avant 0.1, l'objet est invisible, au dela de 100 same thing)
    camera = new THREE.PerspectiveCamera(65, window.innerWidth /
    window.innerHeight, 1, 100);   

    // Écouteurs d'événements pour les touches du clavier
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
        case 'ArrowUp':
            // Avancer
            cameraX += cameraSpeed;
            if (cameraX >= 0) cameraX = 0;
            //console.log(cameraX);
            break;
        case 'ArrowDown':
            // Reculer
            cameraX -= cameraSpeed;
            if (cameraX <= -63) cameraX = -63;
            break;
        case 'ArrowLeft':
            // Déplacer vers la gauche
            cameraZ -= cameraSpeed;
            if (cameraZ <= -20) cameraZ = -20;
            break;
        case 'ArrowRight':
            // Déplacer vers la droite
            cameraZ += cameraSpeed;
            
            if (cameraZ >= 20) cameraZ = 20;
            break;
        }
    
        // Mettre à jour la position de la caméra
        camera.position.set(cameraX, cameraY, cameraZ);

    });
    
    
    camera.position.set(cameraX, cameraY, cameraZ);
    
    // document.addEventListener('mousemove', (event) => {
    //     // Obtenez la position du pointeur de la souris par rapport au centre de la fenêtre
    //     mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    //     mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    //   });
    // camera.lookAt(mouseX, mouseY, 0);
    camera.lookAt(scene.position); 

    //ajouter la camera dans la scene
    scene.add(camera); 

    //add the light
    let pointLight = new THREE.PointLight(0x356b50, 400, 50);;
    //pointLight.distance = 100;
    pointLight.position.set(0,30,0);
    const pointSphere = new THREE.SphereGeometry(10);
    //pointLight.add(new THREE.Mesh(pointSphere, new THREE.MeshBasicMaterial({color: 0xccffcc})));
    scene.add(pointLight); 

    //import the boat into my scene (made in blender)
    const loader = new THREE.OBJLoader();
        loader.load("/assets/models/ship_wreck.obj", function (loadedMesh) {
            var boat = new THREE.MeshLambertMaterial({color: 0x5C3A21});

            // loadedMesh is a group of meshes. For
            // each mesh set the material, and compute the information
            // three.js needs for rendering.
            loadedMesh.children.forEach(function (child) {
                child.material = boat;
                child.geometry.computeFaceNormals();
                child.geometry.computeVertexNormals();
            });

            mesh = loadedMesh;
            loadedMesh.scale.set(0.1, 0.1, 0.1);
            //loadedMesh.rotation.x = -0.3;
            loadedMesh.position.set(-30,0,0);
            scene.add(loadedMesh);
        });

    //ajout d'une surface plane 
    const planeGeometry = new THREE.PlaneGeometry(planeWidth + planeMargin, planeHeight + planeMargin, 1, 1);
    const planeMaterial = new THREE.MeshBasicMaterial({
        color: 0x044872
    });
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial); 
    scene.add(planeMesh);
    planeMesh.rotation.x = -Math.PI / 2; // Rotate the plane by -90 degrees around the x-axis

    // //texture of the city
    // const textureLoader = new THREE.TextureLoader();
    // const colorMap = textureLoader.load('./assets/textures/Concrete026_1K-JPG_Color.jpg');
    // const displacementMap = textureLoader.load('./assets/textures/Concrete026_1K-JPG_Displacement.jpg');
    // const normalGLMap = textureLoader.load('./assets/textures/Concrete026_1K-JPG_NormalDX.jpg');
    // const roughnessMap = textureLoader.load('./assets/textures/Concrete026_1K-JPG_Roughness.jpg');

    //ajout des cubes dans ma scene
    for (let i = 0; i < 500; i++) {
        //rendre plus intelligent par rapport à la taille de mon plane
        //voici une manière de générer toutes mes tours avec une seule boucle (modulo pour x et divisé pour le z)
        //le * c'est l'écart entre mes tours
        //le - c'est le décalage par rapport à ma plane
        let x = i % 20 * 2 - planeWidth / 2; 
        let z = Math.floor(i / 20) * 2 - planeHeight / 2;
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        //basic material ne reagit pas a la lumière, Lambert reagit
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x4a5e7a,
            // map: colorMap, // Assign color (diffuse) map
            // displacementMap: displacementMap, // Assign displacement map
            // normalMap: normalGLMap, // Assign normal map
            // roughnessMap: roughnessMap, // Assign roughness map
         })
        const buildingMesh = new THREE.Mesh(geometry, material)
        scene.add(buildingMesh) 
        buildingMesh.position.x = x; 
        buildingMesh.position.z = z;
        let sizeBuilding = Math.random()*15
        buildingMesh.scale.y = sizeBuilding; 
        buildingMesh.position.y = sizeBuilding / 2;
    }

    scene.fog=new THREE.Fog( 0x588084, 0.18, 50); 
    //scene.fog=new THREE.FogExp2( 0xffffff, 0.01 ); 

    // show axes in the screen (pour debugger)
    //const axes = new THREE.AxesHelper(20);
    //scene.add(axes);
    renderer = new THREE.WebGLRenderer({
        //ca va choper la balise canvas de l'html, la classe que j'ai nommée webgl 
        canvas: document.querySelector('canvas.webgl')
       })

    renderer.setClearColor(0x588084);
    renderer.setSize(800, 600);
    render();
    
}

// Renderer: c'est l'équivalant de mon update, c'est ici qu'on fait interactivité
function render(){
    //mesh.position.x = (Math.cos(step)); c'est pour faire ociller les mesh (maillage donc les petits triangles)
    renderer.render(scene, camera); 
    requestAnimationFrame(render);
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
   } 

function playMusic() {
    var audioElement = document.getElementById('audio');

    if (audioElement.paused) {
        audioElement.play(); // Démarre la lecture du son
    } else {
        audioElement.pause(); // Met en pause la lecture si le son est déjà en cours de lecture
        audioElement.currentTime = 0; // Réinitialise la position de lecture au début
    }
}
