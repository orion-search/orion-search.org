### What can I do with Orion?

Orion is a research measurement and discovery tool that enables you to monitor progress in science, visually explore the scientific landscape and search for relevant publications.

With Orion, you can find a country with an interesting research profile in the **Metrics** page, explore and filter your selection of publications in the **Explore Papers** page and learn more about them on the **Search** page.

### Who is Orion for?

Orion is designed for researchers and those working in policy. This deployment of Orion is for those who would like to explore the life sciences’ scientific landscape.

### What is the difference between Orion and other academic search engines?

Typical search engines offer limited tools to the users to tailor their inquiries, assuming that users know what they are looking for. However, with thousands of new papers published every day, there are obvious gaps in researchers' knowledge that they cannot fill because they do not know what to search for. With traditional text-based search engines it is difficult to search for the unknown unknowns.

Orion is not just a search engine. **It is an easily deployable tool that enables you to craft and navigate domain-specific, information-rich scientific databases.** Our aim with Orion is to introduce users to the richness of the scientific literature and provide them the tools, namely interactive data visualisations and smart search engines, to narrow the search space and find the academic papers they want to read.

### What data do you use in Orion?

We collect academic publications from [Microsoft Academic Graph](https://www.microsoft.com/en-us/research/project/academic-knowledge/) (MAG). MAG is a heterogeneous graph containing scientific publication records, citation relationships between those publications, as well as authors, institutions, journals, conferences, and fields of study. It contains more than 235M documents covering every academic discipline. We also enrich MAG with metadata from other sources; we geocode institutional affiliations and infer authors’ gender with [Google Places API](https://developers.google.com/places/web-service/details) and [GenderAPI](https://gender-api.com/) respectively.

### How do you collect data from Microsoft Academic Graph?

Orion can collect academic documents by querying MAG with conferences, journals or fields of study. Using this Orion deployment as an example, we queried MAG with a journal name, _bioRxiv_, to collect all of the papers published on its platform. In another use case, we collected all of the papers on MAG containing one of the following Fields of Study; _misinformation, disinformation_ and _fake news._

### How often do you update the data in Orion?

We follow Microsoft Academic Graph’s update cycles. This means that Orion’s database, metrics and visualisations are updated fortnightly.

<!-- ### How many papers are in Orion?

This deployment of Orion indexes bioRxiv which currently amounts to 79,984 papers. -->

### What do you mean by _this deployment of Orion_?

We aim for Orion to be a flexible and modular tool that can be configured to work with different thematic topics and levels of analysis. Users with technical expertise can tailor the backend by adding or removing components according to their needs.

With this in mind, **this deployment of Orion** indexes bioRxiv preprints and features the metrics and design choices we made. **Your deployment of Orion** could differ. Do you prefer a different approach to measure research diversity? It’s straightforward to plug your preferred method. Are you interested in all of the Artificial Intelligence literature instead of life sciences preprints? You can change that too.

### How do I search in Orion and how do you rank the results?

Orion combines a **semantic search model** with a traditional **keyword search engine**. Users can query Orion with anything from a keyword or phrase (for example, _gene editing_) to entire paragraphs of text and Orion's ML-powered search engine will find semantically similar academic publications.

For keyword-based searches, Orion uses [Elasticsearch](https://www.elastic.co/elasticsearch/) which performs a full-text search that finds exact or similar matches to the query. For the semantic search model, we used machine learning to find a numerical representation of the users’ query and search for its closest matches in a high-dimensional, academic publication space. In detail, we used a [sentence-level DistilBERT](https://github.com/UKPLab/sentence-transformers) model to infer a document vector for every paper in Orion and [Faiss](https://github.com/facebookresearch/faiss) to index them. For a new query, we use the same the sentence-level DistilBERT to infer its numerical representation and find its closest matches with the pre-built Faiss index.

This flexibility can be powerful; researchers can query Orion with an abstract of their previous work while policymakers could use a news article or the executive the summary of a white paper.

### What are the points in the Explore papers page?

The **Explore Papers** page provides a helicopter view of all the academic publications indexed in this deployment of Orion. Every particle is a paper and the distance between them signifies their semantic similarity; the closer two particles are, the more semantically similar.

To create this visualisation, we inferred a 768-dimensional vector for each paper using a [sentence-level DistilBERT](https://github.com/UKPLab/sentence-transformers) model and then used [UMAP](https://umap-learn.readthedocs.io/en/latest/), a dimensionality reduction method, to project them to 3D.

### How can I use the Explore papers page?

Orion’s **Explore Papers** page was designed for visual exploration and discovery. Users are exposed to the full body of knowledge and can interactively modify their search by filtering the three dimensional space by country, topic and time period. Then, they can select a subset of papers and learn more about them. This exploratory process might lead to dead ends, papers that are not exactly what they needed. That’s fine, users can always revert back to the Explore papers page and further refine their search.

### How can I use the Metrics page?

Orion's **Metrics** page enables you to compare how countries perform on particular topics or examine a country's research profile. It currently shows three metrics; research diversity, gender diversity and countries' comparative advantage. Using the Metrics page, users can answer questions such as _how interdisciplinary was research in 2019 in Sweden in the topics with the highest share of papers with female co-authors?_

After spotting interesting countries, topics and years, you can explore that setting in the **Explore Papers** page.

### What is the comparative advantage and how do you measure it?

The [Revealed Comparative Advantage](https://en.wikipedia.org/wiki/Revealed_comparative_advantage) (RCA) is an index used to quantify the relative advantage or disadvantage of a country at a certain class of products or services. Economists usually use it with trade data. In Orion, we measure the specialisation of a country on a particular topic by summing its number of citations on it. For a certain topic, a country with an RCA value above 1 is considered relatively specialised in it, while those with an RCA value below 1 are said to have a comparative disadvantage in it.

### How do you measure gender diversity?

We remove any authors without a complete first name and infer their gender using GenderAPI, a name to gender inference system. Then, we remove matches with a low accuracy and link the rest with the country of their institutional affiliation. We then find the share of female co-authors in the remaining papers and average them to measure the country-level gender diversity in research.

We should highlight that inferred genderisation assumes that gender identity is both a fixed and binary concept. This does not reflect reality as an individual might identify with a different gender from the one assigned at birth. Nevertheless, we decided to include this dimension in Orion since we believe it’s better to provide a partial view of this important issue than simply disregarding it.

### What is research diversity and how do you measure it?

In academic and policy-oriented discourse, research diversity (also called interdisciplinarity) is perceived as a driving force for research breakthroughs and economic growth. There are many definitions of it as well as ways to quantify it though. In Orion, we measure research diversity in a country by quantifying the pluralism in the thematic topics that have been used in academic publications. Specifically, we create country-level count vectors of the Fields of Study that have been used in papers and measure the ecology-inspired Shannon-Wiener index.

### Why did you opt for country-level comparisons?

We display country-level metrics mainly for two reasons:

- This deployment of Orion indexes bioRxiv papers and doing an author or affiliation-level longitudinal analysis to produce the **Metrics** was not possible due to small sample sizes.
- Working with country-level indicators enables us to provide more contextual information in the future such as official, country-level indicators on research, education and the economy from the World Bank.

### How did you create the topics?

We leveraged [MAG’s six-level hierarchy of Fields of Study](http://export.arxiv.org/pdf/1805.12216) to create a set of topics that are granular enough to make meaningful comparisons and broad enough to capture the diversity of the research areas in the data. We are currently aggregating low-level fields of study to their level one parent and use a mix of simple statistical measures to constraint the total number of topics while ensuring that every publication is covered by the selected themes. This resulted in 64 topics including Bioinformatics, Genomics, Neuroscience, Immunology and Machine learning.

### Can I contribute to Orion?

We would love to work with you! Orion is still in beta and you can help us improve it by reporting things that are not working properly or by suggesting new features. For example, are you familiar with a data source or an indicator that would make Orion better? Send us an [email](mailto:kostas@mozillafoundation.org)!

For those who would like to become contributors, Orion is open-source and we would be happy to work with you. Get in touch!

### What’s next?

Roadmap upcoming!
