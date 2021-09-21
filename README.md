# Automated Data Extraction PlaTform (ADEPT) Specification 1.2
This is the latest design specification for the ADEPT front-end environment (web-page and forms). This is meant to be an internal document for ADEPT administrators to keep track of desired functionality and the rationale behind it. For information on how to *use* the ADEPT system, please visit the separate [FAQ](FAQ.md) document.

### Major Goals 
- [x] Joint administrative access for AZGS and UW teams
- [x] Standard metadata websearch page (e.g., search by author, term, etc.)
- [x] Basic web security features such as HTTPS and user Management
- [x] xDD Application Template instructions, and examples of applications.
- [x] Registration workflow for new users, applications, and dictionaries
- [x] Ability to save searches and request test-sets
- [ ] Application run-time status views
- [x] Containerized for final transfer to xDD servers

### User Registration
New users will go to the LOGIN button on the main page (farthest right of top ribbbon. They will be presented with this user registration form below. The associated Terms of Service document can be found in [TOS.md](TOS.md). 

![Screenshot 2021-09-09 at 9 41 50 AM](https://user-images.githubusercontent.com/10422595/132727411-3ab70b88-9b03-4050-99d6-a4c1aa6d39f8.png)

Users are not automatically approved because of the unique security requirements of ADEPT. However, the application will [email xDD sysadmins with a notification](src/adept-routes.js) that a new user is awaiting review and approval. The Systems Administrator has unique access to the USERS tab when logging in, where they can see a list of users and set their status (`active` or `inactive`) and role (`admin` or `application`). 

Users with the `application` role can create [SAVED SETS](#saved-sets), [DICTIONARIES](#dictionaries), [TEST SETS](#test-sets), and [APPLICATIONS](#applications). Administrators have the same can capabilities as application users, but can also change user statuses, set roles, and reset passwords.

### Saved Sets
A user may save the results of one or more metadata searches as a SAVED SET. Saved Sets are created in the saved sets tab, then populated by saving searches and citations on the Search page. The search parameters in a saved set can be also be used to access the xDD API directly to access the same data directly from the source.

 The user builds these dataset collections by:

- [x] Select new, enter a new collection name and save. 
- [x] Return to the search tab, and select the new collection in the “Local Saved Set” list.
- [x] Define a search and press save to add it to the collection.
- [x] Additional single records can be added to the collection, by clicking on the Save Button that is at the top right of every record.
- [x] [Request that a test set be made](#test-sets) 

### Dictionary Tools
A list of terms that a user would like to have indexed by elastic search for quick, frequent returns. 

- [x] View all dictionaries made by xDD users *externally* to ADEPT
- [X] Users can upload *local* dictionaries within the ADEPT system
- [x] [Request that a test set be made](#test-sets)

### Test Sets
xDD must control access to its resources to ensure that they are used for legitimate scientific research in bulk text data-mining and that xDD is not used by bad-actors to circumnavigate normal licensing restrictions (i.e., to download PDFs that they would not normally have legal access to for purposes other than text data-mining). xDD fulfils this responsibility by ensuring that its full-text documents do not leave its servers.

An exception to this rule are test-sets that ADEPT users may use for local development of xDD APPLICATIONS. A test-set is a random sample of 200 documents from a SAVED SET that a user may download onto their local machines for development purposes. New test sets can be requested from the SAVED SETS or DICTIONARIES tab. Once approved by the xDD system, users can find a unique API-key and URL to to their requested test-set in the TEST SETS tab.

Current Parameters: 
+ Test-sets currently expire after 120 days
+ Requesting a new test-set with the same name will OVERWRITE the previous entry in the test-sets table one, not create a new entry
+ Submitting an application in relation to a test-set means to set the search parameters of the document pool to be identical to the test-set parameters
+ Users cannot combine dictionaries and saved sets to make test sets
+ Users cannot specify SET logic (includes, excludes, and, or, etc.) when defining a test set with eitehr dictionary or saved set tools.

### Applications


### Main-Search Page
User can search terms to the title, author, abstract, or keyword. 

![image](https://user-images.githubusercontent.com/6250117/116596911-d6cc1280-a8d9-11eb-8c19-a28c48c3844d.png)

Narrowing a Search

![image](https://user-images.githubusercontent.com/6250117/116597192-2579ac80-a8da-11eb-90c5-88024a7281d8.png)

* Optional Search Fields - Type in publication, title, DOI, DOCID, and Authors.
* Date Selection - Search for content published during a particular time frame
* Publishers - Search for Publishers
* Journals - Search for journals

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
