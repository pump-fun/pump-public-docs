/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/pump_fees.json`.
 */
export type PumpFees = {
  "address": "pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ",
  "metadata": {
    "name": "pumpFees",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "claimSocialFeePda",
      "discriminator": [
        225,
        21,
        251,
        133,
        161,
        30,
        199,
        226
      ],
      "accounts": [
        {
          "name": "recipient",
          "writable": true
        },
        {
          "name": "socialFeePda",
          "writable": true
        },
        {
          "name": "feeProgramGlobal",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  101,
                  101,
                  45,
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  45,
                  103,
                  108,
                  111,
                  98,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "socialClaimAuthority",
          "signer": true,
          "relations": [
            "feeProgramGlobal"
          ]
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": [
        {
          "name": "userId",
          "type": "string"
        },
        {
          "name": "platform",
          "type": "u8"
        }
      ],
      "returns": {
        "option": {
          "defined": {
            "name": "socialFeePdaClaimed"
          }
        }
      }
    },
    {
      "name": "claimSocialFeePdaV2",
      "discriminator": [
        17,
        77,
        240,
        134,
        58,
        188,
        53,
        149
      ],
      "accounts": [
        {
          "name": "recipient",
          "writable": true
        },
        {
          "name": "socialFeePda",
          "writable": true
        },
        {
          "name": "quoteMint",
          "docs": [
            "Quote mint for claim"
          ],
          "writable": true
        },
        {
          "name": "associatedSocialFeePda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "socialFeePda"
              },
              {
                "kind": "account",
                "path": "quoteTokenProgram"
              },
              {
                "kind": "account",
                "path": "quoteMint"
              }
            ],
            "program": {
              "kind": "account",
              "path": "associatedTokenProgram"
            }
          }
        },
        {
          "name": "associatedRecipient",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "recipient"
              },
              {
                "kind": "account",
                "path": "quoteTokenProgram"
              },
              {
                "kind": "account",
                "path": "quoteMint"
              }
            ],
            "program": {
              "kind": "account",
              "path": "associatedTokenProgram"
            }
          }
        },
        {
          "name": "quoteTokenProgram"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "feeProgramGlobal",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  101,
                  101,
                  45,
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  45,
                  103,
                  108,
                  111,
                  98,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "socialClaimAuthority",
          "signer": true,
          "relations": [
            "feeProgramGlobal"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": [
        {
          "name": "userId",
          "type": "string"
        },
        {
          "name": "platform",
          "type": "u8"
        }
      ],
      "returns": {
        "option": {
          "defined": {
            "name": "socialFeePdaClaimed"
          }
        }
      }
    },
    {
      "name": "crankDonationFeePda",
      "discriminator": [
        220,
        10,
        189,
        167,
        169,
        17,
        25,
        69
      ],
      "accounts": [
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ"
        },
        {
          "name": "payer",
          "docs": [
            "Pays rent when [`temp_wsol_token_account`] is created (`init_if_needed`); receives rent when it is closed after the relay CPI."
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "feeProgramGlobal",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  101,
                  101,
                  45,
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  45,
                  103,
                  108,
                  111,
                  98,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "donationFeePda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  111,
                  110,
                  97,
                  116,
                  105,
                  111,
                  110,
                  45,
                  102,
                  101,
                  101,
                  45,
                  112,
                  100,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "donation_fee_pda.base_mint",
                "account": "donationFeePda"
              },
              {
                "kind": "account",
                "path": "donation_fee_pda.config_id",
                "account": "donationFeePda"
              }
            ]
          }
        },
        {
          "name": "quoteMint",
          "docs": [
            "Quote mint from donation fee pda."
          ],
          "writable": true
        },
        {
          "name": "donationFeePdaAta",
          "docs": [
            "WSOL ATA owned by `donation_fee_pda`."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "donationFeePda"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "quoteMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "donationRelayProgram",
          "address": "RLAYHr9TRFcKB2ubYQhspcnXiaGpaVzNQvHytt47RZu"
        },
        {
          "name": "donationRelayEventAuthority"
        },
        {
          "name": "mintWhitelist"
        },
        {
          "name": "epochTracker",
          "writable": true
        },
        {
          "name": "debouncer",
          "writable": true
        },
        {
          "name": "debouncerAta",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "createDonationFeePda",
      "discriminator": [
        244,
        139,
        16,
        88,
        14,
        255,
        122,
        26
      ],
      "accounts": [
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ"
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "feeProgramGlobal",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  101,
                  101,
                  45,
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  45,
                  103,
                  108,
                  111,
                  98,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "donationFeePda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  111,
                  110,
                  97,
                  116,
                  105,
                  111,
                  110,
                  45,
                  102,
                  101,
                  101,
                  45,
                  112,
                  100,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "baseMint"
              },
              {
                "kind": "account",
                "path": "configId"
              }
            ]
          }
        },
        {
          "name": "configId",
          "docs": [
            "stored on the PDA, so distinct `config_id`s for the same `base_mint` derive distinct addresses."
          ]
        },
        {
          "name": "baseMint"
        },
        {
          "name": "bondingCurve",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  111,
                  110,
                  100,
                  105,
                  110,
                  103,
                  45,
                  99,
                  117,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "baseMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                1,
                86,
                224,
                246,
                147,
                102,
                90,
                207,
                68,
                219,
                21,
                104,
                191,
                23,
                91,
                170,
                81,
                137,
                203,
                151,
                245,
                210,
                255,
                59,
                101,
                93,
                43,
                182,
                253,
                109,
                24,
                176
              ]
            }
          }
        },
        {
          "name": "pool"
        },
        {
          "name": "sharingConfig",
          "docs": [
            "(derived from `[SHARING_CONFIG_SEED, base_mint]`)"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  104,
                  97,
                  114,
                  105,
                  110,
                  103,
                  45,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "baseMint"
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "createFeeSharingConfig",
      "docs": [
        "Create Fee Sharing Config"
      ],
      "discriminator": [
        195,
        78,
        86,
        76,
        111,
        52,
        251,
        213
      ],
      "accounts": [
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ"
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "global",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108
                ]
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                1,
                86,
                224,
                246,
                147,
                102,
                90,
                207,
                68,
                219,
                21,
                104,
                191,
                23,
                91,
                170,
                81,
                137,
                203,
                151,
                245,
                210,
                255,
                59,
                101,
                93,
                43,
                182,
                253,
                109,
                24,
                176
              ]
            }
          }
        },
        {
          "name": "mint"
        },
        {
          "name": "sharingConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  104,
                  97,
                  114,
                  105,
                  110,
                  103,
                  45,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "bondingCurve",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  111,
                  110,
                  100,
                  105,
                  110,
                  103,
                  45,
                  99,
                  117,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                1,
                86,
                224,
                246,
                147,
                102,
                90,
                207,
                68,
                219,
                21,
                104,
                191,
                23,
                91,
                170,
                81,
                137,
                203,
                151,
                245,
                210,
                255,
                59,
                101,
                93,
                43,
                182,
                253,
                109,
                24,
                176
              ]
            }
          }
        },
        {
          "name": "pumpProgram",
          "address": "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"
        },
        {
          "name": "pumpEventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                1,
                86,
                224,
                246,
                147,
                102,
                90,
                207,
                68,
                219,
                21,
                104,
                191,
                23,
                91,
                170,
                81,
                137,
                203,
                151,
                245,
                210,
                255,
                59,
                101,
                93,
                43,
                182,
                253,
                109,
                24,
                176
              ]
            }
          }
        },
        {
          "name": "pool",
          "writable": true,
          "optional": true
        },
        {
          "name": "pumpAmmProgram",
          "optional": true,
          "address": "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"
        },
        {
          "name": "pumpAmmEventAuthority",
          "optional": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                12,
                20,
                222,
                252,
                130,
                94,
                198,
                118,
                148,
                37,
                8,
                24,
                187,
                101,
                64,
                101,
                244,
                41,
                141,
                49,
                86,
                213,
                113,
                180,
                212,
                248,
                9,
                12,
                24,
                233,
                168,
                99
              ]
            }
          }
        }
      ],
      "args": []
    },
    {
      "name": "createSocialFeePda",
      "discriminator": [
        144,
        224,
        59,
        211,
        78,
        248,
        202,
        220
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "socialFeePda",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "feeProgramGlobal",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  101,
                  101,
                  45,
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  45,
                  103,
                  108,
                  111,
                  98,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": [
        {
          "name": "userId",
          "type": "string"
        },
        {
          "name": "platform",
          "type": "u8"
        }
      ]
    },
    {
      "name": "extendFeeConfig",
      "docs": [
        "Realloc the fee_config PDA to [`FeeConfig::CURRENT_SIZE`] (signer pays rent delta)."
      ],
      "discriminator": [
        68,
        179,
        244,
        90,
        173,
        56,
        17,
        217
      ],
      "accounts": [
        {
          "name": "feeConfig",
          "writable": true
        },
        {
          "name": "user",
          "signer": true
        },
        {
          "name": "configProgramId"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": []
    },
    {
      "name": "getFees",
      "docs": [
        "Get Fees"
      ],
      "discriminator": [
        231,
        37,
        126,
        85,
        207,
        91,
        63,
        52
      ],
      "accounts": [
        {
          "name": "feeConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  101,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "configProgramId"
              }
            ]
          }
        },
        {
          "name": "configProgramId"
        }
      ],
      "args": [
        {
          "name": "isPumpPool",
          "type": "bool"
        },
        {
          "name": "marketCapLamports",
          "type": "u128"
        },
        {
          "name": "tradeSizeLamports",
          "type": "u64"
        },
        {
          "name": "isNewQuoteMint",
          "type": {
            "defined": {
              "name": "optionBool"
            }
          }
        }
      ],
      "returns": {
        "defined": {
          "name": "fees"
        }
      }
    },
    {
      "name": "initializeBuyback",
      "discriminator": [
        250,
        129,
        236,
        160,
        227,
        36,
        103,
        134
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "buybackVault",
          "writable": true
        },
        {
          "name": "buybackVaultAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "buybackVault"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "mint"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": [
        {
          "name": "index",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initializeFeeConfig",
      "docs": [
        "Initialize FeeConfig admin"
      ],
      "discriminator": [
        62,
        162,
        20,
        133,
        121,
        65,
        145,
        27
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true,
          "address": "8LWu7QM2dGR1G8nKDHthckea57bkCzXyBTAKPJUBDHo8"
        },
        {
          "name": "feeConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  101,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "configProgramId"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "configProgramId"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": []
    },
    {
      "name": "initializeFeeProgramGlobal",
      "discriminator": [
        35,
        215,
        130,
        84,
        233,
        56,
        124,
        167
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "pumpGlobal"
          ]
        },
        {
          "name": "pumpGlobal",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108
                ]
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                1,
                86,
                224,
                246,
                147,
                102,
                90,
                207,
                68,
                219,
                21,
                104,
                191,
                23,
                91,
                170,
                81,
                137,
                203,
                151,
                245,
                210,
                255,
                59,
                101,
                93,
                43,
                182,
                253,
                109,
                24,
                176
              ]
            }
          }
        },
        {
          "name": "feeProgramGlobal",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  101,
                  101,
                  45,
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  45,
                  103,
                  108,
                  111,
                  98,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": [
        {
          "name": "socialClaimAuthority",
          "type": "pubkey"
        },
        {
          "name": "disableFlags",
          "type": "u8"
        },
        {
          "name": "claimRateLimit",
          "type": "u64"
        }
      ]
    },
    {
      "name": "resetFeeSharingConfig",
      "docs": [
        "Reset Fee Sharing Config and distribute pending fees first"
      ],
      "discriminator": [
        10,
        2,
        182,
        95,
        16,
        127,
        129,
        186
      ],
      "accounts": [
        {
          "name": "newAdmin"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ"
        },
        {
          "name": "authority",
          "signer": true
        },
        {
          "name": "global",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108
                ]
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                1,
                86,
                224,
                246,
                147,
                102,
                90,
                207,
                68,
                219,
                21,
                104,
                191,
                23,
                91,
                170,
                81,
                137,
                203,
                151,
                245,
                210,
                255,
                59,
                101,
                93,
                43,
                182,
                253,
                109,
                24,
                176
              ]
            }
          }
        },
        {
          "name": "mint",
          "relations": [
            "sharingConfig"
          ]
        },
        {
          "name": "sharingConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  104,
                  97,
                  114,
                  105,
                  110,
                  103,
                  45,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "bondingCurve",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  111,
                  110,
                  100,
                  105,
                  110,
                  103,
                  45,
                  99,
                  117,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                1,
                86,
                224,
                246,
                147,
                102,
                90,
                207,
                68,
                219,
                21,
                104,
                191,
                23,
                91,
                170,
                81,
                137,
                203,
                151,
                245,
                210,
                255,
                59,
                101,
                93,
                43,
                182,
                253,
                109,
                24,
                176
              ]
            }
          }
        },
        {
          "name": "pumpCreatorVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  97,
                  116,
                  111,
                  114,
                  45,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "sharingConfig"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                1,
                86,
                224,
                246,
                147,
                102,
                90,
                207,
                68,
                219,
                21,
                104,
                191,
                23,
                91,
                170,
                81,
                137,
                203,
                151,
                245,
                210,
                255,
                59,
                101,
                93,
                43,
                182,
                253,
                109,
                24,
                176
              ]
            }
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "pumpProgram",
          "address": "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"
        },
        {
          "name": "pumpEventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                1,
                86,
                224,
                246,
                147,
                102,
                90,
                207,
                68,
                219,
                21,
                104,
                191,
                23,
                91,
                170,
                81,
                137,
                203,
                151,
                245,
                210,
                255,
                59,
                101,
                93,
                43,
                182,
                253,
                109,
                24,
                176
              ]
            }
          }
        },
        {
          "name": "pumpAmmProgram",
          "address": "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"
        },
        {
          "name": "ammEventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                12,
                20,
                222,
                252,
                130,
                94,
                198,
                118,
                148,
                37,
                8,
                24,
                187,
                101,
                64,
                101,
                244,
                41,
                141,
                49,
                86,
                213,
                113,
                180,
                212,
                248,
                9,
                12,
                24,
                233,
                168,
                99
              ]
            }
          }
        },
        {
          "name": "wsolMint",
          "address": "So11111111111111111111111111111111111111112"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "coinCreatorVaultAuthority",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  97,
                  116,
                  111,
                  114,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "sharingConfig"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                12,
                20,
                222,
                252,
                130,
                94,
                198,
                118,
                148,
                37,
                8,
                24,
                187,
                101,
                64,
                101,
                244,
                41,
                141,
                49,
                86,
                213,
                113,
                180,
                212,
                248,
                9,
                12,
                24,
                233,
                168,
                99
              ]
            }
          }
        },
        {
          "name": "coinCreatorVaultAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "coinCreatorVaultAuthority"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "wsolMint"
              }
            ],
            "program": {
              "kind": "account",
              "path": "associatedTokenProgram"
            }
          }
        }
      ],
      "args": []
    },
    {
      "name": "resetFeeSharingConfigV2",
      "docs": [
        "Reset Fee Sharing Config and distribute pending fees first"
      ],
      "discriminator": [
        169,
        245,
        17,
        209,
        94,
        91,
        248,
        128
      ],
      "accounts": [
        {
          "name": "newAdmin"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ"
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "global",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108
                ]
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                1,
                86,
                224,
                246,
                147,
                102,
                90,
                207,
                68,
                219,
                21,
                104,
                191,
                23,
                91,
                170,
                81,
                137,
                203,
                151,
                245,
                210,
                255,
                59,
                101,
                93,
                43,
                182,
                253,
                109,
                24,
                176
              ]
            }
          }
        },
        {
          "name": "mint",
          "relations": [
            "sharingConfig"
          ]
        },
        {
          "name": "sharingConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  104,
                  97,
                  114,
                  105,
                  110,
                  103,
                  45,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "bondingCurve",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  111,
                  110,
                  100,
                  105,
                  110,
                  103,
                  45,
                  99,
                  117,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                1,
                86,
                224,
                246,
                147,
                102,
                90,
                207,
                68,
                219,
                21,
                104,
                191,
                23,
                91,
                170,
                81,
                137,
                203,
                151,
                245,
                210,
                255,
                59,
                101,
                93,
                43,
                182,
                253,
                109,
                24,
                176
              ]
            }
          }
        },
        {
          "name": "pumpCreatorVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  97,
                  116,
                  111,
                  114,
                  45,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "sharingConfig"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                1,
                86,
                224,
                246,
                147,
                102,
                90,
                207,
                68,
                219,
                21,
                104,
                191,
                23,
                91,
                170,
                81,
                137,
                203,
                151,
                245,
                210,
                255,
                59,
                101,
                93,
                43,
                182,
                253,
                109,
                24,
                176
              ]
            }
          }
        },
        {
          "name": "pumpCreatorVaultAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "pumpCreatorVault"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "quoteMint"
              }
            ],
            "program": {
              "kind": "account",
              "path": "associatedTokenProgram"
            }
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "pumpProgram",
          "address": "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"
        },
        {
          "name": "pumpEventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                1,
                86,
                224,
                246,
                147,
                102,
                90,
                207,
                68,
                219,
                21,
                104,
                191,
                23,
                91,
                170,
                81,
                137,
                203,
                151,
                245,
                210,
                255,
                59,
                101,
                93,
                43,
                182,
                253,
                109,
                24,
                176
              ]
            }
          }
        },
        {
          "name": "pumpAmmProgram",
          "address": "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"
        },
        {
          "name": "ammEventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                12,
                20,
                222,
                252,
                130,
                94,
                198,
                118,
                148,
                37,
                8,
                24,
                187,
                101,
                64,
                101,
                244,
                41,
                141,
                49,
                86,
                213,
                113,
                180,
                212,
                248,
                9,
                12,
                24,
                233,
                168,
                99
              ]
            }
          }
        },
        {
          "name": "quoteMint"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "coinCreatorVaultAuthority",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  97,
                  116,
                  111,
                  114,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "sharingConfig"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                12,
                20,
                222,
                252,
                130,
                94,
                198,
                118,
                148,
                37,
                8,
                24,
                187,
                101,
                64,
                101,
                244,
                41,
                141,
                49,
                86,
                213,
                113,
                180,
                212,
                248,
                9,
                12,
                24,
                233,
                168,
                99
              ]
            }
          }
        },
        {
          "name": "coinCreatorVaultAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "coinCreatorVaultAuthority"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "quoteMint"
              }
            ],
            "program": {
              "kind": "account",
              "path": "associatedTokenProgram"
            }
          }
        }
      ],
      "args": []
    },
    {
      "name": "revokeFeeSharingAuthority",
      "docs": [
        "Revoke Fee Sharing Authority"
      ],
      "discriminator": [
        18,
        233,
        158,
        39,
        185,
        207,
        58,
        104
      ],
      "accounts": [],
      "args": []
    },
    {
      "name": "setAuthority",
      "discriminator": [
        133,
        250,
        37,
        21,
        110,
        163,
        26,
        121
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "feeProgramGlobal"
          ]
        },
        {
          "name": "feeProgramGlobal",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  101,
                  101,
                  45,
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  45,
                  103,
                  108,
                  111,
                  98,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": [
        {
          "name": "newAuthority",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "setClaimRateLimit",
      "discriminator": [
        185,
        211,
        159,
        174,
        212,
        49,
        88,
        4
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "feeProgramGlobal"
          ]
        },
        {
          "name": "feeProgramGlobal",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  101,
                  101,
                  45,
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  45,
                  103,
                  108,
                  111,
                  98,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": [
        {
          "name": "claimRateLimit",
          "type": "u64"
        }
      ]
    },
    {
      "name": "setDisableFlags",
      "discriminator": [
        194,
        217,
        112,
        35,
        114,
        222,
        51,
        190
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "feeProgramGlobal"
          ]
        },
        {
          "name": "feeProgramGlobal",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  101,
                  101,
                  45,
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  45,
                  103,
                  108,
                  111,
                  98,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": [
        {
          "name": "disableFlags",
          "type": "u8"
        }
      ]
    },
    {
      "name": "setSocialClaimAuthority",
      "discriminator": [
        147,
        54,
        184,
        154,
        136,
        237,
        185,
        153
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "feeProgramGlobal"
          ]
        },
        {
          "name": "feeProgramGlobal",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  101,
                  101,
                  45,
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  45,
                  103,
                  108,
                  111,
                  98,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": [
        {
          "name": "socialClaimAuthority",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "sweepBuyback",
      "discriminator": [
        138,
        33,
        204,
        38,
        207,
        161,
        159,
        226
      ],
      "accounts": [
        {
          "name": "destination",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "buybackVault"
          ]
        },
        {
          "name": "buybackVault",
          "writable": true
        },
        {
          "name": "buybackVaultAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "buybackVault"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "destinationAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "destination"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "mint"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": [
        {
          "name": "index",
          "type": "u8"
        }
      ]
    },
    {
      "name": "transferFeeSharingAuthority",
      "docs": [
        "Transfer Fee Sharing Authority"
      ],
      "discriminator": [
        202,
        10,
        75,
        200,
        164,
        34,
        210,
        96
      ],
      "accounts": [],
      "args": []
    },
    {
      "name": "updateAdmin",
      "docs": [
        "Update admin (only callable by admin)"
      ],
      "discriminator": [
        161,
        176,
        40,
        213,
        60,
        184,
        179,
        228
      ],
      "accounts": [
        {
          "name": "admin",
          "signer": true,
          "relations": [
            "feeConfig"
          ]
        },
        {
          "name": "feeConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  101,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "configProgramId"
              }
            ]
          }
        },
        {
          "name": "newAdmin"
        },
        {
          "name": "configProgramId"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": []
    },
    {
      "name": "updateBuybackAuthority",
      "discriminator": [
        66,
        98,
        113,
        202,
        121,
        37,
        219,
        107
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "feeProgramGlobal"
          ]
        },
        {
          "name": "feeProgramGlobal",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  101,
                  101,
                  45,
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  45,
                  103,
                  108,
                  111,
                  98,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "buybackVault",
          "writable": true
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": [
        {
          "name": "index",
          "type": "u8"
        },
        {
          "name": "newAuthority",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "updateBuybackClaimRateLimit",
      "discriminator": [
        186,
        95,
        135,
        190,
        255,
        199,
        137,
        170
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "feeProgramGlobal"
          ]
        },
        {
          "name": "feeProgramGlobal",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  101,
                  101,
                  45,
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  45,
                  103,
                  108,
                  111,
                  98,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "buybackVault",
          "writable": true
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": [
        {
          "name": "index",
          "type": "u8"
        },
        {
          "name": "claimRateLimit",
          "type": "i64"
        }
      ]
    },
    {
      "name": "updateFeeConfig",
      "docs": [
        "Set/Replace fee parameters entirely (only callable by admin)"
      ],
      "discriminator": [
        104,
        184,
        103,
        242,
        88,
        151,
        107,
        20
      ],
      "accounts": [
        {
          "name": "feeConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  101,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "configProgramId"
              }
            ]
          }
        },
        {
          "name": "admin",
          "signer": true,
          "relations": [
            "feeConfig"
          ]
        },
        {
          "name": "configProgramId"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": [
        {
          "name": "feeTiers",
          "type": {
            "vec": {
              "defined": {
                "name": "feeTier"
              }
            }
          }
        },
        {
          "name": "flatFees",
          "type": {
            "defined": {
              "name": "fees"
            }
          }
        }
      ]
    },
    {
      "name": "updateFeeShares",
      "docs": [
        "Update Fee Shares, make sure to distribute all the fees before calling this"
      ],
      "discriminator": [
        189,
        13,
        136,
        99,
        187,
        164,
        237,
        35
      ],
      "accounts": [
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ"
        },
        {
          "name": "authority",
          "signer": true
        },
        {
          "name": "global",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108
                ]
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                1,
                86,
                224,
                246,
                147,
                102,
                90,
                207,
                68,
                219,
                21,
                104,
                191,
                23,
                91,
                170,
                81,
                137,
                203,
                151,
                245,
                210,
                255,
                59,
                101,
                93,
                43,
                182,
                253,
                109,
                24,
                176
              ]
            }
          }
        },
        {
          "name": "mint",
          "relations": [
            "sharingConfig"
          ]
        },
        {
          "name": "sharingConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  104,
                  97,
                  114,
                  105,
                  110,
                  103,
                  45,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "bondingCurve",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  111,
                  110,
                  100,
                  105,
                  110,
                  103,
                  45,
                  99,
                  117,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                1,
                86,
                224,
                246,
                147,
                102,
                90,
                207,
                68,
                219,
                21,
                104,
                191,
                23,
                91,
                170,
                81,
                137,
                203,
                151,
                245,
                210,
                255,
                59,
                101,
                93,
                43,
                182,
                253,
                109,
                24,
                176
              ]
            }
          }
        },
        {
          "name": "pumpCreatorVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  97,
                  116,
                  111,
                  114,
                  45,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "sharingConfig"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                1,
                86,
                224,
                246,
                147,
                102,
                90,
                207,
                68,
                219,
                21,
                104,
                191,
                23,
                91,
                170,
                81,
                137,
                203,
                151,
                245,
                210,
                255,
                59,
                101,
                93,
                43,
                182,
                253,
                109,
                24,
                176
              ]
            }
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "pumpProgram",
          "address": "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"
        },
        {
          "name": "pumpEventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                1,
                86,
                224,
                246,
                147,
                102,
                90,
                207,
                68,
                219,
                21,
                104,
                191,
                23,
                91,
                170,
                81,
                137,
                203,
                151,
                245,
                210,
                255,
                59,
                101,
                93,
                43,
                182,
                253,
                109,
                24,
                176
              ]
            }
          }
        },
        {
          "name": "pumpAmmProgram",
          "address": "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"
        },
        {
          "name": "ammEventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                12,
                20,
                222,
                252,
                130,
                94,
                198,
                118,
                148,
                37,
                8,
                24,
                187,
                101,
                64,
                101,
                244,
                41,
                141,
                49,
                86,
                213,
                113,
                180,
                212,
                248,
                9,
                12,
                24,
                233,
                168,
                99
              ]
            }
          }
        },
        {
          "name": "wsolMint",
          "address": "So11111111111111111111111111111111111111112"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "coinCreatorVaultAuthority",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  97,
                  116,
                  111,
                  114,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "sharingConfig"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                12,
                20,
                222,
                252,
                130,
                94,
                198,
                118,
                148,
                37,
                8,
                24,
                187,
                101,
                64,
                101,
                244,
                41,
                141,
                49,
                86,
                213,
                113,
                180,
                212,
                248,
                9,
                12,
                24,
                233,
                168,
                99
              ]
            }
          }
        },
        {
          "name": "coinCreatorVaultAta",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "shareholders",
          "type": {
            "vec": {
              "defined": {
                "name": "shareholder"
              }
            }
          }
        }
      ]
    },
    {
      "name": "updateFeeSharesV2",
      "docs": [
        "Update Fee Shares, make sure to distribute all the fees before calling this"
      ],
      "discriminator": [
        111,
        251,
        49,
        6,
        78,
        78,
        106,
        18
      ],
      "accounts": [
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ"
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "global",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108
                ]
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                1,
                86,
                224,
                246,
                147,
                102,
                90,
                207,
                68,
                219,
                21,
                104,
                191,
                23,
                91,
                170,
                81,
                137,
                203,
                151,
                245,
                210,
                255,
                59,
                101,
                93,
                43,
                182,
                253,
                109,
                24,
                176
              ]
            }
          }
        },
        {
          "name": "mint",
          "relations": [
            "sharingConfig"
          ]
        },
        {
          "name": "sharingConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  104,
                  97,
                  114,
                  105,
                  110,
                  103,
                  45,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "bondingCurve",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  111,
                  110,
                  100,
                  105,
                  110,
                  103,
                  45,
                  99,
                  117,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                1,
                86,
                224,
                246,
                147,
                102,
                90,
                207,
                68,
                219,
                21,
                104,
                191,
                23,
                91,
                170,
                81,
                137,
                203,
                151,
                245,
                210,
                255,
                59,
                101,
                93,
                43,
                182,
                253,
                109,
                24,
                176
              ]
            }
          }
        },
        {
          "name": "pumpCreatorVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  97,
                  116,
                  111,
                  114,
                  45,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "sharingConfig"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                1,
                86,
                224,
                246,
                147,
                102,
                90,
                207,
                68,
                219,
                21,
                104,
                191,
                23,
                91,
                170,
                81,
                137,
                203,
                151,
                245,
                210,
                255,
                59,
                101,
                93,
                43,
                182,
                253,
                109,
                24,
                176
              ]
            }
          }
        },
        {
          "name": "pumpCreatorVaultAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "pumpCreatorVault"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "quoteMint"
              }
            ],
            "program": {
              "kind": "account",
              "path": "associatedTokenProgram"
            }
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "pumpProgram",
          "address": "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"
        },
        {
          "name": "pumpEventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                1,
                86,
                224,
                246,
                147,
                102,
                90,
                207,
                68,
                219,
                21,
                104,
                191,
                23,
                91,
                170,
                81,
                137,
                203,
                151,
                245,
                210,
                255,
                59,
                101,
                93,
                43,
                182,
                253,
                109,
                24,
                176
              ]
            }
          }
        },
        {
          "name": "pumpAmmProgram",
          "address": "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"
        },
        {
          "name": "ammEventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                12,
                20,
                222,
                252,
                130,
                94,
                198,
                118,
                148,
                37,
                8,
                24,
                187,
                101,
                64,
                101,
                244,
                41,
                141,
                49,
                86,
                213,
                113,
                180,
                212,
                248,
                9,
                12,
                24,
                233,
                168,
                99
              ]
            }
          }
        },
        {
          "name": "quoteMint"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "coinCreatorVaultAuthority",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  97,
                  116,
                  111,
                  114,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "sharingConfig"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                12,
                20,
                222,
                252,
                130,
                94,
                198,
                118,
                148,
                37,
                8,
                24,
                187,
                101,
                64,
                101,
                244,
                41,
                141,
                49,
                86,
                213,
                113,
                180,
                212,
                248,
                9,
                12,
                24,
                233,
                168,
                99
              ]
            }
          }
        },
        {
          "name": "coinCreatorVaultAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "coinCreatorVaultAuthority"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "quoteMint"
              }
            ],
            "program": {
              "kind": "account",
              "path": "associatedTokenProgram"
            }
          }
        }
      ],
      "args": [
        {
          "name": "shareholders",
          "type": {
            "vec": {
              "defined": {
                "name": "shareholder"
              }
            }
          }
        }
      ]
    },
    {
      "name": "updateStableFeeConfig",
      "docs": [
        "Set/Replace fee parameters entirely (only callable by admin)"
      ],
      "discriminator": [
        107,
        169,
        100,
        179,
        134,
        155,
        146,
        221
      ],
      "accounts": [
        {
          "name": "feeConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  101,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "configProgramId"
              }
            ]
          }
        },
        {
          "name": "admin",
          "signer": true,
          "relations": [
            "feeConfig"
          ]
        },
        {
          "name": "configProgramId"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": [
        {
          "name": "feeTiers",
          "type": {
            "vec": {
              "defined": {
                "name": "feeTier"
              }
            }
          }
        }
      ]
    },
    {
      "name": "upsertFeeTiers",
      "docs": [
        "Update or expand fee tiers (only callable by admin)"
      ],
      "discriminator": [
        227,
        23,
        150,
        12,
        77,
        86,
        94,
        4
      ],
      "accounts": [
        {
          "name": "feeConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  101,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "configProgramId"
              }
            ]
          }
        },
        {
          "name": "admin",
          "signer": true,
          "relations": [
            "feeConfig"
          ]
        },
        {
          "name": "configProgramId"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": [
        {
          "name": "feeTiers",
          "type": {
            "vec": {
              "defined": {
                "name": "feeTier"
              }
            }
          }
        },
        {
          "name": "offset",
          "type": "u8"
        }
      ]
    },
    {
      "name": "upsertStableFeeTiers",
      "docs": [
        "Update or expand fee tiers (only callable by admin)"
      ],
      "discriminator": [
        181,
        160,
        162,
        252,
        74,
        76,
        224,
        221
      ],
      "accounts": [
        {
          "name": "feeConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  101,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "configProgramId"
              }
            ]
          }
        },
        {
          "name": "admin",
          "signer": true,
          "relations": [
            "feeConfig"
          ]
        },
        {
          "name": "configProgramId"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": [
        {
          "name": "feeTiers",
          "type": {
            "vec": {
              "defined": {
                "name": "feeTier"
              }
            }
          }
        },
        {
          "name": "offset",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "bondingCurve",
      "discriminator": [
        23,
        183,
        248,
        55,
        96,
        216,
        172,
        96
      ]
    },
    {
      "name": "buybackVault",
      "discriminator": [
        153,
        166,
        71,
        144,
        179,
        189,
        137,
        251
      ]
    },
    {
      "name": "donationFeePda",
      "discriminator": [
        246,
        197,
        96,
        9,
        193,
        30,
        93,
        115
      ]
    },
    {
      "name": "feeConfig",
      "discriminator": [
        143,
        52,
        146,
        187,
        219,
        123,
        76,
        155
      ]
    },
    {
      "name": "feeProgramGlobal",
      "discriminator": [
        162,
        165,
        245,
        49,
        29,
        37,
        55,
        242
      ]
    },
    {
      "name": "global",
      "discriminator": [
        167,
        232,
        232,
        177,
        200,
        108,
        114,
        127
      ]
    },
    {
      "name": "pool",
      "discriminator": [
        241,
        154,
        109,
        4,
        17,
        177,
        109,
        188
      ]
    },
    {
      "name": "sharingConfig",
      "discriminator": [
        216,
        74,
        9,
        0,
        56,
        140,
        93,
        75
      ]
    },
    {
      "name": "socialFeePda",
      "discriminator": [
        139,
        96,
        53,
        17,
        42,
        169,
        206,
        150
      ]
    }
  ],
  "events": [
    {
      "name": "createFeeSharingConfigEvent",
      "discriminator": [
        133,
        105,
        170,
        200,
        184,
        116,
        251,
        88
      ]
    },
    {
      "name": "donationFeePdaCranked",
      "discriminator": [
        30,
        208,
        107,
        93,
        177,
        0,
        223,
        78
      ]
    },
    {
      "name": "donationFeePdaCreated",
      "discriminator": [
        94,
        20,
        137,
        239,
        35,
        77,
        225,
        235
      ]
    },
    {
      "name": "extendFeeConfigEvent",
      "discriminator": [
        226,
        203,
        224,
        35,
        153,
        10,
        88,
        51
      ]
    },
    {
      "name": "initializeFeeConfigEvent",
      "discriminator": [
        89,
        138,
        244,
        230,
        10,
        56,
        226,
        126
      ]
    },
    {
      "name": "initializeFeeProgramGlobalEvent",
      "discriminator": [
        40,
        233,
        156,
        78,
        95,
        0,
        8,
        199
      ]
    },
    {
      "name": "resetFeeSharingConfigEvent",
      "discriminator": [
        203,
        204,
        151,
        226,
        120,
        55,
        214,
        243
      ]
    },
    {
      "name": "setAuthorityEvent",
      "discriminator": [
        18,
        175,
        132,
        66,
        208,
        201,
        87,
        242
      ]
    },
    {
      "name": "setClaimRateLimitEvent",
      "discriminator": [
        13,
        143,
        143,
        235,
        181,
        19,
        51,
        40
      ]
    },
    {
      "name": "setDisableFlagsEvent",
      "discriminator": [
        5,
        8,
        179,
        65,
        49,
        55,
        145,
        126
      ]
    },
    {
      "name": "setSocialClaimAuthorityEvent",
      "discriminator": [
        60,
        118,
        127,
        132,
        239,
        52,
        254,
        14
      ]
    },
    {
      "name": "socialFeePdaClaimed",
      "discriminator": [
        50,
        18,
        193,
        65,
        237,
        210,
        234,
        236
      ]
    },
    {
      "name": "socialFeePdaCreated",
      "discriminator": [
        183,
        183,
        218,
        147,
        24,
        124,
        137,
        169
      ]
    },
    {
      "name": "sweepBuybackEvent",
      "discriminator": [
        43,
        56,
        42,
        214,
        153,
        57,
        166,
        137
      ]
    },
    {
      "name": "updateAdminEvent",
      "discriminator": [
        225,
        152,
        171,
        87,
        246,
        63,
        66,
        234
      ]
    },
    {
      "name": "updateFeeConfigEvent",
      "discriminator": [
        90,
        23,
        65,
        35,
        62,
        244,
        188,
        208
      ]
    },
    {
      "name": "updateFeeSharesEvent",
      "discriminator": [
        21,
        186,
        196,
        184,
        91,
        228,
        225,
        203
      ]
    },
    {
      "name": "updateStableFeeConfigEvent",
      "discriminator": [
        94,
        5,
        43,
        237,
        103,
        147,
        232,
        245
      ]
    },
    {
      "name": "upsertFeeTiersEvent",
      "discriminator": [
        171,
        89,
        169,
        187,
        122,
        186,
        33,
        204
      ]
    },
    {
      "name": "upsertStableFeeTiersEvent",
      "discriminator": [
        232,
        237,
        237,
        52,
        98,
        146,
        73,
        243
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "unauthorizedProgram",
      "msg": "Only Pump and PumpSwap programs can call this instruction"
    },
    {
      "code": 6001,
      "name": "invalidAdmin",
      "msg": "Invalid admin"
    },
    {
      "code": 6002,
      "name": "noFeeTiers",
      "msg": "No fee tiers provided"
    },
    {
      "code": 6003,
      "name": "tooManyFeeTiers",
      "msg": "format"
    },
    {
      "code": 6004,
      "name": "offsetNotContinuous",
      "msg": "The offset should be <= fee_config.fee_tiers.len()"
    },
    {
      "code": 6005,
      "name": "feeTiersNotSorted",
      "msg": "Fee tiers must be sorted by market cap threshold (ascending)"
    },
    {
      "code": 6006,
      "name": "invalidFeeTotal",
      "msg": "Fee total must not exceed 10_000bps"
    },
    {
      "code": 6007,
      "name": "invalidSharingConfig",
      "msg": "Invalid Sharing Config"
    },
    {
      "code": 6008,
      "name": "invalidPool",
      "msg": "Invalid Pool"
    },
    {
      "code": 6009,
      "name": "sharingConfigAdminRevoked",
      "msg": "Sharing config authority has been revoked - sharing config can only be updated once"
    },
    {
      "code": 6010,
      "name": "noShareholders",
      "msg": "No shareholders provided"
    },
    {
      "code": 6011,
      "name": "tooManyShareholders",
      "msg": "format"
    },
    {
      "code": 6012,
      "name": "duplicateShareholder",
      "msg": "Duplicate shareholder address"
    },
    {
      "code": 6013,
      "name": "notEnoughRemainingAccounts",
      "msg": "Not enough remaining accounts"
    },
    {
      "code": 6014,
      "name": "invalidShareTotal",
      "msg": "Invalid share total - must equal 10_000 basis points"
    },
    {
      "code": 6015,
      "name": "shareCalculationOverflow",
      "msg": "Share calculation overflow"
    },
    {
      "code": 6016,
      "name": "notAuthorized",
      "msg": "The given account is not authorized to execute this instruction."
    },
    {
      "code": 6017,
      "name": "zeroShareNotAllowed",
      "msg": "Shareholder cannot have zero share"
    },
    {
      "code": 6018,
      "name": "sharingConfigNotActive",
      "msg": "Fee sharing config is not active"
    },
    {
      "code": 6019,
      "name": "ammAccountsRequiredForGraduatedCoin",
      "msg": "AMM accounts are required for graduated coins"
    },
    {
      "code": 6020,
      "name": "shareholderAccountMismatch",
      "msg": "Remaining account key doesn't match shareholder address"
    },
    {
      "code": 6021,
      "name": "featureDeactivated",
      "msg": "Feature is currently deactivated"
    },
    {
      "code": 6022,
      "name": "userIdTooLong",
      "msg": "User ID exceeds maximum length"
    },
    {
      "code": 6023,
      "name": "deprecatedInstruction",
      "msg": "Instruction is deprecated"
    },
    {
      "code": 6024,
      "name": "feeSharesAlreadyUpdated",
      "msg": "Reward split can only be updated once"
    },
    {
      "code": 6025,
      "name": "mathOverflow",
      "msg": "Math overflow"
    },
    {
      "code": 6026,
      "name": "invalidBuybackIndex",
      "msg": "Invalid buybackindex"
    },
    {
      "code": 6027,
      "name": "claimRateLimitExceeded",
      "msg": "Claim rate limit exceeded"
    },
    {
      "code": 6028,
      "name": "invalidFeeConfigAccount",
      "msg": "Account is not a valid FeeConfig for this instruction"
    },
    {
      "code": 6029,
      "name": "accountTypeNotSupported",
      "msg": "Account type not supported"
    },
    {
      "code": 6030,
      "name": "invalidMint",
      "msg": "Mint does not match quote mint"
    },
    {
      "code": 6031,
      "name": "unsupportedQuoteMint",
      "msg": "Unsupported quote mint"
    }
  ],
  "types": [
    {
      "name": "bondingCurve",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "virtualTokenReserves",
            "type": "u64"
          },
          {
            "name": "virtualQuoteReserves",
            "type": "u64"
          },
          {
            "name": "realTokenReserves",
            "type": "u64"
          },
          {
            "name": "realQuoteReserves",
            "type": "u64"
          },
          {
            "name": "tokenTotalSupply",
            "type": "u64"
          },
          {
            "name": "complete",
            "type": "bool"
          },
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "isMayhemMode",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "buybackVault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "totalClaimed",
            "type": "u64"
          },
          {
            "name": "totalClaimedToken1",
            "type": "u64"
          },
          {
            "name": "totalClaimedToken2",
            "type": "u64"
          },
          {
            "name": "lastClaimed",
            "type": "i64"
          },
          {
            "name": "claimRateLimit",
            "type": "i64"
          },
          {
            "name": "reserved",
            "type": {
              "array": [
                "u8",
                128
              ]
            }
          }
        ]
      }
    },
    {
      "name": "configStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "paused"
          },
          {
            "name": "active"
          }
        ]
      }
    },
    {
      "name": "createFeeSharingConfigEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "bondingCurve",
            "type": "pubkey"
          },
          {
            "name": "pool",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "sharingConfig",
            "type": "pubkey"
          },
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "initialShareholders",
            "type": {
              "vec": {
                "defined": {
                  "name": "shareholder"
                }
              }
            }
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "configStatus"
              }
            }
          }
        ]
      }
    },
    {
      "name": "donationFeePda",
      "docs": [
        "Escrow PDA for donation relay: one per (mint, donation campaign `config_id`)."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "configId",
            "type": "pubkey"
          },
          {
            "name": "baseMint",
            "type": "pubkey"
          },
          {
            "name": "quoteMint",
            "type": "pubkey"
          },
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "totalDonated",
            "type": "u64"
          },
          {
            "name": "lastCrankTs",
            "type": "i64"
          },
          {
            "name": "reserved",
            "type": {
              "array": [
                "u8",
                64
              ]
            }
          }
        ]
      }
    },
    {
      "name": "donationFeePdaCranked",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "signer",
            "type": "pubkey"
          },
          {
            "name": "donationFeePda",
            "type": "pubkey"
          },
          {
            "name": "configId",
            "type": "pubkey"
          },
          {
            "name": "baseMint",
            "type": "pubkey"
          },
          {
            "name": "quoteMint",
            "type": "pubkey"
          },
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "donationFeePdaCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "createdBy",
            "type": "pubkey"
          },
          {
            "name": "donationFeePda",
            "type": "pubkey"
          },
          {
            "name": "configId",
            "type": "pubkey"
          },
          {
            "name": "baseMint",
            "type": "pubkey"
          },
          {
            "name": "quoteMint",
            "type": "pubkey"
          },
          {
            "name": "creator",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "extendFeeConfigEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "feeConfig",
            "type": "pubkey"
          },
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "currentSize",
            "type": "u64"
          },
          {
            "name": "newSize",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "feeConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "docs": [
              "The bump for the PDA"
            ],
            "type": "u8"
          },
          {
            "name": "admin",
            "docs": [
              "The admin account that can update the fee config"
            ],
            "type": "pubkey"
          },
          {
            "name": "flatFees",
            "docs": [
              "The flat fees for non-pump pools"
            ],
            "type": {
              "defined": {
                "name": "fees"
              }
            }
          },
          {
            "name": "feeTiers",
            "docs": [
              "The fee tiers"
            ],
            "type": {
              "vec": {
                "defined": {
                  "name": "feeTier"
                }
              }
            }
          },
          {
            "name": "stableFeeTiers",
            "docs": [
              "The fee tiers"
            ],
            "type": {
              "vec": {
                "defined": {
                  "name": "feeTier"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "feeProgramGlobal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "disableFlags",
            "type": "u8"
          },
          {
            "name": "socialClaimAuthority",
            "type": "pubkey"
          },
          {
            "name": "claimRateLimit",
            "type": "u64"
          },
          {
            "name": "reserved",
            "type": {
              "array": [
                "u8",
                256
              ]
            }
          }
        ]
      }
    },
    {
      "name": "feeTier",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "marketCapLamportsThreshold",
            "type": "u128"
          },
          {
            "name": "fees",
            "type": {
              "defined": {
                "name": "fees"
              }
            }
          }
        ]
      }
    },
    {
      "name": "fees",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lpFeeBps",
            "type": "u64"
          },
          {
            "name": "protocolFeeBps",
            "type": "u64"
          },
          {
            "name": "creatorFeeBps",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "global",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "initialized",
            "type": "bool"
          },
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "feeRecipient",
            "type": "pubkey"
          },
          {
            "name": "initialVirtualTokenReserves",
            "type": "u64"
          },
          {
            "name": "initialVirtualSolReserves",
            "type": "u64"
          },
          {
            "name": "initialRealTokenReserves",
            "type": "u64"
          },
          {
            "name": "tokenTotalSupply",
            "type": "u64"
          },
          {
            "name": "feeBasisPoints",
            "type": "u64"
          },
          {
            "name": "withdrawAuthority",
            "type": "pubkey"
          },
          {
            "name": "enableMigrate",
            "type": "bool"
          },
          {
            "name": "poolMigrationFee",
            "type": "u64"
          },
          {
            "name": "creatorFeeBasisPoints",
            "type": "u64"
          },
          {
            "name": "feeRecipients",
            "type": {
              "array": [
                "pubkey",
                7
              ]
            }
          },
          {
            "name": "setCreatorAuthority",
            "type": "pubkey"
          },
          {
            "name": "adminSetCreatorAuthority",
            "type": "pubkey"
          },
          {
            "name": "createV2Enabled",
            "type": "bool"
          },
          {
            "name": "whitelistPda",
            "type": "pubkey"
          },
          {
            "name": "reservedFeeRecipient",
            "type": "pubkey"
          },
          {
            "name": "mayhemModeEnabled",
            "type": "bool"
          },
          {
            "name": "reservedFeeRecipients",
            "type": {
              "array": [
                "pubkey",
                7
              ]
            }
          }
        ]
      }
    },
    {
      "name": "initializeFeeConfigEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "feeConfig",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "initializeFeeProgramGlobalEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "socialClaimAuthority",
            "type": "pubkey"
          },
          {
            "name": "disableFlags",
            "type": "u8"
          },
          {
            "name": "claimRateLimit",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "optionBool",
      "type": {
        "kind": "struct",
        "fields": [
          "bool"
        ]
      }
    },
    {
      "name": "pool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolBump",
            "type": "u8"
          },
          {
            "name": "index",
            "type": "u16"
          },
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "baseMint",
            "type": "pubkey"
          },
          {
            "name": "quoteMint",
            "type": "pubkey"
          },
          {
            "name": "lpMint",
            "type": "pubkey"
          },
          {
            "name": "poolBaseTokenAccount",
            "type": "pubkey"
          },
          {
            "name": "poolQuoteTokenAccount",
            "type": "pubkey"
          },
          {
            "name": "lpSupply",
            "type": "u64"
          },
          {
            "name": "coinCreator",
            "type": "pubkey"
          },
          {
            "name": "isMayhemMode",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "resetFeeSharingConfigEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "sharingConfig",
            "type": "pubkey"
          },
          {
            "name": "oldAdmin",
            "type": "pubkey"
          },
          {
            "name": "oldShareholders",
            "type": {
              "vec": {
                "defined": {
                  "name": "shareholder"
                }
              }
            }
          },
          {
            "name": "newAdmin",
            "type": "pubkey"
          },
          {
            "name": "newShareholders",
            "type": {
              "vec": {
                "defined": {
                  "name": "shareholder"
                }
              }
            }
          },
          {
            "name": "oldVersion",
            "type": "u8"
          },
          {
            "name": "newVersion",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "setAuthorityEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "oldAuthority",
            "type": "pubkey"
          },
          {
            "name": "newAuthority",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "setClaimRateLimitEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "claimRateLimit",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "setDisableFlagsEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "disableFlags",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "setSocialClaimAuthorityEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "socialClaimAuthority",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "shareholder",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "address",
            "type": "pubkey"
          },
          {
            "name": "shareBps",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "sharingConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "configStatus"
              }
            }
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "adminRevoked",
            "type": "bool"
          },
          {
            "name": "shareholders",
            "type": {
              "vec": {
                "defined": {
                  "name": "shareholder"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "socialFeePda",
      "docs": [
        "Platform identifier: 0=pump, 1=twitter, etc."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "userId",
            "docs": [
              "Max 20 characters to fit u64::MAX (18,446,744,073,709,551,615) as a string.",
              "Actual storage: 4 bytes (length prefix) + 20 bytes (content) = 24 bytes."
            ],
            "type": "string"
          },
          {
            "name": "platform",
            "type": "u8"
          },
          {
            "name": "totalClaimed",
            "type": "u64"
          },
          {
            "name": "lastClaimed",
            "type": "u64"
          },
          {
            "name": "totalStableClaimed",
            "type": "u64"
          },
          {
            "name": "reserved",
            "type": {
              "array": [
                "u8",
                120
              ]
            }
          }
        ]
      }
    },
    {
      "name": "socialFeePdaClaimed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "userId",
            "type": "string"
          },
          {
            "name": "platform",
            "type": "u8"
          },
          {
            "name": "socialFeePda",
            "type": "pubkey"
          },
          {
            "name": "recipient",
            "type": "pubkey"
          },
          {
            "name": "socialClaimAuthority",
            "type": "pubkey"
          },
          {
            "name": "amountClaimed",
            "type": "u64"
          },
          {
            "name": "claimableBefore",
            "type": "u64"
          },
          {
            "name": "lifetimeClaimed",
            "type": "u64"
          },
          {
            "name": "recipientBalanceBefore",
            "type": "u64"
          },
          {
            "name": "recipientBalanceAfter",
            "type": "u64"
          },
          {
            "name": "quoteMint",
            "type": "pubkey"
          },
          {
            "name": "lifetimeStableClaimed",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "socialFeePdaCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "userId",
            "type": "string"
          },
          {
            "name": "platform",
            "type": "u8"
          },
          {
            "name": "socialFeePda",
            "type": "pubkey"
          },
          {
            "name": "createdBy",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "sweepBuybackEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "index",
            "type": "u8"
          },
          {
            "name": "solAmount",
            "type": "u64"
          },
          {
            "name": "tokenAmount",
            "type": "u64"
          },
          {
            "name": "destination",
            "type": "pubkey"
          },
          {
            "name": "buybackVault",
            "type": "pubkey"
          },
          {
            "name": "mint",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "updateAdminEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "oldAdmin",
            "type": "pubkey"
          },
          {
            "name": "newAdmin",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "updateFeeConfigEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "feeConfig",
            "type": "pubkey"
          },
          {
            "name": "feeTiers",
            "type": {
              "vec": {
                "defined": {
                  "name": "feeTier"
                }
              }
            }
          },
          {
            "name": "flatFees",
            "type": {
              "defined": {
                "name": "fees"
              }
            }
          }
        ]
      }
    },
    {
      "name": "updateFeeSharesEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "sharingConfig",
            "type": "pubkey"
          },
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "newShareholders",
            "type": {
              "vec": {
                "defined": {
                  "name": "shareholder"
                }
              }
            }
          },
          {
            "name": "version",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "updateStableFeeConfigEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "feeConfig",
            "type": "pubkey"
          },
          {
            "name": "stableFeeTiers",
            "type": {
              "vec": {
                "defined": {
                  "name": "feeTier"
                }
              }
            }
          },
          {
            "name": "flatFees",
            "type": {
              "defined": {
                "name": "fees"
              }
            }
          }
        ]
      }
    },
    {
      "name": "upsertFeeTiersEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "feeConfig",
            "type": "pubkey"
          },
          {
            "name": "feeTiers",
            "type": {
              "vec": {
                "defined": {
                  "name": "feeTier"
                }
              }
            }
          },
          {
            "name": "offset",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "upsertStableFeeTiersEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "feeConfig",
            "type": "pubkey"
          },
          {
            "name": "stableFeeTiers",
            "type": {
              "vec": {
                "defined": {
                  "name": "feeTier"
                }
              }
            }
          },
          {
            "name": "offset",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "ammCreatorVaultAuthoritySeed",
      "type": {
        "array": [
          "u8",
          13
        ]
      },
      "value": "[99, 114, 101, 97, 116, 111, 114, 95, 118, 97, 117, 108, 116]"
    },
    {
      "name": "buybackVaultSeed",
      "type": {
        "array": [
          "u8",
          13
        ]
      },
      "value": "[98, 117, 121, 98, 97, 99, 107, 45, 118, 97, 117, 108, 116]"
    },
    {
      "name": "debouncerV1",
      "type": "bytes",
      "value": "[100, 101, 98, 111, 117, 110, 99, 101, 114, 95, 118, 49]"
    },
    {
      "name": "donationFeePdaSeed",
      "type": {
        "array": [
          "u8",
          16
        ]
      },
      "value": "[100, 111, 110, 97, 116, 105, 111, 110, 45, 102, 101, 101, 45, 112, 100, 97]"
    },
    {
      "name": "epochTrackerV1",
      "type": "bytes",
      "value": "[101, 112, 111, 99, 104, 95, 116, 114, 97, 99, 107, 101, 114, 95, 118, 49]"
    },
    {
      "name": "feeConfigSeed",
      "type": "bytes",
      "value": "[102, 101, 101, 95, 99, 111, 110, 102, 105, 103]"
    },
    {
      "name": "feeProgramGlobalSeed",
      "type": {
        "array": [
          "u8",
          18
        ]
      },
      "value": "[102, 101, 101, 45, 112, 114, 111, 103, 114, 97, 109, 45, 103, 108, 111, 98, 97, 108]"
    },
    {
      "name": "ixDonatePubkeyConfigIdWithPayerV1",
      "type": {
        "array": [
          "u8",
          8
        ]
      },
      "value": "[120, 217, 57, 241, 135, 104, 139, 184]"
    },
    {
      "name": "maxBuybackIndex",
      "type": "u8",
      "value": "8"
    },
    {
      "name": "mintWhitelistV1",
      "type": "bytes",
      "value": "[109, 105, 110, 116, 95, 119, 104, 105, 116, 101, 108, 105, 115, 116, 95, 118, 49]"
    },
    {
      "name": "pumpCreatorVaultSeed",
      "type": {
        "array": [
          "u8",
          13
        ]
      },
      "value": "[99, 114, 101, 97, 116, 111, 114, 45, 118, 97, 117, 108, 116]"
    },
    {
      "name": "pumpGlobalSeed",
      "docs": [
        "Bonding Curve Program Global Seed"
      ],
      "type": {
        "array": [
          "u8",
          6
        ]
      },
      "value": "[103, 108, 111, 98, 97, 108]"
    },
    {
      "name": "sharingConfigSeed",
      "type": {
        "array": [
          "u8",
          14
        ]
      },
      "value": "[115, 104, 97, 114, 105, 110, 103, 45, 99, 111, 110, 102, 105, 103]"
    },
    {
      "name": "socialFeePdaSeed",
      "type": {
        "array": [
          "u8",
          14
        ]
      },
      "value": "[115, 111, 99, 105, 97, 108, 45, 102, 101, 101, 45, 112, 100, 97]"
    }
  ]
};
