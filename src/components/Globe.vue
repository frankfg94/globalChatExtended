
<template>
<div>
  <h2 v-if="debug">Component Globe is imported</h2>
  <div class="bg" @click="changeText" id="THREECanvas">
  </div>
</div>
</template>
<style>
.bg {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -100;
}
</style>
<script>
export default {
  name: 'Globe',
  data: () => ({
    debug: false,
    earthSpeedX: 0.003,
    earthSpeedY: 0.003,
    mouseX: 0,
    mouseY: 0,
    cartoon: false
  }),
  methods: {
    initGlobe () {
      const THREE = require('three')
      var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      var scene = new THREE.Scene()
      var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      var mouseX = 0
      var mouseY = 0
      renderer.setSize(window.innerWidth, window.innerHeight)

      // Add the 3D scene in the HTML
      document.getElementById('THREECanvas').appendChild(renderer.domElement)
      scene.add(new THREE.AmbientLight(0x333333))
      var light = new THREE.DirectionalLight(0x659c51, 1)
      light.position.set(5, 3, 5)
      var geometry = new THREE.SphereGeometry(0.75, 32, 32)

      // TODO: change with TOON for cartoon
      var texture = new THREE.TextureLoader().load('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/i/4013c234-b843-4331-84cd-8a86d940d26f/dcrbmun-38493001-d0cc-4bd6-9acb-2bf1109b488b.jpg/v1/fill/w_1264,h_632,q_70,strp/free_hd_20k_x10k_earth_world_map_texture_by_giallo86_dcrbmun-pre.jpg')
      console.log(texture)

      var material = new THREE.MeshToonMaterial({ })
      if (!this.cartoon) {
        light = new THREE.DirectionalLight(0x333333, 1)
        light.intensity = 10
        material = new THREE.MeshPhongMaterial({ map: texture })
      }
      scene.add(light)

      // Smart light reflections
      material.specularMap = new THREE.TextureLoader().load('http://learningthreejs.com/data/2013-09-16-how-to-make-the-earth-in-webgl/demo/bower_components/threex.planets/images/earthspec1k.jpg')
      material.specular = new THREE.Color('grey')

      // Texture height per pixel (perspective)
      material.bumpMap = new THREE.TextureLoader().load('http://learningthreejs.com/data/2013-09-16-how-to-make-the-earth-in-webgl/demo/bower_components/threex.planets/images/earthbump1k.jpg')
      material.bumpScale = 0.05

      var sphere = new THREE.Mesh(geometry, material)
      sphere.position.set(-1, 0, 0)
      // adding the clouds sphere
      /* TODO: too complicated at the moment
      var geometryC = new THREE.SphereGeometry(0.51, 32, 32)
      var materialC = new THREE.MeshPhongMaterial({
        map: new THREE.Texture(canvasCloud),
        side: THREE.DoubleSide,
        opacity: 0.8,
        transparent: true,
        depthWrite: false
      })
      var cloudMesh = new THREE.Mesh(geometryC, materialC)
      sphere.add(cloudMesh)
    */
      scene.add(sphere)
      camera.position.z = 2

      document.addEventListener('mousemove', onDocumentMouseMove, false)
      function onDocumentMouseMove (event) {
        mouseX = (event.clientX - window.innerWidth / 3) / 100
        mouseY = (event.clientY - window.innerHeight / 3) / 100
      }

      var animate = function () {
        requestAnimationFrame(animate)
        camera.position.x += (-mouseX - camera.position.x) * 0.005
        camera.position.y += (mouseY - camera.position.y) * 0.001
        sphere.rotation.x += 0.003
        sphere.rotation.y += 0.003

        renderer.render(scene, camera)
      }
      animate()
    },
    changeText () {
      this.cartoon = true
    }
  },
  mounted: function () {
    this.initGlobe()
  }
}
</script>
