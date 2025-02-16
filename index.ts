import { readdir } from "node:fs/promises";
import { checkWorkspaceDeps } from "./src/check-workspace";
import { getPacakgeJson } from "./src/get-package-json";

const path = "../blog/";

export async function main() {
	const packageJSONRes = await getPacakgeJson(path);

	if (packageJSONRes == null) {
		return;
	}

	const workspacePaths = packageJSONRes.workspaces;

	if (workspacePaths == null) {
		// Do something
	} else {
		const validWorkspaces: string[] = [];

		for (const workspace of workspacePaths) {
			const spiltWorkspacePath = workspace.split("/");

			if (spiltWorkspacePath[spiltWorkspacePath.length - 1] === "*") {
				const workspacePath = spiltWorkspacePath
					.slice(0, spiltWorkspacePath.length - 1)
					.join("/");

				const wildcardWorkspacePath = `${path}${workspacePath}`;
				const dirs = await readdir(wildcardWorkspacePath, {
					recursive: false,
				});

				const dirPaths = dirs.map((dir) => `${wildcardWorkspacePath}/${dir}`);
				validWorkspaces.push(...dirPaths);
			} else {
				validWorkspaces.push(`${path}${workspace}`);
			}
		}

		for (const workspace of validWorkspaces) {
			await checkWorkspaceDeps(workspace);
		}
	}
}

main();
