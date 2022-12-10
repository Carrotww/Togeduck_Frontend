console.log('api.js 연결')

// 전역 변수 - global.js로 이동할 예정
const backend_base_url = "http://127.0.0.1:8000"
const frontend_base_url = "http://127.0.0.1:5500"

// 로그인 된 사용자 정보 
const token = localStorage.getItem("access");

// 카테고리 목록 API
async function get_hobby() {
    const response = await fetch(`${backend_base_url}/workshops/hobby/`, {
        method: "GET",
    })
    return response
}

// 게시글 전체 목록 API
async function get_articles() {
    const response = await fetch(`${backend_base_url}/articles/`, {
        method: "GET",
    })
    return response
}

// 게시글 작성하기 버튼 API
function ArticleCreatePage(){
    console.log('게시글 작성 버튼')
    if (token){
        // 게시글 작성 페이지로 이동
        // window.location.replace(`${frontend_base_url}/templates/community.html/`)
    } else {
        alert('게시글 작성은 로그인 된 사용자만 가능합니다!')
    }
}

// 카테고리 선택 시 해당 카테고리 게시글 리스트 API
async function get_select_articles(category_id) {
    const response = await fetch(`${backend_base_url}/articles/?category=${category_id}`, {
        method: "GET",
    })
    return response
}

// 게시글 상세 페이지 이동 //
function replace_article_detail(article_id) {
    const url = `${frontend_base_url}/templates/main/article_detail.html?id=${article_id}`;
    location.href = url;
}

// 게시글 상세 페이지의 API 호출하여 특정 게시글 데이터 요청
async function get_article_detail(article_id){
    const response = await fetch(`${backend_base_url}/articles/${article_id}/`, {
        method: "GET",
    })
    return response
}

// 게시글 상세 페이지의 댓글 API
async function get_article_detail_comment(article_id) {
    const response = await fetch(`${backend_base_url}/articles/${article_id}/comment/`, {
        method: "GET",
    })
    return response
}