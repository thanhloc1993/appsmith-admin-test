import { User_Eibanam_GetTagsByUserTagTypesQuery } from '@supports/graphql/bob/bob-types';
import { ArrayElement } from '@supports/types/cms-types';

export type UserTag = ArrayElement<User_Eibanam_GetTagsByUserTagTypesQuery['user_tag']>;
export type UserTagLabel = 'Student Tag' | 'Parent Tag';

export type TypeOfUserTag =
    | 'student tag'
    | 'student discount tag'
    | 'parent tag'
    | 'parent discount tag'
    | 'student tag & student discount tag'
    | 'parent tag & parent discount tag';

export const UserTagTypeNames = ['Student', 'Parent', 'Student Discount', 'Parent Discount'];

export type StudentTagAction =
    | 'single student tag'
    | 'single student discount tag'
    | 'both student tag and student discount tag'
    | 'adding single student tag'
    | 'adding single student discount tag'
    | 'adding both student tag and student discount tag'
    | 'removing single student tag'
    | 'removing single student discount tag'
    | 'removing both student tag and student discount tag'
    | 'removing all tag';

export type ParentTagAction =
    | 'single parent tag'
    | 'single parent discount tag'
    | 'both parent tag and parent discount tag'
    | 'adding single parent tag'
    | 'adding single parent discount tag'
    | 'adding both parent tag and parent discount tag'
    | 'removing single parent tag'
    | 'removing single parent discount tag'
    | 'removing both parent tag and parent discount tag'
    | 'removing all tag';
