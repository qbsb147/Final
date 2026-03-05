import React, { useState } from 'react';
import styled from 'styled-components';
import bgImg from '../../assets/backgroundImg.jpg';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useSearchStore from '../../store/useSearchStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiUser } from 'react-icons/fi';
import { FaRegUserCircle } from 'react-icons/fa';
import { onlineWsService } from '../../api/onlineWsService';

const menuData = [
  {
    title: '심리검사',
    path: '/trial',
    items: [
      { title: '스트레스 검사', path: '/trial/stress' },
      { title: '번아웃 검사', path: '/trial/burnout' },
      { title: '성향 검사', path: '/trial/tendency' },
    ],
  },
  {
    title: '워케이션',
    path: '/worcation',
    items: [
      { title: '전체보기', path: '/worcation' },
      { title: '제휴업체', path: '/worcation/partners' },
      { title: 'AI 추천', path: '/worcation/ai' },
      { title: '워케이션 등록', path: '/worcation/register-list' },
    ],
  },
  {
    title: '식단정보',
    path: '/eat',
    items: [' '],
  },
  {
    title: '직원관리',
    path: '/employee/list',
    items: [
      { title: '직원목록', path: '/employee/list' },
      { title: '워케이션 신청자', path: '/employee/worcation-applies' },
      { title: '상담 필요자', path: '/employee/needs-consult' },
      { title: '직원 신청', path: '/employee/applies' },
    ],
  },
  {
    title: '로그인',
    items: [
      { title: '내 정보', path: '/my/info' },
      { title: '신체 정보', path: '/my/body' },
      { title: '예약자 명단', path: '/my/reservation' },
      { title: '워케이션 신청내역', path: '/my/worcation-history' },
    ],
  },
];

const Header = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();
  const loginUser = useAuthStore((state) => state.loginUser);
  const logout = useAuthStore((state) => state.logout);
  const isLoggedIn = Boolean(loginUser);
  const role = loginUser?.role;

  // searchStore 초기화 함수들
  const setKeyword = useSearchStore((state) => state.setKeyword);
  const setDates = useSearchStore((state) => state.setDates);
  const setPopularKeywords = useSearchStore((state) => state.setPopularKeywords);

  // 로고 클릭 시 searchStore 초기화
  const handleLogoClick = () => {
    setKeyword('');
    setDates(null, null);
    setPopularKeywords([]);
  };

  // 신규 코드: 로그인 메뉴 가공 후 role별로 filteredMenus로 가공
  const menus = menuData.map((menu) => {
    if (menu.title === '로그인') {
      if (isLoggedIn) {
        let items = [
          { title: '내 정보', path: '/my/info' },
          { title: '신체 정보', path: '/my/body' },
        ];
        if (role === 'WORCATION') {
          items.push(
            { title: '예약자 명단', path: 'my/reservation' },
            { title: '제휴 승인 목록', path: '/partnership/approveList' },
            { title: '제휴 요청 목록', path: '/partnership/requests' }
          );
        } else {
          items.push({ title: '워케이션 신청내역', path: '/my/worcation-history' });
        }
        items.push({ title: '채팅방 목록', path: '/my/chat' });
        items.push({ title: '로그아웃', path: '/logout' });

        return {
          ...menu,
          title: loginUser.user_name + '님' || '내 정보',
          path: '/my/info',
          items,
        };
      } else return menu;
    }
    return menu;
  });

  const filteredMenus = menus
    .map((menu) => {
      if (!isLoggedIn) {
        // 로그인 전에는 모든 메뉴의 items(드롭다운)를 빈 배열로
        return { ...menu, items: [] };
      }
      // 로그인 후에는 items만 권한별로 필터링, 상단 탭은 항상 보임
      if (menu.title === '워케이션') {
        return {
          ...menu,
          items: menu.items.filter((item) => {
            if (item.title === '워케이션 등록') {
              return role === 'WORCATION';
            }
            return true;
          }),
        };
      }
      // 로그인 후 WORCATION이면 직원관리 메뉴 자체를 아예 숨김
      if (menu.title === '직원관리' && role === 'WORCATION') {
        return null;
      }
      if (menu.title === '직원관리') {
        // 직원관리 드롭다운은 MASTER, MANAGER만 보임
        return {
          ...menu,
          items: role === 'MASTER' || role === 'MANAGER' ? menu.items : [],
        };
      }
      // 다른 메뉴는 items 그대로
      return menu;
    })
    .filter(Boolean); // null(숨김) 메뉴 제거

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpireAt');
    onlineWsService.stopHeartbeat();
    onlineWsService.close();
    toast.success('로그아웃했습니다.');
    navigate('/');
  };

  return (
    <HeaderWrap onMouseEnter={() => setDropdownVisible(true)} onMouseLeave={() => setDropdownVisible(false)}>
      <HeaderBg>
        <HeaderInner>
          <LogoWrap>
            <Link to="/" onClick={handleLogoClick}>
              <LogoImg src={logo} alt="logo" />
            </Link>
          </LogoWrap>
          <NavWrap>
            <Nav>
              {/*
              {menus.map((menu, idx) => (
                <NavItem key={idx} className="nav-item">
                  ...
                ))}
              */}
              {filteredMenus.map((menu, idx) => (
                <NavItem key={idx} className="nav-item">
                  {menu.title === '로그인' && !isLoggedIn ? (
                    <StyleLinkColumn to="/login">
                      <FiUser size={30} />
                    </StyleLinkColumn>
                  ) : menu.title === loginUser?.user_name + '님' && isLoggedIn ? (
                    <StyleLinkColumn to={menu.path}>
                      <FaRegUserCircle size={24} />
                      <span>{menu.title}</span>
                    </StyleLinkColumn>
                  ) : (
                    <StyleLink to={menu.path}>{menu.title}</StyleLink>
                  )}
                </NavItem>
              ))}
            </Nav>
          </NavWrap>
        </HeaderInner>
      </HeaderBg>

      {isDropdownVisible && (
        <DropdownWrap>
          <DropdownContent>
            {filteredMenus
              .filter((menu) => menu.items && menu.items.length > 0)
              .map((menu, idx) => (
                <DropdownColumn key={idx}>
                  <ul>
                    {menu.items
                      .filter((item) => {
                        if (
                          !isLoggedIn &&
                          (item.title === '내 정보' ||
                            item.title === '신체 정보' ||
                            item.title === '워케이션 신청내역' ||
                            item.title === '예약자 명단')
                        ) {
                          return false;
                        }
                        return true;
                      })
                      .map((item, subIdx) => (
                        <li
                          key={subIdx}
                          onClick={() => {
                            if (item.title === '로그아웃') {
                              handleLogout();
                            }
                          }}
                        >
                          <StyleLink to={item.path}>{item.title}</StyleLink>
                        </li>
                      ))}
                  </ul>
                </DropdownColumn>
              ))}
          </DropdownContent>
        </DropdownWrap>
      )}
    </HeaderWrap>
  );
};

// --- styled-components ---

const HeaderWrap = styled.header`
  position: absolute;
  font-family: sans-serif;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  height: 100px;
`;

const HeaderBg = styled.div`
  background-image: url(${bgImg});
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 120px;
  position: relative;
`;

const HeaderInner = styled.div`
  max-width: 1280px;
  height: 100%;
  margin: ${({ theme }) => theme.spacing.s0} auto;
  padding: ${({ theme }) => theme.spacing.s0} ${({ theme }) => theme.spacing.s2};
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 1200px) {
    padding: ${({ theme }) => theme.spacing.s0} ${({ theme }) => theme.spacing.s2};
  }

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.s0} ${({ theme }) => theme.spacing.s1};
  }
`;

const LogoWrap = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.s2};
`;

const LogoImg = styled.img`
  width: 100px;
  height: 100px;
  @media (max-width: 992px) {
    width: 80px;
    height: 80px;
  }

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
  }
`;

const NavWrap = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Nav = styled.ul`
  display: flex;
  width: 100%;
  list-style: none;
  margin: 0;
  padding: 0;
  font-weight: bold;
  justify-content: space-around;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;

  @media (max-width: 1200px) {
    gap: 6px;
    padding: 0 10px;
  }

  @media (max-width: 768px) {
    gap: 4px;
    font-size: 0.9em;
  }
`;

const NavItem = styled.li`
  flex: 1 0 auto;
  text-align: center;
  color: ${({ theme }) => theme.colors.black};
  cursor: pointer;
  display: flex;
  align-items: center;
  min-width: max-content;
  padding: 0 4px;

  @media (max-width: 992px) {
    padding: 0 2px;
  }

  @media (max-width: 768px) {
    font-size: 0.9em;
  }
  justify-content: center;
  height: 100%;
`;

const DropdownWrap = styled.div`
  position: absolute;
  top: 120px;
  left: 0;
  width: 100%;
  background: ${({ theme }) => theme.colors.white};
  z-index: ${({ theme }) => theme.zIndices.dropdown};
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing.s4} ${theme.spacing.s0}`};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 992px) {
    padding: ${({ theme }) => `${theme.spacing.s3} ${theme.spacing.s0}`};
  }

  @media (max-width: 768px) {
    padding: ${({ theme }) => `${theme.spacing.s2} ${theme.spacing.s0}`};
    top: 80px;
  }
`;

const DropdownContent = styled.div`
  margin-left: 100px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  overflow-x: auto;
  width: 100%;
  max-width: 1180px;
  white-space: nowrap;
  padding: ${({ theme }) => `${theme.spacing.s0} ${theme.spacing.s4}`};
  gap: 16px;

  &::before {
    content: '';
    display: none;
    width: 0;
    margin-right: 0;
  }

  @media (max-width: 1200px) {
    padding: ${({ theme }) => `${theme.spacing.s0} ${theme.spacing.s3}`};
    gap: 12px;
  }

  @media (max-width: 768px) {
    padding: ${({ theme }) => `${theme.spacing.s0} ${theme.spacing.s2}`};
    gap: 8px;
  }
`;

const DropdownColumn = styled.div`
  flex: 1;
  min-width: 0px;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.s2};

  @media (max-width: 992px) {
    flex: 1 0 calc(33.333% - 16px);
    min-width: 140px;
  }

  @media (max-width: 768px) {
    flex: 1 0 calc(50% - 8px);
    min-width: 120px;
    padding: ${({ theme }) => theme.spacing.s1};
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      padding: ${({ theme }) => `${theme.spacing.s2} ${theme.spacing.s2}`};
      color: ${({ theme }) => theme.colors.gray[700]};
      cursor: pointer;
      font-size: 0.9em;
      transition: all 0.2s ease;
      border-radius: 4px;

      &:hover {
        background-color: ${({ theme }) => theme.colors.gray[100]};
        color: ${({ theme }) => theme.colors.primary};
      }

      @media (max-width: 768px) {
        padding: ${({ theme }) => `${theme.spacing.s1} ${theme.spacing.s2}`};
        font-size: 0.85em;
      }
    }
  }
`;

const StyleLink = styled(Link)`
  color: ${({ theme }) => theme.colors.black};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.fontWeights.bold};

  &:focus {
    outline: none;
    border-radius: ${({ theme }) => theme.borderRadius.base};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary};
  }
`;

const StyleLinkColumn = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.black};
  font-weight: ${({ theme }) => theme.fontWeights.bold};

  span {
    margin-top: 6px;
  }

  &:hover {
    color: #535bf2;
  }

  &:focus {
    outline: none;
    border-radius: ${({ theme }) => theme.borderRadius.base};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary};
  }
`;

export default Header;
