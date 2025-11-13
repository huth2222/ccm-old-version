import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { getAxiosCall } from "../Utility/HelperFunction";

export const userDashboardStore = create(
  devtools(
    (set) => ({
      jobList: [],
      isLoading: true,
      job: {},
      isJobLoaded: false,
      approveSequenceData: [],
      filterOptionList: {
        companyCodeSelection: [],
        distChannelSelection: [],
        statusSelection: [],
        statusSelectionDefault: "",
      },
      changeCustomerData: {
        NAME1: "",
        NAME2: "",
        NAME3: "",
        NAME4: "",
      },

      fetchJobList: async () => {
        const responseData = await getAxiosCall("job");
        if (responseData.status === 200) {
          const jobList = responseData.data;
          set({ jobList });
          set({ isLoading: false });
        } else {
          set({ isLoading: true });
        }
      },

      fetchJob: async (jobId) => {
        const responseData = await getAxiosCall(`job/${jobId}`);
        if (responseData.status === 200) {
          const job = responseData.data.data.job;
          const approveSequenceData = responseData.data.data.approveSequnceData;
          const changeCustomerData = responseData.data.data.customer;
          set({
            job,
            approveSequenceData,
            changeCustomerData: {
              NAME1: changeCustomerData?.NAME1,
              NAME2: changeCustomerData?.NAME2,
              NAME3: changeCustomerData?.NAME3,
              NAME4: changeCustomerData?.NAME4,
            },
          });
          set({ isJobLoaded: true });
        } else {
          set({ isJobLoaded: false });
        }
      },

      getSelectionData: async () => {
        const responseData = await getAxiosCall("users/getSelection");
        // console.log(responseData);
        if (responseData.status === 200) {
          const filterOptionList = responseData.data;
          set({ filterOptionList });
        } else {
          set({
            filterOptionList: {
              companyCodeSelection: [],
              distChannelSelection: [],
              statusSelection: [],
              statusSelectionDefault: "",
            },
          });
        }
      },
      filterJob: async (url) => {
        const responseData = await getAxiosCall(url);
        set({ isLoading: true });
        // console.log(responseData);
        if (responseData.status === 200) {
          const jobList = responseData.data;
          set({ jobList });
          set({ isLoading: false });
        } else {
          set({ isLoading: false, jobList: [] });
        }
      },
      setJobLoadedStateFalse: () => set(() => ({ isJobLoaded: false })),
      resetJobStoreData: () =>
        set({ job: {}, approveSequenceData: [], isJobLoaded: false }),
    }),
    { enabled: false }
  )
);
