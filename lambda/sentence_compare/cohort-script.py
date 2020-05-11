from sentence_transformers import SentenceTransformer
import scipy.spatial
from typing import List

embedder = SentenceTransformer("roberta-large-nli-mean-tokens")

# Corpus with example sentences
corpus = [
    "the particulars of the place where someone lives or an organization is situated.",
    "a formal speech delivered to an audience.",
    "write the name and address of the intended recipient on (an envelope, letter, or package).",
    "speak to (a person or an assembly), typically in a formal way.",
]
corpus_embeddings = embedder.encode(corpus, show_progress_bar=True)

corpus2 = [
    "an object or group of objects wrapped in paper or packed in a box.",
    "a set of proposals or terms offered or agreed as a whole.",
    "put into a box or wrapping for sale or transport.",
    "present (someone or something) in an attractive or advantageous way.",
]
corpus2_embeddings = embedder.encode(corpus, show_progress_bar=True)

# Query sentences:
queries = [
    "speak to people in a formal way.",
    # "Where I'm going.",
]
query_embeddings = embedder.encode(queries, show_progress_bar=True)

queries2 = [
    "An item wrapped in paper.",
    # "No, Idea",
]
query2_embeddings = embedder.encode(queries2, show_progress_bar=True)
print(query_embeddings, query2_embeddings)

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

for query, query_embedding in zip(queries2, query2_embeddings):
    distances = scipy.spatial.distance.cdist(
        [query_embedding], corpus2_embeddings, "cosine"
    )[0]

    results = zip(range(len(distances)), distances)
    results = sorted(results, key=lambda x: x[1])

    print(
        """\n\n=================================\n\n
    Query: {0} \nMost similar sentences in corpus:""".format(
            query
        )
    )

    for idx, distance in results[0 : len(corpus2)]:
        print(corpus2[idx], "(Score: {:.2%})".format(1 - distance))
