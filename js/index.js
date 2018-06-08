var postList = [];
var authorList = [];

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
    outputHtml();
  }

  function outputHtml(){
    document.getElementById("postList").innerHTML="";
    for (var i = 0; i < postList.length; i++) {
      title = "Title: ".bold() + "<a href='#" + postList[i].id + "' onclick=outputPostInfo(" + postList[i].id +") >" + postList[i].title + "</a>";
      author = "Author: ".bold() + postList[i].userInfo.name;
      destroy = "Delete: ".bold() + postList[i].id;
      document.getElementById("postList").innerHTML+= title + "<br>"   + author + "<br>";
      document.getElementById("postList").innerHTML+= "<a href='#'" + "onclick=destroyPost(" + postList[i].id + ")" +">" + "DELETE" + "</a>"  + "<br> " + "---" + "<br>";
    }
  }

  function destroyPost(postId){
    var getPostId = postList.findIndex(function(post) {
      return post.id == postId;
    });
    postList.splice(getPostId,1);
    outputHtml();
  }

  function outputPostInfo(postId){
    postId = parseInt(postId)
    document.getElementById("postList").style.display = 'none';
    document.getElementById("search").style.display = 'none';
    document.getElementById("postInfo").style.display = 'block';
    var post = postList.find(post => post.id === postId);
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

    document.getElementById("postTitle").innerHTML = title;
    document.getElementById("postBody").innerHTML = body;
    document.getElementById("authorName").innerHTML = author;
    document.getElementById("username").innerHTML = username;
    document.getElementById("email").innerHTML = email;
    document.getElementById("address").innerHTML = address;
    document.getElementById("phone").innerHTML = phone;
    document.getElementById("website").innerHTML = website;
    document.getElementById("company").innerHTML = company;

  }

  function homePage(){
    document.getElementById("postList").style.display = 'block';
    document.getElementById("search").style.display = 'block';
    document.getElementById("postInfo").style.display = 'none';
    document.getElementById("editPost").style.display = "none"

  }

  function searchBy(){
    var searchText = document.getElementById("searchText").value;
    var checked = document.querySelector('input[name = "name"]:checked').value;
    searchStringInArray(searchText,checked);
  }

  function searchStringInArray (searchText,checked) {
    var foundPost = [];
    for (var j=0; j<postList.length; j++) {
      if (checked == 'author') {
        if (postList[j].userInfo.name.match(searchText)){
          foundPost.push(j);
        }
      }
      else if (checked == 'title') {
        if (postList[j].title.match(searchText)){
          foundPost.push(j);
        }
      }
      else if (checked == 'body') {
        if (postList[j].body.match(searchText)){
          foundPost.push(j);
        }
      }
    }
      searchResultOutput(foundPost);
      return ;
  }

  function searchResultOutput(foundPost){
    document.getElementById("searchResult").innerHTML = "";
    if (foundPost.length <= 0) {
      document.getElementById("searchResult").innerHTML+= "NOT FOUND";
    }
    else {
      for (var i = 0; i < foundPost.length; i++) {
        title = "Title: ".bold() + "<a href='#" + postList[foundPost[i]].id + "' onclick=outputPostInfo(" + postList[foundPost[i]].id +") >" + postList[foundPost[i]].title + "</a>";
        author = "Author: ".bold() + postList[foundPost[i]].userInfo.name;
        document.getElementById("searchResult").innerHTML+= title + "<br>";
        document.getElementById("searchResult").innerHTML+= author + "<br>" + "---" + "<br>";

      }
    }
  }


  function editPost(url){
    document.getElementById("editPost").style.display = "block"
    var postId = url.substr(url.length - 1);
    var getPostId = postList.findIndex(function(post) {
      return post.id == postId;
    });
    document.getElementById("editPostTitle").value = postList[getPostId].title;
    document.getElementById("editPostBody").value = postList[getPostId].body;
  }


  function updatePost(url){
    var postId = url.substr(url.length - 1);
    var getPostId = postList.findIndex(function(post) {
      return post.id == postId;
    })
    var editTitle =  document.getElementById("editPostTitle").value;
    var editBody = document.getElementById("editPostBody").value;

    postList[getPostId].title = editTitle;
    postList[getPostId].body = editBody;
    outputHtml();
    outputPostInfo(postId);
    document.getElementById("editPost").style.display = "none";
    document.getElementById("updated").innerHTML = "Updated";
    document.getElementById("updated").style.color = "green";

  }
