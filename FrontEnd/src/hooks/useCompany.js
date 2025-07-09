import { useState, useRef } from 'react';
import memberService from '../api/members';

export const useCompany = (initialCompanyName = '', onCompanySelect) => {
  const [companySearchResults, setCompanySearchResults] = useState([]);
  const [companyName, setCompanyName] = useState(initialCompanyName);
  const [departments, setDepartments] = useState([]);
  const companyNameTimeout = useRef();

  // 회사명 입력 핸들러 (자동완성)
  const handleCompanyNameChange = (e) => {
    const value = e.target.value;
    setCompanyName(value);
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
        console.err(err);
        setCompanySearchResults([]);
      }
    }, 330);
  };

  // 회사 선택 핸들러
  const handleCompanySelect = async (company) => {
    setCompanyName(company.company_name);
    setCompanySearchResults([]);
    if (onCompanySelect) {
      onCompanySelect(company);
    }
    // 회사 선택 시 부서 목록도 가져오기
    if (company.company_no) {
      try {
        const deptData = await memberService.searchDepartment(company.company_no);
        setDepartments(Array.isArray(deptData) ? deptData : []);
      } catch (err) {
        console.err(err);
        setDepartments([]);
      }
    } else {
      setDepartments([]);
    }
  };

  // 부서 선택 핸들러 (선택적으로 사용)
  const handleDepartmentSelect = (department, onSelect) => {
    if (onSelect) onSelect(department);
  };

  return {
    companyName,
    setCompanyName,
    companySearchResults,
    handleCompanyNameChange,
    handleCompanySelect,
    departments,
    handleDepartmentSelect,
  };
}; 