import * as React from "react";
import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import useMediaQuery from "@mui/material/useMediaQuery";
// import ListSubheader from "@mui/material/ListSubheader";
import Popper from "@mui/material/Popper";
import { useTheme, styled } from "@mui/material/styles";
import { VariableSizeList } from "react-window";
import Typography from "@mui/material/Typography";
import { getObjectByValue } from "../../Utility/Constant";

const LISTBOX_PADDING = 8;

function renderRow(props) {
  //   console.log({ props });
  const { data, index, style } = props;
  const dataSet = data[index];
  const inlineStyle = {
    ...style,
    top: style.top + LISTBOX_PADDING,
  };

  return (
    <Typography component="li" {...dataSet[0]} noWrap style={inlineStyle}>
      {dataSet[1].BankBranch} - {dataSet[1].Description}
    </Typography>
  );
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

// Adapter for react-window
const ListboxComponent = React.forwardRef(function ListboxComponent(
  props,
  ref
) {
  const { children, ...other } = props;
  const itemData = [];
  children.forEach((item) => {
    itemData.push(item);
    itemData.push(...(item.children || []));
  });
  // console.log({ props, itemData });

  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up("sm"), {
    noSsr: true,
  });
  const itemCount = itemData.length;
  const itemSize = smUp ? 36 : 48;

  const getChildSize = (child) => {
    if (child.hasOwnProperty("group")) {
      return 48;
    }

    return itemSize;
  };

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize;
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
  };

  const gridRef = useResetCache(itemCount);

  // console.log("33333", { renderRow, itemData }, getChildSize(itemData[0]));

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

ListboxComponent.propTypes = {
  children: PropTypes.node,
};

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
});

export default function VirtualAutoComplete({
  dataList,
  label,
  size,
  className,
  value,
  name,
  onChange,
  ...props
}) {
  // console.log(dataList.slice(0, 4));
  const handleChange = (e, value) => {
    console.log(value);
    onChange({ name: name, value: value });
  };

  // const getOptionLabel = (option) => {
  //   console.log(option);
  // return `${option.BankBranch} - ${option.Description}`; // Replace 'firstKey' and 'secondKey' with your actual keys
  // };

  // const handleChange = (e, value) => {
  //   console.log(value);
  //   onChange({ name: name, value: value.BankBranch });
  // };

  // const getOptionLabel = (option) => {
  //   return `${option.BankBranch} - ${option.Description}`;
  // };

  // const localStateValue = dataList.find((item) => item.BankBranch === value);
  const getTransportObj = getObjectByValue(dataList, "BankBranch", value);
  const localStateValue = {
    _id: "001",
    BankBranch: getTransportObj
      ? `${getTransportObj?.BankBranch} - ${getTransportObj?.Description}`
      : "",
  };

  // console.log(getTransportObj, value);

  return (
    <Autocomplete
      id="toa-virtual-dropdown"
      className={className}
      value={localStateValue}
      disableListWrap
      PopperComponent={StyledPopper}
      ListboxComponent={ListboxComponent}
      options={dataList}
      onChange={handleChange}
      getOptionLabel={(option) => option?.BankBranch}
      // getOptionLabel={(option) => getOptionLabel(option)}
      renderInput={(params) => (
        <TextField
          {...params}
          size={size}
          label={label}
          sx={{
            "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor: "#777777",
              cursor: "not-allowed",
            },
          }}
        />
      )}
      renderOption={(props, option, state) => [props, option, state.index]}
      size={size}
      {...props}
    />
  );
}
