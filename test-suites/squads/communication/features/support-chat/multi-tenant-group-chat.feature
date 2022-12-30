@cms @cms2 @teacher @teacher2
@communication
@communication-multi-tenant

Feature: Multitenancy group chat

    Background:
        Given "school admin Tenant S1" has logged in with tenant on CMS
        And "school admin Tenant S2" has logged in with tenant on CMS
        And school admin "Tenant S1" creates a new student and parent info on "Tenant S1"
        And school admin "Tenant S2" creates a new student and parent info on "Tenant S2"
        And school admin "Tenant S1" creates a new "teacher" with tenant on CMS
        And school admin "Tenant S2" creates a new "teacher" with tenant on CMS
        And Teacher of tenant "Tenant S1" login on Teacher App
        And Teacher of tenant "Tenant S2" login on Teacher App

    Scenario Outline: Search group chat by name belong to Tenant
        And "teacher T1" is at Unjoined list
        And "teacher T2" is at Unjoined list
        When Teacher of tenant "<tenant>" search student name of tenant "<anotherTenant>" on Teacher App
        Then Teacher of tenant "<tenant>" "<action>" student & parent chat group of tenant "<anotherTenant>" on Teacher App
        Examples:
            | tenant    | anotherTenant | action       |
            | Tenant S1 | Tenant S1     | sees         |
            | Tenant S2 | Tenant S2     | sees         |
            | Tenant S1 | Tenant S2     | doesn't sees |
            | Tenant S2 | Tenant S1     | doesn't sees |

    @ignore
    Scenario: Teacher join all group chat
        When "teacher T1" join all group chat
        And "teacher T2" join all group chat
        Then "teacher T1" sees both student and parent group chat of "student S1" at tab Joined
        And "teacher T1" doesn't sees both student and parent group chat of "student S2" at tab Joined
        And "teacher T2" sees both student and parent group chat of "student S2" at tab Joined
        And "teacher T2" doesn't sees both student and parent group chat of "student S1" at tab Joined
