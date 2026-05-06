import fs from 'fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Since we are in node, this is tricky. Let's just use strings.
const buffer = fs.readFileSync('public/models/paddle.glb');
const str = buffer.toString('utf8');
// Just grab some names that might look like nodes
const names = str.match(/"name":"([^"]+)"/g);
if (names) {
    console.log([...new Set(names)].join('\n'));
} else {
    console.log("No names found or binary format is hiding them.");
}
