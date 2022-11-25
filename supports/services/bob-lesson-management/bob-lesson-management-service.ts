import { toTimestampNewProto } from '../common/request';
import { callGRPC } from '../grpc/grpc';
import {
    CreateLessonRequest,
    CreateLessonResponse,
    CreateLessonSavingMethod,
    Material,
    Recurrence,
} from 'manabuf/bob/v1/lessons_pb';

export interface CreateLessonRequestData
    extends Omit<CreateLessonRequest.AsObject, 'startTime' | 'endTime'> {
    startTime?: Date;
    endTime?: Date;
}

export class LessonManagementService {
    private serviceName = 'bob.v1.LessonManagementService';

    private setCreateRequestData = async (
        request: CreateLessonRequest,
        requestData: CreateLessonRequestData
    ) => {
        if (requestData.startTime !== undefined) {
            request.setStartTime(toTimestampNewProto(requestData.startTime));
        } else {
            const sd = new Date();
            sd.setFullYear(sd.getFullYear() + 1);
            const startTime = toTimestampNewProto(sd);
            request.setStartTime(startTime);
        }

        if (requestData.endTime !== undefined) {
            request.setEndTime(toTimestampNewProto(requestData.endTime));
        } else {
            const ed = new Date();
            ed.setFullYear(ed.getFullYear() + 2);
            const endTime = toTimestampNewProto(ed);
            request.setEndTime(endTime);
        }

        request.setCenterId(requestData.centerId);
        request.setTeacherIdsList(requestData.teacherIdsList);
        request.setTeachingMedium(requestData.teachingMedium);
        request.setTeachingMethod(requestData.teachingMethod);

        // Set Student Info list
        const studentInfoListList = requestData.studentInfoListList.map((studentInfo) => {
            const studentInfoProto = new CreateLessonRequest.StudentInfo();
            studentInfoProto.setStudentId(studentInfo.studentId);
            studentInfoProto.setCourseId(studentInfo.courseId);
            studentInfoProto.setAttendanceStatus(studentInfo.attendanceStatus);

            return studentInfoProto;
        });
        request.setStudentInfoListList(studentInfoListList);

        // Set Materials list
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
