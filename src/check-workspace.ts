import { readdir } from "node:fs/promises";
import {
	generatePackageJsonPackageName,
	generateWorkspaceFileImportPackageNames,
} from "./generate-package-names";
import {
	getAllWorkspaceFileImportedPackages,
	getFileImports,
} from "./get-file-imports";
import { getPacakgeJson } from "./get-package-json";
import { recursiveFileSearch } from "./node-helpers/recursive-file-search";

export async function checkWorkspaceDeps(workspacePath: string) {
	const packageJson = await getPacakgeJson(`${workspacePath}`);

	if (packageJson == null) {
		return;
	}

	const { name, workspaces, dependencies, devDependencies, scripts } =
		packageJson;

	if (workspaces != null) {
		throw new Error(
			`Package json ${name} has workpaces... shouldn't be using this function`,
		);
	}

	const packagesInPackageJson = [
		...Object.keys(dependencies ?? {}),
		...Object.keys(devDependencies ?? {}),
	];

	const workspacePackages =
		await getAllWorkspaceFileImportedPackages(workspacePath);

	const missingPackagesFromFileImports = packagesInPackageJson.filter(
		(packageInPackageJson) =>
			!workspacePackages.some((workspacePackage) => {
				return generateWorkspaceFileImportPackageNames(workspacePackage).some(
					(name) =>
						generatePackageJsonPackageName(packageInPackageJson).includes(name),
				);
			}),
	);

	// Check package.json scripts
	const allScriptStrings = Object.values(scripts ?? {})
		.join(" ")
		.split(" ")
		.map((scriptString) => scriptString.replace('"', ""));

	const missingPacakgesFromPackageJsonScripts =
		missingPackagesFromFileImports.filter(
			(packageName) => !allScriptStrings.includes(packageName),
		);

	console.log("missingPackages", name, missingPacakgesFromPackageJsonScripts);
}
