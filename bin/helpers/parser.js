import fs from "fs";
import path from "path";
const NOMA_PLUGIN_REGEX = /^((@noma\/(plugin-[a-z0-9-_.]+))|(@[a-z0-9-_.]+\/noma-plugin-[a-z0-9-_.]+)|(noma-plugin-[a-z0-9-_.]+))$/;
function resolvePackageDependencies(projectDirectory) {
    const packageJsonPath = path.resolve(projectDirectory, `package.json`);
    const packageJSON = JSON.parse(fs.readFileSync(packageJsonPath).toString(`utf-8`));
    return Object.keys(packageJSON.dependencies).filter((line) => NOMA_PLUGIN_REGEX.test(line));
}
export async function pluginLoader(projectDirectory) {
    /// Load the package dependencies from package.json and filter them, so only the noma plugins are left.
    const nomaPlugins = resolvePackageDependencies(projectDirectory);
    /// Extract the name, node_modules file path and full file path for each plugin.
    const mapped = await Promise.all(nomaPlugins.map(async (pluginName) => {
        const shortHandName = pluginName.replace(/^@[a-z0-9-_.]+\/(?:noma-)?plugin-([a-z0-9-_.]+)$/, "$1");
        const pluginDefinition = `${projectDirectory}\\node_modules\\${pluginName}\\src\\index`;
        const moduleImportPath = pluginDefinition.replace(/.*node_modules\\/, ``).replace(/\\/g, `/`);
        return {
            path: moduleImportPath,
            fullPath: pluginDefinition,
            pluginName,
            shortHandName,
        };
    }));
    /// Create the Typescript declaration (.d.ts) type and export the file path too.
    mapped.sort((current, next) => current.pluginName.localeCompare(next.pluginName));
    return mapped.map(({ path, shortHandName, fullPath: filePath }, i) => {
        const newLine = i === mapped.length - 1 ? `` : `\n`;
        return {
            name: shortHandName,
            typeDeclaration: `type ${shortHandName} = import("${path}").default${newLine}`,
            filePath: `${filePath}.d.ts`,
        };
    });
}
//# sourceMappingURL=parser.js.map