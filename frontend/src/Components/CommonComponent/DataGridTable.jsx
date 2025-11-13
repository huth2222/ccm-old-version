import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from "@mui/x-data-grid";
// import { useTranslation } from "react-i18next";
// import ReportFooter from "../Footer/ReportFooter";

const CustomToolbar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
};

const DataGridTable = ({
  className,
  rows,
  columns,
  loading,
  exportNotNeed = "false",
  ...other
}) => {
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(0);
  const [sortModel, setSortModel] = useState([]);
  useEffect(() => {
    setPage(0);
    setPageSize(20);
    setSortModel([]);
  }, [rows]);

  return (
    <>
      <DataGrid
        className={className}
        page={page}
        onPageChange={(newPage) => setPage(newPage)}
        rows={Array.isArray(rows) ? rows : []}
        columns={columns}
        loading={loading}
        sortModel={sortModel}
        onSortModelChange={(newSortModel) => setSortModel(newSortModel)}
        slots={{
          toolbar: !exportNotNeed && CustomToolbar,
        }}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => {
          setPageSize(newPageSize);
        }}
        rowsPerPageOptions={[20, 50, 100]}
        disableSelectionOnClick
        autoHeight={true}
        disableColumnMenu={true}
        disableRowSelectionOnClick
        // disableColumnSelector={true}
        checkboxSelection
        initialState={{
          pagination: { paginationModel: { pageSize: 25 } },
        }}
        localeText={{
          noRowsLabel: "Data Not Available.",
        }}
        sx={{
          "& .MuiDataGrid-cell:hover": {
            color: "primary.main",
          },
        }}
        {...other}
      />
      {/* {totalWithTitle && <ReportFooter title={totalWithTitle} />} */}
    </>
  );
};

export default DataGridTable;
