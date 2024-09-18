# **아이디얼팜**  
> **암호 화폐를 이용한 투자 플랫폼을 개발하는 프로젝트**

---

## **목차**
1. [실행 환경](#1-실행-환경)  
   1-1. [로컬 실행](#1-1-로컬-실행)  
   1-2. [환경 변수](#1-2-환경-변수)  
2. [기술 스택](#2-기술-스택)  
3. [디렉토리 구조](#3-디렉토리-구조)  
4. [ERD](#4-erd)  
5. [기능 구현](#5-기능-구현)  
   5-1. [회원가입](#5-1-회원가입)
   5-2. [로그인](#5-2-로그인)  
   5-3. [투자 상품 CRUD](#5-3-투자-상품-CRUD)  
   5-4. [공지사항 CRUD](#5-4-공지사항-CRUD)  
   5-5. [대시보드 및 관리자 기능](#5-5-대시보드-및-관리자-기능)  

---

## **1. 실행 환경**
### **1-2. 환경 변수**  
- 아래 항목들이 `.env` 파일에 반드시 존재해야 합니다:
  - `DB_HOST`: 데이터베이스 연결 HOST 주소
  - `DB_TYPE`: 데이터베이스 연결 TYPE
  - `DB_USERNAME`: 데이터베이스 연결 username
  - `DB_PASSWORD`: 데이터베이스 연결 password
  - `DB_DATABASE`: 데이터베이스 연결 database 이름
  - `AWS_ACCESSKEY`: AWS Accesskey
  - `AWS_SECRETKEY`: AWS Secretkey
  - `JWT_SECRET_KEY`: JWT 토큰 서명에 사용될 비밀 키

---

### 기술 스택
<img src="https://img.shields.io/badge/JavaScript-version 4-3178C6">&nbsp;
<img src="https://img.shields.io/badge/Node.js-version 10-E0234E">&nbsp;
<img src="https://img.shields.io/badge/MySQL-version 8-00758F">&nbsp;

</br>

---

## 디렉토리 구조

<details>
<summary><strong>디렉토리 구조</strong></summary>
<div markdown="1">
 
```bash
└─src
│  app.js
│
├─controllers
│  │  admin.js
│  │  attendee.js
│  │  coins.js
│  │  community.js
│  │  invests.js
│  │  invitation.js
│  │  meeting.js
│  │  membership.js
│  │  nft.js
│  │  notice.js
│  │  products.js
│  │  users.js
│  │  wallets.js
│  │
│  └─admin
│          attendee.js
│          meeting.js
│          membership.js
│          membershipGrade.js
│          nft.js
│          product.js
│          upload.js
│
├─datas
│      abiEth.js
│      mainnet.js
│      testnet.js
│
├─db
│      aws.js
│      index.js
│
├─helpers
│      caver.js
│      users.js
│
├─routes
│  │  admin.js
│  │  coins.js
│  │  invests.js
│  │  notice.js
│  │  products.js
│  │  users.js
│  │  wallets.js
│  │
│  └─club
│          community.js
│          invest.js
│          invitation.js
│          meeting.js
│          membership.js
│          membershipGrade.js
│          user.js
│
├─services
│      attendee.js
│      community.js
│      invest.js
│      invitation.js
│      meeting.js
│      membership.js
│      membershipGrade.js
│      nft.js
│      nftRequest.js
│      pdf.js
│      product.js
│      user.js
│
├─swagger
│      admin.yml
│      attendee.yml
│      coin.yml
│      community.yml
│      index.js
│      invest.yml
│      invitation.yml
│      meeting.yml
│      membership.yml
│      nft.yml
│      notice.yml
│      product.yml
│      users.yml
└      wallet.yml
```
</div>
</details>

</br>

## **ERD**

<details>
<summary><strong>ERD 이미지 보기</strong></summary>
<div markdown="1">

![ERD 이미지](https://github.com/user-attachments/assets/dc7e3564-be07-4f82-b42c-9f7735b8802d)

</div>
</details>

</br>

## 기능구현
### **5-1. 회원가입** 
* 이메일 중복 및 대문자 확인 하여 회원 가입
  
### **5-2. 로그인** 
* 로그인 성공 시 JWT 토큰 발행

### **5-3. 투자 상품 CRUD**
* 투자하고 싶은 상품 주문, 목록보기, 취소

### **5-4. 공지사항 CRUD**
* 공지사항 목록보기, 등록

### **5-4. 대시보드 및 관리자 기능**
* 관리자 로그인 기능 (JWT 토큰 발급)
* 투자 상품 CRUD
* 대시보드(회원 수, 가입한 회원 수, 인증 완료된 금액 등)

 ---
 
 ## **Swagger 문서**
API 명세는 Swagger를 통해 확인할 수 있습니다. 아래 링크를 클릭하여 Swagger 문서로 이동하세요.

[Swagger 문서 보러 가기](https://github.com/user-attachments/assets/f5c88e84-751f-4b2d-8294-a593b3c95b5a)

---
