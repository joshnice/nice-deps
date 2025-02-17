import { readdir } from "node:fs/promises";
import {
	generatePackageJsonDepName,
	generatePackageNames,
} from "./generate-package-names";
import { getFileImports } from "./get-file-imports";
import { getPacakgeJson } from "./get-package-json";
import { recursiveFileSearch } from "./node-helpers/recursive-file-search";

export async function checkWorkspaceDeps(workspacePath: string) {
	const packageJson = await getPacakgeJson(`${workspacePath}`);

	if (packageJson == null) {
		return;
	}

	const { name, workspaces, dependencies, devDependencies } = packageJson;

	if (workspaces != null) {
		throw new Error(
			`Package json ${name} has workpaces... shouldn't be using this function`,
		);
	}

	const packageJsonDeps = [
		...Object.keys(dependencies ?? {}),
		...Object.keys(devDependencies ?? {}),
	];

	const validFiles = await recursiveFileSearch(
		workspacePath,
		["ts", "tsx"],
		["node_modules", "dist", ".wrangler"],
	);

	const usedPackages: string[] = [];

	for (const file of validFiles) {
		const importedPackages = await getFileImports(file);
		// biome-ignore lint/complexity/noForEach: <explanation>
		importedPackages.forEach((packageName) => {
			if (!usedPackages.includes(packageName)) {
				usedPackages.push(packageName);
			}
		});
	}

	const missingPackages = packageJsonDeps.filter(
		(packageJsonDep) =>
			!usedPackages.some((usedPackage) => {
				return generatePackageNames(usedPackage).some((name) =>
					generatePackageJsonDepName(packageJsonDep).includes(name),
				);
			}),
	);

	console.log(name, missingPackages);
}
