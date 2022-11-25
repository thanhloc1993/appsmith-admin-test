import { generateInstanceTags, getSquadTags, isOnTrunk } from '../utils';

describe('isOnTrunk', () => {
    const OLD_ENV = process.env;

    afterAll(() => {
        process.env = OLD_ENV; // Restore old environment
    });

    it('isOnTrunk | return true when 3 refs on develop', () => {
        process.env = {
            EIBANAM_REF: 'develop',
            ME_REF: 'develop',
            FE_REF: 'develop',
        };
        expect(isOnTrunk()).toEqual(true);
    });
    it('isOnTrunk | return true when run on host', () => {
        process.env = {
            EIBANAM_REF: 'develop',
            ME_REF: '',
            FE_REF: '',
        };
        expect(isOnTrunk()).toEqual(true);
    });
    it('isOnTrunk | return false eibanam_ref != develop', () => {
        process.env = {
            EIBANAM_REF: 'feature',
            ME_REF: 'develop',
            FE_REF: 'develop',
        };
        expect(isOnTrunk()).toEqual(false);
    });
    it('isOnTrunk | return false me/fe != develop', () => {
        process.env = {
            EIBANAM_REF: 'develop',
            ME_REF: 'feature',
            FE_REF: 'feature',
        };
        expect(isOnTrunk()).toEqual(false);
    });
});
describe('getSquadTags', () => {
    it('getSquadTags | @syllabus', () => {
        expect(getSquadTags(['@syllabus'])).toEqual(['@syllabus']);
    });
    it('getSquadTags | syllabus', () => {
        expect(getSquadTags(['syllabus'])).toEqual(['@syllabus']);
    });
    it('getSquadTags | []', () => {
        expect(getSquadTags([])).toEqual([]);
    });
    it('getSquadTags | [""]', () => {
        expect(getSquadTags([''])).toEqual([]);
    });
});

describe('generateInstanceTags', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules();
    });
    afterAll(() => {
        process.env = OLD_ENV; // Restore old environment
    });

    it('generateInstanceTags | TAGS equal @course', () => {
        process.env = { ...OLD_ENV, TAGS: '@course' }; // Make a copy

        expect(generateInstanceTags()).toEqual(['@course']);
    });
    it('generateInstanceTags | TAGS equal @syllabus and @course', () => {
        process.env = { ...OLD_ENV, TAGS: '@syllabus and @course' }; // Make a copy

        expect(generateInstanceTags()).toEqual(['@syllabus', '@course']);
    });
    it('generateInstanceTags | TAGS equal @syllabus and (@course and @book)', () => {
        process.env = { ...OLD_ENV, TAGS: '@syllabus and (@course and @book)' }; // Make a copy

        expect(generateInstanceTags()).toEqual(['@syllabus', '@course', '@book']);
    });
});
