
### 👥 팀원 소개


<table>
  <tr>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/100756731?v=4" width="100" /><br/>
      <strong>김현우</strong><br/>
      <a href="https://github.com/gusdn6288">@gusdn6288</a>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/88296511?v=4" width="100" /><br/>
      <strong>이예은</strong><br/>
      <a href="https://github.com/yeeun426">@yeeun426</a>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/180901036?v=4" width="100" /><br/>
      <strong>박용규</strong><br/>
      <a href="https://github.com/yonggyu99">@yonggyu99</a>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/63743294?v=4" width="100" /><br/>
      <strong>임재찬</strong><br/>
      <a href="https://github.com/alex8396">@alex8396</a>
    </td>
  </tr>
</table>




## 폴더구조
```
📦 root/
├── frontend/                        # 프론트엔드 (React + Vite)
│   ├── public/                      # 정적 파일
│   │   ├── img/
│   │   │   └── itBlog/             # IT 블로그 관련 이미지
│   │   └── favicon.ico             # 파비콘
│   ├── src/                         # 주요 소스 코드
│   │   ├── apis/                   # API 호출 함수들
│   │   ├── assets/                 # 이미지, 폰트 등 자산
│   │   ├── common/                 # 공통 상수/함수/스타일
│   │   ├── components/             # 재사용 가능한 컴포넌트
│   │   ├── hooks/                  # 커스텀 React 훅
│   │   ├── pages/                  # 라우팅되는 실제 페이지들
│   │   ├── router/                 # 라우터 설정
│   │   ├── store/                  # 상태 관리 관련 (예: Zustand)
│   │   ├── utils/                  # 유틸 함수 모음
│   │   └── main.jsx                # React 앱 진입 파일
│   ├── index.html                  # HTML 템플릿
│   ├── package.json                # 프론트엔드 의존성 정의
│   └── README.md                   # 프론트엔드 전용 설명서 (선택)
│
├── backend/                         # 백엔드 (Node.js + Express + MongoDB)
│   ├── config/                     # DB 연결, 설정 관리
│   ├── controllers/                # 비즈니스 로직
│   ├── models/                     # Mongoose 모델 정의
│   ├── routes/                     # API 라우터
│   ├── node_modules/               # 백엔드 패키지 모음
│   ├── .env                        # 환경 변수
│   ├── package.json                # 백엔드 의존성 정의
│   └── server.js                   # 서버 진입점
│
├── .github/                         # GitHub 워크플로우, PR 템플릿 등
└── README.md                        # 전체 프로젝트 소개
```
