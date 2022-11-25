export async function retryHelper(params: {
    action: () => Promise<void>;
    retryCount: number;
    errorAction?: () => Promise<void>;
}) {
    const { action, retryCount, errorAction } = params;
    let tempTry = 0;
    while (tempTry < retryCount) {
        tempTry++;
        try {
            await action();
            tempTry = retryCount;
        } catch (e) {
            if (tempTry === retryCount - 1) {
                throw e;
            } else {
                if (errorAction !== null && errorAction !== undefined) {
                    await errorAction();
                }
            }
        }
    }
}
