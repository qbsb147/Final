// Handler.js: All handler functions for SignUp and step components

export function createHandleChange(setFormData1, setFormData2) {
  return (e, step) => {
    const { name, value } = e.target;
    if (step === 1) setFormData1((prev) => ({ ...prev, [name]: value }));
    else if (step === 2) setFormData2((prev) => ({ ...prev, [name]: value }));
  };
}

export function createHandleRadioChange(setSelectedType, setFormData1, setFormData2) {
  return (e) => {
    const { value } = e.target;
    setSelectedType(value);
    setFormData1((prev) => ({ ...prev, type: value }));
    setFormData2({});
  };
}

export function createHandleNext(validateStep, formData1, setFormStep) {
  return async () => {
    const isValid = await validateStep(formData1, 1);
    if (!isValid) return;
    setFormStep((prev) => prev + 1);
  };
}

export function createHandlePrev(setFormStep, setFormData2) {
  return () => {
    setFormStep((prev) => (prev > 1 ? prev - 1 : prev));
    setFormData2({});
  };
}

export function createHandleSubmit({ formStep, formData1, formData2, validateStep, selectedType, memberService }) {
  return async (e) => {
    e.preventDefault();
    if (formData1.user_pwd !== formData1.user_pwd_check) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    let isValidStep2 = true;
    if (formStep === 2) {
      isValidStep2 = await validateStep(formData2, 2, `type${selectedType}`);
      if (!isValidStep2) return;
    }
    try {
      await memberService.register(formData1, formData2);
      alert('회원가입이 완료되었습니다.');
      window.location.href = '/login';
    } catch (error) {
      console.error('회원가입 중 오류 발생:', error);
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  };
}

export function createHandleCompanyNameKeyUp(companyNameTimeout, setCompanySearchResults, memberService) {
  return (e) => {
    const value = e.target.value;
    if (companyNameTimeout.current) clearTimeout(companyNameTimeout.current);
    companyNameTimeout.current = setTimeout(async () => {
      if (!value) {
        setCompanySearchResults([]);
        return;
      }
      try {
        const data = await memberService.searchCompany(value);
        setCompanySearchResults(Array.isArray(data) ? data : []);
      } catch (err) {
        setCompanySearchResults([]);
        console.error('회사명 검색 에러:', err);
      }
    }, 500);
  };
}

export function createHandleCompanySelect(setFormData2, setCompanySearchResults) {
  return (company) => {
    setFormData2((prev) => ({
      ...prev,
      company_name: company.company_name,
      companyNo: company.company_no,
      address: company.company_address,
    }));
    setCompanySearchResults([]);
  };
}

export function createHandleAddressSearch(isPostcodeReady, setFormData1) {
  return () => {
    if (!isPostcodeReady) {
      alert('주소 검색 스크립트가 아직 준비되지 않았습니다.');
      return;
    }
    new window.daum.Postcode({
      oncomplete: function (data) {
        const addr = data.address;
        setFormData1((prev) => ({ ...prev, address: addr }));
      },
    }).open();
  };
}

export function createHandleOpenPopup(setIsPopupOpen) {
  return () => setIsPopupOpen(true);
}

export function createHandleClosePopup(setIsPopupOpen) {
  return () => setIsPopupOpen(false);
}

export function createHandleRegisterDepartment() {
  return (departmentName) => {
    alert(`등록된 부서명: ${departmentName}`);
    // 실제 등록 로직은 여기에 추가
  };
}
