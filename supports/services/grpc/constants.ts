import { loadConfiguration } from 'configurations/load-environment';

export const gRPCEndpoint = loadConfiguration(process.env.ENV).GRPC_ENDPOINT;
// BOB service
export const upsertLOsEndpoint = `manabie.bob.Course/UpsertLOs`;
export const gradeMapEndpoint = 'manabie.bob.Course/RetrieveGradeMap';
export const getLowestLocationsEnpoint = `bob.v1.MasterDataReaderService/RetrieveLocations`;

// Yasuo service
export const getBrightcoveVideoInfoEndpoint = 'yasuo.v1.BrightcoveService/GetBrightcoveVideoInfo';
export const finishUploadBrightCoveEndpoint = 'manabie.yasuo.CourseService/FinishUploadBrightCove';
export const createBrightCoveUploadUrlEndpoint =
    'manabie.yasuo.CourseService/CreateBrightCoveUploadUrl';
export const upsertQuizEndpoint = `manabie.yasuo.CourseService/UpsertQuiz`;

// Eureka
export const updateDisplayOrderLOsAndAssignmentEndpoint =
    'eureka.v1.CourseModifierService/UpdateDisplayOrdersOfLOsAndAssignments';
