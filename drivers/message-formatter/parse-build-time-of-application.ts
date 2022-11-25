import * as fs from 'fs';

export async function readLogFile(filePath: string, matchString: string[]) {
    if (!fs.existsSync(filePath)) {
        console.log('not found log file', filePath);
        return [];
    }

    const data = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });
    const result = data.split('\n').filter((line) => {
        if (!line) return undefined;
        return line && matchString.findIndex((str) => line.match(str)) >= 0;
    });

    return result;
}
function findSecondsOnSentence(sentence: string) {
    if (!sentence) return 0;

    const regex = /\d+(\.|,)\d+(ms|s)/g;
    const matches = sentence.match(regex);
    if (matches) {
        const match = matches[0].replace(/,/g, ''); // 1,900ms -> 1900ms

        if (match.match('ms')) return Number(match.replace(/ms/g, ''));

        return Number(match.replace(/s/g, ' ')) * 1000;
    }
    return 0;
}

export async function parseBuildTimeOfBackOffice(filePath: string) {
    const prefixMessage = `Done in `;
    const stdout = await readLogFile(filePath, [prefixMessage]);
    const buildTime = findSecondsOnSentence(stdout[0]);

    return buildTime;
}

export async function parseBuildTimeOfTeacherLearnerWeb(filePath: string) {
    const flutterPubGet = 'Running "flutter pub get" in manabie_';
    const compilingWeb = 'Compiling lib/main.dart for the Web...';
    const rows = await readLogFile(filePath, [flutterPubGet, compilingWeb]);

    if (!rows || !rows.length) return 0;

    let totalTime = 0;

    rows.forEach((row) => {
        if (!row) return;

        const time = findSecondsOnSentence(row);
        if (!time) return;
        totalTime += time;
    });

    return totalTime;
}
