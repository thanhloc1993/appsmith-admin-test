import NsUsermgmtUserModifierService from './request-types';
import {
    CreateStudentRequest,
    UpdateStudentRequest,
    CreateParentsAndAssignToStudentRequest,
    UpdateParentsAndFamilyRelationshipRequest,
    UpsertStudentCoursePackageRequest,
    ReissueUserPasswordRequest,
    UserAddress,
    StudentPhoneNumber,
    StudentPackageExtra,
} from 'manabuf/usermgmt/v2/users_pb';
import { arrayHasItem } from 'step-definitions/utils';

export function createStudentReq({
    schoolId,
    studentProfile,
    userAddressesList,
}: NsUsermgmtUserModifierService.CreateStudentReq) {
    const request = new CreateStudentRequest();

    const studentProfileReq = studentGeneralInfoReq(studentProfile);
    const studentHomeAddress = studentHomeAddressReq(userAddressesList);

    request.setSchoolId(schoolId);
    request.setStudentProfile(studentProfileReq);
    request.setUserAddressesList(studentHomeAddress);

    return request;
}

export function studentGeneralInfoReq(payload: CreateStudentRequest.AsObject['studentProfile']) {
    const studentGeneralInfoReq = new CreateStudentRequest.StudentProfile();

    const {
        email,
        enrollmentStatus,
        grade,
        name,
        firstName,
        lastName,
        firstNamePhonetic,
        lastNamePhonetic,
        studentExternalId,
        studentNote,
        countryCode,
        password,
        phoneNumber,
        locationIdsList,
        enrollmentStatusStr,
        studentPhoneNumber,
        gradeId,
    } = payload!;

    const studentPhoneNumberReq = createStudentPhoneNumberReq(studentPhoneNumber);

    studentGeneralInfoReq.setName(name);
    studentGeneralInfoReq.setFirstName(firstName);
    studentGeneralInfoReq.setLastName(lastName);
    studentGeneralInfoReq.setFirstNamePhonetic(firstNamePhonetic);
    studentGeneralInfoReq.setLastNamePhonetic(lastNamePhonetic);
    studentGeneralInfoReq.setEmail(email);
    studentGeneralInfoReq.setPassword(password);
    studentGeneralInfoReq.setGrade(grade);
    studentGeneralInfoReq.setCountryCode(countryCode);
    studentGeneralInfoReq.setPhoneNumber(phoneNumber);
    studentGeneralInfoReq.setEnrollmentStatus(enrollmentStatus);
    studentGeneralInfoReq.setStudentExternalId(studentExternalId);
    studentGeneralInfoReq.setStudentNote(studentNote);
    studentGeneralInfoReq.setLocationIdsList(locationIdsList);
    studentGeneralInfoReq.setEnrollmentStatusStr(enrollmentStatusStr);
    studentGeneralInfoReq.setStudentPhoneNumber(studentPhoneNumberReq);
    studentGeneralInfoReq.setGradeId(gradeId);

    return studentGeneralInfoReq;
}

export function createStudentPhoneNumberReq(
    payload: NsUsermgmtUserModifierService.CreateStudentProfile['studentPhoneNumber']
) {
    const studentPhoneNumberReq = new StudentPhoneNumber();
    const studentPhoneNumber = (payload?.phoneNumber || '').trim();
    const studentHomePhoneNumber = (payload?.homePhoneNumber || '').trim();
    const contactPreference = payload?.contactPreference;

    studentPhoneNumberReq.setPhoneNumber(studentPhoneNumber);
    studentPhoneNumberReq.setHomePhoneNumber(studentHomePhoneNumber);
    studentPhoneNumberReq.setContactPreference(contactPreference || 0);

    return studentPhoneNumberReq;
}

export function studentHomeAddressReq(
    payload: NsUsermgmtUserModifierService.CreateStudentReq['userAddressesList']
) {
    const studentGeneralInfoReq = payload.map((address) => {
        const userAddressReq = new UserAddress();
        userAddressReq.setPostalCode(address.postalCode || '');
        userAddressReq.setPrefecture(address.prefecture?.id || '');
        userAddressReq.setCity(address.city || '');
        userAddressReq.setFirstStreet(address.firstStreet || '');
        userAddressReq.setSecondStreet(address.secondStreet || '');
        return userAddressReq;
    });
    return studentGeneralInfoReq;
}

export function updateStudentReq({ schoolId, studentProfile }: UpdateStudentRequest.AsObject) {
    const {
        id,
        email,
        enrollmentStatus,
        grade,
        name,
        firstName,
        lastName,
        firstNamePhonetic,
        lastNamePhonetic,
        studentExternalId,
        studentNote,
        enrollmentStatusStr,
    } = studentProfile!;

    const request = new UpdateStudentRequest();
    const studentProfileReq = new UpdateStudentRequest.StudentProfile();

    studentProfileReq.setId(id);
    studentProfileReq.setEmail(email);
    studentProfileReq.setEnrollmentStatus(enrollmentStatus);
    studentProfileReq.setGrade(grade);
    studentProfileReq.setName(name);
    studentProfileReq.setFirstName(firstName);
    studentProfileReq.setLastName(lastName);
    studentProfileReq.setFirstNamePhonetic(firstNamePhonetic);
    studentProfileReq.setLastNamePhonetic(lastNamePhonetic);
    studentProfileReq.setStudentExternalId(studentExternalId);
    studentProfileReq.setStudentNote(studentNote);
    studentProfileReq.setEnrollmentStatusStr(enrollmentStatusStr);

    request.setSchoolId(schoolId);
    request.setStudentProfile(studentProfileReq);

    return request;
}

export function createParentReq({
    schoolId,
    studentId,
    parentProfilesList,
}: CreateParentsAndAssignToStudentRequest.AsObject) {
    const req = new CreateParentsAndAssignToStudentRequest();

    req.setSchoolId(schoolId);

    req.setStudentId(studentId);

    if (arrayHasItem(parentProfilesList)) {
        req.setParentProfilesList(
            parentProfilesList.map((parent) => setCreateParentProfile(parent))
        );
    }

    return req;
}

export function updateParentReq({
    schoolId,
    studentId,
    parentProfilesList,
}: UpdateParentsAndFamilyRelationshipRequest.AsObject) {
    const req = new UpdateParentsAndFamilyRelationshipRequest();

    req.setSchoolId(schoolId);
    req.setStudentId(studentId);

    if (arrayHasItem(parentProfilesList)) {
        req.setParentProfilesList(
            parentProfilesList.map((parent) => setUpdateParentProfile(parent))
        );
    }

    return req;
}

export function upsertStudentCoursePackageReq(
    data: NsUsermgmtUserModifierService.UpsertStudentCoursePackagePayload
) {
    const { studentId, studentPackages } = data;
    const req = new UpsertStudentCoursePackageRequest();

    const reqStudentPackages = studentPackages.map((studentPackage) => {
        return setStudentPackageProfile(studentPackage);
    });

    req.setStudentId(studentId);

    req.setStudentPackageProfilesList(reqStudentPackages);
    return req;
}

export function reissuePasswordReq({ userId, newPassword }: ReissueUserPasswordRequest.AsObject) {
    const request = new ReissueUserPasswordRequest();
    request.setUserId(userId);
    request.setNewPassword(newPassword);

    return request;
}

const setCreateParentProfile = (
    parent: NsUsermgmtUserModifierService.CreateParentProfile
): CreateParentsAndAssignToStudentRequest.ParentProfile => {
    const parentProfile = new CreateParentsAndAssignToStudentRequest.ParentProfile();

    parentProfile.setName(parent.name);
    parentProfile.setEmail(parent.email);
    parentProfile.setPassword(parent.password);
    parentProfile.setPhoneNumber(parent.phoneNumber);
    parentProfile.setRelationship(parent.relationship);
    parentProfile.setCountryCode(parent.countryCode);

    return parentProfile;
};

const setUpdateParentProfile = (
    parent: NsUsermgmtUserModifierService.UpdateParentProfile
): UpdateParentsAndFamilyRelationshipRequest.ParentProfile => {
    const parentProfile = new UpdateParentsAndFamilyRelationshipRequest.ParentProfile();

    parentProfile.setId(parent.id);
    parentProfile.setEmail(parent.email);
    parentProfile.setRelationship(parent.relationship);

    return parentProfile;
};

const setStudentPackageProfile = (
    data: NsUsermgmtUserModifierService.StudentPackage
): UpsertStudentCoursePackageRequest.StudentPackageProfile => {
    const studentPackageProfile = new UpsertStudentCoursePackageRequest.StudentPackageProfile();

    if (data.studentPackageId) {
        studentPackageProfile.setStudentPackageId(data.studentPackageId);
    } else {
        studentPackageProfile.setCourseId(data.courseId);
    }

    studentPackageProfile.setStartTime(data.startTime);
    studentPackageProfile.setEndTime(data.endTime);

    const locationId = data.locationId;
    const classId = data?.classId || '';

    if (locationId) {
        const studentPackageExtra = new StudentPackageExtra();
        studentPackageExtra.setLocationId(locationId);
        studentPackageExtra.setClassId(classId);
        studentPackageProfile.setStudentPackageExtraList([studentPackageExtra]);
    }

    return studentPackageProfile;
};
