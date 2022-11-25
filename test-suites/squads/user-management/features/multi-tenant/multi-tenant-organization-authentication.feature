@cms
@user @user-multi-tenant @User_Authentication_MultiTenantAuthentication

Feature: Multi tenant organization authentication on CMS

    Scenario: "school admin" unable to login without entering ORG Name on "CMS"
        When "school admin" "Tenant S1" logins without tenant identifier on "CMS"
        Then "school admin" "Tenant S1" can not login on "CMS"

    Scenario Outline: "<accountType>" unable to login without entering ORG Name on "<platform>"
        Given school admin "Tenant S1" creates a new "<accountType>"
        When "<accountType>" "Tenant S1" logins without tenant identifier on "<platform>"
        Then "<accountType>" "Tenant S1" can not login on "<platform>"

        @learner
        Examples:
            | accountType | platform    |
            | student     | Learner App |
            | parent      | Learner App |
        @teacher
        Examples:
            | accountType | platform    |
            | teacher     | Teacher App |
            | teacher     | CMS         |

    Scenario: platform able to switching between ORG after logout on "CMS"
        When "school admin" "Tenant S1" logins with tenant on "CMS"
        And "school admin" "Tenant S1" switch to "Tenant S2" on "CMS"
        Then "school admin" "Tenant S2" logins "CMS" successfully
        And "school admin Tenant S2" sees student list and staff list display correctly

    Scenario Outline: "<accountType>" able to switching between ORG after logout on "<platform>"
        Given school admin "Tenant S1" creates a new "<accountType>"
        And school admin "Tenant S2" creates a new "<accountType>"
        When "<accountType>" "Tenant S1" logins with tenant on "<platform>"
        And "<accountType>" "Tenant S1" switch to "Tenant S2" on "<platform>"
        Then "<accountType>" "Tenant S2" logins "<platform>" successfully

        @learner
        Examples:
            | accountType | platform    |
            | student     | Learner App |
            | parent      | Learner App |

        @teacher
        Examples:
            | accountType | platform    |
            | teacher     | Teacher App |
            | teacher     | CMS         |