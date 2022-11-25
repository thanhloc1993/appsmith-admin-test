@cms
@lesson
@lesson-location-settings-cms

Feature: School admin can apply location settings in detailed future lesson page
    Background:
        Given "school admin" logins CMS
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "school admin" has gone to detailed lesson info page

    Scenario Outline: School admin can apply location settings in detailed future lesson page
        When "school admin" opens location settings in nav bar on CMS
        And "school admin" applies "<type>" location which matches location of "future" lesson
        And "school admin" confirms to apply location settings
        Then "school admin" is redirected to "future" lessons list page
        And "school admin" sees lesson which has location is included in selected location settings
        And "school admin" sees "<order>" location name under school admin's name
        Examples:
            | type                          | order                                                                                                                                               |
            | one child location of parent  | one child                                                                                                                                           |
            | all child locations of parent | one smallest id child location along with number of remained child                                                                                  |
            | one parent                    | one parent location and one smallest id child location along with number of remained child                                                          |
            | org                           | org and one smallest id parent location along with number of remained parent and one smallest id child location along with number of remained child |

    Scenario Outline: School admin can cancel to apply location settings in detailed future lesson page
        Given "school admin" has open location settings in nav bar on CMS
        And "school admin" has selected "<type>" location
        When "school admin" cancels confirming applying location settings by "<option>"
        Then "school admin" still sees location settings popup
        Examples:
            | type                          | option                         |
            | one child location of parent  | 1 of [cancel button, X button] |
            | all child locations of parent | 1 of [cancel button, X button] |
            | one parent                    | 1 of [cancel button, X button] |
            | org                           | 1 of [cancel button, X button] |
