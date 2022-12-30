import { toTimestampNewProto } from '@supports/services/common/request';
import { callGRPC } from '@supports/services/grpc/grpc';

import { Timestamp } from 'manabuf/google/protobuf/timestamp_pb';
import { CreateLessonSavingMethod } from 'manabuf/lessonmgmt/v1/enums_pb';
import {
    CreateLessonRequest,
    CreateLessonResponse,
    Recurrence,
    Material,
} from 'manabuf/lessonmgmt/v1/lessons_pb';

export interface CreateLessonRequestData
    extends Omit<CreateLessonRequest.AsObject, 'startTime' | 'endTime'> {
    startTime?: Date;
    endTime?: Date;
}

const parseLessonTime = (lessonTime: Date | undefined, timeType: 'start' | 'end'): Timestamp => {
    if (lessonTime) return toTimestampNewProto(lessonTime);

    const resultTime = new Date();
    const yearRange = timeType === 'start' ? 1 : 2;
    resultTime.setFullYear(resultTime.getFullYear() + yearRange);
    return toTimestampNewProto(resultTime);
};

export class LessonManagementService {
    private serviceName = 'lessonmgmt.v1.LessonModifierService';

    private setCreateRequestData = async (
        request: CreateLessonRequest,
        requestData: CreateLessonRequestData
    ) => {
        const startTime = parseLessonTime(requestData.startTime, 'start');
        const endTime = parseLessonTime(requestData.endTime, 'end');

        request.setStartTime(startTime);
        request.setEndTime(endTime);
        request.setCourseId(requestData.courseId);
        request.setClassId(requestData.classId);
        request.setTimeZone(requestData.timeZone);
        request.setLocationId(requestData.locationId);
        request.setTeacherIdsList(requestData.teacherIdsList);
        request.setTeachingMedium(requestData.teachingMedium);
        request.setTeachingMethod(requestData.teachingMethod);
        request.setSchedulingStatus(requestData.schedulingStatus);

        // Set Student Info list
        const studentInfoListList = requestData.studentInfoListList.map((studentInfo) => {
            const studentInfoProto = new CreateLessonRequest.StudentInfo();
            studentInfoProto.setStudentId(studentInfo.studentId);
            studentInfoProto.setCourseId(studentInfo.courseId);
            studentInfoProto.setLocationId(studentInfo.locationId);
            studentInfoProto.setAttendanceStatus(studentInfo.attendanceStatus);
            studentInfoProto.setAttendanceNote(studentInfo.attendanceNote);
            studentInfoProto.setAttendanceNotice(studentInfo.attendanceNotice);
            studentInfoProto.setAttendanceReason(studentInfo.attendanceReason);
            return studentInfoProto;
        });
        request.setStudentInfoListList(studentInfoListList);

        // Set Materials list`
        const materialsList = requestData.materialsList.map((material) => {
            const materialProto = new Material();
            materialProto.setMediaId(material.mediaId);
            return materialProto;
        });
        request.setMaterialsList(materialsList);

        // Set Saving option
        const savingOption = new CreateLessonRequest.SavingOption();
        const defaultSavingOption = CreateLessonSavingMethod.CREATE_LESSON_SAVING_METHOD_ONE_TIME;
        savingOption.setMethod(requestData.savingOption?.method || defaultSavingOption);

        const recurrence = new Recurrence();
        recurrence.setEndDate(toTimestampNewProto(requestData.savingOption?.recurrence?.endDate));
        savingOption.setRecurrence(recurrence);

        request.setSavingOption(savingOption);
    };

    async createLesson(
        token: string,
        requestData: CreateLessonRequestData
    ): Promise<{
        request: CreateLessonRequestData;
        response: CreateLessonResponse.AsObject | undefined;
    }> {
        const request = new CreateLessonRequest();
        await this.setCreateRequestData(request, requestData);
        const response = await callGRPC<CreateLessonRequest, CreateLessonResponse>({
            serviceName: this.serviceName,
            methodName: 'CreateLesson',
            request,
            token,
            requestType: CreateLessonRequest,
            responseType: CreateLessonResponse,
        });

        return {
            request: request.toObject(),
            response: response.message?.toObject(),
        };
    }
}
