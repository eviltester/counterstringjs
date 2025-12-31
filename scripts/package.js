const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const extensionDir = path.join(__dirname, '..', 'extension');
const buildDir = path.join(__dirname, '..', 'build');
const packageJson = require(path.join(__dirname, '..', 'package.json'));

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function copyExtensionFiles() {
    ensureDir(buildDir);
    
    function copyDirectory(src, dest) {
        const entries = fs.readdirSync(src, { withFileTypes: true });
        
        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);
            
            if (entry.isDirectory()) {
                fs.mkdirSync(destPath, { recursive: true });
                copyDirectory(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }
    
    copyDirectory(extensionDir, buildDir);
    console.log('Extension files copied to build/');
}

function createZipFile() {
    return new Promise((resolve, reject) => {
        const version = packageJson.version.replace(/\./g, '-');
        const zipFileName = `counterstringjs-${version}.zip`;
        const zipPath = path.join(__dirname, '..', 'releases', zipFileName);
        
        ensureDir(path.dirname(zipPath));

        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        output.on('close', () => {
            console.log(`Extension packaged: ${zipPath}`);
            console.log(`Total bytes: ${archive.pointer()}`);
            resolve(zipPath);
        });

        archive.on('error', (err) => {
            reject(err);
        });

        archive.pipe(output);
        archive.directory(buildDir, false);
        archive.finalize();
    });
}

async function package() {
    try {
        console.log('Packaging extension...');
        copyExtensionFiles();
        await createZipFile();
        console.log('Build complete!');
    } catch (error) {
        console.error('Error during packaging:', error);
        process.exit(1);
    }
}

package();
