@cms @syllabus
@demo @ignore

Feature: Demo modify study plan items via grpc

    Scenario: Demo modify study plan items via grpc
        Given "school admin" logins CMS
        And school admin has created a "simple content 2 topic without quiz" book
        And school admin has created a new course without any location
        And school admin has created a matched studyplan