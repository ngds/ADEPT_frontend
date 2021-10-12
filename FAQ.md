# Frequently Asked Questions

## Table of Contents
1. [General Questions](#general-questions)
    1. [What is xDD](#what-is-xdd)?
    2. [What is Knowledge Base Construction](#what-is-knowledge-base-construction)?    
    3. [What is ADEPT](#what-is-adept)?
    4. [What is COSMOS](#what-is-cosmos)?
    5. [Who runs these projects](#who-runs-these-projects)?
    6. [Who pays for these projects](#who-pays-for-these-projects)?
2. [Is this resource right for my project](#is-this-resource-right-for-my-project)?
    1. [What are examples of prohibited uses](#what-are-examples-of-prohibited-uses)?
    2. [Hypothetical use cases](#hypothetical-use-cases)?  
3. [How to get started with xDD and ADEPT](#how-to-get-started-with-xdd-and-adept)?


## General Questions
### What is xDD?
The [xDD library of scientific articles](https://xdd.wisc.edu) is the largest set of documents available for *legal* automated [knowledge base construction](#knowledge-base-construction) in the world, hosting >14 million documents from across ~13 thousand journals (growing by ~8,000 new documents per day). For comparison, [the PubMed Central bulk data mining library](https://www.ncbi.nlm.nih.gov/pmc/tools/textmining/) contains 2.75 million minable full-text articles. While smaller datasets are adequate for proof-of-concept research meant to test the efficacy of different machine learning algorithms and techniques, attempts to build a scientifically-actionable dataset for applied research require a larger dataset with more comprehensive coverage of the scientific literature.

### What is Knowledge Base Construction?
Knowledge base construction (KBC) is the process of populating a knowledge base (i.e., a database) with facts extracted from data (e.g., text, audio, video, tables, diagrams, ...). For example, a scientist wishing to study the [distribution of stromatolites in the fossil record](#https://pubs.geoscienceworld.org/gsa/geology/article/45/6/487/207926/The-rise-and-fall-of-stromatolites-in-shallow) would need to compile a database of where stromatolite fossils have been reported around the world. The traditional way to build such a database would be the for the scientist to read through various scientific publications to find descriptions of stromatolite fossils and manually enter relevant findings into a database. 

[Automated knowledge base construction](https://dl.acm.org/doi/10.1145/3236386.3243045) is simply when a software application is used to achieve the same result programmatically. [xDD](#what-is-xdd) is specifically designed to provide machine-readable copies of scientific publications for such *automated* knowledge base construction. 

![Screenshot 2021-08-05 at 11 20 39 AM](https://user-images.githubusercontent.com/10422595/128401228-1b71c0c3-33d5-45f0-adb1-bb02d3a56771.png)

### What is ADEPT?
[ADEPT](https://xdd.wisc.edu/adept) (the **A**utomated **D**ata **E**xtraction **P**la**T**form) is a front-end, web-interface for interacting with data in the xDD library. It allows users to 1) browse available documents in the xDD library using full-text search terms (powered by [ElasticSearch](https://www.elastic.co) and other common search parameters (e.g., publication date, journal name); 2) save and track sets of documents associated with particular research projects; 3) and submit and deploy [KBC applications](#what-is-knowledge-base-construction) against the xDD library.  

### What is COSMOS?
COSMOS is an AI-powered technical assistant that extracts and assimilates data to algorithmically identify and extract tables, figures, and equations. COSMOS is independent of both the [xDD](#what-is-xdd) and [ADEPT](#what-is-adept) systems and its inclusion in a KBC application is completely optional. Most xDD applications do not use it at all. However, users that are specifically interested in analysing tables, figures, or equations  as part of their knowledge base construction applications may find it useful to integrate COSMOS into their workflow. For more information about COSMOS please visit https://cosmos.wisc.edu.

### Who runs these projects?
The xDD-ADEPT-COSMOS system is currently maintained by a joint partnership between the Department of Geoscience and Department of Computer Sciences at the University of Wisconsin-Madison. Requests to collaborate or other questions should be directed to the project leader at these organisations, Shanan E. Peters (contact@geodeepdive.org).

Other organisations have also contributed to various parts of the xDD-ADEPT-COSMOS system at various points in its development history: including the [Stanford AI Lab](https://ai.stanford.edu/), the [Geoinformatics Research Lab at the Arizona Geological Survey](https://azgs.arizona.edu/staff/andrew-zaffos), the [Wisconsin Institute for Discovery](https://wid.wisc.edu/), and the [Center for High-throughput Computing](https://chtc.cs.wisc.edu/).

### Who pays for these projects?
Project funding is currently or has been provided by the National Science Foundation, the U.S. Department of Energy, and the Defense Advanced Research Project Agency.

Importantly, users do not and will never have to pay to use [xDD](#what-is-xdd) or the [ADEPT](#what-is-adept) system. Access to high-throughput compute resources as part of the ADEPT system are also provided to users for free. 

## Is this resource right for my project?
[xDD](#what-is-xdd) is much larger than comparable data stacks because it has negotiated unique contractual agreements with the four largest publishers of scientific literature (Reed-Elsevier, Wiley-Blackwell, Springer, and Taylor & Francis) to allow free, bulk text-data mining on documents where this is normally prohibited. These controlled-access documents are in addition to xDD’s considerable open-source holdings such as documents from the United States Geological Survey.

The trade-off of including these controlled-access agreements is that xDD and its users must obey the following three constraints.

1. KBC applications using xDD documents ***may only be deployed within UW-Madison computing resources***. xDD provides access to these computing resources to users for free.
2. Users must use xDD for [non-commercial academic research](#what-kinds-of-research-can-be-done-with-xdd) and may not monetize the output of an xDD-[KBC application](#what-knowledge-base-construction).
3. Application output must be a machine-readable, derived product..

A full list of the Terms of Service for ADEPT and xDD can be viewed [here](https://github.com/ngds/ADEPT_frontend/blob/main/TOS.md#terms-of-service). As a general rule, however, projects that meet the above three criteria are likely permissable. Users with further questions about permissability are encouraged to reach out to xDD administrators directly (contact@geodeepdive.org).

### Hypothetical use-cases?
The following is a list of hypothetical scenarios where xDD would or would not be an appropriate partner for a research project. This list is not exhaustive, and a full list of the Terms of Service for ADEPT and xDD can be viewed [here](https://github.com/ngds/ADEPT_frontend/blob/main/TOS.md#terms-of-service). Users with further questions about permissability are encouraged to reach out to xDD administrators directly (contact@geodeepdive.org).

#### Prohibited Example 1
A user wishes to read a particular article and submits an xDD application that returns a human-readable, full-text copy of that article without performing any data analysis. (Violation of the derived-products only rule).

#### Prohibited Example 2
A user write a knowledge base construction application to create a database of the locations of precious minerals and ores with the intention to sell this database to mining companies. (Violation of the non-commercial only rule). 

#### Allowed Example 1
A user write a knowledge base construction application to create a database of the locations of precious minerals and ores and publishes this data freely under an open-access license as part of an academic publication. A mining company, unaffiliated with the original KBC researcher, then uses that data for commercial purposes.

### How to get started with xDD and ADEPT
Users interested in developing an xDD application are encouraged to visit the following resources. Users are also encouraged to reach out directly to the xDD administrators with questions (contact@geodeepdive.org).

1. Review the xDD [Terms of Service](https://github.com/ngds/ADEPT_frontend/blob/main/TOS.md#terms-of-service)
2. Register and account and login at https://xdd.wisc.edu/adept/#loginPanel
3. Instructions on how to [construct an xDD Application](https://github.com/ngds/xdd-docker-recipe/blob/master/README.md#objective)
4. Three examples of working applications created by xDD users.
    1. [An application for named entity recognition and disambiguation of toponyms in text.](https://github.com/ngds/geoparse-rerank/tree/add_cluter_disambig)
    2. [An application for identifying and extracting samples and geographic coordinates from text.](https://github.com/throughput-ec/UnacquiredSites)
    3. [An application for biomedical data extraction](https://github.com/clulab/reach/tree/frailty) 
