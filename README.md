# arcadians-avatar-builder 🧙

## What's this?

This project will be embedded to the Arcadians v2 mint site. It shows an animated Arcadian and can play different animations and wear different parts

## Features:

- This takes in a GLTF file that contains the mesh of an animated Arcadian. 
- The parts of the Arcadian can be mixed and matched
- Predefined animations can be exported to a PNG sprite sheet
- Front end HTML code can call the functions in the JS code to change parts and animations

## Getting started

- Clone the repository
- Run any http server on the working directory (i.e. `http-server`)
- Open http://localhost:8080

## Config file

- [`config.js`](src/config.js) has been provided as a starting point that contains the v1 Arcadians data
- It contains settings on the following:
    - exporting the sprite sheet
    - list of gltf files, materials and animations
    - list of parts
- The config file contains documentation comments on the important sections

## Avatar Canvas Game Lego

- [`avatarCanvas.js`](src/avatarCanvas.js) is a reusable game lego for drawing and playing animations from the exported sprite sheet
- [Demo page](test-avatar-canvas.html) has been provided as a sample how to use this class
