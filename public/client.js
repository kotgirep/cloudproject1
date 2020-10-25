const form = document.querySelectorAll('form'); // grabbing an element on the page
const errorElement = document.querySelectorAll('.error-message');
const loadingElement = document.querySelector('.loading');
const tweetsElement = document.querySelector('.userFiles');
const loadMoreElement = document.querySelector('#loadMore');
const API_URL = 'http://localhost:3000/';

let skip = 0;
let limit = 5;
let loading = false;
let finished = false;

console.log(form);
// errorElement[2].style.display = 'none';

document.addEventListener('scroll', () => {
  const rect = loadMoreElement.getBoundingClientRect();
  if (rect.top < window.innerHeight && !loading && !finished) {
    loadMore();
  }
});

listAllFiles();

function uploadFile() {
  console.log('clicked upload file button');
}

function listAllFiles(reset = true) {
  loading = true;
  if (reset) {
    tweetsElement.innerHTML = '';
    skip = 0;
    finished = false;
  }

  fetch('http://localhost:3000/awsfiles/fetch_files_data')
    .then((response) => response.json())
    .then((result) => {
      console.log(result.statuses);
      console.log('client.js call to fetch all files' + JSON.stringify(result));
      result.forEach((msg) => {
        const div = document.createElement('div');

        const header = document.createElement('h5');
        header.textContent = msg.userFirsttName;

        const fname = document.createElement('tr');
        fname.textContent = msg.userFirstName;

        const lname = document.createElement('p');
        lname.textContent = msg.userLastName;

        const fd = document.createElement('p');
        fd.textContent = msg.fileDescription;

        const fn = document.createElement('p');
        fn.textContent = msg.fileDescription;

        const contents = document.createElement('p');
        contents.textContent = status.text;

        const date = document.createElement('small');
        date.textContent = new Date(msg.created_at);

        var btn = document.createElement('button');
        btn.style = 'float: right; border:none;';
        btn.setAttribute('tweed-id', status.id_str);
        btn.addEventListener('click', function () {
          deleteTweet(this.getAttribute('tweed-id'));
        });
        var btn1 = document.createElement('button');
        btn1.style = 'float: right; border:none;';
        btn1.setAttribute('tweed-id', status.id_str);
        btn1.addEventListener('click', function () {
          likeTweet(this.getAttribute('tweed-id'));
        });

        var iconspan1 = document.createElement('span');
        iconspan1.style.color = '#00B7FF';
        iconspan1.style.fontSize = '20px';
        iconspan1.setAttribute('class', 'glyphicon glyphicon-heart');
        btn1.appendChild(iconspan1);

        var iconspan = document.createElement('span');
        iconspan.style.color = '#00B7FF';
        iconspan.style.fontSize = '20px';
        iconspan.setAttribute('class', 'glyphicon glyphicon-trash');
        btn.appendChild(iconspan);

        var btn2 = document.createElement('button');
        btn2.style = 'float: right; border:none;';
        btn2.setAttribute('tweed-id', status.id_str);
        btn2.addEventListener('click', function () {
          reTweet(this.getAttribute('tweed-id'));
        });

        var iconspan2 = document.createElement('span');
        iconspan2.style.color = '#00B7FF';
        iconspan2.style.fontSize = '20px';
        iconspan2.setAttribute('class', 'glyphicon glyphicon-retweet');

        btn2.appendChild(iconspan2);

        div.appendChild(header);
        div.appendChild(btn);
        div.appendChild(btn1);
        div.appendChild(btn2);

        div.appendChild(contents);
        div.appendChild(fname);
        div.appendChild(lname);
        div.appendChild(fd);
        div.appendChild(fn);
        div.appendChild(date);

        tweetsElement.appendChild(div);
      });

      loadingElement.style.display = 'none';
      if (!result.has_more) {
        loadMoreElement.style.visibility = 'hidden';
        finished = true;
      } else {
        loadMoreElement.style.visibility = 'visible';
      }
      loading = false;
    });
}

function loadMore() {
  skip += limit;
  listAllFiles(false);
}
