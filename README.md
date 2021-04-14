# Automated Data Extraction PlaTform (ADEPT) Specification 1.0
This is a new design specification for the ADEPT front-end environment (web-page and forms).

## Required Functionality
We breakup the description of functionality into a list of specific [forms](#forms), [pages](#pages), [CyVerse](#cyverse) interactions, and general [broad-strokes requirements](#broad-strokes-requirements). In addition, some elements are TBD or have some other quirks that are discussed separate in the [special considerations](#special-considerations) section.

### Broad-Strokes Requirements

### Critical 
1. Joint administrative access for AZGS and UW teams
2. Basic web security features such as HTTPS and user Management
3. Thorough API documentation, xDD Application Template instructions, and examples of applications
4. Registration forms for both users, applications, and dictionaries
5. Application run-time status views
6. Containerized in case it needs to be transferred to UW hosting

### Optional or Uncertain
1. External links to UW services like COSMOS
3. Support for exporting informtion directly into a users CyVerse Account*
4. Linking ADEPT accounts to a CyVerse Account*
5. An RStudio implementation*

## Forms

### User Registration Form
Given the unique security requirements of ADEPT, there will need to be some vetting of users. The basic information we expect to be included in a registration form is given below in SQL format. Most items on this list are standard or intuitive. The only special case is the disclaimer. We will need some sort of disclaimer that outlines our security protocols, why they exist, and terms of use. We may want to approach UA or UW counsel for help with writing this language. For best coverage, we may want to display this disclaimer in multiple places.


````SQL
given text
surname text
institution text
email text
password text -- SHA1 of course
cyverse text -- Users, CyVerse Account information, see "special considerations section" for more information.
orcid text -- Maybe we use orcid as the login?
purpose text -- basically, what research project(s) they are looking to accomplish
disclaimer boolean
````

### ADEPT USER Management FUNCTIONS
 
User Types
1. Admin
2. Application Control(regular user)
3. Anonymous(doesn't create a log in)


Admin User Functions
1. User Management- add, edit, delete, change role.
2. Password reset- can reset passwords for users.
3. Group functions- user can create groups and add users to group 
4. Automatic approval of users when registered. 



We envision five capabilities for user accounts.

1. Browse
2. Test Set Request
3. Dictionary Request
4. BYOD (document upload) request
5. Application Request

### Dictionary Management Form
A list of terms that a user would like to have indexed by elastic search. While the basic submission is straightforward there are a few ways that might make it more user-friendly.

1. Allow the upload of a csv file
2. Provide some simple checks to notify users if there is already a similar dictionary in use
3. Let users edit existing dictionaries
4. Some sort of status-update tracker

https://xdd.wisc.edu/api/dictionaries?all -- To see a list of existing dictionaries
https://xdd.wisc.edu/api/dictionaries?dictionary=covid-19&show_terms=true -- To see a list of terms in a dictionary

There will have to be some communication between xDD and ADEPT to update key statuses. This may require a rework of the authentication system.

### API Key (Test Set) Request Form
I think that this can be completely automated. Users just specify a dictioanary and they will receive a key and a random sample of 1-200 documents for their project. For security and performance reasons we can cap users at 10 API keys at a time, but I think it would make development a lot less painful if people could just quickly generate test sets.

Upon giving the user a key, we can specify whether they want to do 1 of 3 actions with it.

1. Just save it to their ADEPT web app account (default)
2. Write the key to their CyVerse Data Store as a YAML or some other common config file format
3. Have all the data downloaded and stored in their CyVerse Data Store.

### Application Submission Form
TBD

## Pages

### Main-Search Page
We are currently envisioning the that the main search page will follow the basic structure of https://data.geothermaldata.org/ with xDD articles metadata represented as cards. This is the information that is returned from https://xdddev.chtc.io/api/v1/articles. 

A few special considerations for ADEPT compared to the data.geothermaldata (NGDS) template that we will be using are:
1. There is, as of yet, no reliable geolocation metadata for articles so the map utilities will not be needed at this time.
2. Users will probably want to search using more complex logic than just by term - i.e., using more of the /articles parameters. Currently the NGDS search page only provides one search field, so there will need to be a more complex search form.
3. We might want to change/enhance the "save" button from NGDS so that it literally stores the docid to the user's project? 
4. Because the metadata from xDD is authoratative there is no need for the metadata editing functions of NGDS.
5. Can the articles route support typeahead? It cannot currently.
6. Add support for facets (publishers, dictionaries, datasets, and journals) in xdd API. The /publishers route is already operational.

### Card Introspection Page
If a user wants to look further into an article's metadata they can click on the card. The metadata to be displayed here is relatively straightforward and also would come from the https://xdddev.chtc.io/api/v1/articles route.

We may also want to let users peruse the results of the https://xdddev.chtc.io/api/v1/snippets route and which keywords in a dictionary are found in that document (currently can be gotten through the /terms route - e.g., https://xdd.wisc.edu/api/terms?docid=54b43243e138239d868490ba&show_terms=true, but better methods are supposedly coming). Both of these options present some interesting UI design challenges because they would require users to add additional input such as the term they want to search for snippets or the dictionary of terms they want to have counted/indexed.

We could have a dropdown menu of dictionaries and use the dictionary terms in that article, and have those "terms" populate the "keywords"

### Account Information Page
A page where users can see the dictionaries they've submitted, the API Key's they've been granted, and the status of any other requests.

### API Documentation Pages
TBD

## CyVerse
We want to let users interact with their test-set data easily using pre-made RStudio and Jupyter Notebooks (a separate aspect of ADEPT from the front-end). We can automatically write/read/edit data in their CyVerse users directory using the CyVerse API (https://de.cyverse.org/terrain/docs/index.html#!/fileio/post_terrain_secured_fileio_upload). The read capability may be useful for us as well if we want BYOD documents to be uploaded through CyVerse in some way and *then* posted to UW.

## Special Considerations

### Who will host?
Ideally the AZGS will host ADEPT for the time-being, but it should be containerizable/ transferable so that it can be turned over to the UW team if they want to go in a different direction in the future or if AZGS is no longer able to support it.

### CyVerse Account Problem
An unresolved consideration is how ADEPT user registration will interact with CyVesre (if at all). On one hand, it would be excellent if we could leverage CyVerse OAuth capabilities (which do not exist yet, but I was told could be added) so that users have a single set of login credentials for both ADEPT and CyVerse. If that is not feasible, we can have users manually link their CyVerse accounts. This latter approach may be better anyway because it would allow us to maintain more control over users. The exact pros and cons of this will need to be worked out in detail with the CyVerse team in attendance.

### COSMOS vs. ADEPT
ADEPT is really meant to be about the app creation and queue pipeline moreso than the enhanced search functionalities of COSMOS. However, there is defintiely going to be some overalp. We should get a clearer specification document for COSMOS as well and look at the intersect/redundancy of features between the two.

## Additional Links
Tutotiral How to queue applications on CyVerse https://github.com/cyverse/terrain-notebook
A preliminary front-end made by the xdd team https://xdddev.chtc.io/results.html
