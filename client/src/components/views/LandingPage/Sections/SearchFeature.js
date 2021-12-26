import React, { useState } from "react";
import { Input } from "antd";

const { Search } = Input;

const SearchFeature = (props) => {
  const [searchTerm, setSearchTerm] = useState("");

  const onSearch = e => {
    setSearchTerm(e.currentTarget.value);

    props.refreshFunction(e.currentTarget.value)
  };

  return (
    <div>
      <Search
        value={searchTerm}
        onChange={onSearch}
        placeholder="Search destination"
      />
    </div>
  );
};

export default SearchFeature;
