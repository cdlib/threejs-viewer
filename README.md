# Three.js Object Viewer

Experiments with using [three.js](https://threejs.org) as an object viewer.

View at: [https://cdlib.github.io/threejs-viewer](https://cdlib.github.io/threejs-viewer)

**This repository is no longer used or maintained and is now archived.**

## Running It Yourself

Requires Node, npm.

### Installation

`npm install`

The glTF model demos require **.gltf** files in **./models** and referenced in **./js/models.json**.

#### Converting OBJ Files to GLTF

Obj files can be manually converted to Draco-compressed glTF files with the following process:

1. Create a folder at the root project level named **OBJ** and add .obj files there
2. Run `FILENAME=[obj filename] npm run togltf` where [obj filename] is the name of the obj file you want to convert in **./OBJ**

The converted glTF file including any associated texture and buffer files will be placed in **./models**.

### Development

`npm start`

### Building

`npm run build`

### Publishing

`npm run publish`

Requires [GitHub Pages](https://pages.github.com) to be configured.
