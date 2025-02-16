import { readFile, readdir } from "node:fs/promises";
import { isPackageJson } from "./types/package-json-type";

const packageJSONName = "package.json";

export async function getPacakgeJson(path: string) {
	const files = await readdir(path);

	const packjsonFile = files.find((file) => file === packageJSONName);

	if (packjsonFile == null) {
		console.info(`Package json can't be found for path ${path}`);
		return null;
	}

	const packageJSONFile = await readFile(`${path}/${packageJSONName}`, {
		encoding: "utf8",
	});

	const parsedFile = JSON.parse(packageJSONFile);

	return isPackageJson(parsedFile) ? parsedFile : null;
}
