@cms @learner @parent
@communication
@compose-notification

Feature: Send notification for selected recipients
    Background:
        Given "school admin" logins CMS

    # @ignore
    # Scenario Outline: Send a notification to the <type> list in <course>, <grade>, <userEmail>
    #     Given school admin has created notification
    #     When school admin sends a notification to the "<type>" list in "<course>", "<grade>", "<userEmail>"
    #     Then matching recipients receive the notification
    #     Examples:
    #         | type                                       | course                                                         | grade                                                                    | userEmail                                            |
    #         | 1 of [student and parent, student, parent] | 1 of [All courses, Course C1, Course C2]                       | 1 of [All grade, student S1's grade]                                     | 1 of [empty, student S1's email, student S2's email] |
    #         | 1 of [student and parent, student, parent] | 1 of [All courses, Course C1, Course C2]                       | 1 of [All grade, student S1's grade]                                     | 1 of [student S1's email & student S2's email]       |
    #         | 1 of [student and parent, student, parent] | 1 of [All courses, Course C1, Course C2]                       | 1 of [student S1's grade & student S2's grade, All & student S2's grade] | 1 of [student S1's email & student S2's email]       |
    #         | 1 of [student and parent, student, parent] | 1 of [All courses, Course C1, Course C2]                       | 1 of [student S1's grade & student S2's grade, All & student S2's grade] | 1 of [empty, student S1's email, student S2's email] |
    #         | 1 of [student and parent, student, parent] | 1 of [Course C1 & Course C2, All & Course C1, All & Course C2] | 1 of [student S1's grade & student S2's grade, All & student S2's grade] | 1 of [empty, student S1's email, student S2's email] |
    #         | 1 of [student and parent, student, parent] | 1 of [Course C1 & Course C2, All & Course C1, All & Course C2] | 1 of [student S1's grade & student S2's grade, All & student S2's grade] | 1 of [student S1's email & student S2's email]       |
    #         | 1 of [student and parent, student, parent] | 1 of [Course C1 & Course C2, All & Course C1, All & Course C2] | 1 of [All grade, student S1's grade]                                     | 1 of [student S1's email & student S2's email]       |
    #         | 1 of [student and parent, student, parent] | 1 of [Course C1 & Course C2, All & Course C1, All & Course C2] | 1 of [All grade, student S1's grade]                                     | 1 of [empty, student S1's email, student S2's email] |

    Scenario Outline: Send notification to specific user in <type> list
        Given "school admin" is at "Notification" page on CMS
        When school admin has created "student S1" with created course "Course C1", grade and "parent P1, parent P2" info
        And school admin has created "student S2" with created course "Course C2", grade and "parent P3" info
        Then school admin sends a notification to the "<type>" list in "<userEmail>" that the recipients will received

        Examples:
            | type    | userEmail               |
            | Student | student S1              |
            | Student | student S2              |
            | Student | student S1 & student S2 |
            | Parent  | student S1              |
            | Parent  | student S2              |
            | Parent  | student S1 & student S2 |
            | All     | student S1              |
            | All     | student S2              |
            | All     | student S1 & student S2 |
