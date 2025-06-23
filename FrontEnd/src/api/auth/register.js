import api from "../axios";

//회원가입
export const register = async (formData1,formData2) => {
    const {userPwdCheck : _, ...sendData1 } = formData1;
    const sendData2 = { ...formData2 };

    //1. 공통 : 회원 정보 등록
    const { data:member } = await api.post('/members', sendData1);

    //2. 유형별 추가 관리

    switch(formData1.type){
        //직원
        case 'A':{
            await api.post('/companyProfiles', {
                ...sendData2,
                memberNo: member.memberNo,
            });
            break;
        }
        //기업
        case 'B':{
            await api.post('/companyProfiles', {
                ...sendData2,
                memberNo: member.memberNo,
            });
            break;
        }
        //워케이션
        case 'C':{
            break;
        }
        default:
            throw new Error('유효하지 않은 회원 유형입니다.');
    }
    return member;
};

