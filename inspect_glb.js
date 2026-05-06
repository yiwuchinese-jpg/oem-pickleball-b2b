/* eslint-disable */
const fs = require('fs');
const { NodeIO } = require('@gltf-transform/core');

async function inspectGLB() {
  const io = new NodeIO();
  const document = await io.read('public/models/paddle.glb');
  const root = document.getRoot();
  
  console.log("Meshes:");
  root.listMeshes().forEach(mesh => console.log("- " + mesh.getName()));
  
  console.log("Nodes:");
  root.listNodes().forEach(node => console.log("- " + node.getName()));
}

inspectGLB().catch(console.error);