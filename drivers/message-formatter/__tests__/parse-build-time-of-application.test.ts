import {
    parseBuildTimeOfBackOffice,
    parseBuildTimeOfTeacherLearnerWeb,
} from '../parse-build-time-of-application';
import path from 'path';

describe(parseBuildTimeOfBackOffice.name, () => {
    it('getting correct ms/s in log file', async () => {
        const result = await parseBuildTimeOfBackOffice(
            path.join(__dirname, './test-logs/cms.text')
        );

        expect(result).toEqual(39880); //39.88s.
    });
    it('dont panic app when reading a non-exist file', async () => {
        const result = await parseBuildTimeOfBackOffice(
            path.join(__dirname, './test-logs/non-exist-cms.text')
        );

        expect(result).toEqual(0);
    });
});
describe(parseBuildTimeOfTeacherLearnerWeb.name, () => {
    it('getting correct ms/s in teacher log file', async () => {
        const result = await parseBuildTimeOfTeacherLearnerWeb(
            path.join(__dirname, './test-logs/teacher.text')
        );
        expect(result).toEqual(71334); // 1,634ms + 69.7s
    });
    it('getting correct ms/s in learner log file', async () => {
        const result = await parseBuildTimeOfTeacherLearnerWeb(
            path.join(__dirname, './test-logs/learner.text')
        );
        expect(result).toEqual(78740); // 1,940ms + 76.8s
    });
});
