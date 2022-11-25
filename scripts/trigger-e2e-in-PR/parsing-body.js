const startString = '<-- Start eibanam trigger -->';
const endString = '<-- End eibanam trigger -->';

function findElementAndGetValue(arr, key) {
    const item = arr.find((e) => e.includes(key)) || '';
    const value = item.replace(`- ${key}:`, '').trim() || '';

    console.log(key, value); //to debug
    return value;
}

function getTagsInBody(body = '') {
    let tags = findElementAndGetValue(body, 'Tags').replace(/(`|'|")/g, '');

    return tags;
}

function getBranchInBody({ body = '', key, currentRepo, defaultRepo, branch }) {
    let inputBranch = findElementAndGetValue(body, key);
    if (!inputBranch && currentRepo === defaultRepo) {
        inputBranch = branch;
    }

    return inputBranch;
}

function getEibanamBlockInBody(body = '') {
    const startIndex = body.indexOf(startString) + startString.length;
    const endIndex = body.indexOf(endString);

    const eibanamBlockString = (
        body.substring(startIndex, endIndex).replace(/(\r)/gi, '').split('\n') || []
    ).filter((s) => s);
    return eibanamBlockString;
}

function parsingData(eibanamBlockString = '', repo, branch) {
    console.log('eibanamBlockString', eibanamBlockString);

    const tags = getTagsInBody(eibanamBlockString);
    const meRef = getBranchInBody({
        body: eibanamBlockString,
        key: 'ME ref',
        currentRepo: repo,
        defaultRepo: process.env.ME_REPO,
        branch,
    });
    const feRef = getBranchInBody({
        body: eibanamBlockString,
        key: 'FE ref',
        currentRepo: repo,
        defaultRepo: process.env.FE_REPO,
        branch,
    });
    const eibanamRef =
        getBranchInBody({
            body: eibanamBlockString,
            key: 'Eibanam ref',
            currentRepo: repo,
            defaultRepo: process.env.EIBANAM_REPO,
            branch,
        }) || 'develop';

    const featureFiles = findElementAndGetValue(eibanamBlockString, 'Feature files');
    const organization = findElementAndGetValue(eibanamBlockString, 'Organization') || 'manabie';
    const environment = findElementAndGetValue(eibanamBlockString, 'Environment') || 'staging';

    // new  syntax
    const args = findElementAndGetValue(eibanamBlockString, 'test:e2e');

    return {
        tags,
        featureFiles,
        organization,
        meRef,
        feRef,
        eibanamRef,
        environment,
        args,
    };
}

function parsingEibanamBlock(body = '', repo, branch) {
    const eibanamBlockString = getEibanamBlockInBody(body);
    return parsingData(eibanamBlockString, repo, branch);
}

module.exports = parsingEibanamBlock;
