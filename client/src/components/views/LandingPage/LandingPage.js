import React, { useEffect, useState } from "react";
import ImageSlider from "../../utils/ImageSlider";
import { FaCode, FaIgloo } from "react-icons/fa";
import axios from "axios";
import { Icon, Row, Col, Card } from "antd";
import Meta from "antd/lib/card/Meta";
import CheckboxFilter from "./Sections/Checkbox";
import Radiobox from "./Sections/Radiobox";
import { price, continents } from "./Sections/data";
import SearchFeature from "./Sections/SearchFeature";

function LandingPage() {
  const [products, setProducts] = useState([]);
  const [skip, setSkip] = useState(0);
  const [limit, setLimt] = useState(8);
  const [postSize, setPostSize] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const [Filters, setFilters] = useState({
    continets: [],
    price: []
  });

  useEffect(() => {
    const variables = {
      skip: skip,
      limit: limit
    };
    getProducts(variables);
  }, []);

  const getProducts = variables => {
    axios.post("/api/product/getProducts", variables).then(res => {
      if (res.data.success) {
        if (variables.loadMore) {
          setProducts([...products, ...res.data.products]);
        } else {
          setProducts(res.data.products);
        }

        setPostSize(res.data.postSize);

        console.log(res.data.products);
      } else {
        alert("Failed to fetch data");
      }
    });
  };

  const onLoadMore = () => {
    let Skip = skip + limit;

    const variables = {
      skip: Skip,
      limit: limit,
      loadMore: true
    };

    getProducts(variables);
    setSkip(Skip);
  };

  const showFilteredResults = filters => {
    const variables = {
      skip: 0,
      limit: limit,
      filters: filters
    };

    getProducts(variables);
    setSkip(0);
  };

  const handlePrice = value => {
    const data = price;
    let array = [];

    for (let key in data) {
      if (data[key]._id === parseInt(value, 10)) {
        array = data[key].array;
      }
    }
    console.log("array", array);
    return array;
  };

  const handleFilters = (filters, category) => {
    console.log(filters);
    const newFilters = { ...Filters };
    newFilters[category] = filters;

    if (category === "price") {
      let priceValue = handlePrice(filters);
      newFilters[category] = priceValue;
    }

    showFilteredResults(newFilters);
    setFilters(newFilters);
  };

  const updateSearchterm = newTerm => {
    setSearchTerm(newTerm);

    //console.log(newTerm)

    const variables = {
      skip: 0,
      limit: limit,
      filters: Filters,
      searchTerm: newTerm
    };

    setSkip(0);
    getProducts(variables);
  };

  const rederCards = products.map((product, i) => {
    return (
      <Col lg={6} md={8} xs={24}>
        <Card
          hoverable={true}
          cover={
            <a href={`/product/${product._id}`}>
              <ImageSlider images={product.images} />
            </a>
          }
        >
          <Meta title={product.title} description={`$${product.price}`} />
        </Card>
      </Col>
    );
  });

  return (
    <>
      <div style={{ width: "75%", margin: "3rem auto" }}>
        <div style={{ textAlign: "center" }}>
          <h2>
            Lets travel together <Icon type="rocket" />{" "}
          </h2>
        </div>

        <Row gutter={[16, 16]}>
          <Col lg={12} xs={24}>
            <CheckboxFilter
              handleFilters={filters => handleFilters(filters, "continents")}
              list={continents}
            />
          </Col>
          <Col lg={12} xs={24}>
            <Radiobox
              list={price}
              handleFilters={filters => handleFilters(filters, "price")}
            />
          </Col>
        </Row>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            margin: "1rem auto"
          }}
        >
          <SearchFeature refreshFunction={updateSearchterm} />
        </div>

        {products.length === 0 ? (
          <div
            style={{
              display: "flex",
              height: "300px",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <h2>No posts yet...</h2>
          </div>
        ) : (
          <div>
            <Row gutter={[16, 16]}>{rederCards}</Row>
          </div>
        )}

        <br />
        <br />
        {postSize >= limit && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button onClick={onLoadMore}>Load More</button>
          </div>
        )}
      </div>
    </>
  );
}

export default LandingPage;
