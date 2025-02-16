/**
 * @param packageName - "@upstash/redis/cloudflare"
 * @returns ["@upstash", "@upstash/redis", "@upstash/redis/cloudflare"]
 */
export function generatePackageNames(packageName: string) {
	const packageNameSpilt = packageName.split("/");
	const numberOfSlashes = packageNameSpilt.length;
	const names: string[] = [];
	for (let index = 0; index < numberOfSlashes; index += 1) {
		const name = packageNameSpilt.slice(0, index + 1);
		const joinedName = name.join("/");
		names.push(joinedName);
	}
	return names;
}
