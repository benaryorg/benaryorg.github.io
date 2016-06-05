document.addEventListener('DOMContentLoaded',function()
{
	var converter = new Markdown.Converter();
	var DONE = this.DONE || 4;

	var loadpost = function(file)
	{
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()
		{
			if(this.readyState === DONE && this.status === 200)
			{
				var center = document.getElementById('center');
				var backlink = document.createElement('a');
				var post = document.createElement('div');

				center.innerHTML = '';

				backlink.href = '.';
				backlink.innerText = 'Back to Posts';

				post.innerHTML = converter.makeHtml(xhr.responseText);

				center.appendChild(backlink);
				center.appendChild(post);
			}
		};
		xhr.open('GET',file,true);
		xhr.send();
		return false;
	};

	var loadpostlist = function()
	{
		var recvposts = function()
		{
			if(this.readyState === DONE && this.status === 200)
			{
				var header = document.createElement('h1');
				header.innerText = 'Blog Posts:';
				var list = document.createElement('ul');

				var lines = xhr.responseText.split('\n');
				lines
					.map(function(line)
					{
						return line.trim();
					})
					.filter(function(line)
					{
						return line.length > 0;
					})
					.forEach(function(line)
					{
						var index = line.indexOf(';');
						var file = line.substr(0,index);
						var title = line.substr(index+1);

						var li = document.createElement('li');
						var link = document.createElement('a');

						link.href = '?post='+encodeURIComponent(file);
						link.innerText = title;
						link.onclick = function()
						{
						};

						li.appendChild(link);
						list.appendChild(li);
					});

				var center = document.getElementById('center');
				center.innerHTML = '';
				center.appendChild(header);
				center.appendChild(list);
			}
		}

		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = recvposts;
		xhr.open('GET','posts.txt',true);
		xhr.send();
		return false;
	};

	var index = window.location.href.indexOf('?post=');
	if(index == -1)
	{
		loadpostlist();
	}
	else
	{
		var post = window.location.href.substr(index+6);
		if(post != '')
		{
			loadpost(post);
		}
		else
		{
			loadpostlist();
		}
	}
});

