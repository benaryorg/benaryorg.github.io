document.addEventListener('DOMContentLoaded',function()
{
	var converter = new Markdown.Converter();
	var xhr = new XMLHttpRequest();
	var DONE = this.DONE || 4;
	var readystatechange = function()
	{
		if(this.readyState === DONE && this.status === 200)
		{
			document.getElementById('postparent').style.display = 'none';
			document.getElementById('postlistparent').style.display = 'block';

			var oldlist = document.getElementById('postlist');
			var list = document.createElement('ul');
			list.id = 'postlist';

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

					link.href = '#';
					link.innerText = title;
					link.onclick = function()
					{
						var xhr = new XMLHttpRequest();
						xhr.onreadystatechange = function()
						{
							if(this.readyState === DONE && this.status === 200)
							{
								var post = document.getElementById('post');
								post.innerHTML = converter.makeHtml(xhr.responseText);
								document.getElementById('postparent').style.display = 'block';
								document.getElementById('postlistparent').style.display = 'none';
							}
						};
						xhr.open('GET',file,true);
						xhr.send();
						return false;
					};

					li.appendChild(link);
					list.appendChild(li);
				});

			document.getElementById('postlistparent').replaceChild(list,oldlist);
		}
	}
	xhr.onreadystatechange = readystatechange;
	xhr.open('GET','posts.txt',true);
	xhr.send();

	document.getElementById('backlink').onclick = function()
	{
		document.getElementById('post').innerHTML = '';
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = readystatechange;
		xhr.open('GET','posts.txt',true);
		xhr.send();
		return false;
	};
});

