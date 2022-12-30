@cms @teacher
@communication
@support-chat @support-chat-filter

Feature: Search chat group by student name

    Background:
        Given "school admin" logins CMS
        And school admin has created a student "student S1" with "1 parents", "1 visible courses"
        And school admin has created a student "student S2" with "1 parents", "1 visible courses"
        And "teacher" logins Teacher App
        And "teacher" has filtered location in location settings on Teacher App with student locations
        And "teacher" is at the conversation screen on Teacher App
        And "teacher" joined "student S1" group chat and "parent P1" group chat successfully
        And "teacher" joined "student S2" group chat and "parent P2" group chat successfully

    Scenario Outline: Teacher searches chat groups by student "<type>" name, <messageType> message, <contactFilter> contact, <courses>
        Given teacher has sent message to "student S1"
        And teacher has sent message to "parent P2"
        And teacher has filled "<type>" of "<studentName>" in search bar on Teacher App
        And "teacher" has started filter conversation on Teacher App
        And teacher has selected message type "<messageType>"
        And teacher has selected contact filter "<contactFilter>"
        And "teacher" has selected "<courses>" filter
        When teacher applies above filters
        Then teacher sees all chat groups matches with the above filters
        Examples:
            | type      | studentName       | messageType | contactFilter | courses                                            |
            | empty     | empty             | all         | all           | all courses                                        |
            | full name | student S1's name | all         | all           | all courses                                        |
            | full name | student S2's name | all         | all           | all courses                                        |
            | empty     | empty             | not reply   | all           | all courses                                        |
            # | empty     | empty             | unread      | all           | all courses                                        |
            | empty     | empty             | all         | student       | all courses                                        |
            | empty     | empty             | all         | parent        | all courses                                        |
            | empty     | empty             | all         | all           | 1 of [Course C1, Course C2, Course C1 & Course C2] |

    @ignore
    # TODO: un-ignore when finish update elastic search when update student name
    Scenario Outline: Teacher searches chat groups by partial name of student "<student>"
        When school admin updates "<student>" with random name
        And "teacher" searches for partial name of "<student>" in search bar on Teacher App
        Then "teacher" sees both student & parent of "<student>" chat group on Teacher App
        Examples:
            | student    |
            | student S1 |
            | student S2 |

# Scenario Outline: Teacher filters chat groups by <messageType> message, <contactFilter> contact, <courseName> course
#     Given "school admin" has added "<courseName>" course to "<student>"
#     And "teacher" has sent message to "<userAccount>"
#     When "teacher" filters chat groups by message type "<messageType>"
#     And "teacher" filters chat groups by contact filter "<contactFilter>"
#     And "teacher" filters chat groups by course name "<courseName>"
#     Then "teacher" sees all chat groups matches with the above filter
#     Examples:
#         | courseName                         | student                     | userAccount                                                        | messageType            | contactFilter             |
#         | 1 of [unique name 1,unique name 2] | 1 of [student 1, student 2] | 1 of [student 1,student 2, student 1's parent, student 2's parent] | 1 of [All,Not Replied] | 1 of [All,Student,Parent] |

# Scenario Outline: Teacher filters chat groups by <messageType> message, <contactFilter> contact, multiple courses
#     Given "school admin" has added "<course>" course to "<student>"
#     And "teacher" has sent message to "<userAccount>"
#     When "teacher" filters chat groups by message type "<messageType>"
#     And "teacher" filters chat groups by contact filter "<contactFilter>"
#     And "teacher" filters chat groups by course name "<courseName>"
#     Then "teacher" sees all chat groups matches with the above filter
#     Examples:
#         | course                             | student                     | userAccount                                                        | messageType            | contactFilter             | courseName                      |
#         | 1 of [unique name 1,unique name 2] | 1 of [student 1, student 2] | 1 of [student 1,student 2, student 1's parent, student 2's parent] | 1 of [All,Not Replied] | 1 of [All,Student,Parent] | unique name 1 and unique name 2 |

# Scenario Outline: Teacher filters chat groups by <messageType> message, <contactFilter> contact, All courses
#     Given "school admin" has added "<courseName>" course to "<student>"
#     And "teacher" has sent message to "<userAccount>"
#     When "teacher" filters chat groups by message type "<messageType>"
#     And "teacher" filters chat groups by contact filter "<contactFilter>"
#     And "teacher" filters chat groups by all courses
#     Then "teacher" sees all chat groups matches with the above filter
#     Examples:
#         | courseName                         | student                     | userAccount                                                        | messageType            | contactFilter             |
#         | 1 of [unique name 1,unique name 2] | 1 of [student 1, student 2] | 1 of [student 1,student 2, student 1's parent, student 2's parent] | 1 of [All,Not Replied] | 1 of [All,Student,Parent] |

# Scenario Outline: Teacher searches chat groups by student "<type>", <messageType> message, <contactFilter> contact, 1 course
#     Given "school admin" has added "<courseName>" course to "<student>"
#     And "teacher" has sent message to "<userAccount>"
#     When "teacher" searches by "<type>" of "<studentName>" in search bar on Teacher App
#     And "teacher" filters chat groups by message type "<messageType>"
#     And "teacher" filters chat groups by contact filter "<contactFilter>"
#     And "teacher" filters chat groups by course name "<courseName>"
#     Then "teacher" sees all chat groups matches with the above filter
#     Examples:
#         | courseName                         | student                     | userAccount                                                        | type                           | studentName                           | messageType            | contactFilter             |
#         | 1 of [unique name 1,unique name 2] | 1 of [student 1, student 2] | 1 of [student 1,student 2, student 1's parent, student 2's parent] | 1 of [partial name, full name] | 1 of [student 1 name, student 2 name] | 1 of [All,Not Replied] | 1 of [All,Student,Parent] |

# Scenario Outline: Teacher searches chat groups by student "<type>", <messageType> message, <contactFilter> contact, multiple courses
#     Given "school admin" adds "<course>" course to "<student>"
#     And "teacher" has sent message to "<userAccount>"
#     When "teacher" searches for "<type>" of "<studentName>" in search bar on Teacher App
#     And "teacher" filters chat groups by message type "<messageType>"
#     And "teacher" filters chat groups by contact filter "<contactFilter>"
#     And "teacher" filters chat groups by course name "<courseName>"
#     Then "teacher" sees all chat groups matches with the above filter
#     Examples:
#         | course                             | student                     | userAccount                                                        | type                           | studentName                           | messageType            | contactFilter             | courseName                      |
#         | 1 of [unique name 1,unique name 2] | 1 of [student 1, student 2] | 1 of [student 1,student 2, student 1's parent, student 2's parent] | 1 of [partial name, full name] | 1 of [student 1 name, student 2 name] | 1 of [All,Not Replied] | 1 of [All,Student,Parent] | unique name 1 and unique name 2 |

# Scenario Outline: Teacher searches chat groups by student "<type>", <messageType> message, <contactFilter> contact, all courses
#     Given "school admin" adds "<courseName>" course to "<student>"
#     And "teacher" has sent message to "<userAccount>"
#     When "teacher" searches for "<type>" of "<studentName>" in search bar on Teacher App
#     And "teacher" filters chat groups by message type "<messageType>"
#     And "teacher" filters chat groups by contact filter "<contactFilter>"
#     And "teacher" filters chat groups by all courses
#     Then "teacher" sees all chat groups matches with the above filter
#     Examples:
#         | courseName                         | student                     | userAccount                                                        | type                           | studentName                           | messageType            | contactFilter             |
#         | 1 of [unique name 1,unique name 2] | 1 of [student 1, student 2] | 1 of [student 1,student 2, student 1's parent, student 2's parent] | 1 of [partial name, full name] | 1 of [student 1 name, student 2 name] | 1 of [All,Not Replied] | 1 of [All,Student,Parent] |

# @ignore
# Scenario Outline: Teacher sees <chatGroup> when teacher reset filter in <filterMethod>
#     Given "teacher" filters chat group by "<filterMethod>" on Teacher App
#     And result page is shown
#     When "teacher" selects "Reset All" filter
#     Then message type resets to All option on Teacher App
#     And contact filter resets to All option on Teacher App
#     And course filter resets to All option on Teacher App
#     And "<chatGroup>" is shown on Teacher App
#     Examples:
#         | filterMethod                  | chatGroup                                  |
#         | filter popup only             | All chat groups                            |
#         | both student name and filters | Chat groups match with search bar's inputs |