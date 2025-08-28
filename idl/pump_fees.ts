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
        }
      ],
      "returns": {
        "defined": {
          "name": "fees"
        }
      }
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
    }
  ],
  "accounts": [
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
    }
  ],
  "events": [
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
      "name": "zeroMarketCap",
      "msg": "Market cap must be greater than 0"
    },
    {
      "code": 6008,
      "name": "zeroTradeSize",
      "msg": "Trade size must be greater than 0"
    }
  ],
  "types": [
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
    }
  ],
  "constants": [
    {
      "name": "feeConfigSeed",
      "type": "bytes",
      "value": "[102, 101, 101, 95, 99, 111, 110, 102, 105, 103]"
    }
  ]
};
