  export const inputsByStep = {
    // 1단계에서 사용할 입력 필드 정의
    step1: [
      { name: 'userId', type: 'text', placeholder: '아이디', side: 'left' },
      { name: 'userPwd', type: 'password', placeholder: '비밀번호', side: 'left' },
      { name: 'userPwdCheck', type: 'password', placeholder: '비밀번호 확인', side: 'left' },
      { name: 'name', type: 'text', placeholder: '이름', side: 'left' },
      { name: 'address', type: 'text', placeholder: '주소', side: 'right' },
      { name: 'birthday', type: 'text', placeholder: '생년월일', side: 'right' },
      { name: 'email', type: 'text', placeholder: '이메일', side: 'right' },
      { name: 'phone', type: 'text', placeholder: '연락처', side: 'right' },
    ],
      // 2단계에서 사용할 입력 필드 정의
      //typeA: 직원, typeB: 기업
    step2: {
      typeA: [
        { name: 'companyName', type: 'text', placeholder: '회사명', side: 'left' },
        { name: 'department', type: 'text', placeholder: '부서명', side: 'left' },
        { name: 'position', type: 'text', placeholder: '직급', side: 'left' },
        { name: 'address', type: 'text', placeholder: '회사주소', side: 'right' },
        { name: 'companyEmail', type: 'text', placeholder: '회사 이메일', side: 'right' },
        { name: 'companyPhone', type: 'text', placeholder: '회사 전화번호', side: 'right' },
      ],
      typeB: [
        { name: 'companyName', type: 'text', placeholder: '기업명', side: 'left' },
        { name: 'businessId', type: 'text', placeholder: '사업자번호', side: 'left' },
        { name: 'businessName', type: 'text', placeholder: '사업자명', side: 'left' },
        { name: 'openDate', type: 'text', placeholder: '개업일', side: 'left' },
        { name: 'address', type: 'text', placeholder: '기업주소', side: 'right' },
        { name: 'email', type: 'text', placeholder: '이메일', side: 'right' },
        { name: 'companyTel', type: 'text', placeholder: '기업전화번호', side: 'right' },
      ],
    },
  };