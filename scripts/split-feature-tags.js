/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
const path = require('path');

function chunkFunction(arr, chunk = 1) {
    const chunks = [],
        n = arr.length;
    let i = 0;
    while (i < n) {
        chunks.push(arr.slice(i, (i += chunk)));
    }

    return chunks;
}
function convertCronTime2ICTTime() {
    const cronTime = process.env.CRON_TIME;

    return cronTime;
}
function smallFeatureChunksViaInputGroup({ chunk = 1, organization, group, data }) {
    let results = [];

    let tagExpression = [];

    if (!data || !group.length) return { results, tagExpression };

    group.forEach((key) => {
        const { features, time, name } = data[key] || {};

        if (features) {
            const squad = name || key;

            tagExpression.push(key);

            const result = chunkFunction(features, chunk).map((chunks) => {
                const featureTagJoins = (chunks || []).map((e) => e.tag).join(' or ');
                return {
                    tagString: `@${squad} and (${featureTagJoins})`,
                    squad,
                    time,
                    organization: organization || 'manabie',
                    key,
                };
            });

            results = [...results, ...result];
        }
    });
    return { results, tagExpression };
}

function smallFeatureChunksViaCronTime({ chunk = 1, organization, cronTime, data }) {
    let results = [];

    let tagExpression = [];

    if (!data) return { results, tagExpression };

    Object.keys(data).forEach((key) => {
        const { features, time, name } = data[key] || {};
        if (cronTime && cronTime !== time) return; //if cronTime was enable it should be map with time set in squad-tags.json file

        const squad = name || key;

        tagExpression.push(key);

        const result = chunkFunction(features, chunk).map((chunks) => {
            const featureTagJoins = (chunks || []).map((e) => e.tag).join(' or ');
            return {
                tagString: `@${squad} and (${featureTagJoins})`,
                squad,
                time,
                organization: organization || 'manabie',
                key,
            };
        });
        results = [...results, ...result];
    });

    return { results, tagExpression };
}

function smallFeatureChunks({ chunk = 1, organization, pathFile, cronTime, group }) {
    if (!fs.existsSync(pathFile)) throw Error(`cannot found ${pathFile}`);

    const dataString = fs.readFileSync(pathFile, {
        encoding: 'utf-8',
    });
    const data = JSON.parse(dataString) || {};

    if (!cronTime && group && group?.length) {
        return smallFeatureChunksViaInputGroup({ chunk, organization, group, data });
    }

    return smallFeatureChunksViaCronTime({ chunk, organization, cronTime, data });
}

function splitFeatureTags({ chunk = 1 }) {
    if (process.env.TAGS) {
        return {
            tagExpression: process.env.TAGS,
            results: [
                {
                    tagString: process.env.TAGS,
                    squad: process.env.SQUADS,
                    organization: process.env.ORGANIZATION,
                },
            ],
        };
    }
    const cronTime = convertCronTime2ICTTime();
    const __dirname = process.cwd();

    const group = (process.env.GROUP || '').split(',');

    const { results: manabie, tagExpression: manabieTagExpression } = smallFeatureChunks({
        chunk,
        organization: 'manabie',
        pathFile: path.resolve(__dirname, 'test-suites/squads/squad-tags.json'),
        cronTime,
        group,
    });
    const { results: jprep, tagExpression: jprepTagExpression } = smallFeatureChunks({
        chunk,
        organization: 'jprep',
        pathFile: path.resolve(__dirname, `test-suites/squads/jprep-squad-tags.json`),
        cronTime,
        group,
    });

    return {
        results: [...manabie, ...jprep],
        tagExpression: [...manabieTagExpression, ...jprepTagExpression].join(', '),
    };
}

module.exports = {
    splitFeatureTags,
    smallFeatureChunks,
    convertCronTime2ICTTime,
};
