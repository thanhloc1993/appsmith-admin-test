@cms @cms2 @teacher @teacher2 @learner @learner2
@lesson
@lesson-multi-tenant
@staging

Feature: Create online future and online past lesson with multi-tenant

    Background:
        Given "school admin 1" of "Tenant S1" has logged in CMS
        And "school admin 2" of "Tenant S2" has logged in CMS
        And "teacher T1" of "Tenant S1" has logged in Teacher App
        And "teacher T2" of "Tenant S2" has logged in Teacher App
        And "student S1" of "Tenant S1" with course and enrolled status has logged Learner App
        And "student S2" of "Tenant S2" with course and enrolled status has logged Learner App

    Scenario Outline: Create online <type> lesson with multi-tenant
        When "school admin 1" of "Tenant S1" creates a "<type>" online "lesson L1" with "teacher T1"&"student S1" on CMS
        And "school admin 2" of "Tenant S2" creates a "<type>" online "lesson L2" with "teacher T2"&"student S2" on CMS
        Then "school admin 1" of "Tenant S1" sees newly "<type>" online "lesson L1" on CMS
        And "school admin 2" of "Tenant S2" sees newly "<type>" online "lesson L2" on CMS
        And "school admin 1" of "Tenant S1" does not see newly "<type>" online "lesson L2" on CMS
        And "school admin 2" of "Tenant S2" does not see newly "<type>" online "lesson L1" on CMS
        And "teacher T1" of "Tenant S1" sees newly "<type>" online "lesson L1" on Teacher App
        And "teacher T2" of "Tenant S2" sees newly "<type>" online "lesson L2" on Teacher App
        And "teacher T1" of "Tenant S1" does not see newly "<type>" online "lesson L2" on Teacher App
        And "teacher T2" of "Tenant S2" does not see newly "<type>" online "lesson L1" on Teacher App
        And "student S1" of "Tenant S1" sees newly "<type>" online "lesson L1" on Learner App
        And "student S2" of "Tenant S2" sees newly "<type>" online "lesson L2" on Learner App
        And "student S1" of "Tenant S1" does not see newly "<type>" online "lesson L2" on Learner App
        And "student S2" of "Tenant S2" does not see newly "<type>" online "lesson L1" on Learner App
        Examples:
            | type   |
            | future |
            | past   |
