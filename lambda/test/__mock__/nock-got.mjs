import got from 'got';
import nock from 'nock';

function generateResponse(word = "bear", def1, def2, def3) {
    let app_id = process.env.OXFORD_ID;
    let app_key = process.env.OXFORD_KEY;
    const header_ret = {
        "api_version": "v2",
        "code_version": "leap2-v2.6.0-ge749fd1",
        "connection": "keep-alive",
        "content-encoding": "gzip",
        "content-length": "918",
        "content-type": "application/json;charset=utf-8",
        "date": "Fri, 27 Mar 2020 20:58:21 GMT",
        "server": "openresty/1.17.4.1rc0",
        "x-request-id": "3ded642bc492d929c67d1e79b1c262d0"
    };
    const response_body = {
        "id": word,
        "metadata": {
            "operation": "retrieve",
            "provider": "Oxford University Press",
            "schema": "RetrieveEntry"
        },
        "results": [
            {
                "id": "bear",
                "language": "en-gb",
                "lexicalEntries": [
                    {
                        "entries": [
                            {
                                "homographNumber": "100",
                                "senses": [
                                    {
                                        "definitions": [
                                            "(of a person) carry"
                                        ],
                                        "id": "m_en_gbus0080800.012",
                                        "subsenses": [
                                            {
                                                "definitions": [
                                                    "(of a vehicle or boat) convey (passengers or cargo)"
                                                ],
                                                "id": "m_en_gbus0080800.018"
                                            },
                                            {
                                                "definitions": [
                                                    "have or display as a visible mark or feature"
                                                ],
                                                "id": "m_en_gbus0080800.019"
                                            },
                                            {
                                                "definitions": [
                                                    "be called by (a name or title)"
                                                ],
                                                "id": "m_en_gbus0080800.020"
                                            },
                                            {
                                                "definitions": [
                                                    "carry or conduct oneself in a specified manner"
                                                ],
                                                "id": "m_en_gbus0080800.021"
                                            }
                                        ]
                                    },
                                    {
                                        "definitions": [
                                            "support; carry the weight of"
                                        ],
                                        "id": "m_en_gbus0080800.023",
                                        "subsenses": [
                                            {
                                                "definitions": [
                                                    def1
                                                ],
                                                "id": "m_en_gbus0080800.024"
                                            },
                                            {
                                                "definitions": [
                                                    "be able to accept or stand up to"
                                                ],
                                                "id": "m_en_gbus0080800.025"
                                            }
                                        ]
                                    },
                                    {
                                        "definitions": [
                                            def2
                                        ],
                                        "id": "m_en_gbus0080800.027",
                                        "subsenses": [
                                            {
                                                "definitions": [
                                                    "manage to tolerate (a situation or experience)"
                                                ],
                                                "id": "m_en_gbus0080800.028"
                                            },
                                            {
                                                "definitions": [
                                                    "strongly dislike"
                                                ],
                                                "id": "m_en_gbus0080800.029"
                                            }
                                        ]
                                    },
                                    {
                                        "definitions": [
                                            "give birth to (a child)"
                                        ],
                                        "id": "m_en_gbus0080800.031",
                                        "subsenses": [
                                            {
                                                "definitions": [
                                                    "(of a tree or plant) produce (fruit or flowers)"
                                                ],
                                                "id": "m_en_gbus0080800.032"
                                            }
                                        ]
                                    },
                                    {
                                        "definitions": [
                                            "turn and proceed in a specified direction"
                                        ],
                                        "id": "m_en_gbus0080800.034"
                                    }
                                ]
                            }
                        ],
                        "language": "en-gb",
                        "lexicalCategory": {
                            "id": "verb",
                            "text": "Part"
                        },
                        "text": "bear"
                    }
                ],
                "type": "headword",
                "word": "bear"
            },
            {
                "id": "bear",
                "language": "en-gb",
                "lexicalEntries": [
                    {
                        "entries": [
                            {
                                "homographNumber": "200",
                                "senses": [
                                    {
                                        "definitions": [
                                            "a large, heavy mammal that walks on the soles of its feet, having thick fur and a very short tail. Bears are related to the dog family but most species are omnivorous."
                                        ],
                                        "id": "m_en_gbus0080810.006",
                                        "subsenses": [
                                            {
                                                "definitions": [
                                                    "a teddy bear."
                                                ],
                                                "id": "m_en_gbus0080810.010"
                                            },
                                            {
                                                "definitions": [
                                                    "a nickname for Russia."
                                                ],
                                                "id": "m_en_gbus0080810.011"
                                            }
                                        ]
                                    },
                                    {
                                        "definitions": [
                                            "a large, heavy, cumbersome man"
                                        ],
                                        "id": "m_en_gbus0080810.017",
                                        "subsenses": [
                                            {
                                                "definitions": [
                                                    "a gay or bisexual man with a burly physique and a large amount of body hair"
                                                ],
                                                "id": "m_en_gbus0080810.018"
                                            },
                                            {
                                                "definitions": [
                                                    def3
                                                ],
                                                "id": "m_en_gbus0080810.019"
                                            },
                                            {
                                                "definitions": [
                                                    "something that is very difficult or unpleasant to deal with"
                                                ],
                                                "id": "m_en_gbus0080810.020"
                                            }
                                        ]
                                    },
                                    {
                                        "definitions": [
                                            "a person who sells shares hoping to buy them back later at a lower price."
                                        ],
                                        "id": "m_en_gbus0080810.022"
                                    }
                                ]
                            }
                        ],
                        "language": "en-gb",
                        "lexicalCategory": {
                            "id": "noun",
                            "text": "Noun"
                        },
                        "text": "bear"
                    }
                ],
                "type": "headword",
                "word": "bear"
            }
        ],
        "word": word
    }
    const response = nock("https://od-api.oxforddictionaries.com", {
        reqheaders: {
            'app_id': app_id,
            'app_key': app_key,
        },
    })
        .log(console.log)
        .persist()
        .get(`/api/v2/entries/en-gb/${word}?fields=definitions&strictMatch=True`)
        .reply(200, response_body)
    return response_body.results
}

function replyError() {
    let app_id = "app_id";
    let app_key = "app_key";

    const error_body = {
        "error": "No entry found matching supplied source_lang, word and provided filters"
    }

    const response = nock("https://od-api.oxforddictionaries.com", {
        reqheaders: {
            'app_id': app_id,
            'app_key': app_key,
        },
    })
        .log(console.log)
        .get(`/api/v2/entries/en-gb/notaword?fields=definitions&strictMatch=True`)
        .reply(404, error_body)
}

const dynamoTable = {
    "words": {
        "unknownWords": {
            "bear": [
                [
                    "Part",
                    "(of a person) carry"
                ],
                [
                    "Part",
                    "(of a vehicle or boat) convey (passengers or cargo)"
                ],
                [
                    "Part",
                    "have or display as a visible mark or feature"
                ],
                [
                    "Part",
                    "be called by (a name or title)"
                ],
                [
                    "Part",
                    "carry or conduct oneself in a specified manner"
                ],
                [
                    "Part",
                    "support; carry the weight of"
                ],
                [
                    "Part",
                    "definition 1"
                ],
                [
                    "Part",
                    "be able to accept or stand up to"
                ],
                [
                    "Part",
                    "definition 2"
                ],
                [
                    "Part",
                    "manage to tolerate (a situation or experience)"
                ],
                [
                    "Part",
                    "strongly dislike"
                ],
                [
                    "Part",
                    "give birth to (a child)"
                ],
                [
                    "Part",
                    "(of a tree or plant) produce (fruit or flowers)"
                ],
                [
                    "Part",
                    "turn and proceed in a specified direction"
                ],
                [
                    "Noun",
                    "a large, heavy mammal that walks on the soles of its feet, having thick fur and a very short tail. Bears are related to the dog family but most species are omnivorous."
                ],
                [
                    "Noun",
                    "a teddy bear."
                ],
                [
                    "Noun",
                    "a nickname for Russia."
                ],
                [
                    "Noun",
                    "a large, heavy, cumbersome man"
                ],
                [
                    "Noun",
                    "a gay or bisexual man with a burly physique and a large amount of body hair"
                ],
                [
                    "Noun",
                    "definition 3"
                ],
                [
                    "Noun",
                    "something that is very difficult or unpleasant to deal with"
                ],
                [
                    "Noun",
                    "a person who sells shares hoping to buy them back later at a lower price."
                ]
            ]
        }
    }
}

export {
    generateResponse,
    replyError,
    dynamoTable
}