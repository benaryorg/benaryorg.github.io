# Plain Code

In the first blog post I've covered some theory about computers in general so
how about we start programming now?

This post might seem a bit boring as we will neither talk about how to actually
run the code nor will the code actually output something or interact with
anything.

# Programming Languages

Syntax describes the structure of code.
A programming language is just a way of telling a computer what to do in human
readable form.
The only thing that programming languages differ in is syntax.
That last sentence is just plain wrong.

Every programming language does have some features that set it apart from
others, unless somebody felt the need to reinvent the wheel, wasn't aware of
the other language(s) or developed it at the same time.
Features might be different [programming
paradigms](https://en.wikipedia.org/wiki/Programming_paradigm) such as
declarative versus imperative programming.

For the sake of simplicity I will just choose the language C, not because it is
particularly modern or has a lot of features but because it is lacking magic
and is therefore easier to understand because nothing strange is going on
behind the scenes and because C is nowadays used as a whole category of syntax.
C-like syntax is common; Java, Rust, PHP, JavaScript, it's just everywhere.

# First Steps

Let's get into it.

Every program needs a starting point, in case of C it is called `main`.

Let's do something simple: a program that does nothing.

```c
// this is a comment
void main(void)
{
}
```

So, what can we see here?

First thing: a comment is something you can only see in the source code.
It is just ignored by literally everything.

Second: we see `main` right?
But what's the stuff around it you ask?
Well, `void` means *nothing*.

C is typed, meaning everything has a type.
The notation used for declaring things in C is one of the below:

| Name     | Declaration                   |
|----------|-------------------------------|
| Variable | `type name`                   |
| Array    | `type name[length]`           |
| Function | `return_type name(variables)` |

That means we are declaring a function named `main` (our entry point) that
"computes" nothing and needs nothing to do that.
Seems about right.

Furthermore we have curly braces that denote the function body: the start and
end of the function.

## Functions

Functions aka subroutines, are pieces of code which you can use from other
places.
This could for example be used for establishing a connection to a server.

A function does have input and output, both of which can be nothing aka `void`.

In the example of the connection this function could look like:

```c
connection connect(address server,number port)
{
	// do something
	return some_variable_of_type_connection;
}
```

## Variables

Variables are easy.
A variable is a piece of memory with a fixed size.
As soon as you have a variable you can do with it's memory whatever you like.

C does have certain types of variables defined for you (assuming x86_64
platform):

| Name      | Size    | Type        | Values                               |
|-----------|---------|-------------|--------------------------------------|
| Integer   | 4 byte  | `int`       | -2147483648 to 2147483647            |
| Short     | 2 byte  | `short int` | -32768 to 32767                      |
| Character | 1 byte  | `char`      | -128 to 127                          |
| Pointer   | 8 byte  | `type *`    | reference to memory                  |
| Double    | 8 byte  | `double`    | very low to very high floating point |
| Float     | 4 byte  | `float`     | low to high floating point           |

Integral types including characters can be made `unsigned` by prefixing them
with unsigned, making them hold only positive numbers, extending their upper
bounds by the capped lower bounds.

### Integer

An integer is just an integral number, meaning one or two, but not 1.5.
You can multiply it's value, divide it and do weird things with it.

### Character

Characters are used for text.
Meaning you can easily store `'a'` or `'b'` and using pointers or arrays whole
words sentences or whatever you want, we call that a *string*.

If you are storing an actual character in a `char` as opposed to a number, then
you will find yourself using ASCII, which is just a standard assigning specific
numbers to letters.
`'a'` for example equals the number 97.
You usually don't use the numbers directly but character notation:

*[ASCII]: American Standard Code for Information Interchange

```c
char difficult = 97;
char easy = 'a';
```

ASCII table and other things about ASCII to be found
[here](https://en.wikipedia.org/wiki/ASCII).

### Floating Point

There is a nice [IEEE
standard](https://en.wikipedia.org/wiki/IEEE_floating_point), just read that.
No, I'm joking, just deal with it that you can store things like `0.5` inside
them but that it is not guaranteed that they equal or be exact.
If you can, use an integer instead.
Especially when dealing with currency.
If you deal with currency, just store the smallest unit as integers.

## Array

You need fifty integers?
Just use `int [50]`.

You can then access it using `name[index]`.

**Warning:** the first index is 0, not 1.

# Pointers

No, I haven't yet explained them.
Most people consider them annoying because they always make your programs
crash (when you use them wrong).
Pointers are easy, just think of them as an integer that holds an address in
memory.
I've already told you, a variable isn't any different from a few bytes in
memory.
A simple example:

```c
// get four bytes and write 42 into them
int data = 42;

// store the data's address
int *ptr = &data;

// get more bytes and store the data the ptr points at
int newdata = *ptr;
```

## Pointers and Functions

```c
// sets the memory at some address to the answer
void get_answer(int *data)
{
	*data = 42;
}

// get some bytes
int data = 4;

// set that memory address' memory to the answer
get_answer(&data);
```

Why would you want this?
You'll know when, but if it's possible to do without pointers, try that,
unless of course it has serious disadvantages.

## When Pointers Go Bad

```c
// just point at some address in memory where we don't have data
int *data = 0;

// access the data
*data;

// program crashes above
```

Why is 0 special?
Well, some people thought, why don't take 0 as a special value for "pointer
points at nothing".
Since then this is convention.
All modern operating systems have the address 0 always "unmapped" meaning if
you try to access it, whether it be read or write, the program instantly
crashes.

## Pointers and Arrays

The name of an array without any index given is a pointer to the memory of the
array, meaning you can use it to pass arrays to functions (which is otherwise
not permitted).
This is also nice if you got your memory from somewhere else than an array
declaration.

Furthermore it means that not only is your array a pointer but also that any
pointer is an array.

Therefore you can do things like that:

```c
// returns the second element
int second(int *arr)
{
	// remember that the first index is 0
	return arr[1];
}

// create an array with two elements (0 and 1)
// and fill it with the values 1337 and 42
int arr[2] = {1337,42};

// store the result (42) of `second` into `snd`
int snd = second(arr);
```

## Pointer Arithmetic

You can add some numbers to integers and characters of course, but what about
pointers?
If you add or subtract some number from/to a pointer then the result is a
pointer shifted by that **amount**.
Amount in this case means that it is shifted by a number of units of the type
of the pointer.

An example:

```c
// pointer at the start of the ram at address 0
int *ptr = 0;

// pointer to the second integer in memory
// this means it points at the address 4
int *further = ptr+1;
```

I wrote "the second integer in memory" which is kind of a contrary statement to
what I said before.
Memory is just a bunch of bytes.
On RAM level there is no such thing as an integer.
But if you write C code that declares some memory address to be handled as an
integer then it will be handled as that, even if it's not.

We can see this easily in an example like this:

```c
// regular integer (4 byte)
int i = 1337;

// use the four bytes of `i` as an array
char *arr = &i;

// we can now access the individual parts of the array
arr[0]; // 57
arr[1]; // 5
arr[2]; // 0
arr[3]; // 0
```

Something worth noting here is that the first element (0) contains the lowest
byte of the integer.
This is because the platform I am assuming (x86_64) is "little endian".
More information on [Wikipedia](https://en.wikipedia.org/wiki/Endianness).

## Strings

Strings as mentioned above are a special kind of array, a character array.
They are very important because in an application you often deal with character
arrays, whether it be user input, network connections or just simple output,
you always work with byte arrays.

Strings do have some special value at the end, a zero.
This is used for termination.
Why you ask?
Well, imagine an array which holds the text a user entered; variable length and
definitely no NUL value inside.
Now it is your job to do things with it.
How do you know where it ends?
You see that having a 0 at the end is perfect for telling where a string ends.

And because we use strings that often there is a convenient way to write them:

```c
// we can leave the number out if we directly initialize it
// because the length is known at compile-time because we set the values
char array[] = {97,104,97,0}; // ASCII for "aha" and a zero at the end

// means the same (including the zero at the end).
char same[] = "aha";
```

# To Be Continued

