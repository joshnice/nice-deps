import { readdir } from "node:fs/promises";

export async function recursiveFileSearch(
	path: string,
	fileTypes: string[],
	skipDirs: string[] = [],
	validFiles: string[] = [],
): Promise<string[]> {
	const files = await readdir(path, { recursive: false, withFileTypes: true });

	for (const file of files) {
		if (file.isFile() && fileTypes.includes(getFileExtType(file.name))) {
			validFiles.push(`${file.parentPath}/${file.name}`);
		}

		if (file.isDirectory()) {
			if (!skipDirs.includes(file.name)) {
				const newPath = `${file.parentPath}/${file.name}`;
				await recursiveFileSearch(newPath, fileTypes, skipDirs, validFiles);
			}
		}
	}

	return validFiles;
}

function getFileExtType(fileName: string) {
	const spiltName = fileName.split(".");
	const fileExt = spiltName[spiltName.length - 1];
	return fileExt;
}
