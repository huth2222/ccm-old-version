import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { getAxiosCall } from "../Utility/HelperFunction";
import { data } from "autoprefixer";

const devtoolsEnabled = true;

const createUser = create(
  devtools(
    (set) => ({
      bears: 0,
      isSubmitClicked: false,

      sendSubmitTrue: () => set({ isSubmitClicked: true }),
      sendSubmitFalse: () => set({ isSubmitClicked: false }),
      increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
      removeAllBears: () => set({ bears: 0 }),
    }),
    { enabled: false }
  )
);

const useUserDataStore = create(
  devtools(
    (set) => ({
      isSubmited: false,
      updateSubmitTrueState: () => set(() => ({ isSubmited: true })),
      updateSubmitFalseState: () => set(() => ({ isSubmited: false })),
    }),
    { enabled: false }
  )
);

const fetchDataList = create(
  devtools(
    (set) => ({
      countryList: [],
      transportZoneList: [],
      salesOfficeList: [],
      salesDistrictList: [],
      salesGroupList: [],
      customerGroupList: [],
      shippingConditionList: [],
      dataPriceList: [],
      paymentTermList: [],
      dataRegion: [],
      dataGender: [],
      isCountryLoaded: false,
      isTransPortDataLoaded: false,
      generalInfoDataState: {},
      attributeList: [],
      classificationList: [],
      deliveryPriorityList: [],
      incotermsList: [],
      incotermsLocationList: [],
      bankBranchList: [],
      bankBranchCodeList: [],
      carrierCodeList: [],

      bpGroupList: [],
      languageList: [],
      tradingPartnerList: [],
      reconciliationList: [],
      riskClassList: [],
      checkRulesList: [],
      currencyList: [],
      exchangeRateTypeList: [],
      accountAssignmentList: [],
      taxClassificationList: [],
      withHoldingTaxList: [],

      setGeneralDateInStore: (data) => {
        set({ generalInfoDataState: data });
      },

      fetchDropDownData: async (code) => {
        const responseData = await getAxiosCall(`data/allDropDownData/${code}`);
        if (responseData.status === 200) {
          const countryList = responseData.data.data?.DataCountry?.sort(
            (a, b) => {
              return a.Description.localeCompare(b.Description);
            }
          );
          set({ countryList });

          if (countryList.length > 0) {
            set({ isCountryLoaded: true });
          } else {
            set({ isCountryLoaded: false });
          }

          const transportZoneList =
            responseData.data.data?.DataTransportationZone?.sort((a, b) => {
              return a.TransportationZone.localeCompare(b.TransportationZone);
            });
          set({ transportZoneList });

          if (transportZoneList?.length > 0) {
            set({ isTransPortDataLoaded: true });
          } else {
            set({ isTransPortDataLoaded: false });
          }

          const salesOfficeList = responseData.data.data?.DataSalesOffice?.sort(
            (a, b) => {
              return a.Description.localeCompare(b.Description);
            }
          );
          set({ salesOfficeList });

          const salesDistrictList =
            responseData.data.data?.DataSalesDistrict?.sort((a, b) => {
              return a.Description.localeCompare(b.Description);
            });
          set({ salesDistrictList });

          // const salesGroupList = responseData.data.data.DataSalesGroup?.sort(
          //   (a, b) => {
          //     return a.Description?.localeCompare(b.Description);
          //   }
          // );
          // set({ salesGroupList });

          const customerGroupList =
            responseData.data.data?.DataCustomerGroup?.sort((a, b) => {
              return a.Description.localeCompare(b.Description);
            });
          set({ customerGroupList });

          const shippingConditionList =
            responseData.data.data?.DataShippingCondition?.sort((a, b) => {
              return a.Description.localeCompare(b.Description);
            });
          set({ shippingConditionList });

          const dataPriceList = responseData.data.data?.DataPriceList ?? [];
          set({ dataPriceList });

          const paymentTermList = responseData.data.data?.DataPaymentTerm ?? [];
          set({ paymentTermList });

          const dataRegion = responseData.data.data?.DataRegion ?? [];
          set({ dataRegion });

          const dataGender = responseData.data.data?.DataGender ?? [];
          set({ dataGender });
          const carrierCodeList = responseData.data.data?.DataCarrier ?? [];
          set({ carrierCodeList });

          const attributeList = responseData.data.data?.DataAttributeOne?.sort(
            (a, b) => {
              return a.Description.localeCompare(b.Description);
            }
          );
          set({ attributeList });

          const classificationList =
            responseData.data.data?.DataCustomerClassification?.sort((a, b) => {
              return a.Description.localeCompare(b.Description);
            });
          set({ classificationList });

          const deliveryPriorityList =
            responseData.data.data?.DataDeliveryPriority?.sort((a, b) => {
              return a.Description.localeCompare(b.Description);
            });
          set({ deliveryPriorityList });

          const incotermsList = responseData.data.data?.DataIncoterm?.sort(
            (a, b) => {
              return a.Description.localeCompare(b.Description);
            }
          );
          set({ incotermsList });

          const bankBranchList = responseData.data.data?.DataBankBranch?.sort(
            (a, b) => {
              return a.BankBranch.localeCompare(b.BankBranch);
            }
          );
          set({ bankBranchList });

          const bankBranchCodeList =
            responseData.data.data?.DataBankBranch?.sort((a, b) => {
              a.BankBranch.localeCompare(b.BankBranch);
            }).map((bank) => bank.BankBranch);
          set({ bankBranchCodeList });

          const bpGroupList = responseData.data.data?.DataBPGroup?.sort(
            (a, b) => {
              return a.BPGroup.localeCompare(b.BPGroup);
            }
          );
          set({ bpGroupList });

          const languageList = responseData.data.data?.DataLanguage?.sort(
            (a, b) => {
              return a.Language.localeCompare(b.Language);
            }
          );
          set({ languageList });

          const tradingPartnerList =
            responseData.data.data?.DataTradingPartner?.sort((a, b) => {
              return a.TradingPartner.localeCompare(b.TradingPartner);
            });
          set({ tradingPartnerList });

          const reconciliationList =
            responseData.data.data?.DataReconciliationAccount?.sort((a, b) => {
              return a.ReconciliationAccount.localeCompare(
                b.ReconciliationAccount
              );
            });
          set({ reconciliationList });

          const riskClassList = responseData.data.data?.DataRiskClass?.sort(
            (a, b) => {
              return a.RiskClass.localeCompare(b.RiskClass);
            }
          );
          set({ riskClassList });

          const checkRulesList = responseData.data.data?.DataCheckRule?.sort(
            (a, b) => {
              return a.CheckRule.localeCompare(b.CheckRule);
            }
          );
          set({ checkRulesList });

          const currencyList = responseData.data.data?.DataCurrency?.sort(
            (a, b) => {
              return a.Currency.localeCompare(b.Currency);
            }
          );
          set({ currencyList });

          const exchangeRateTypeList =
            responseData.data.data?.DataExchangeRateType?.sort((a, b) => {
              return a.ExchangeRateType.localeCompare(b.ExchangeRateType);
            });
          set({ exchangeRateTypeList });

          const accountAssignmentList =
            responseData.data.data?.DataAccountAssignmentGroup ?? [];
          set({ accountAssignmentList });

          const taxClassificationList =
            responseData.data.data?.DataTaxClassification ?? [];
          set({ taxClassificationList });

          const withHoldingTaxList =
            responseData.data.data?.DataWithholdingTaxCode ?? [];
          set({ withHoldingTaxList });
        } else {
          set({ isCountryLoaded: false });
        }
      },

      fetchSalesGroupData: async (saleOffice, companyCode) => {
        const responseData = await getAxiosCall(
          `data/getSalesGroup/${saleOffice}/${companyCode}`
        );
        if (responseData.status === 200) {
          // console.log(responseData, ".................");
          // const salesGroupListARMaster = responseData.data.data?.DataSalesGroup;
          // set({ salesGroupListARMaster });
          const salesGroupList = responseData.data.data?.sort((a, b) => {
            return a.SaleGroupDescription?.localeCompare(
              b.SaleGroupDescription
            );
          });
          set({ salesGroupList });
        }
      },

      resetDataList: () => {
        set({ countryList: [] });
        set({ transportZoneList: [] });
        set({ salesOfficeList: [] });
        set({ salesDistrictList: [] });
        set({ salesGroupList: [] });
        set({ customerGroupList: [] });
        set({ shippingConditionList: [] });
        set({ dataPriceList: [] });
        set({ paymentTermList: [] });
        set({ transportZoneList: [] });
      },
    }),
    { enabled: false }
  )
);

const useVerifyStore = create(
  devtools(
    (set) => ({
      verify: {},
      updateVerifyDataState: (data) =>
        set((state) => ({
          verify: {
            ...state.verify,
            ...data,
          },
        })),
    }),
    { enabled: false }
  )
);

const useSalesStore = create(
  devtools(
    (set) => ({
      saleInfomation: {
        saleEmployeeCode: "",
        saleEmployeeName: "",
        carrierCode: "",
        carrierName: "",
        salesOffice: "",
        salesDistrict: "",
        salesGroup: "",
        customerGroup: "",
        shippingCondition: "",
        paymentTerm: "",
        creditLimit: "",
        priceList: "",
        branchCode: "",
        description: "",
      },
      updateSalesDataState: (salesData) =>
        set((state) => ({
          saleInfomation: {
            ...state.saleInfomation,
            ...salesData,
          },
        })),
    }),
    { enabled: false }
  )
);

const useAuthorizeStore = create(
  devtools(
    (set) => ({
      authorizeDirector: [],
      updateAuthorizeDataState: (data) =>
        set((state) => ({
          authorizeDirector: data,
        })),
    }),
    { enabled: false }
  )
);

export const useInternationalAddressDataStore = create(
  devtools((set) => ({
    intnlStoreAddress: {},
    updateAddressDataIntoStore: (data) =>
      set((state) => ({
        intnlStoreAddress: {
          ...state.intnlStoreAddress,
          ...data,
        },
      })),
  }))
);

const useBillingStore = create(
  devtools(
    (set) => ({
      billingAddress: {
        billingAddressChoose: "sameAddress",
      },
      billingStoreData: {},
      updateBillingAddressDataState: (data) =>
        set((state) => ({
          billingAddress: {
            ...state.billingAddress,
            ...data,
          },
        })),
      updateBillingInfo: (data) =>
        set((state) => ({
          billingStoreData: {
            ...state.billingStoreData,
            ...data,
          },
        })),
    }),
    { enabled: false }
  )
);

const useUploadItemStore = create(
  devtools(
    (set) => ({
      uploadItems: [],
      updateUploadItemsState: (data) =>
        set((state) => ({
          // uploadItems: state.uploadItems.concat(data),
          uploadItems: data,
        })),
    }),
    { enabled: false }
  )
);

const useGeneralInfoStore = create(
  devtools(
    (set) => ({
      data: {},
      id: "",
      updateGeneralInfoDataState: (dataList) =>
        set((state) => ({
          data: {
            dataList,
          },
        })),
      updateResponseJobIdState: (jobid) => {
        set(() => ({ id: jobid }));
      },
      resetSavedPayloadStoreData: () => {
        set({ data: {}, id: "" });
      },
    }),
    { enabled: false }
  )
);

export {
  createUser,
  fetchDataList,
  useVerifyStore,
  useSalesStore,
  useAuthorizeStore,
  useBillingStore,
  useUploadItemStore,
  useGeneralInfoStore,
  useUserDataStore,
};
