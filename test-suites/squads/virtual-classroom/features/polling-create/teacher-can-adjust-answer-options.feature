@cms @teacher @learner
@virtual-classroom
@virtual-classroom-polling-create

Feature: Teacher can adjust polling answer options while setting up polling
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson management with start date&time is more than 10 minutes from now
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher" has joined lesson of lesson management on Teacher App
        And "learner" has joined lesson on Learner App

    # Add more options: [default 4] 5-> 10 (case 4 has been covered)
    Scenario Outline: Teacher can add more polling options <addOptions> while setting up polling
        Given "teacher" has opened polling on Teacher App
        When "teacher" adds "<addOptions>" to polling answer options
        And "teacher" sees set up polling page with "<afterAddOptions>" options on Teacher App
        And "teacher" sets correct answer is "<correctOption>" option
        And "teacher" starts polling on Teacher App
        Then "teacher" is redirected to Stats page on Teacher App
        And "teacher" sees "active" polling icon on Teacher App
        And "student" sees answer bar with options "<afterAddOptions>" on Learner App
        Examples:
            | addOptions       | afterAddOptions              | correctOption |
            | E                | A, B, C, D, E                | E             |
            | E, F             | A, B, C, D, E, F             | F             |
            | E, F, G          | A, B, C, D, E, F, G          | G             |
            | E, F, G, H       | A, B, C, D, E, F, G, H       | H             |
            | E, F, G, H, I    | A, B, C, D, E, F, G, H, I    | I             |
            | E, F, G, H, I, J | A, B, C, D, E, F, G, H, I, J | J             |

    # Remove options: [default 4] 4 -> 2
    Scenario Outline: Teacher can remove polling options <removeOptions> while setting up polling
        Given "teacher" has opened polling on Teacher App
        When "teacher" removes "<removeOptions>" polling answer options
        And "teacher" sees set up polling page with "<afterRemoveOptions>" options on Teacher App
        And "teacher" sets correct answer is "<correctOption>" option
        And "teacher" starts polling on Teacher App
        Then "teacher" is redirected to Stats page on Teacher App
        And "teacher" sees "active" polling icon on Teacher App
        And "student" sees answer bar with options "<afterRemoveOptions>" on Learner App
        Examples:
            | removeOptions | afterRemoveOptions | correctOption |
            | D             | A, B, C            | C             |
            | D, C          | A, B               | B             |

    # Add more and then remove options: [default 4] add 5-> 10 and then remove 10 -> 2
    Scenario Outline: Teacher can add more options <addOptions> and then remove options <removeOptions> while setting up polling
        Given "teacher" has opened polling on Teacher App
        When "teacher" adds "<addOptions>" to polling answer options
        And "teacher" sees set up polling page with 4 default options and "<addOptions>" options on Teacher App
        And "teacher" removes "<removeOptions>" polling answer options
        And "teacher" sees set up polling page with "<afterRemoveOptions>" options on Teacher App
        And "teacher" sets correct answer is "<correctOption>" option
        And "teacher" starts polling on Teacher App
        Then "teacher" is redirected to Stats page on Teacher App
        And "teacher" sees "active" polling icon on Teacher App
        And "student" sees answer bar with options "<afterRemoveOptions>" on Learner App
        Examples:
            | addOptions       | removeOptions          | afterRemoveOptions | correctOption |
            | E, F, G, H, I, J | J, I, H, G, F ,E, D, C | A, B               | B             |

    # Remove and then add more options: [default 4] remove 4 -> 2 and then add 2 -> 10
    Scenario Outline: Teacher can remove options <removeOptions> and then add options <addOptions> while setting up polling
        Given "teacher" has opened polling on Teacher App
        When "teacher" removes "<removeOptions>" polling answer options
        And "teacher" sees set up polling page with "<afterRemoveOptions>" options on Teacher App
        And "teacher" adds "<addOptions>" to polling answer options
        And "teacher" sees set up polling page with "<afterAddOptions>" options on Teacher App
        And "teacher" sets correct answer is "<correctOption>" option
        And "teacher" starts polling on Teacher App
        Then "teacher" is redirected to Stats page on Teacher App
        And "teacher" sees "active" polling icon on Teacher App
        And "student" sees answer bar with options "<afterAddOptions>" on Learner App
        Examples:
            | removeOptions | afterRemoveOptions | addOptions             | afterAddOptions              | correctOption |
            | D, C          | A, B               | C, D, E, F, G, H, I, J | A, B, C, D, E, F, G, H, I, J | J             |
