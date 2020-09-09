import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import "../../style.css";
import axios from "axios";
import getLogin from "../../Context/Context";
import AlertModal from "../../Modal/AlertModal";
import heart from "../../img/heart.png";
import unheart from "../../img/unheart.png";
import EditWritingPageForm from "./Edit/EditWritingPageForm";
import Tags from "./Tags";
import CheckingModal from "../../Modal/CheckingModal";

const ContentBox = styled.div`
  background: #f0cdcd;
`;
const CommentBox = styled.div`
  background: #abe8e1;
`;
const CommentLi = styled.li`
  background: #f7ffaf;
  border: 2px solid;
`;
const LikeButton = styled.div`
  .likeBtn {
    background-color: #f0cdcd;
    border: none;
  }
  .LikeImg {
    height: 30px;
  }
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 10px;
`;

const ContentView = () => {
  let splitUrl = window.location.href.split("/");
  let contentId = splitUrl[4];
  const value = useContext(getLogin);
  const [content, setContent] = useState("");
  const [comment, newComment] = useState("");
  const [commented, setCommneted] = useState([]);
  const [modal, getModal] = useState(false);
  const [children, getChildren] = useState("");
  const [className, getClassName] = useState("");
  const [deleteState, getDelete] = useState(true);
  const [nickName, setnickName] = useState("");
  const [data, getData] = useState("");
  const getToken = window.sessionStorage.getItem("token");
  const [countLike, setCountLike] = useState(0);
  // const [isLike, setIsLike] = useState(false);
  const [tags, getTags] = useState([]);
  const [checkModal, getCheckModal] = useState(false);
  const [commentId, getCommentId] = useState("");
  const getNickName = window.sessionStorage.getItem("nickName");
  const [replyBtn, setReplyBtn] = useState(false);

  const openModalModify = () => {
    getCheckModal(!checkModal);
    getChildren("일기수정");
  };
  const closeCheckModal = () => {
    getCheckModal(!checkModal);
  };
  const openModal = () => {
    getModal(!modal);
  };
  const closeModal = () => {
    getModal(!modal);
  };
  useEffect(() => {
    const ac = new AbortController();
    axios
      .get(`http://localhost:5000/content/${contentId}`, {
        headers: { "x-access-token": getToken },
      })
      .then(res => {
        setContent(res.data.Content);
        setnickName(res.data.Content.user.nickName);
        getTags(res.data.Content.tag);
        deleteButton();
        setCountLike(res.data.like);
        value.setIsLike(res.data.userLike);
      })
      .catch(() => {
        getChildren("로그인 후 이용하실 수 있습니다^^");
        getClassName("content");
        openModal();
        userInfo();
      });
    return () => {
      ac.abort();
    };
  }, [commented, nickName]);

  const allComment = content.comment;

  const userInfo = () => {
    let ac = new AbortController();
    axios
      .get("http://localhost:5000/mypage", {
        headers: {
          "x-access-token": getToken,
        },
      })
      .then(res => {
        getData(res.data);
      });
    return () => {
      ac.abort();
    };
  };

  //좋아요버튼
  const setLikeBtn = () => {
    if (value.isLike) {
      plusLike();
    } else {
      plusLike();
    }
  };

  // 좋아요 증감
  const plusLike = () => {
    axios
      .post(
        `http://localhost:5000/content/${contentId}/like`,
        { like: countLike },
        { headers: { "x-access-token": getToken } }
      )
      .then(res => {
        setCountLike(res.data.count);
        value.setIsLike(!value.isLike);
      });
  };

  //댓글기능
  const postComment = e => {
    e.preventDefault();
    setCommneted([comment, ...content.comment]);
    axios
      .post(
        "http://localhost:5000/comment",
        {
          contentId: contentId,
          comment: comment,
        },
        { headers: { "x-access-token": getToken } }
      )
      .then(() => {
        newComment("");
      });
  };

  //댓글 삭제
  const deleteComment = value => {
    axios
      .delete(`http://localhost:5000/comment/${value}`, {
        headers: { "x-access-token": getToken },
      })
      .then(() => {
        getChildren("댓글이 삭제되었습니다");
        getClassName("deleteComment");
        getCommentId(value);
        openModal();
      })
      .catch(() => {
        getChildren("삭제 권한이 없습니다");
        getClassName("deleteComment");
        openModal();
      });
  };

  //일기 삭제버튼 생성유무
  const deleteButton = () => {
    if (value.nickName === nickName) {
      getDelete(!deleteState);
    }
  };

  //일기 삭제
  const deleteContent = () => {
    axios
      .delete(`http://localhost:5000/content/${contentId}`, {
        headers: { "x-access-token": getToken },
      })
      .then(res => {
        if (res.status === 200) {
          getChildren("일기가 삭제되었습니다");
          getClassName("deleteCotent");
          openModal();
        }
      })
      .catch(() => {
        getClassName("deleteCotentError");
        return openModal();
      });
  };

  //답글
  const handleReplyBtn = () => {
    setReplyBtn(!replyBtn);
  }

  return (
    <center className="ContentViewBox">
      <>
        {!value.isChecking ? (
          <>
            <ContentBox>
              <div className="Content">
                <h1>{content.title}</h1>
                <span>{content.createdAt}</span>
                <div className="TextArea">{content.text}</div>
                <br />
                <div>
                  <Tags data={tags} />
                </div>
                <LikeButton>
                  {value.isLike ? (
                    <img
                      className="LikeImg"
                      src={heart}
                      alt=""
                      onClick={setLikeBtn}
                    />
                  ) : (
                      <img
                        className="LikeImg"
                        src={unheart}
                        alt=""
                        onClick={setLikeBtn}
                      />
                    )}
                  {countLike ? <span>{countLike}</span> : ""}

                </LikeButton>
                <button
                  onClick={openModalModify}
                  style={
                    deleteState ? { display: "none" } : { display: "block" }
                  }
                >
                  일기수정
                </button>

                <CheckingModal visible={checkModal} onClose={closeCheckModal}>
                  {children}
                </CheckingModal>
                <button
                  onClick={deleteContent}
                  style={
                    deleteState ? { display: "none" } : { display: "block" }
                  }
                >
                  일기삭제
                </button>
              </div>
            </ContentBox>
            <CommentBox>
              <div className="Comment">
                <input
                  type="text"
                  placeholder="댓글을 작성하세요"
                  value={comment}
                  onChange={e => newComment(e.target.value)}
                />
                <button onClick={postComment}>댓글 작성</button>

                <>
                  {allComment?.map(data => (
                    <CommentLi key={data.id}>
                      {data.user.nickName}
                      <br />
                      {data.createdAt}
                      <br />
                      {data.comment}
                      <br />
                      <button key={data.id} onClick={() => deleteComment(data.id)} style={
                        data.user.nickName === getNickName ?
                          { display: "block" } : { display: "none" }
                      }>
                        댓글 삭제
                      </button>

                      <button onClick={handleReplyBtn}>답글 달기</button>
                      <br />

                      <div id={data.id} style={replyBtn ? { display: "block" } : { display: "none" }}>
                        <input placeholder="답글을 작성하세요" ></input>
                        <button>답글 작성</button>
                      </div>
                    </CommentLi>
                  ))}
                </>

              </div>
            </CommentBox>
          </>
        ) : (
            <Container>
              <EditWritingPageForm content={content} token={getToken} />
            </Container>
          )}
      </>
      <AlertModal
        visible={modal}
        onClose={closeModal}
        className={className}
        commentId={commentId}
      >
        {children}
      </AlertModal>
    </center>
  );
};
export default ContentView;
