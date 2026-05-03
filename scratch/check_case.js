const fs = require('fs');
const path = require('path');

function checkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            checkDir(fullPath);
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const importRegex = /import\s+.*?from\s+['"](.*?)['"]/g;
            let match;
            while ((match = importRegex.exec(content)) !== null) {
                const importPath = match[1];
                if (importPath.startsWith('.')) {
                    const resolvedPath = path.resolve(dir, importPath);
                    try {
                        const dirName = path.dirname(resolvedPath);
                        const baseName = path.basename(resolvedPath);
                        if (!fs.existsSync(dirName)) continue;
                        
                        const actualFiles = fs.readdirSync(dirName);
                        const hasExt = importPath.endsWith('.js') || importPath.endsWith('.jsx') || importPath.endsWith('.css');
                        
                        let found = false;
                        for (const actual of actualFiles) {
                            if (hasExt) {
                                if (actual === baseName) { found = true; break; }
                            } else {
                                if (actual === baseName || actual === baseName + '.js' || actual === baseName + '.jsx' || actual === baseName + '/index.js' || actual === baseName + '/index.jsx') {
                                    found = true; break;
                                }
                            }
                        }
                        if (!found) {
                            let caseInsensitiveMatch = null;
                            for (const actual of actualFiles) {
                                if (hasExt) {
                                    if (actual.toLowerCase() === baseName.toLowerCase()) { caseInsensitiveMatch = actual; break; }
                                } else {
                                    if (actual.toLowerCase() === baseName.toLowerCase() || actual.toLowerCase() === (baseName + '.js').toLowerCase() || actual.toLowerCase() === (baseName + '.jsx').toLowerCase()) {
                                        caseInsensitiveMatch = actual; break;
                                    }
                                }
                            }
                            if (caseInsensitiveMatch) {
                                console.log(`[CASE ERROR] In ${fullPath}:\n  Imported: '${importPath}'\n  Actual File: '${caseInsensitiveMatch}'`);
                            }
                        }
                    } catch (e) { }
                }
            }
        }
    }
}

checkDir(path.resolve(__dirname, '../velora-frontend/src'));
console.log('Case check complete.');
