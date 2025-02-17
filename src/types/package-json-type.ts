export interface PackageJson {
	name: string;
	workspaces?: string[];
	scripts?: Record<string, string>;
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function isPackageJson(data: any): data is PackageJson {
	if (data == null) {
		return false;
	}

	const name = typeof data.name === "string";
	const workspaces =
		data.workspaces == null ||
		(Array.isArray(data.workspaces) &&
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			data.workspaces.every((workspace: any) => typeof workspace === "string"));
	const deps = data.dependencies == null || depValidation(data.dependencies);
	const devDeps =
		data.devDependencies == null || depValidation(data.devDependencies);
	const scripts = data.scripts == null || depValidation(data.scripts);

	return name && workspaces && deps && devDeps && scripts;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function depValidation(deps: any): boolean {
	if (typeof deps === "object") {
		return Object.entries(deps).every(
			([depName, depVersion]) =>
				typeof depName === "string" && typeof depVersion === "string",
		);
	}

	return false;
}
