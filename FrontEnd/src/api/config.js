const { VITE_API_URL, VITE_API_TIMEOUT = 5000, VITE_API_VERSION = 'v1', VITE_API_BUSINESS } = import.meta.env;

export const API_CONFIG = {
  BASE_URL: `${VITE_API_URL}/${VITE_API_VERSION}`, //localhost:8080/api/v1
  // BASE_URL: `${VITE_API_URL}`,
  TIMEOUT: VITE_API_TIMEOUT,
  HEADERS: {
    'Content-Type': 'application/json', //내가 서버로 보내는 데이터는 json이야
    Accept: 'application/json', //json으로 응답해줘.
  },
};

export const API_BUSINESS = {
  BUSINESS_VALIDATE: `${VITE_API_BUSINESS}`,
  TIMEOUT: VITE_API_TIMEOUT,
  HEADERS: {
    'Content-Type': 'application/json', //내가 서버로 보내는 데이터는 json이야
    Accept: 'application/json', //json으로 응답해줘.
  },
};

export const API_ENDPOINTS = {
  MEMBER: {
    SIGNUP: (role) => `/member/signUp/${role}`,
    MY_INFO: '/member/userInfo',
    BASE: '/member',
    VALIDATE_PASSWORD: '/member/validate-password',
    INIT: '/member/signUp/init',
  },
  HEALTH: {
    BASE: '/health',
  },
  COMPANY: {
    SEARCH: (company_name) => `/company/search?company_name=${company_name}`,
    DEPARTMENT_SEARCH: (company_no) => `/company/search/department/${company_no}`,
  },
  COMPANY_PROFILE: '/companyProfiles',
  COMPANY_EMPLOYEE: {
    CHANGE_ROLE: (userNo) => `/member/${userNo}`,
    EMPLOYEE_LIST: (companyNo) => `/employee/list/${companyNo}`,
    NEEDS_CONSULT: (companyNo) => `/employee/needs-consult/${companyNo}`,
    APPROVEEMPLOYEE: (companyNo) => `/employee/applies/${companyNo}`,
    APPROVECHECK: (userNo) => `/employee/applies/${userNo}`,
    EMPLOYEECOUNT: (companyNo) => `/employee/employees-summary/${companyNo}`,
    WORCATIONAPPLIES: (companyNo) => `/employee/worcation-applies/${companyNo}`,
    WORCATIONAPLLIECHECK: (userNo) => `/employee/worcation-applies/${userNo}`,
    CALENDAREMPLOYEE: (companyNo) => `/employee/worcation-calendar/${companyNo}`,
  },
  WORCATION: {
    LIST: '/worcations',
    DETAIL: (worcation_no) => `/worcations/${worcation_no}`,
    //임시저장
    SAVE: '/worcations',
    //업체 정보 수정
    UPDATE: (worcation_no) => `/worcatoins/${worcation_no}`,
    DELETE: (worcation_no) => `/worcations/${worcation_no}`,

    //사업자 정보
    VALIDATE: () => '/worcation/validate',

    //내워케이션이름 가져오기
    WORCATIONNAME: (userNo) => `/worcations/my/${userNo}`,

    WORCATIONRESERVATION: (userNo) => `/worcations/reservaionList/${userNo}`,

    GETMYLIST: (user_no) => `/worcations/my/${user_no}`,

  },

  APPLICATION: {
    //예약 신청
    CREATE: '/applications',
    //워케이션별 예약 확인
    RESERVED_WORCATION: (worcation_no) => `/applications/reserved_by_worcation?worcationNo=${worcation_no}`,
    //예약 확인
    RESERVED: (user_no) => `/applications/reserved?userNo=${user_no}`,
    //지난 예약 정보
    USED: (user_no) => `/applications/used?userNo=${user_no}`,
    //삭제
    DELETE: (application_no) => `/applications/${application_no}`,
    DATE_COUNT: (worcation_no) => `/applications/date_count/${worcation_no}`,
    LIST: '/applications',
    GET_FULL_DATES: ({ worcationNo, startDate, endDate }) =>
      `/applications/reserved-worcation?worcationNo=${worcationNo}&startDate=${startDate}&endDate=${endDate}`,
  },
  REVIEW: {
    ADD: '/reviews',
    UPDATE: (review_no) => `/reviews/${review_no}`,
    DELETE: (review_no) => `/reviews/${review_no}`,
  },
  LOGIN: '/member/login',
  //심리정보 불러오기
  MENTALS: (user_no) => `/mentals/${user_no}`,
  // 스프링 구현하면 지울 내용//
  MEMBER_PREFERENCE: '/member_preference',
  // 스프링 구현하면 지울 내용//
  // 스프링 구현하면 쓰일 내용//
  // MEMBER_PREFERENCE: (uesr_no) => `/member_preference/${uesr_no}`,
  // 스프링 구현하면 쓰일 내용//

  MEMBER_PREFERENCE_GET: (preference_no) => `/member_preference?preference_no=${preference_no}`,
};
