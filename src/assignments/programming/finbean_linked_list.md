# Finbean Linked List

## Finbean

If you don't know [Finbean](https://twitch.tv/psycho_manatee) then this meta-paragraph probably doesn't concern you.
Basically Finbean studies computer science and writes code.
Rookie code I'd probably say, but we've all been rookies at some point, and there's only so far you can make someone go on their assignments, so sometimes you code along.

## The Assignment

I don't know exactly what the assignment was, it was something about storing cuisines in a list, and you had to craft the list yourself I assume (otherwise, what the heck Finbean, that assignment would've taken like two minutes).
Anyway, language is C++ and the "IDE" was vim, which *is* powerful enough as it is.
Since I use vim daily [my configuration](https://github.com/benaryorg/dotfiles) is elaborate, and my toolchain consists of a long list of compiler flags and some additional tools (like *valgrind* or *gdb*).
For this assignment however I used [onlinegdb.com](https://www.onlinegdb.com/9C4vV0Rv30) as it was easiest, despite running Gentoo and therefore having C++ compilers at hand on every single machine I have.

## Code

Back on track, this is the code (ISC licensed):

```cpp
/*
 * Copyright (c) 2022 benaryorg <binary@benary.org>
 *
 * Permission to use, copy, modify, and distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

// compile using:
//  g++ \
//    -pedantic -Wall -Wextra -Wcast-align -Wcast-qual -Wctor-dtor-privacy -Wdisabled-optimization
//    -Wformat=2 -Winit-self -Wlogical-op -Wmissing-declarations -Wmissing-include-dirs -Wnoexcept
//    -Wold-style-cast -Woverloaded-virtual -Wredundant-decls -Wsign-conversion -Wsign-promo
//    -Wstrict-null-sentinel -Wstrict-overflow=5 -Wswitch-default -Wundef -Wno-unused -Werror

#include <iostream>
#include <memory>

using namespace std;

typedef void (*iter_func)(const string *data);

void print_node(const string *);

class MyNode
{
	string data;
	unique_ptr<MyNode> next { nullptr };

public:
	MyNode(string data)
	{
		this->data = data;
	}

	bool eq(string data)
	{
		return this->data == data;
	}

	void iterate(iter_func func)
	{
		func(&this->data);
		if(this->next)
		{
			this->next->iterate(func);
		}
	}

	void insert(string data)
	{
		if(data < this->data)
		{
			unique_ptr<MyNode> old = move(this->next);
			this->next = unique_ptr<MyNode>(new MyNode(this->data));
			this->data = data;
			this->next->next = move(old);
		}
		else
		{
			if(this->next)
			{
				this->next->insert(data);
			}
			else
			{
				this->next = unique_ptr<MyNode>(new MyNode(data));
			}
		}
	}

	bool remove(string data)
	{
		if(!this->next)
		{
			return false;
		}
		if(this->next->eq(data))
		{
			this->next = move(this->next->next);
			return true;
		}
		return this->next->remove(data);
	}

	unique_ptr<MyNode> split_after()
	{
		return move(this->next);
	}
};

class MyList
{
	unique_ptr<MyNode> head { nullptr };

public:
	MyList()
	{
	}

	void iterate(iter_func func)
	{
		if(this->head)
		{
			this->head->iterate(func);
		}
	}

	void insert(string data)
	{
		if(this->head)
		{
			this->head->insert(data);
		}
		else
		{
			this->head = unique_ptr<MyNode>(new MyNode(data));
		}
	}

	bool remove(string data)
	{
		if(!this->head)
		{
			return false;
		}
		return false;
		if(this->head->eq(data))
		{
			this->head = this->head->split_after();
			return true;
		}
		return this->head->remove(data);
	}
};

void print_node(const string *data)
{
	cout << "data: " << *data << endl;
}

int main()
{
	unique_ptr<MyList> list(new MyList());

	cout << "first run (empty):" << endl;
	list->iterate(print_node);

	list->insert("tomato salad");
	cout << "second run (1):" << endl;
	list->iterate(print_node);

	list->insert("french fries");
	cout << "third run (2):" << endl;
	list->iterate(print_node);

	list->insert("potato salad");
	cout << "fourth run (3):" << endl;
	list->iterate(print_node);

	list->insert("marinated manatee");
	cout << "fifth run (4):" << endl;
	list->iterate(print_node);

	list->remove("marinated manatee");
	cout << "sixth run (3):" << endl;
	list->iterate(print_node);

	return 0;
}
```

## Questionare

Besides writing this and answering questions if people had some (also teaching some peers how to use the basics of *gdb*, though that's not quite related to this) there was also this questionaire that came up in the end.
This was also relayed by Finbean, and of course it may very well be subject to intellectual property, so I reproduce these questions here hoping that neither me nor Finbean will be reprimanded for it.
If you want it taken down hit me up via the media of your choice, [my website](https://benary.org)[^ipv6_only] should list *something* you can use.

[^ipv6_only]: Note the website is IPv6-only, file a complaint with your ISP if you can't access it, though I can't help but think that my infrastructure may be at fault.

### Used Structure

> a. How well did the data structure selected perform for the assigned application?

I chose a list with most methods implemented via tail recursive calls on the nodes.
This performed reasonably well since the ergonomics are at focus for this assignment.
Had performance in terms of memory, cpu, or scalability constraints been an issue the lack of short-circuiting in the iterative approach of traversing the list would have been a limiting factor.

### Alternative Structures

> b. Would a different data structure work better? If so, which one and why...

My list was singly linked, therefore implementation complexity was low which was the important thing here.
It also was more of a set-like approach (a PriorityQueue in Java or BinaryHeap in Rust), keeping the list sorted internally at all times, this would've allowed some performance improvements, though nothing big compared to the alternatives.
However for performance reasons a hashset or hashmap would have been more suitable.
The constant-time of hashing adds some overhead but allows O(log(n)) indexing which for large sets of data outperforms any iterative approach.

### Efficiency Considerations of Used Structure

> c. What was efficient about your design and use of the data structure?

The tail recursion did make up for constant memory usage while keeping implementation complexity to a minimum.
The separation of list and node functions, the latter carrying the brunt of logic, did allow for a separation of internals and interface while still keeping internals structured.
Keeping the list sorted internally was also a benefit when it comes to search, but that was barely necessary.
If insertion speed was key, then this would indeed be a serious flaw.

### Ineffeciencies of Used Structure

> d. What was not efficient?

Insertion speed mostly, but as said, everything compared to a hash-approach.

### Critical Approach

> e. What would you do differently if you had more time to solve the problem?

Throw math at the problem, in a nutshell.
Many existing algorithms are faster than mine mathematically. I'd leverage them where possible.

For *e* I'd like to add that if I had more time I'd like to have a talk with the product owners or stakeholders (or whatever internal position is responsible for clarifying requirements) as to what use-case should be optimised for.
Are we focusing write speed? Memory compactness? Search time?
The solution strongly depends on these, for example Perfect Hash Functions (PHFs) can be used to achieve constant time access in a map, which would be useful if the list was either constant/static or rarely ever changed.
Adding new elements would be terribly expensive then though.
Also, a database might be much better suited if filtering was important.

If complexity would rise above basic types of sets or lists then I'd very likely opt for using an in-memory sqlite database, which is both trivial in terms of license (public domain) as well as embeddable (it's in virtually every smartphone) and highly performant [citation needed] and scalable (unless you require parallel writable access).
It also serialises nicely, and can leverage edge cases such as expensive flash storage by using append-mechanisms and whatnot.
Basically for storing structured data, sqlite is the way to go if you need querying.

## Words to the Professor

I know I didn't fully finish the assignment, heck I didn't even have access to it to begin with, however I'd like your honest opinion on this if possible.
To add a few things about my code: yes, my class naming sounds more like a tutorial than anything.
Also, I would've gone the full route and either use templating or generics to get myself a generic list, or map even, that would allow me to re-use it for several parts of the assignment, again the full scope of which I didn't have access to, hence I only ever implemented the basic list type and the bare minimum of methods on it.
Also, I'm "new" to C++, usually sticking to Rust, C, and various scripting language since I'm a systems administrator by profession (though both developer and devops suite my skillset equally well), hence not making use of the very powerful features of templating that C++ offers, a double edged sword, but one that when wielded properly can be a game-changer.
In practice I'd stay away from templating though, since maintainability decreases drastically in such cases, and in my opinion maintainability is more important than performance often enough.
Also note that modern compilers optimize better than humans can do, so the best we can do is choose an approach and algorithm and hope for the best, implementation specifics rarely matter, and making the code concise on a high-level often increases speed due to abstractions applied by the optimisation layer, such as tail-call optimisation.

Feel free to send me an email if you can be bothered to go through this.

### Further Info

By the way, examples of such optimisations are the rigorous use of call-by-value even for large structs.
The compiler will figure out how to pass it indirectly or how to make use of the stack.
Generally I prefer using the stack wherever possible for that reason exactly.

