import { readFile, readdir } from "node:fs/promises";
import { isPackageJson } from "./types/package-json-type";

const packageJSONName = "package.json";

export async function findPacakgeJson() {
	const files = await readdir("./");
	const packjsonFile = files.find((file) => file === packageJSONName);

	if (packjsonFile == null) {
		console.info("Package json can't be found");
		return null;
	}

	const packageJSONFile = await readFile(`./${packageJSONName}`, {
		encoding: "utf8",
	});

	const parsedFile = JSON.parse(packageJSONFile);

	return isPackageJson(parsedFile) ? parsedFile : null;
}
