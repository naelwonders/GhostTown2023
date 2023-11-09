let renderer, scene, camera;

init();

function init() {
    //creation de la scene qui contient tous les elements graphiques (caméra, objets, lumière)
    scene = new THREE.Scene();

    // Set the background color of the scene to taupe gray (adjust the RGB values as needed)
    scene.background = new THREE.Color(0x588084);

    //creation de la camera
    //le premier argument est l'angle, généralement  fixée entre 45 et 75
    //les deux derniers c'est le near far on utilisera raisonnablement des valeurs de 0.1 et 100 (avant 0.1, l'objet est invisible, au dela de 100 same thing)
    camera = new THREE.PerspectiveCamera(65, window.innerWidth /
    window.innerHeight, 1, 100);
    camera.position.x = -45;
    camera.position.y = 20;
    camera.position.z = 0;
    //on peut aussi positionner la camera en une seule instruction : camera.position.set(-30, 40, 30); 
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

    //ajout d'une surface plane 
    let planeWidth = 50;
    let planeHeight = 50;
    let planeMargin = 5
    const planeGeometry = new THREE.PlaneGeometry(planeWidth + planeMargin, planeHeight + planeMargin, 1, 1);
    const planeMaterial = new THREE.MeshBasicMaterial({
        color: 0x4a5e7a
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
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            // map: colorMap, // Assign color (diffuse) map
            // displacementMap: displacementMap, // Assign displacement map
            // normalMap: normalGLMap, // Assign normal map
            // roughnessMap: roughnessMap, // Assign roughness map
         })
        const buildingMesh = new THREE.Mesh(geometry, material)
        scene.add(buildingMesh) 
        buildingMesh.position.x = x; 
        buildingMesh.position.z = z;
        let sizeBuilding = Math.random()*10
        buildingMesh.scale.y = sizeBuilding; 
        buildingMesh.position.y = sizeBuilding / 2;
    }


    // show axes in the screen (pour debugger)
    const axes = new THREE.AxesHelper(20);
    scene.add(axes);
    renderer = new THREE.WebGLRenderer({
        //ca va choper la balise canvas de l'html, la classe que j'ai nommée webgl 
        canvas: document.querySelector('canvas.webgl')
       })
       renderer.setSize(600, 600);
       render();

    
}

// Renderer
function render(){
    renderer.render(scene, camera); 
    requestAnimationFrame(render);
}
