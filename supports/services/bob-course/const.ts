import { convertEnumKeys } from '../../../step-definitions/utils';
import { LearningObjectiveType } from 'manabuf/common/v1/enums_pb';
import { AssignmentType } from 'manabuf/eureka/v1/enums_pb';

export const KeyLearningObjectiveType = convertEnumKeys(LearningObjectiveType);
export const KeyAssignmentType = convertEnumKeys(AssignmentType);
export { LearningObjectiveType };
