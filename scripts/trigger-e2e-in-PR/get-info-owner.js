async function getInfoOwner({ github, context }) {
    let request = {
        owner: context.repo.owner,
        repo: context.repo.repo,
        pull_number: context.payload.number,
    };
    if (context.eventName == 'repository_dispatch') {
        console.log('payload', context.payload);
        const payload = context.payload.client_payload;
        request = {
            pull_number: payload.pull_number,
            owner: payload.owner,
            repo: payload.repo,
        };
    }
    console.log('request', request);
    const { data } = await github.rest.pulls.get(request);

    return {
        owner: request.owner,
        repo: request.repo,
        pullNumber: request.pull_number,
        body: data.body,
        branch: data.head.ref,
    };
}

module.exports = getInfoOwner;
