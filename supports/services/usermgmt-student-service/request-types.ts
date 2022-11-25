import { UserAddress } from '@supports/entities/user-profile-entity';
import { ArrayElement } from '@supports/types/cms-types';

import {
    CreateStudentRequest,
    UpdateStudentRequest,
    CreateParentsAndAssignToStudentRequest,
    UpdateParentsAndFamilyRelationshipRequest,
    UpsertStudentCoursePackageRequest,
} from 'manabuf/usermgmt/v2/users_pb';

declare namespace NsUsermgmtUserModifierService {
    export interface CreateStudentReq
        extends Omit<CreateStudentRequest.AsObject, 'userAddressesList'> {
        userAddressesList: UserAddress[];
    }
    export interface CreateStudentProfile extends CreateStudentRequest.StudentProfile.AsObject {}

    export interface UpdateStudentProfile extends UpdateStudentRequest.StudentProfile.AsObject {}

    export interface CreateParentProfile
        extends CreateParentsAndAssignToStudentRequest.ParentProfile.AsObject {}

    export interface UpdateParentProfile
        extends UpdateParentsAndFamilyRelationshipRequest.ParentProfile.AsObject {}

    export interface UpsertStudentPackageProfile
        extends UpsertStudentCoursePackageRequest.StudentPackageProfile.AsObject {}
    export interface UpsertStudentCoursePackageReq
        extends UpsertStudentCoursePackageRequest.AsObject {}

    export interface StudentPackage
        extends Omit<
            ArrayElement<UpsertStudentCoursePackageRequest.AsObject['studentPackageProfilesList']>,
            'locationIdsList' | 'studentPackageExtraList'
        > {
        locationId: string;
        classId?: string;
    }
    export interface UpsertStudentCoursePackagePayload {
        studentId: UpsertStudentCoursePackageReq['studentId'];
        studentPackages: StudentPackage[];
    }
}

export default NsUsermgmtUserModifierService;
