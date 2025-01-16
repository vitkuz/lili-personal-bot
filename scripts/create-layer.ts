import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const LAYER_DIR = 'lambda-layer';
const NODEJS_DIR = path.join(LAYER_DIR, 'nodejs');

function createLayerStructure() {
    // Clean up existing directory
    if (fs.existsSync(LAYER_DIR)) {
        fs.rmSync(LAYER_DIR, { recursive: true });
    }

    // Create directory structure
    fs.mkdirSync(NODEJS_DIR, { recursive: true });

    // Copy package.json for layer
    fs.copyFileSync('package.json', path.join(NODEJS_DIR, 'package.json'));

    // Install dependencies
    execSync('npm install --omit=dev', {
        cwd: NODEJS_DIR,
        stdio: 'inherit'
    });

    // Copy shared modules
    // const sharedModules = [
    //     { src: 'src/config', dest: 'config' },
    //     { src: 'src/services', dest: 'services' },
    //     { src: 'src/types', dest: 'types' },
    //     { src: 'src/utils', dest: 'utils' }
    // ];
    //
    // sharedModules.forEach(({ src, dest }) => {
    //     const destPath = path.join(NODEJS_DIR, dest);
    //     fs.cpSync(src, destPath, { recursive: true });
    // });

    console.log('Lambda layer created successfully!');
}

createLayerStructure();