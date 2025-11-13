import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function MyDatePicker({ className, onChange, name, value, label, ...props }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={className}>
        <DatePicker
          label={label}
          value={value || ""}
          onChange={onChange}
          slotProps={{ textField: { size: "small", error: false } }}
          helperText={null}
          format="DD/MM/YYYY"
          {...props}
          sx={{
            "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor: "#777777",
              cursor: "not-allowed",
            },
          }}
        />
      </div>
    </LocalizationProvider>
  );
}

export default MyDatePicker;
