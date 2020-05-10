from sentence_transformers import SentenceTransformer
import scipy.spatial

embedder = SentenceTransformer("roberta-large-nli-mean-tokens")

# Corpus with example sentences
corpus = [
    "the particulars of the place where someone lives or an organization is situated.",
    "a formal speech delivered to an audience.",
    "write the name and address of the intended recipient on (an envelope, letter, or package).",
    "speak to (a person or an assembly), typically in a formal way.",
]
corpus_embeddings = embedder.encode(corpus, show_progress_bar=True)

# Query sentences:
queries = [
    "the details of where someone lives.",
    "speak to people in a formal way.",
    "Write the name and address of the receiver on something.",
    "Where I'm going.",
    "formal speech.",
]
query_embeddings = embedder.encode(queries, show_progress_bar=True)

# Find the closest 5 sentences of the corpus for each query sentence based on cosine similarity
for query, query_embedding in zip(queries, query_embeddings):
    distances = scipy.spatial.distance.cdist(
        [query_embedding], corpus_embeddings, "cosine"
    )[0]

    results = zip(range(len(distances)), distances)
    results = sorted(results, key=lambda x: x[1])

    print(
        """\n\n=================================\n\n
    Query: {0} \nMost similar sentences in corpus:""".format(
            query
        )
    )

    for idx, distance in results[0 : len(corpus)]:
        print(corpus[idx], "(Score: {:.2%})".format(1 - distance))
