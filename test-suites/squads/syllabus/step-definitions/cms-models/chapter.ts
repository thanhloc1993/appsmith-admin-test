import { createRandomChapters } from '../syllabus-content-book-create-definitions';
import { ServiceReturn } from '../types/cms-types';

export type Chapter = ServiceReturn<typeof createRandomChapters>['chaptersList'][0];
