import { LearningMaterialType } from 'manabuf/syllabus/v1/enums_pb';
import { LearningMaterialBase } from 'manabuf/syllabus/v1/learning_material_pb';

export interface UpdateLearningMaterialBase
    extends Omit<LearningMaterialBase.AsObject, 'type' | 'topicId' | 'displayOrder'> {}
export interface InsertLearningMaterialBase
    extends Omit<LearningMaterialBase.AsObject, 'type' | 'learningMaterialId' | 'displayOrder'> {}

export interface ILearningMaterialBase
    extends Omit<LearningMaterialBase.AsObject, 'displayOrder' | 'type'> {
    typeForLM: keyof typeof LearningMaterialType;
}

export const createLearningMaterialBaseForInsert = (payload: InsertLearningMaterialBase) => {
    const { name, topicId } = payload;
    const lM = new LearningMaterialBase();

    lM.setTopicId(topicId);
    lM.setName(name);

    return lM;
};

export const createLearningMaterialBaseForUpdate = (payload: UpdateLearningMaterialBase) => {
    const { learningMaterialId, name } = payload;
    const lM = new LearningMaterialBase();

    lM.setLearningMaterialId(learningMaterialId);
    lM.setName(name);

    return lM;
};
