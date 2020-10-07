# Automated Data Extraction PlaTform (ADEPT) Specification 1.0
This is a new design specification for the ADEPT front-end environment (web-page and forms).

## Required Functionality
We breakup the description of functionality into a list of specific [forms](#forms), [pages](#pages), and general [broad-strokes requirements](#broad-strokes-requirements). In addition, some elements are TBD or have some other quirks that are discussed separate in the [special considerations](#special-considerations) section.

### Broad-Strokes Requirements

### Critical 
1. Joint administrative access for AZGS and UW teams
2. Basic web security features such as HTTPS and user Management
3. Thorough API documentation, xDD Application Template instructions, and examples of applications
4. Registration forms for both users, applications, and dictionaries
5. Application run-time status views

### Optional or Uncertain
1. External links to UW services like COSMOS
3. Support for exporting informtion directly into a users CyVerse Account*
4. Linking ADEPT accounts to a CyVerse Account*
5. An RStudio implementation*

## Pages

### User Registration Form
Given the unique security requirements of ADEPT, there will need to be some vetting of users. The basic information we expect to be included in a registration form is given below in SQL format. Most items on this list are standard or intuitive. The only special case is the disclaimer. We will need some sort of disclaimer that outlines our security protocols, why they exist, and terms of use. We may want to approach UA or UW counsel for help with writing this language. For best coverage, we may want to display this disclaimer in multiple places.

````SQL
given text
surname text
institution text
email text
password text -- SHA1 of course
cyverse text -- Users, CyVerse Account information, see "special considerations section" for more information.
purpose text -- basically, what research project(s) they are looking to accomplish
disclaimer boolean
````

### Main-Search Page
We are currently envisioning the that the main search page will follow the basic structure of https://data.geothermaldata.org/ with xDD articles metadata represented as cards. This is the information that is returned from https://xdddev.chtc.io/api/v1/articles. 

A few special considerations for ADEPT compared to the data.geothermaldata (NGDS) template that we will be using are:
1. There is, as of yet, no reliable geolocation metadata for articles so the map utilities will not be needed at this time.
2. Users will probably want to search using more complex logic than just by term - i.e., using more of the /articles parameters. Currently the NGDS search page only provides one search field, so there will need to be a more complex search form.
3. We might want to change/enhance the "save" button from NGDS so that it literally stores the docid to the user's project?
4. Because the metadata from xDD is authoratative there is no need for the metadata editing functions of NGDS.

### Card Introspection
If a user wants to look further into an article's metadata they can click on the card. The metadata to be displayed here is relatively straightforward and also would come from the https://xdddev.chtc.io/api/v1/articles route.

We may also want to let users peruse the results of the https://xdddev.chtc.io/api/v1/snippets route and which keywords in a dictionary are found in that document (currently can be gotten through the /terms route - e.g., https://xdd.wisc.edu/api/terms?docid=54b43243e138239d868490ba&show_terms=true, but better methods are supposedly coming). Both of these options present some interesting UI design challenges because they would require users to add additional input such as the term they want to search for snippets or the dictionary of terms they want to have counted/indexed.

### Dictionary Management Form
A list of terms that a user would like to have indexed by elastic search. While the basic submission is straightforward there are a few ways that might make it more user-friendly.

1. Allow the upload of a .txt or csv file
2. Provide some simple checks to notify users if there is already a similar dictionary in use
3. Let users edit existing dictionaries
4. Some sort of status-update tracker

### Application Submission Form
TBD

### API Documentation Pages
TBD

## Special Considerations

### Who will host?
Ideally the AZGS will host ADEPT for the time-being, but it should be containerizable/ transferable so that it can be turned over to the UW team if:
1. They want to go in a different direction in the future.
2. AZGS is no longer able to support it.

### CyVerse Account Problem
An unresolved consideration is how ADEPT user registration will interact with CyVesre (if at all). On one hand, it would be excellent if we could leverage CyVerse OAuth capabilities (which do not exist yet, but I was told could be added) so that users have a single set of login credentials for both ADEPT and CyVerse. If that is not feasible, we can have users manually link their CyVerse accounts. This latter approach may be better anyway because it would allow us to maintain more control over users. The exact pros and cons of this will need to be worked out in detail with the CyVerse team in attendance.

### COSMOS vs. ADEPT
ADEPT is really meant to be about the app creation and queue pipeline moreso than the enhanced search functionalities of COSMOS. However, there is defintiely going to be some overalp. We should get a clearer specification document for COSMOS as well and look at the intersect/redundancy of features between the two.
