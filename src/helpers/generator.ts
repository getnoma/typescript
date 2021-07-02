import { default as jsonSchemaRefParser } from "@apidevtools/json-schema-ref-parser";
import fs from "fs";
import path from "path";
import { pluginLoader } from "./parser.js";

// TODO: Consider using arguments to select directories, such as "./" before ".noma" folder.
const YML_CONFIG = `.noma/default.yml`;
const TYPESCRIPT_FILE = `NomaConfig.d.ts`;

export async function configCreator(projectDirectory: string) {
	/// Resolve the paths from the project directory.
	const ymlConfigPath = path.resolve(projectDirectory, YML_CONFIG);
	const typescriptFilePath = path.resolve(projectDirectory, TYPESCRIPT_FILE);

	/// Load the yml as json from the specified YML config file path.
	const nomaConfig = await jsonSchemaRefParser.dereference(ymlConfigPath);

	/// Delete the file if it already exists, so it's ready to be overwritten.
	if (fs.existsSync(TYPESCRIPT_FILE)) {
		fs.unlinkSync(TYPESCRIPT_FILE);
	}

	/// Load the plugin file data, and filter any non-Typescript plugins.
	const mappedPlugins = (await pluginLoader(projectDirectory)).filter(({ filePath }) => fs.existsSync(filePath));
	const pluginParameters = mappedPlugins.map(({ name }) => `${name}: ${name}`).join(` ; `);
	const pluginTypeDeclarations = `${mappedPlugins.map(({ typeDeclaration }) => typeDeclaration)}`.replace(/,/g, ``);

	/// Create the Typescript declaration (.d.ts) file data.
	const mainFunction = `
export interface IMainFunction {
	(nomaConfig: { config: INomaConfig; ${pluginParameters} }): void;
}
						`;

	const stringifiedConfig = Object.keys(nomaConfig)
		.map((key) => {
			return JSON.stringify({
				[key]: nomaConfig[key as keyof typeof nomaConfig],
			});
		})
		.join(` & `);

	const fileData = `${pluginTypeDeclarations}
export type INomaConfig = ${stringifiedConfig}
        ${mainFunction}`;

	/// Write the file data to the specified Typescript declaration (.d.ts) file.
	fs.writeFileSync(typescriptFilePath, fileData);
}
