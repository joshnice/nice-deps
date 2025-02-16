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
			if (spiltWorkspacePath.some((pathEle) => pathEle === "*")) {
				console.log("workspace path contains wildcard", workspace);
			} else {
				validWorkspaces.push(workspace);
			}
		}

		for (const workspace of validWorkspaces) {
			await checkWorkspaceDeps(`${path}${workspace}`);
		}
	}
}

main();
