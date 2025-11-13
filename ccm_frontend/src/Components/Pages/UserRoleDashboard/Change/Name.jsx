import React, { useState, useEffect, memo } from "react";
import { TextField, Button, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useParams } from "react-router-dom";

const Name = ({ inputData, onDataChange, name, isSubmit, getJobData }) => {
  const role = localStorage.getItem("role");
  const [inputs, setInputs] = useState(inputData || []);
  const { action } = useParams();
  useEffect(() => {
    if (inputData !== undefined) {
      setInputs(inputData);
    } else {
      setInputs([""]);
    }
  }, [inputData]);

  const handleInputChange = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
    onDataChange(name, newInputs);
  };

  const handleAddInput = () => {
    const newInputs = [...inputs, ""];
    setInputs(newInputs);
    onDataChange(name, newInputs);
  };

  const handleRemoveInput = (index) => {
    const newInputs = inputs.filter((_, i) => i !== index);
    setInputs(newInputs);
    onDataChange(name, newInputs);
  };
  return (
    <div>
      {inputs?.map((input, index) => (
        <Box
          key={index}
          sx={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
        >
          <TextField
            fullWidth
            className="w-full p-8"
            required
            size="small"
            name="name"
            label="Name"
            value={input}
            onChange={(e) => handleInputChange(index, e.target.value)}
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#777777",
                cursor: "not-allowed",
              },
              marginBottom: "1rem",
            }}
            inputProps={{ maxLength: 35 }}
            error={isSubmit && !input ? true : false}
            disabled={
              role === "AR Master"
                ? getJobData?.isArMasterApproved
                : action === "view" || action === "status"
                ? true
                : false
            }
          />
          {inputs.length > 1 && action !== "view" && action !== "status" && (
            <Button
              variant="outlined"
              size="small"
              color="error"
              sx={{ margin: "0 0 1rem 1rem" }}
              onClick={() => handleRemoveInput(index)}
            >
              <DeleteIcon />
            </Button>
          )}
        </Box>
      ))}
      {inputs.length < 4 && action !== "view" && action !== "status" && (
        <Button
          sx={{
            marginBottom: "1rem",
            float: "right",
          }}
          variant="outlined"
          size="medium"
          onClick={handleAddInput}
        >
          <AddIcon /> Add More
        </Button>
      )}
    </div>
  );
};

export default memo(Name);
