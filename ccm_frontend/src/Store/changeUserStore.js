import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { getAxiosCall } from "../Utility/HelperFunction";

export const changeUserStore = create(
  devtools((set) => ({
    selectedChangeOption: {
      name: false,
      telephoneNo: false,
      address: false,
      email: false,
      billingAddress: false,
      creditLimt: false,
      priceList: false,
      paymentTerm: false,
    },

    verifyObjChange: {
      customerId: "",
        channel: "",
        companyCode: "",
        salesDistrict: "",
    },

    updateSelectionState: (data) => {
      set({ selectedChangeOption: data });
    },
    updateVerifyObjChange: (data) => {
      set({ verifyObjChange: data });
    },
  })),
  { enabled: false }
);
