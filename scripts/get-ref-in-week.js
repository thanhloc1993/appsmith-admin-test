async function getRefInWeek({ context, core }) {
    const isSchedule = context.eventName === 'schedule';
    if (isSchedule) {
        const dayOfWeek = new Date().getDay();
        const isWeekend = dayOfWeek === 6 || dayOfWeek === 0; // 6 = Saturday, 0 = Sunday
        core.exportVariable('ENV', isWeekend ? 'uat' : 'staging');
    }

    return {
        EIBANAM_REF: process.env.EIBANAM_REF,
        ENV: process.env.ENV,
    };
}

module.exports = {
    getRefInWeek,
};
