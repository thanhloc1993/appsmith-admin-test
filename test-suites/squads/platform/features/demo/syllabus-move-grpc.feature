@cms @demo @ignore

Feature: Test move grpc to eureka

    Background:
        Given "school admin" logins CMS

    Scenario: Create content book eureka
        Given school admin has created a book via grpc eureka
        And school admin has created a chapter via grpc eureka

    Scenario: Create topic eureka
        Given school admin has created a book via grpc eureka
        And school admin has created a chapter via grpc eureka
        And school admin has created a topic via grpc eureka

    Scenario: Create LO eureka
        Given school admin has created a "chapter-topic" book via grpc eureka
        And school admin has created a LO via grpc eureka

    Scenario: Create quiz by upsertQuizV2 eureka
        Given school admin has created a "chapter-topic" book via grpc eureka
        And school admin has created a LO via grpc eureka
        And school admin has created quizes via grpc eureka

    Scenario Outline: Add book to course eureka
        Given school admin has created a new course without any location
        And school admin has created a "<book>" book
        When school admin adds the new created book for course
        Then school admin sees book and study plan is added to study plan in the course
        Examples:
            | book                       |
            | empty                      |
            | has chapter and topic only |
            | content                    |

    Scenario: Create assignment eureka
        Given school admin has created a "chapter-topic" book via grpc eureka
        And school admin has created a 'assignment' via grpc eureka

    Scenario: Create task assignment eureka
        Given school admin has created a "chapter-topic" book via grpc eureka
        And school admin has created a 'task assignment' via grpc eureka

    Scenario: Create quiz by single quiz eureka
        Given school admin has created a "chapter-topic" book via grpc eureka
        And school admin has created a LO via grpc eureka
        And school admin has created quiz by upsertSingleQuiz via grpc eureka