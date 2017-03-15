document.addEventListener('DOMContentLoaded',function()
{
	var DONE = this.DONE || 4;
	var converter = window.markdownit
	({
		highlight: function(str,lang)
		{
			if(lang && hljs.getLanguage(lang))
			{
				try
				{
					return hljs.highlight(lang,str).value;
				}
				catch(__)
				{
				}
			}
			return '';
		}
	})
		.use(window.markdownitAbbr)
		.use(window.markdownitFootnote);

	var loadpost = function(file)
	{
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()
		{
			if(this.readyState === DONE && this.status === 200)
			{
				var oldcenter = document.getElementById('center');
				var newcenter = document.createElement('div');
				var backlink = document.createElement('a');
				var post = document.createElement('div');

				backlink.href = '#';
				backlink.innerHTML = 'Back to Posts';
				backlink.onclick = function()
				{
					window.location.href = backlink.href;
					loadpostlist();
					return false;
				};

				post.innerHTML = converter.render(xhr.responseText);

				newcenter.id = 'center';
				newcenter.appendChild(backlink);
				newcenter.appendChild(post);

				oldcenter.parentElement.replaceChild(newcenter,oldcenter);
			}
		};
		xhr.open('GET',decodeURIComponent(file),true);
		xhr.send();
		return false;
	};

	var loadpostlist = function()
	{
		var recvposts = function()
		{
			if(this.readyState === DONE && this.status === 200)
			{
				var oldcenter = document.getElementById('center');
				var newcenter = document.createElement('div');
				var header = document.createElement('h1');
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

						link.href = '#'+encodeURIComponent(file);
						link.innerHTML = title;
						link.onclick = function()
						{
							window.location.href = link.href;
							loadpost(encodeURIComponent(file));
						};

						li.appendChild(link);
						list.appendChild(li);
					});

				header.innerHTML = 'Blag Posts:';

				newcenter.id = 'center';
				newcenter.innerHTML = '';
				newcenter.appendChild(header);
				newcenter.appendChild(list);
				oldcenter.parentElement.replaceChild(newcenter,oldcenter);
			}
		}

		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = recvposts;
		xhr.open('GET','posts.txt',true);
		xhr.send();
		return false;
	};

	if(window.location.hash === "" || window.location.hash === "#")
	{
		loadpostlist();
	}
	else
	{
		loadpost(window.location.hash.substr(1));
	}
});

