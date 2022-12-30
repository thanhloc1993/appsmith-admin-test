@cms
@lesson
@lesson-location-settings-cms

Feature: School admin can apply location settings for future lesson list
    Background:
        Given "school admin" logins CMS
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "school admin" has gone to "future" lessons list page

    Scenario Outline: School admin can apply location settings for future lesson list
        Given "school admin" has chosen "5" rows per page in the first result page
        And "school admin" has gone to another result page
        When "school admin" opens location settings in nav bar on CMS
        And "school admin" applies "<type>" location which matches location of "future" lesson
        Then "school admin" is redirected to the first page of "future" lesson list page
        And "school admin" sees lesson which has location is included in selected location settings
        And "school admin" sees "<order>" location name under school admin's name
        And "school admin" still sees lessons per page is "5"
        Examples:
            | type                          | order                                                                                                                                               |
            | one child location of parent  | one child                                                                                                                                           |
            | all child locations of parent | one smallest id child location along with number of remained child                                                                                  |
            | one parent                    | one parent location and one smallest id child location along with number of remained child                                                          |
            | org                           | org and one smallest id parent location along with number of remained parent and one smallest id child location along with number of remained child |

    Scenario Outline: School admin sees full future lesson list when not applying any location in location settings
        Given "school admin" has opened location settings in nav bar on CMS
        And "school admin" has selected "<type>" location
        And "school admin" has cancelled applying location by "<option>"
        When "school admin" confirms to cancel applying location
        Then "school admin" sees full "future" lesson list
        And "school admin" does not see any location name under school admin's name
        Examples:
            | type                          | option                         |
            | one child location of parent  | 1 of [cancel button, X button] |
            | all child locations of parent | 1 of [cancel button, X button] |
            | one parent                    | 1 of [cancel button, X button] |
            | org                           | 1 of [cancel button, X button] |
