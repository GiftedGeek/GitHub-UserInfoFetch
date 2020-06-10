const pullAccountInfo = () => {
  const username = document.getElementById("search").value;
  const url = `https://api.github.com/users/${username}`;
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      const img = document.createElement("img");
      img.src = data.avatar_url;

      const dataTable = document.getElementById("infoDisplayTable");
      const noOfRows = dataTable.rows.length;

      const newRow = dataTable.insertRow(1);

      const followers = fetch(data.followers_url)
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response.json();
        })
        .then((data) => {
          const followers = [];
          data.forEach((obj) => {
            followers.push(obj.login);
          });
          return new Promise((resolve, reject) => resolve(followers));
        });

      const avatarCell = newRow.insertCell(0);
      const nameCell = newRow.insertCell(1);
      const repositoryCell = newRow.insertCell(2);
      const followersCell = newRow.insertCell(3);
      const locationCell = newRow.insertCell(4);

      avatarCell.appendChild(img);
      nameCell.innerHTML = `<a href=${data.html_url} target="_blank"> ${data.login} </a>`;
      repositoryCell.innerHTML = data.public_repos;
      followers.then((val) => {
        if (val.length != 0) {
          var allFollowers = "";
          val.forEach((followerName) => {
            allFollowers += `<a href=https://github.com/${followerName} target="_blank">${followerName}</a> </br>`;
          });
          followersCell.innerHTML = allFollowers;
        } else {
          followersCell.innerHTML = '<p> No Followers </p>';
        }
      });
      if (data.location === null) {
        locationCell.innerHTML = '<p>Location unavailable</p>';
      } else {
        locationCell.innerHTML = data.location;
      }

      if (noOfRows > 1) {
        dataTable.deleteRow(2);
      }
    })
    .catch((error) => {
      alert("User Unavailable");
    });
}