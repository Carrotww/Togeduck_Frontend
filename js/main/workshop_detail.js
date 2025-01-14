window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const workshop_id = urlParams.get('id');
    workshop_detail_view(workshop_id)
    workshop_review_view(workshop_id)
}


const urlParams = new URLSearchParams(window.location.search);
const workshop_id = urlParams.get('id');


// 워크샵 상세 데이터 불러오기
async function workshop_detail_view(workshop_id) {
    const response = await workshop_detail_get(workshop_id)

    if (response.status == 200) {
        data = await response.json()

        const title = document.getElementById("title") // 소개
        const max_guest = document.getElementById("max_guest") // 제한인원
        const amount = document.getElementById("amount") // 참가비
        const content = document.getElementById("content") // 내용
        const workshop_image = document.getElementById("workshop_image") // 이미지
        const category = document.getElementById("category") // 카테고리
        const location = document.getElementById("location") // 지역
        const host = document.getElementById("host") // 호스트
        const likes_count = document.getElementById("likes_count") // 좋아요 수
        const participant_count = document.getElementById("participant_count") // 참가인원
        const date = document.getElementById("date") // 워크샵 날짜
        const address = document.getElementById("address") // 주소

        title.innerText = data.title;
        content.innerText = data.content;
        max_guest.innerText = data.max_guest;
        amount.innerText = data.amount;
        workshop_image.setAttribute("src", `http://127.0.0.1:8000${data.workshop_image}`);
        category.innerText = data.category;
        location.innerText = data.location;
        host.innerText = data.host;
        likes_count.innerText = data.likes_count;
        participant_count.innerText = data.participant_count;

        const today = new Date(data.date)
            // date.innerText = today.toLocaleDateString()
        var options = { hour: "numeric", minute: "numeric" };
        date.innerText = today.toLocaleString("ko-kr", options)

        address.innerText = data.address;

        // 로그인 사용자의 닉네임
        const payload = localStorage.getItem("payload");
        const payload_parse = JSON.parse(payload)

        // 로그인 사용자와 워크샵의 호스트가 동일인물이 아니라면 <문의하기> 버튼을 출력한다
        if (payload_parse.nickname != data.host) {
            const chat_button_label = document.getElementById("chat_button_wrap")
            chat_button_label.innerHTML = `<button type="button" class="chat_user_button" id="chat_button" onclick="click_user_chat(${data.host_id})">문의하기</button>`
        }

        if (payload_parse.nickname == data.host) {
            const put_delete_box = document.getElementById("put_delete_box")
            put_delete_box.innerHTML = `<button onclick="PUT_Button()">수정</button>
                                        <button type="button" onclick="workshop_DELETE(workshop_id)">삭제</button>`
        }
    }
}


// 워크샵 리뷰 보기
async function workshop_review_view(workshop_id) {

    const response = await workshop_review_get(workshop_id)

    if (response.status == 200) {

        data = await response.json()

        const list = document.getElementById("list")

        for (let i = 0; i < data.length; i++) {

            const review = data[i].content
            const user = data[i].user
            const created_at = data[i].created_at
            const updated_at = data[i].updated_at



            const new_review = `
                      <div id="review_list(${data[i].id})" class="comment">
                        <div id="user"  style="font-size:15px" class="comment-header">${user}</div>
                        <input style="color : #046582;" id="update_button(${data[i].id})" class="comment-body" value=" ${review}">
                        <p style="font-size:11px" id="created_at">${created_at}</p>
                        <p style="font-size:11px" id="updated_at">${updated_at}</p>
                        <div id="comment-footer${data[i].id}" class="comment-footer" >
                          <button type="button" onclick="review_delete(${data[i].id})">삭제버튼</button>
                          <button  class="open" id="update_button" type="button" onclick="updateMode(${data[i].id})" > 수정하기</button>
                          <div  class="btn" id="btn${data[i].id}" >
                          <button  id="button" type="button" onclick="review_put(${data[i].id})" > 수정완료</button>
                          
                        </div>
                      </div>
                    `

            list.insertAdjacentHTML("beforeend", new_review)



            const update_btn = document.getElementById(`comment-footer${data[i].id}`)
            const payload = localStorage.getItem("payload");
            const payload_parse = JSON.parse(payload)
            nickname = payload_parse.nickname

            if (nickname != data[i].user) {

                update_btn.style.display = "none"

            }
        }
    }
}


// 리뷰 수정 화면
function updateMode(id) {

    const content = document.getElementById(`update_button(${id})`); // 원래 리뷰 내용

    content.style.visibility = "hidden"; // 원래 내용 숨기기

    const input_content = document.createElement("textarea"); // 수정할 수 있는 입력창
    input_content.setAttribute("id", `input_content${id}`); // 수정 내용
    input_content.setAttribute("placeholder", "수정할 내용을 입력해주세요")
    input_content.innerText = content.innerHTML; // 안하면 공란처리
    input_content.rows = 3;

    const reviews_list = document.getElementById(`review_list(${id})`); // 넣을 댓글창
    reviews_list.insertBefore(input_content, content);

    const update_button = document.getElementById("update_button"); //수정하기 버튼
    update_button.setAttribute("onclick", "review_put(id)");
    // 업데이트 버튼을 가져오고 클릭시 review_put(id) 함수 실행
}





//리뷰 수정
async function review_put(id) {


    review_id = id

    const content = document.getElementById(`input_content${id}`).value // 수정 내용

    const response = await workshop_review_put(workshop_id, review_id, content)

    if (response.status == 200) {

        alert("댓글을 수정 했습니다.")
    } else {
        alert(response.status, '작성자가 아닙니다')
    }
    window.location.reload()
}




// 리뷰 작성
async function workshop_review_POST(workshop_id) {

    const review_post = document.getElementById("review_post").value

    const response = await workshop_review_post(workshop_id, review_post)

    if (response.status == 200) {
        alert('댓글 작성 됐습니다')
    } else {
        alert(response.status, 'qtqtqtq')
    }
    location.reload()
}



// 리뷰 삭제
async function review_delete(id) {
    review_id = id
    const response = await workshop_review_delete(workshop_id, review_id)

    if (response.status == 403) {
        alert("댓글 작성자가 아닙니다")
    } else {
        alert("댓글을 삭제했습니다")
    }
    window.location.reload()
}

// 좋아요 
async function Like_post(workshop_id) {

    workshop_id = location.href.split("?")[1].split("=")[1]

    const response = await workshop_like(workshop_id)


    if (response.status == 200) {

        data = await response.json()

        alert(`${data['msg']}`)

    } else {
        alert(response.status);
    }
    location.reload()
}

// 썸네일 프리뷰
var number = 1;
do {
    function showPreview(event, number) {
        if (event.target.files.length > 0) {
            let src = URL.createObjectURL(event.target.files[0]);
            let preview = document.getElementById("file-ip-" + number + "-preview");
            preview.src = src;
            preview.style.display = "block";
        }
    }

    function myImgRemove(number) {
        document.getElementById("file-ip-" + number + "-preview").src =
            "https://i.ibb.co/ZVFsg37/default.png";
        document.getElementById("file-ip-" + number).value = null;
    }
    number++;
} while (number < 5);

// 워크샵 작성
async function workshop_post() {

    const content = document.getElementById("content").value
    const workshop_image = document.getElementById("getval").files[0];
    const title = document.getElementById("title").value;
    const date = document.getElementById("date").value;
    const max_guest = document.getElementById("max_guest").value;
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category_id").value;
    const location = document.getElementById("location_id").value;
    const address = document.getElementById("address").value;

    const formData = new FormData();


    formData.append("title", title);
    formData.append("content", content);
    formData.append("date", date);
    formData.append("workshop_image", workshop_image);
    formData.append("max_guest", max_guest);
    formData.append("amount", amount);
    formData.append("category", category);
    formData.append("location", location);
    formData.append("address", address);


    const response = await fetch("http://127.0.0.1:8000/workshops/", {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("access")
        },

        method: 'POST',

        body: formData
    })

    if (response.status == 200) {
        alert("새로운 워크샵이 생성되었습니다.");
        window.location.replace(`${front_end_url}/templates/main/workshop.html`)
    } else {
        alert('생성 목록을 모두 작성해주세요',response.status);
    }

}



function PUT_Button() {
    const urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id');
    window.location.href = `${front_end_url}/templates/main/workshop_put.html?id=${id}`
}

//워크샵 수정
async function workshop_put(workshop_id) {

    const content = document.getElementById("content").value
    const workshop_image = document.getElementById("getval").files[0];
    const title = document.getElementById("title").value;
    const date = document.getElementById("date").value;
    const max_guest = document.getElementById("max_guest").value;
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category_id").value;
    const location = document.getElementById("location_id").value;
    const address = document.getElementById("address").value;


    const formData = new FormData();

    formData.append("title", title);
    formData.append("content", content);
    formData.append("date", date);
    formData.append("workshop_image", workshop_image);
    formData.append("max_guest", max_guest);
    formData.append("amount", amount);
    formData.append("category", category);
    formData.append("location", location);
    formData.append("address", address);



    const response = await fetch(`http://127.0.0.1:8000/workshops/${workshop_id}/`, {
        headers: {

            Authorization: "Bearer " + localStorage.getItem("access")
        },

        method: "PUT",
        body: formData

    })
    if (response.status == 200) {
        alert("워크샵 수정 됐습니다")
        window.location.replace(`${front_end_url}/templates/main/workshop_detail.html?id=${workshop_id}`)
    } else {
        alert(response.status)
    }

}




// 워크샵 삭제
async function workshop_DELETE(workshop_id) {



    const response = await workshop_delete(workshop_id)
    if (response.status == 204) {
        alert("워크샵을 삭제 했습니다.")
    } else {
        alert("워크샵 작성자가 아닙니다")
    }

    window.location.replace(`${front_end_url}/templates/main/workshop.html`)
}

// 리뷰 보이기 / 숨기기
//document.getElementById("list").style.visibility = "hidden";
function showComments() {
    $("#hide").show();
    $("#show").hide();
    $("#list").fadeIn(1000);
    document.getElementById("list").style.display = "";
    const list = document.getElementById("list");
    list.style.visibility = "visible";
}

function hideComments() {
    $("#list").fadeOut(1000, function() {
        $("#hide").hide();
        $("#show").show();
        document.getElementById("list").style.display = "none";
    });
}
$(function() {
    $("#show").bind("click", showComments);
    $("#hide").bind("click", hideComments);
});