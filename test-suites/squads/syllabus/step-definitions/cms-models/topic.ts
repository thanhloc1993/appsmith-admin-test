import { createRandomTopics } from '../syllabus-content-book-create-definitions';
import { ServiceReturn } from '../types/cms-types';

export type Topic = ServiceReturn<typeof createRandomTopics>['topicsList'][0];
