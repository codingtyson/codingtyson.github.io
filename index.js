const colors = [
  "#ef5777",
  "#575fcf",
  "#4bcffa",
  "#34e7e4",
  "#0be881",
  "#f53b57",
  "#3c40c6",
  "#0fbcf9",
  "#00d8d6",
  "#05c46b",
  "#ffc048",
  "#ffdd59",
  "#ff5e57",
  "#d2dae2",
  "#485460",
  "#ffa801",
  "#ffd32a",
  "#ff3f34",
];
let dragTarget = {};

function 색추출기(colors) {
  const 랜덤값 = Math.floor(Math.random() * colors.length); //0~17
  return colors[랜덤값];
}

document.querySelector("button").addEventListener("click", (e) => {
  const title = document.querySelector("#input1").value;
  const content = document.querySelector("#input").value;
  const url = document.querySelector("#inputUrl").value;

  // local storage 저장
  const todo객체 = {};
  todo객체.title = title;
  todo객체.content = content;
  todo객체.category = "todo";
  todo객체.url = url;
  todo객체.color = 색추출기(colors);
  todo객체.id = new Date().getTime().toString();

  localStorage.setItem(todo객체.id, JSON.stringify(todo객체));

  const newTag = createTag(
    todo객체.title,
    todo객체.content,
    todo객체.url,
    todo객체.id,
    todo객체.color
  );
  document.querySelector(".todo").appendChild(newTag);

  document.querySelector("#input1").value = "";
  document.querySelector("#input").value = "";
  document.querySelector("#inputUrl").value = "";
});

const boxes = document.querySelectorAll(".box");
boxes.forEach((box, i) => {
  box.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
  box.addEventListener("drop", (e) => {
    e.currentTarget.appendChild(dragTarget);
    const todo = JSON.parse(
      localStorage.getItem(dragTarget.getAttribute("key"))
    );
    todo.category = e.currentTarget.getAttribute("category");
    localStorage.setItem(todo.id, JSON.stringify(todo));
  });
});

function createTag(title, content, url, key, color) {
  const newTag = document.createElement("div");
  newTag.classList.add("tag");

  const titleTag = document.createElement("p");
  titleTag.innerHTML = title;
  titleTag.classList.add("title");
  newTag.appendChild(titleTag);

  const contentTag = document.createElement("p");
  contentTag.innerHTML = content;
  contentTag.classList.add("content");
  newTag.appendChild(contentTag);

  const urlLink = document.createElement("a");
  urlLink.href = url;
  urlLink.target = "_blank";
  urlLink.innerHTML = url;
  urlLink.classList.add("url");
  newTag.appendChild(urlLink);

  // const timestamp = document.createElement("p");
  // timestamp.innerHTML = new Date(Number(todo.timestamp)).toLocaleString();
  // timestamp.classList.add("timestamp");
  // newTag.appendChild(timestamp);
  const timestamp = document.createElement("p");
  timestamp.innerHTML = new Date().toLocaleString();
  timestamp.classList.add("timestamp");
  newTag.appendChild(timestamp);

  newTag.style.backgroundColor = color;

  newTag.setAttribute("draggable", true);

  newTag.addEventListener("dragstart", (e) => {
    dragTarget = e.currentTarget;
  });

  const deleteBtn = document.createElement("span");
  deleteBtn.classList.add("delete");
  deleteBtn.innerHTML = "X";

  deleteBtn.addEventListener("click", (e) => {
    e.currentTarget.parentElement.remove();
    const key = e.currentTarget.parentElement.getAttribute("key");
    localStorage.removeItem(key);
  });
  newTag.appendChild(deleteBtn);

  newTag.setAttribute("key", key);

  return newTag;
}

for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const todo = JSON.parse(localStorage.getItem(key));
  const color = todo.color || 색추출기(colors);
  const newTag = createTag(
    todo.title,
    todo.content,
    todo.url,
    todo.id,
    todo.color
    // todo.timestamp
  );

  function getSortedDataByTime() {
    const data = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const todo = JSON.parse(localStorage.getItem(key));
      data.push(todo);
    }
    data.sort((a, b) => a.id - b.id); // 시간 정보로 정렬
    return data;
  }

  // 순서대로 데이터를 출력하는 함수
  function displayData() {
    const sortedData = getSortedDataByTime();
    sortedData.forEach((todo) => {
      const color = todo.color || 색추출기(colors);
      const newTag = createTag(
        todo.title,
        todo.content,
        todo.url,
        todo.id,
        todo.color
      );

      document.querySelector(`.${todo.category}`).appendChild(newTag);
      newTag.style.backgroundColor = color;
    });
  }
}
displayData();
const urlInput = document.querySelector("#inputUrl");
urlInput.addEventListener("input", (e) => {
  const urlValue = e.target.value;

  if (!urlValue.startsWith("http://") && !urlValue.startsWith("https://")) {
    urlInput.value = "http://" + urlValue;
  }
});

display();

const titleInput = document.querySelector("#input1");
titleInput.addEventListener("input", (e) => {
  const maxLength = 20;
  if (titleInput.value.length > maxLength) {
    titleInput.value = titleInput.value.slice(0, maxLength);
  }
});

const contentInput = document.querySelector("#input");

contentInput.addEventListener("input", (e) => {
  const maxLength = 200;

  if (contentInput.value.length > maxLength) {
    contentInput.value = contentInput.value.slice(0, maxLength);
  }
});
