import { readdir } from "node:fs/promises";
import { getPacakgeJson } from "./get-package-json";
import { recursiveFileSearch } from "./node-helpers/recursive-file-search";

export async function checkWorkspaceDeps(workspacePath: string) {
	const packageJson = await getPacakgeJson(`./${workspacePath}/`);

	if (packageJson == null) {
		return;
	}

	const { name, workspaces, dependencies, devDependencies } = packageJson;

	if (workspaces != null) {
		throw new Error(
			`Package json ${name} has workpaces... shouldn't be using this function`,
		);
	}

	const allDeps = [
		Object.keys(dependencies ?? {}),
		Object.keys(devDependencies ?? {}),
	];

	const validFiles = await recursiveFileSearch(
		workspacePath,
		["ts", "tsx"],
		["node_modules", "dist"],
	);

	console.log("validFiles", validFiles);
}
