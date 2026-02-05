// src/pages/worcation/components/detail/ReviewSection.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { ButtonYbShadow } from '../../../../styles/Button.styles.js';

const ReviewSection = ({ reviews, loginUser, isDisabled, handleAddComment, handleSaveEdit, handleDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [newComment, setNewComment] = useState('');

  // 리뷰 수정 핸들러
  const handleEditClick = (review) => {
    setEditingId(review.review_no);
    setEditedContent(review.review_content);
  };

  return (
    <ContentSection>
      <CommentInputWrap>
        {isDisabled && <Overlay>댓글 작성은 워케이션 이용후 이용 가능합니다.</Overlay>}
        <CommentInput
          placeholder="댓글을 입력하세요."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={isDisabled}
        />
        <CommentSubmit as={ButtonYbShadow} onClick={handleAddComment} disabled={isDisabled}>
          등록
        </CommentSubmit>
      </CommentInputWrap>
      <CommentList>
        {reviews.map((review) => (
          <CommentItem key={review.review_no}>
            <CommentUser>{review.writer_id} :</CommentUser>
            {editingId === review.review_no ? (
              <>
                <CommentText>
                  <CommentInput value={editedContent} onChange={(e) => setEditedContent(e.target.value)} />
                </CommentText>
                <CommentActions>
                  <ActionBtn onClick={() => handleSaveEdit(review.review_no)}>저장</ActionBtn>
                  <ActionBtn onClick={() => setEditingId(null)}>취소</ActionBtn>
                </CommentActions>
              </>
            ) : (
              <>
                <CommentText>{review.review_content}</CommentText>

                <CommentActions>
                  {review.writer_id === loginUser?.user_id ? (
                    <>
                      <ActionBtn onClick={() => handleEditClick(review)}>수정</ActionBtn>
                      <ActionBtn onClick={() => handleDelete(review.review_no)}>삭제</ActionBtn>
                    </>
                  ) : (
                    <>
                      <ActionBtn style={{ visibility: 'hidden' }}>수정</ActionBtn>
                      <ActionBtn style={{ visibility: 'hidden' }}>삭제</ActionBtn>
                    </>
                  )}
                </CommentActions>
              </>
            )}
          </CommentItem>
        ))}
      </CommentList>
    </ContentSection>
  );
};

export default ReviewSection;

const CommentInputWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 40px;
`;

const CommentInput = styled.input`
  flex: 1;
  width: 100%;
  height: 50px;
  border: 2px solid ${({ theme }) => theme.colors.gray[400]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: 0 10px;
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-family: 'GyeonggiTitleOTF';
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.black};
`;

const CommentSubmit = styled.button``;

const CommentList = styled.div`
  border: 2px solid ${({ theme }) => theme.colors.black};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 20px;
`;

const CommentItem = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.black};
  padding: 10px 0;
`;

const CommentUser = styled.span`
  flex-basis: 10%;
  min-width: 80px;
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-family: 'GyeonggiTitleOTF';
`;

const CommentText = styled.div`
  flex-basis: 80%;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  flex: 1;
  margin: 0 10px;
  display: flex;
  align-items: center;
  padding: 0;
`;

const CommentActions = styled.div`
  flex-basis: 10%;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const ActionBtn = styled.button`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.black};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 5px 10px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  font-family: 'Godo B';
  color: ${({ theme }) => theme.colors.black};
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 1);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: #e2e2e2;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: left;
  text-align: left;
`;
