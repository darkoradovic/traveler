import React, { useState } from "react";
import { Typography, Button, Form, message, Input, Icon } from "antd";
import FIleUpload from "../../utils/FIleUpload";
import axios from "axios";

const { Title } = Typography;
const { TextArea } = Input;

const Continents = [
  { key: 1, value: "Africa" },
  { key: 2, value: "Europe" },
  { key: 3, value: "Australia" },
  { key: 4, value: "Asia" },
  { key: 5, value: "South America" },
  { key: 6, value: "North America" },
  { key: 7, value: "Antartica" }
];

const Upload = props => {
  const [titleValue, setTitleValue] = useState("");
  const [descValue, setDescValue] = useState("");
  const [priceValue, setPriceValue] = useState(0);
  const [continentValue, setContinentValue] = useState(1);

  const [Images, setImages] = useState([]);

  const onTitleChange = e => {
    setTitleValue(e.target.value);
  };

  const onDescChange = e => {
    setDescValue(e.target.value);
  };

  const onPriceChange = e => {
    setPriceValue(e.target.value);
  };

  const onContinent = e => {
    setContinentValue(e.target.value);
  };

  const updateImages = newImages => {
    console.log(newImages);
    setImages(newImages);
  };

  const onSubmit = e => {
    e.preventDefault();

    if (
      !titleValue ||
      !descValue ||
      !priceValue ||
      !continentValue ||
      !Images
    ) {
      return alert("Fill all the fields");
    }

    const variables = {
      writer: props.user.userData._id,
      title: titleValue,
      description: descValue,
      price: priceValue,
      images: Images,
      continents: continentValue
    };

    axios.post("/api/product/uploadProduct", variables).then(res => {
      if (res.data.success) {
        alert("Product uploaded");
        props.history.push("/");
      } else {
        alert("Failed to load product");
      }
    });
  };

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title>Upload travel product</Title>
      </div>

      <Form onSubmit={onSubmit}>
        <FIleUpload refreshFunction={updateImages} />
        <br />
        <br />
        <label>Title</label>
        <Input onChange={onTitleChange} value={titleValue} />
        <br />
        <br />
        <label>Description</label>
        <TextArea onChange={onDescChange} value={descValue} />
        <br />
        <br />
        <label>Price</label>
        <Input onChange={onPriceChange} value={priceValue} type="number" />
        <br />
        <br />
        <select onChange={onContinent}>
          {Continents.map(item => (
            <option key={item.key} value={item.key}>
              {item.value}
            </option>
          ))}
        </select>
        <br />
        <br />

        <Button onClick={onSubmit}>Submit</Button>
      </Form>
    </div>
  );
};

export default Upload;
