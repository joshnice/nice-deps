import { findPacakgeJson } from "./src/find-package-json";

export async function main() {
	const packageJSONRes = await findPacakgeJson();

	if (packageJSONRes == null) {
		return;
	}

	console.log("packageJSONRes", packageJSONRes);
}

main();
