const doaCondition = {
    "userSelect": {
        "1100": {
            "10": ["SGH", "Div Head"],
            "20": ["Div Head"],
            "30": ["Div Head"],
            "40": ["Div Head"],
            "50": ["Div Head"],
            "60": ["Div Head"],
        },
        "1200": {
            "10": ["SGH", "Div Head"],
            "20": ["SGH", "Div Head"],
            "30": ["Div Head"],
            "40": ["Div Head"],
            "50": ["Div Head"],
            "60": ["Div Head"],
        },
        "5100": {
            "10": ["CM", "FAD", "CD"],
            "20": ["CM", "FAD", "CD"],
            "30": ["CM", "FAD", "CD"],
            "40": ["CM", "FAD", "CD"],
            "50": ["CM", "FAD", "CD"],
            "60": ["CM", "FAD", "CD"],
        }
    },
    "jobType": {
        "newCustomer": {
            "companyCode": {
                "1100": {
                    "channel": {
                        "10": ["SGH", "Div Head"],
                        "20": ["Div Head"],
                        "30": ["Div Head"],
                        "40": ["Div Head"],
                        "50": ["Div Head"],
                        "60": ["Div Head"],
                    },
                    "condition": {
                        "creditLimit": {
                            "step": "onlyOne",
                            "condition": "moreThan",
                            "value": "500000",
                            "approval": "CEO",
                        },
                        "paymentTerm": {
                            "step": "onlyOne",
                            "value": "More than 30 days",
                            "approval": "CEO",
                            "needCoApprover": true,
                            "coApprover": "CFO",
                        },
                    }
                },
                "1200": {
                    "channel": {
                        "10": ["SGH", "Div Head"],
                        "20": ["SGH", "Div Head"],
                        "30": ["Div Head"],
                        "40": ["Div Head"],
                        "50": ["Div Head"],
                        "60": ["Div Head"],
                    },
                    "condition": {
                        "creditLimit": {
                            "step": "onlyOne",
                            "condition": "moreThan",
                            "value": "500000",
                            "approval": "CEO",
                        },
                        "paymentTerm": {
                            "step": "onlyOne",
                            "value": "More than 30 days",
                            "approval": "CEO",
                            "needCoApprover": true,
                            "coApprover": "CFO",
                        },
                    }
                },
                "5100": {
                    "channel": {
                        "10": ["CM", "FAD"],
                        "20": ["CM", "FAD"],
                        "30": ["CM", "FAD"],
                        "40": ["CM", "FAD"],
                        "50": ["CM", "FAD"],
                        "60": ["CM", "FAD"],
                    },
                    "condition": {
                        "creditLimit": {
                            "step": "multipleStep",
                            "condition": ["moreThan", "moreThan"],
                            "value": ["1400000000", "1800000000"],
                            "approval": ["CD", "CEO"]
                        },
                        "priceList": {
                            "step": "onlyOne",
                            "value": "XL",
                            "approval": "Div Head",
                        },
                    }
                },
            }
        },
        "changeCustomer": {
            "companyCode": {
                "1100": {
                    "channel": {
                        "10": ["SGH", "Div Head"],
                        "20": ["Div Head"],
                        "30": ["Div Head"],
                        "40": ["Div Head"],
                        "50": ["Div Head"],
                        "60": ["Div Head"],
                    },
                    "condition": {
                        "creditLimit": {
                            "step": "onlyOne",
                            "condition": "moreThan",
                            "value": "1000000",
                            "approval": "CEO",
                        },
                        "paymentTerm": {
                            "step": "onlyOne",
                            "value": "More than 30 days",
                            "approval": "CEO",
                            "needCoApprover": true,
                            "coApprover": "CFO",
                        },
                    }
                },
                "1200": {
                    "channel": {
                        "10": ["SGH", "Div Head"],
                        "20": ["SGH", "Div Head"],
                        "30": ["Div Head"],
                        "40": ["Div Head"],
                        "50": ["Div Head"],
                        "60": ["Div Head"],
                    },
                    "condition": {
                        "creditLimit": {
                            "step": "onlyOne",
                            "condition": "moreThan",
                            "value": "500000",
                            "approval": "CEO",
                        },
                        "paymentTerm": {
                            "step": "onlyOne",
                            "value": "More than 30 days",
                            "approval": "CEO",
                            "needCoApprover": true,
                            "coApprover": "CFO",
                        },
                    }
                },
                "5100": {
                    "channel": {
                        "10": ["CM"],
                        "20": ["CM"],
                        "30": ["CM"],
                        "40": ["CM"],
                        "50": ["CM"],
                        "60": ["CM"],
                    },
                    "condition": {
                        "creditLimit": {
                            "step": "multipleStep",
                            "condition": ["lessThanOrEqual", "moreThan", "moreThan"],
                            "value": ["10000000000", "10000000000", "20000000000"],
                            "approval": ["FAD", "CD", "CEO"]
                        },
                        "priceList": {
                            "step": "onlyOne",
                            "value": "XL",
                            "approval": "CD",
                        },
                        "paymentTerm": {
                            "step": "onlyOne",
                            "value": "More than 30 days",
                            "approval": "CD",
                            "needCoApprover": true,
                            "coApprover": "FAD",
                        },
                    }
                },
            }
        }
    }
}

module.exports = doaCondition;
