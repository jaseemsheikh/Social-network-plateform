let currentUser = localStorage.getItem('username') || "Guest";
let posts = JSON.parse(localStorage.getItem('posts')) || [];
let notifCount = parseInt(localStorage.getItem('notifCount')) || 0;

document.getElementById('username').value = currentUser;
document.getElementById('notif-count').innerText = notifCount;
loadNotifications();

function setUser() {
    currentUser = document.getElementById('username').value;
    localStorage.setItem('username', currentUser);
    alert("Profile saved: " + currentUser);
}

function saveData() {
    localStorage.setItem('posts', JSON.stringify(posts));
    localStorage.setItem('notifCount', notifCount);
}

function createPost() {
    const content = document.getElementById('post-content').value;
    const privacy = document.getElementById('privacy').value;
    const mediaFile = document.getElementById('post-media').files[0];

    if(content === "") return alert("Post will not be empty");

    let mediaURL = "";
    let mediaType = "";
    if(mediaFile) {
        mediaURL = URL.createObjectURL(mediaFile);
        mediaType = mediaFile.type;
    }

    const post = {
        id: Date.now(),
        author: currentUser,
        content: content,
        media: mediaURL,
        mediaType: mediaType,
        privacy: privacy,
        likes: 0,
        comments: [],
        time: new Date().toLocaleString()
    };
    posts.unshift(post);
    saveData();
    renderPosts();
    addNotification(`${currentUser} "Guest is post something new"`);
    document.getElementById('post-content').value = "";
    document.getElementById('post-media').value = "";
}

function likePost(id) {
    let post = posts.find(p => p.id === id);
    post.likes++;
    saveData();
    renderPosts();
}

function addComment(id) {
    let input = document.getElementById(`comment-input-${id}`);
    let comment = input.value;
    if(comment === "") return;
    let post = posts.find(p => p.id === id);
    post.comments.push(`${currentUser}: ${comment}`);
    input.value = "";
    saveData();
    renderPosts();
}

function sendFriendRequest(author) {
    if(author === currentUser) return alert("You cannot send a friend request to yourself.");
    addNotification(`${currentUser} is sent a friend request to ${author}`);
}

function addNotification(msg) {
    notifCount++;
    document.getElementById('notif-count').innerText = notifCount;
    let notifs = JSON.parse(localStorage.getItem('notifications')) || [];
    notifs.unshift(msg);
    localStorage.setItem('notifications', JSON.stringify(notifs));
    loadNotifications();
}

function loadNotifications() {
    let notifs = JSON.parse(localStorage.getItem('notifications')) || [];
    let notifDiv = document.getElementById('notifications');
    notifDiv.innerHTML = notifs.map(n => `<p>• ${n}</p>`).join('');
}

function renderPosts() {
    const container = document.getElementById('posts-container');
    container.innerHTML = '';
    posts.forEach(post => {
        let mediaTag = "";
        if(post.mediaType.includes('image')) mediaTag = `<img src="${post.media}">`;
        if(post.mediaType.includes('video')) mediaTag = `<video controls src="${post.media}"></video>`;

        container.innerHTML += `
            <div class="post">
                <b>${post.author}</b> <small style="color:gray;">${post.time} - ${post.privacy}</small>
                <p>${post.content}</p>
                ${mediaTag}
                <div class="post-actions">
                    <button onclick="likePost(${post.id})">👍 Like (${post.likes})</button>
                    <button onclick="document.getElementById('comment-box-${post.id}').style.display='block'">💬 Comment</button>
                    <button onclick="sendFriendRequest('${post.author}')">➕ Friend</button>
                </div>
                <div id="comment-box-${post.id}" class="comment-box" style="display:none;">
                    <input type="text" id="comment-input-${post.id}" placeholder="Write a comment...">
                    <button onclick="addComment(${post.id})">Send</button>
                </div>
                <div>
                    ${post.comments.map(c => `<div class="comment">${c}</div>`).join('')}
                </div>
            </div>
        `;
    });
}

renderPosts(); // page load par posts show karo