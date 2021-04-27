# Automated Data Extraction PlaTform (ADEPT) Specification 1.1
This is a new design specification for the ADEPT front-end environment (web-page and forms).

## Required Functionality
We breakup the description of functionality into a list of specific [forms](#forms), [pages](#pages), and general [broad-strokes requirements](#broad-strokes-requirements). 

### Broad-Strokes Requirements

### Critical 
1. Joint administrative access for AZGS and UW teams
2. Basic web security features such as HTTPS and user Management
3. Thorough API documentation, xDD Application Template instructions, and examples of applications
4. Registration forms for both users, applications, and dictionaries
5. Application run-time status views
6. Containerized for final transfer to xDD servers

### Optional or Uncertain
1. External links to UW services like COSMOS
2. Upload of custom datasets*

## Forms

### User Registration Form
Given the unique security requirements of ADEPT, there is some vetting of users. The basic information in the registration form is given below in SQL format.


````SQL
given text
surname text
email text
institution text
purpose text -- basically, what research project(s) they are looking to accomplish
password text -- SHA1 of course
disclaimer boolean
````

![image](https://user-images.githubusercontent.com/6250117/114731457-9f187480-9cf6-11eb-80cd-4f262b8bb78a.png)

Typical workflow is that a user fills out the registration form, the account will be inactive, admin will activate, optionally change roles to admin.

### ADEPT USER Management FUNCTIONS
 

| User Types | Description |
| --- | --- |
| Admin | Highest permission level |
| Application Control | Regular user access |
| Anonymous | View-only access |


Admin User Functions:
1. User Management- add, edit, delete, and change roles.
2. Password reset- can reset passwords for users.
3. Group functions- user can create groups and add users to group 
4. Automatic approval of users when registered.
5. Access to Test set Tools, Dictionary Tools, and Saved sets.
6. Able to browse records

Application User Functions:
1. Access to Test set Tools, Dictionary Tools, and Saved sets.
2. Able to browse records

Anonymous Functions:
1. Able to browse records


### Saved Sets

A user may save the results of one or more metadata searches as a SAVED SET. Saved Sets are created in the saved sets tab, then populated by saving searches and citations on the Search page. The search parameters in a saved set can be also be used to access the xDD API directly to access the same data directly from the source.

 The user builds these dataset collections by:

1. Select new, enter a new collection name and save. 
2. Return to the search tab, and select the new collection in the “Local Saved Set” list.
3. Define a search and press save to add it to the collection.
4. Additional single records can be added to the collection, by clicking on the Save Button that is at the top right of every record. 



### Dictionary Tools
A list of terms that a user would like to have indexed by elastic search. While the basic submission is straightforward there are a few ways that might make it more user-friendly.

Dictionaries can be system sourced dictionaries, which can be cached locally, or local, user defined dictionaries

1. Allow the upload of a csv file
2. Provide some simple checks to notify users if there is already a similar dictionary in use
3. Let users edit existing dictionaries
4. Some sort of status-update tracker

![image](https://user-images.githubusercontent.com/6250117/114928718-c56a0d00-9de7-11eb-81a6-13addd96ce4a.png)


https://xdd.wisc.edu/api/dictionaries?all -- To see a list of existing dictionaries

https://xdd.wisc.edu/api/dictionaries?dictionary=covid-19&show_terms=true -- To see a list of terms in a dictionary


### API Key (Test Set) Request Form

xDD must control access to its resources to ensure that they are used for legitimate scientific research in bulk text data-mining and that xDD is not used by bad-actors to circumnavigate normal licensing restrictions (i.e., to download PDFs that they would not normally have legal access to for purposes other than text data-mining). xDD fulfils this responsibility by ensuring that its full-text documents do not leave its servers.

An exception to this rule are test-sets that ADEPT users may use for local development of xDD APPLICATIONS. A test-set is a random sample of 200 documents from a SAVED SET that a user may download onto their local machines for development purposes. New test sets can be requested from the SAVED SETS or DICTIONARIES tab. Once approved by the xDD system, users can find a unique API-key and URL to to their requested test-set in the TEST SETS tab.

User must define the test sets and dictioanary associated that can be used in applications. These are XDD defined test sets.

Upon giving the user a key, we can specify whether they want to do 1 of 3 actions with it:

* DATE LIMIT OPTION - for static or current test sets
* GENERATE NEW SET from EXISTING with new key
* DELETE TEST SET - with deletion dates



### Application Submission Form

Definition of the programs, algorithms, code, that can be executed by a user.  

a list of the resources needed for the container( number of cores, if GPU will be involved and memory/storage requirements)

Application States - Submitted. Approved, Denied, running
Process States - Submitted, Registered, running, finished, canceled, error


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


