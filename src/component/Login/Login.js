import React, { useState, useContext } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import getLogin from "../../Context/Context";
import { GoogleLogin } from "react-google-login";
import AlertModal from "../../Modal/AlertModal";

const Login = () => {
  const value = useContext(getLogin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modal, getModal] = useState(false);
  const [children, getChildren] = useState("");
  const [className, getClassName] = useState("");

  console.log(value.nickname);


  const openModal = () => {
    getModal(!modal);
  };

  const closeModal = () => {
    getModal(!modal);
  };

  const emailHandler = e => {
    setEmail(e.target.value);
  };
  const passwordHandler = e => {
    setPassword(e.target.value);
  };

  const submitHandler = e => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/user/login", {
        email: email,
        password: password,
      })
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          value.handleSetNickName(res.data.nickName);
          getChildren("로그인에 성공했습니다");
          getClassName("login");
          value.handleLogin();
          value.handleToken(res.data.token);
          openModal();
        }
      })
      .catch(() => {
        getChildren("아이디,비밀번호를 확인해주세요");
        getClassName("error");
        return openModal();
      });
  };

  return (
    <center className="loginName">
      <h1>로그인</h1>
      <form>
        <div>
          <label>이메일</label>
          <input type="email" value={email} onChange={emailHandler} />
        </div>
        <div>
          <label>비밀번호</label>
          <input type="password" value={password} onChange={passwordHandler} />
        </div>
        <button onClick={submitHandler}>확인</button>

        <div>
          <GoogleLogin
            clientId="333133070398-amgnp101osuduqvjn2vacf3p20j2kmgn.apps.googleusercontent.com"
            onSuccess={res => {
              value.handleLogin();
              value.handleToken(res.accessToken);
              getChildren("로그인에 성공했습니다");
              getClassName("login");
              openModal();
            }}
            onFailure={err => {
              console.log(err);
            }}
          />
        </div>
      </form>
      <AlertModal visible={modal} onClose={closeModal} className={className}>
        {children}
      </AlertModal>
    </center>
  );
};

export default withRouter(Login);
