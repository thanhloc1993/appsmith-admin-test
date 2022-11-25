import { IGherkinDocument } from './types';
//@ts-ignore
import * as fs from 'fs-extra';
//@ts-ignore
import * as parser from 'gherkin-parse';
import glob from 'glob';
import path from 'path';

export function resolveFromCwd(pathname: string) {
    return path.resolve(process.cwd(), pathname);
}
export function readGlobFiles(globPattern: string, options?: glob.IOptions) {
    return glob.sync(globPattern, options);
}
export function loadFile(pathname: string) {
    return fs.readFileSync(pathname, { encoding: 'utf-8' });
}

export function loadGlobFiles(globPattern: string, options?: glob.IOptions) {
    const lineNumber = globPattern.match(/(:\d+)*$/g)?.[0] || ''; // get line number from glob pattern. EX: features/**/*.feature:3

    const files = readGlobFiles(globPattern.replace(lineNumber, ''), options);

    return files.map((file) => ({
        fullPath: file + lineNumber,
        content: parser.convertFeatureFileToJSON(file) as IGherkinDocument.RootObject,
    }));
}

export interface IGherkinExpression {
    path: string;
    gherkin: IGherkinDocument.RootObject;
}
export function parseGherkinExpression(featureFiles: string[]): IGherkinExpression[] {
    let result: IGherkinExpression[] = [];
    for (const featureFile of featureFiles) {
        const featureFilePath = featureFile.startsWith('/')
            ? featureFile
            : resolveFromCwd(featureFile);

        const contents = loadGlobFiles(featureFilePath);
        contents.forEach(({ fullPath, content }) => {
            result = [
                ...result,
                {
                    path: fullPath,
                    gherkin: content,
                },
            ];
        });
    }
    return result;
}
