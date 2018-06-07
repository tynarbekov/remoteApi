var postList = [];
var authorList = [];
var allData = [];

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
      title = "Title: ".bold() + "<a href='post.html?postId=" + posts[i].id + "'>" + posts[i].title + "</a>" + ", ";
      author = "Author: ".bold() + posts[i].userInfo.name;
      document.getElementById("postList").innerHTML+= title + author + "<br>";
    }
  }

  //
  function setUrl(url){
    console.log(postList);
    // url = url.substr(url.length -1);
    // return postList[url];
  }


  //
