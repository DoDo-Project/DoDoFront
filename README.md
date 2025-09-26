## ✨ 프론트엔드 주요 기능 (Key Frontend Features)

- **✅ 사용자 및 펫 UI 관리**
  > 회원가입/로그인 화면, 소셜 로그인(OAuth2) <br> 펫 등록 및 정보 수정 화면, 건강 기록 리포트 UI 제공

- **✅ 산책 경로 및 실시간 위치 시각화**
  > 지도 기반 산책 경로 표시 및 실시간 위치 업데이트 (WebSocket) <br> 안전 구역(Geo-fencing) 시각화 및 알림 UI (FCM)

- **✅ 활동 및 건강 통계 시각화**
  > 산책 기록, 활동량, 심박수, 수면 패턴 차트/그래프 표시 <br> 통계 데이터 조회 UI 제공 (MySQL + MyBatis 기반 API 연동)

- **✅ 커뮤니티 UI**
  > 게시글 목록/상세보기, 댓글 기능 <br> 인기 게시글/검색 UI 제공

- **✅ 알림 및 푸시**
  > 활동 목표 달성 알림, 지오펜싱 이탈 알림, 커뮤니티 댓글/답글 알림 등 UI 구현

- **✅ 성능 최적화**
  > 데이터 로딩 최적화 및 캐싱, 비동기 UI 처리 (Redux/React Query 등 활용 가능)

<br>

## ⚙️ 기술 스택 (Tech Stack)

<div align="center">

### Frontend & Styling
<p>
<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black">
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
<img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white">
</p>

### Data Management & Real-time
<p>
<img src="https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white">
<img src="https://img.shields.io/badge/ReactQuery-FF4154?style=for-the-badge&logoColor=white">
<img src="https://img.shields.io/badge/WebSocket-0082C9?style=for-the-badge&logoColor=white">
<img src="https://img.shields.io/badge/FCM-FCA121?style=for-the-badge&logo=firebase&logoColor=white">
</p>

</div>

<br>

## 🤖 프론트엔드 아키텍처 (Frontend System Architecture)

앱/웹 클라이언트를 중심으로 UI 요청과 실시간 데이터 처리 흐름 다이어그램  
(사용자 입력 → React/TS 기반 UI 처리 → API 호출 → Spring Boot 서버 → MySQL/JPA/MyBatis 데이터 조회 → WebSocket/FCM 실시간 데이터 수신 → UI 업데이트)

<br>

## 🤝 Conventions
우리 프로젝트는 원활한 협업을 위해 아래와 같은 규칙을 따릅니다.

- **[Commit Convention](./.github/COMMIT_CONVENTION.md)**

<br>

## 📊 프론트엔드 참고자료 출처

👉🏻 **[React + WebSocket 실시간 데이터 처리 예제](https://www.digitalocean.com/community/tutorials/react-websockets)**

<br>

## 💁‍♂️ 팀원 소개 (Team Members)

<table align="center">
  <tr>
    <td align="center">
      <a href="https://github.com/sooloin">
      <img src="https://github.com/sooloin.png" alt="조수빈 프로필" width="150" height="150"/><br>
      <b>조수빈</b>
    </td>
    <td align="center">
      <a href="https://github.com/path-ptj">
      <img src="https://github.com/right-path-ptj.png" alt="박태정 프로필" width="150" height="150"/><br>
      <b>박태정</b>
    </td>
  </tr>
</table>
