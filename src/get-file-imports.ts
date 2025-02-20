import { readFile } from "node:fs/promises";
import { recursiveFileSearch } from "./node-helpers/recursive-file-search";

export async function getAllWorkspaceFileImportedPackages(
	workspacePath: string,
) {
	const filePaths = await recursiveFileSearch(
		workspacePath,
		["ts", "tsx"],
		["node_modules", "dist", ".wrangler"],
	);

	let foundPackages: string[] = [];
	for (const filePath of filePaths) {
		const filePackages = await getFileImports(filePath);
		foundPackages = filePackages.reduce((packages, packageName) => {
			// Check to see if package has already been found
			if (!packages.includes(packageName)) {
				packages.push(packageName);
			}
			return packages;
		}, foundPackages);
	}
	return foundPackages;
}

/**
 * Need to handle the following:
 * - import * as Sentry from "@sentry/react";
 * - import Gist from "super-react-gist";
 */
export async function getFileImports(filePath: string) {
	const file = await readFile(filePath, { encoding: "utf8" });
	const spiltFile = file.split(/\r?\n/);
	const importedPackages: string[] = [];
	let importStatement = false;
	for await (const line of spiltFile) {
		const trimmedLine = line.trim();

		if (importStatement) {
			if (trimmedLine.includes("from")) {
				const importName = getImportName(trimmedLine);
				if (importName != null) {
					importedPackages.push(importName);
					importStatement = false;
				}
			}
		} else {
			const trimmedLine = line.trim();
			const startOfLine = trimmedLine.slice(0, 7);
			if (startOfLine === "import ") {
				importStatement = true;
				const doesLineContainFromWithSingleQuote =
					trimmedLine.includes(" from '");
				const doesLineContainFromWithDoubleQuote =
					trimmedLine.includes(' from "');
				const doesLineContainFromWithBackTick = trimmedLine.includes(" from `");

				if (
					doesLineContainFromWithSingleQuote ||
					doesLineContainFromWithDoubleQuote ||
					doesLineContainFromWithBackTick
				) {
					const importName = getImportName(trimmedLine);
					if (importName != null) {
						importedPackages.push(importName);
					}
					importStatement = false;
				}
			}
		}
	}
	return importedPackages;
}

function getImportName(line: string) {
	const splitFromLine = line.split(" from ");
	const importName = splitFromLine.pop();
	if (importName != null) {
		const parsedImportName = importName
			.replaceAll("'", "")
			.replaceAll('"', "")
			.replaceAll("`", "")
			.replaceAll(";", "");

		const fileImport =
			parsedImportName.slice(0, 2) === "./" ||
			parsedImportName.slice(0, 3) === "../";

		return fileImport ? null : parsedImportName;
	}
	return null;
}
