import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  getCartItems,
  removeCartItem,
  onSuccessBuy
} from "../../../_actions/user_actions";
import UserCardBlock from "./Sections/UserCartBlock";
import { Result, Empty } from "antd";
import Paypal from "../../utils/Paypal";

const CartPage = props => {
  const dispatch = useDispatch();

  const [Total, setTotal] = useState(0);
  const [showTotal, setShowTotal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    let cartItems = [];
    if (props.user.userData && props.user.userData.cart) {
      if (props.user.userData.cart.length > 0) {
        props.user.userData.cart.forEach(item => {
          cartItems.push(item.id);
        });
        dispatch(getCartItems(cartItems, props.user.userData.cart));
      }
    }
  }, [props.user.userData]);

  useEffect(() => {
    if (props.user.cartDetail && props.user.cartDetail.length > 0) {
      calculateTotal(props.user.cartDetail);
    }
  }, [props.user.cartDetail]);

  const calculateTotal = () => {
    let total = 0;
    props.user.cartDetail.map(item => {
      total += parseInt(item.price) * item.quantity;
    });
    setTotal(total);
    setShowTotal(true);
  };

  const removeFromCart = productId => {
    dispatch(removeCartItem(productId)).then(response => {
      if (response.payload.cartDetail.length <= 0) {
        setShowTotal(false);
      } else {
        calculateTotal(response.payload.cartDetail);
      }
    });
  };

  const transactionSuccess = data => {
    let variables = {
      cartDetail: props.user.cartDetail,
      payment: data
    };
    axios.post("/api/users/successBuy", variables).then(res => {
      if (res.data.success) {
        setShowSuccess(true);
        setShowTotal(false);

        dispatch(
          onSuccessBuy({ cart: res.data.cart, cartDetail: res.data.cartDetail })
        );
      } else {
        alert("Wrong data");
      }
    });
  };

  const transactionError = () => {
    console.log("Transaction failed");
  };

  const transactionCanceled = () => {
    console.log("Transaction canceled");
  };

  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <h1>My Cart</h1>
      <div>
        <UserCardBlock
          products={props.user.cartDetail}
          removeItem={removeFromCart}
        />

        {showTotal ? (
          <div style={{ marginTop: "3rem" }}>
            <h2>Total amount: ${Total} </h2>
          </div>
        ) : showSuccess ? (
          <Result status="success" title="Successfully Purchased Items" />
        ) : (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            <br />
            <Empty description={false} />
            <p>No Items In the Cart</p>
          </div>
        )}
      </div>
      {showTotal && (
        <Paypal
          toPay={Total}
          onSuccess={transactionSuccess}
          onError={transactionError}
          onCancel={transactionCanceled}
        />
      )}
    </div>
  );
};

export default CartPage;
