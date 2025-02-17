/**
 * @param packageName - "@upstash/redis/cloudflare"
 * @returns ["@upstash", "@upstash/redis", "@upstash/redis/cloudflare"]
 */
export function generateWorkspaceFileImportPackageNames(packageName: string) {
	const packageNameSpilt = packageName.split("/");
	const numberOfSlashes = packageNameSpilt.length;
	const names: string[] = [];
	for (let index = 0; index < numberOfSlashes; index += 1) {
		const name = packageNameSpilt.slice(0, index + 1);
		const joinedName = name.join("/");
		names.push(joinedName.toLowerCase());
	}
	return names;
}

export function generatePackageJsonPackageName(packageJsonDep: string) {
	const names = [packageJsonDep.toLowerCase()];

	if (packageJsonDep.includes("@types/")) {
		names.push(packageJsonDep.replace("@types/", "").toLowerCase());
	}

	return names;
}
