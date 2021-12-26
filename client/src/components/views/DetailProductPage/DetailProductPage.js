import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductImages from "./Sections/ProductImages";
import ProductInfo from "./Sections/ProductInfo";
import { Row, Col } from "antd";

import { addToCart } from "../../../_actions/user_actions";
import { useDispatch } from "react-redux";

const DetailProductPage = props => {
  const dispatch = useDispatch();

  const [product, setProduct] = useState([]);

  const productId = props.match.params.productId;

  useEffect(() => {
    axios
      .get(`/api/product/products_id?id=${productId}&type=single`)
      .then(response => {
        setProduct(response.data[0]);
      });
  }, []);

  const addToCartHandler = productId => {
    dispatch(addToCart(productId));
  };

  return (
    <div className="postPage" style={{ width: "100%", padding: "3rem 4rem" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h1>{product.title}</h1>
      </div>

      <Row gutter={[16, 16]}>
        <Col lg={12} xs={24}>
          <ProductImages detail={product} />
        </Col>
        <Col lg={12} xs={24}>
          <ProductInfo addToCart={addToCartHandler} detail={product} />
        </Col>
      </Row>
    </div>
  );
};

export default DetailProductPage;
