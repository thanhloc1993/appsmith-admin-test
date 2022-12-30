@cms
@cms-syllabus-integration
@syllabus @assignment

Feature: [Integration] School admin creates assignment integration test
    Background:
        Given "school admin" logins CMS
        And school admin is at book page
        And school admin has created a "has chapter and topic only" book
        And school admin goes to book detail page
        And school admin goes to assignment create page

    #TCID:syl-0965,syl-0966,syl-0967,syl-0968,syl-0969
    Scenario Outline: School admin creates an assignment with <field>
        When school admin "creates" an assignment with "<field>"
        Then school admin sees message "You have created a new assignment successfully"
        And school admin sees "a new" assignment with "<field>" on CMS

        Examples:
            | field            |
            | description      |
            | no description   |
            | no require grade |
            | random settings  |
            | all settings     |

    #TCID:syl-0046,syl-0051,syl-0095,syl-0099,syl-0102
    Scenario Outline: School admin creates an assignment with upload <material>
        When school admin "creates" an assignment with upload "<material>"
        Then school admin sees message "You have created a new assignment successfully"
        And school admin sees "a new" assignment with material on CMS

        Examples:
            | material   |
            | file       |
            | brightcove |

    #TCID:syl-0964
    Scenario Outline:  School admin cannot create assignment with missing <field>
        When school admin "creates" an assignment with missing "<field>"
        Then school admin cannot "create" any assignment

        Examples:
            | field |
            | name  |
            | grade |
