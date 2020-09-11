import React, { useState, useContext, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import getLogin from "../../../Context/Context";
import AlertModal from "../../../Modal/AlertModal";
const FormData = require("form-data");

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 10px;
`;

const EditSubmitButton = ({ data, image }) => {
  const value = useContext(getLogin);
  const [modal, getModal] = useState(false);
  const [children, getChildren] = useState("");
  const [className, getClassName] = useState("");
  const [contentIdModify, getContentIdModify] = useState("");
  const getToken = window.sessionStorage.getItem("token");
  let splitUrl = window.location.href.split("/");
  let contentId = splitUrl[4];
  const url = `http://localhost:5000/content/${contentId}`;
  let history = useHistory();
  let location = useLocation();

  useEffect(() => {
    return () => {
      value.handleIsChecking();
    };
  }, [location]);

  const openModal = () => {
    getModal(!modal);
  };

  const closeModal = () => {
    getModal(!modal);
  };

  const handleCancle = event => {
    event.preventDefault();
    value.handleIsChecking();
    history.push(`/content/${contentId}`);
  };

  const submitButton = event => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("imgFile", image);
    formData.append("title", data.title);
    formData.append("text", data.text);
    formData.append("covid_date", data.covid_date);
    formData.append("q_temp", data.q_temp);
    formData.append("q_resp", data.q_resp);
    formData.append("q_cough", data.q_cough);
    formData.append("q_appet", data.q_appet);
    formData.append("q_sleep", data.q_sleep);
    formData.append("q_fatigue", data.q_fatigue);
    formData.append("q_psy", data.q_psy);
    formData.append("tags", data.tags);
    axios
      .patch(url, formData, {
        headers: {
          "x-access-token": getToken,
        },
      })
      .then(res => {
        if (res.status === 201) {
          getContentIdModify(res.data.contentId);
          getChildren("수정완료^^");
          getClassName("contentModify");
          return openModal();
        }
      });
  };

  return (
    <>
      <Container>
        <form>
          <button type="submit" onClick={submitButton}>
            일기수정
          </button>
          <button onClick={handleCancle}>취소</button>
        </form>
      </Container>
      <AlertModal
        visible={modal}
        onClose={closeModal}
        className={className}
        contentId={contentIdModify}
      >
        {children}
      </AlertModal>
    </>
  );
};

export default EditSubmitButton;
