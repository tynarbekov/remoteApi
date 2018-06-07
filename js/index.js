var postList = [];
var authorList = [];
var storedPosts;

function ajaxGet(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(this.responseText);
    };
    xhr.onerror = reject;
    xhr.open('GET', url);
    xhr.send();
  });
}

function checkMemory(){
  if (postList.length <= 0) {
    return false;
  }else {
    return true;
  }
}

function getPostList(){
  if (!checkMemory()) {
    callAjax();
  }
  return postList;
}

function callAjax(){
  ajaxGet('https://jsonplaceholder.typicode.com/posts')
    .then(function(posts) {
        let list = JSON.parse(posts);
        list.forEach(function(post){
          postList.push(post)
        });
        ajaxGet('https://jsonplaceholder.typicode.com/users')
        .then(function(users){
          let authors = JSON.parse(users);
          authors.forEach(function(author){
            authorList.push(author)
          });
          compare(authorList,postList);
        })
        .catch(function(err){
          console.log(err);
        })
    })
    .catch(function(err){
      console.log(err);
    })
}

  function compare(authors,posts){
    for (var i = 0; i < posts.length; i++) {
      for (var j = 0; j < authors.length; j++) {
        if (posts[i].userId == authors[j].id) {
          postList[i].userInfo = authors[j]
        }
      }
    }
    toStorage();
    outputHtml();
  }

  function toStorage(){
    localStorage.setItem("posts",JSON.stringify(postList))
    storedPosts = JSON.parse(localStorage.getItem("posts"))
  }

  function outputHtml(){
    for (var i = 0; i < storedPosts.length; i++) {
      title = "Title: ".bold() + "<a href='post.html?postId=" + storedPosts[i].id + "'>" + storedPosts[i].title + "</a>";
      author = "Author: ".bold() + storedPosts[i].userInfo.name;
      document.getElementById("postList").innerHTML+= title + "<br>"   + author + "<br>" + "---" + "<br>";
    }
  }

  function getPostInfo(url){
    url = url.split("=").pop();
    url = parseInt(url);
    var postInfo = JSON.parse(localStorage.getItem("posts"));
    var post = postInfo.find( post => post.id === url );
    outputPostInfo(post);
  }

  function outputPostInfo(post){
    title = "Title: " + post.title;
    body = "Body: " + post.body;
    author = "Author: " + post.userInfo.name;
    username = "Username: " + post.userInfo.username;
    email = "Email: " + post.userInfo.email;
    address = "Address: Street: " + post.userInfo.address.street + ", suite: "
    + post.userInfo.address.suite +
    ", city: " + post.userInfo.address.street +
    ", zipcode: " + post.userInfo.address.zipcode +
    ", geo: " + "lat: " + post.userInfo.address.geo.lat + ", lng: " + post.userInfo.address.geo.lng;
    phone = "Phone: " + post.userInfo.phone;
    website = "Website: " + post.userInfo.website;
    company = "Company Name: " + post.userInfo.company.name + ", catchPhrase: " + post.userInfo.company.catchPhrase + ", bs: " + post.userInfo.company.bs;

    document.getElementById("postTitle").innerHTML+= title;
    document.getElementById("postBody").innerHTML+= body;
    document.getElementById("authorName").innerHTML+= author;
    document.getElementById("username").innerHTML+= username;
    document.getElementById("email").innerHTML+= email;
    document.getElementById("address").innerHTML+= address;
    document.getElementById("phone").innerHTML+= phone;
    document.getElementById("website").innerHTML+= website;
    document.getElementById("company").innerHTML+= company;

  }


  function search(by){
    
  }










  //
