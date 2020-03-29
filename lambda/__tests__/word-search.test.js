const fc = require("fast-check");
const got = require('got');
const nock = require("nock");
const lookUpWord = require("../libs/word-search");
const results = [
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
											"take responsibility for"
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
									"endure (an ordeal or difficulty)"
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
					"text": "Verb"
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
											"a rough, bad-mannered, or uncouth person"
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
]

function generateResponse(word, randdef1, randdef2, randdef3) {
	let app_id = "app_id";
	let app_key = "app_key";
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
				"id": word,
				"language": "en-gb",
				"lexicalEntries": [
					{
						"entries": [
							{
								"homographNumber": "100",
								"senses": [
									{
										"definitions": [
											randdef1
										],
										"id": "m_en_gbus0572960.007"
									},
									{
										"definitions": [
											"relating to a person or group favouring radical, reforming, or socialist views; left wing"
										],
										"id": "m_en_gbus0572960.012"
									}
								]
							}
						],
						"language": "en-gb",
						"lexicalCategory": {
							"id": "adjective",
							"text": "Adjective"
						},
						"text": word
					},
					{
						"entries": [
							{
								"homographNumber": "101",
								"senses": [
									{
										"definitions": [
											"on or to the left side"
										],
										"id": "m_en_gbus0572960.014"
									}
								]
							}
						],
						"language": "en-gb",
						"lexicalCategory": {
							"id": "adverb",
							"text": "Adverb"
						},
						"text": word
					},
					{
						"entries": [
							{
								"homographNumber": "102",
								"senses": [
									{
										"definitions": [
											randdef2
										],
										"id": "m_en_gbus0572960.018",
										"subsenses": [
											{
												"definitions": [
													"(in soccer or a similar sport) the left-hand half of the field when facing the opponents' goal"
												],
												"id": "m_en_gbus0572960.020"
											},
											{
												"definitions": [
													randdef3
												],
												"id": "m_en_gbus0572960.022"
											},
											{
												"definitions": [
													"a left turn"
												],
												"id": "m_en_gbus0572960.023"
											},
											{
												"definitions": [
													"a road, entrance, etc. on the left"
												],
												"id": "m_en_gbus0572960.026"
											},
											{
												"definitions": [
													"a person's left fist, especially a boxer's"
												],
												"id": "m_en_gbus0572960.027"
											},
											{
												"definitions": [
													"a blow given with the left fist"
												],
												"id": "m_en_gbus0572960.028"
											}
										]
									},
									{
										"definitions": [
											"a group or party favouring radical, reforming, or socialist views"
										],
										"id": "m_en_gbus0572960.030"
									}
								]
							}
						],
						"language": "en-gb",
						"lexicalCategory": {
							"id": "noun",
							"text": "Noun"
						},
						"text": word
					}
				],
				"type": "headword",
				"word": word
			},
			{
				"id": word,
				"language": "en-gb",
				"lexicalEntries": [
					{
						"entries": [
							{
								"homographNumber": "200"
							}
						],
						"language": "en-gb",
						"lexicalCategory": {
							"id": "verb",
							"text": "Verb"
						},
						"text": word
					}
				],
				"type": "headword",
				"word": word
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
	return response
}

function reply_error() {
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

// Component Test, Looking up a word in a dictionary
describe('Word Lookup', () => {
	it("Given an invalid word, return an error(404) message", async () => {
		expect.assertions(1);
		reply_error()
		searchword = await lookUpWord("notaword")
		expect(searchword).toEqual("404");
	});
	it("Given a valid word, retrieve list of nested lists with definitions and part of speech", async () => {
		fc.assert(
			fc.asyncProperty(
				fc.asciiString(30),
				fc.lorem(15, true),
				fc.lorem(25, true),
				fc.lorem(35, true),
				async (word, def1, def2, def3) => {
					generateResponse(word, def1, def2, def3);
					const word_lookup_ans = [['Part', '(of a person) carry'],
					['Part', '(of a vehicle or boat) convey (passengers or cargo)'], ['Part', 'have or display as a visible mark or feature'],
					['Part', 'be called by (a name or title)'],
					['Adjective', def1],
					['Adjective', 'relating to a person or group favouring radical, reforming, or socialist views; left wing'],
					['Adverb', 'on or to the left side'],
					['Noun', def2],
					['Noun',
						'(in soccer or a similar sport) the left-hand half of the field when facing the opponents\'s goal'],
					['Noun', def3],
					['Noun', 'a left turn'],
					['Noun', 'a road, entrance, etc. on the left'],
					['Noun', 'a person\'s left fist, especially a boxer\'s'],
					['Noun', 'a blow given with the left fist'],
					['Noun',
						'a group or party favouring radical, reforming, or socialist views']];
					expect(await lookUpWord(word)).toEqual(word_lookup_ans);
				}
			)
		)
	});
});