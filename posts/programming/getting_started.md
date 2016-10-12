# Getting Started With Programming

Hi there, welcome to a fast (depending on how fast you read) and quick
(actually really in depth if I manage to keep going).

What I will do:

- explain computers
	- a bit of hardware maybe
	- a whole lot of software
	- sprinkled with operating system stuff
- explain programming
	- concepts
	- ideas
	- best practices
- explain languages in detail
	- some, I don't really know which yet, I just started to write something so
	  this might be a little weird

# Theory

You can happily skip this whole chapter.
I earlier said this will be in depth so here you go:

> Computers are stupid.

To understand why, let me just summarise:

1. Computers do exactly what you tell them
	- if you tell them to kill themselves they'll do
	- if you tell them something they don't understand they'll try to make
	  themselves understand (often by just doing random things)
		- that got better in recent years, we now have smarter interpreters,
		  compilers, OSes and whatnot. Stuff usually tells you right away that
		  it doesn't know what to do with your instructions
2. Computers have not a lot of instructions you can give them
	- this however doesn't apply to other software, you can and will instruct a
	  lot of foreign software to do things for you
		- foreign code can contain bugs of their own
3. Computers as whole, starting at the hardware and going all the way up, are
   just so incredibly complex that you will never understand everything about
   them. [relevant xkcd](https://xkcd.com/1605/)

## What is a Computer?

Basically a computer consists of CPU and RAM.
In most computers you'll find other things like disks or peripherals.

Peripherals include:

- output devices
	- monitors
- input devices
	- keyboards
	- mice
- both
	- parallel/serial ports
	- network

*[CPU]: Central Processing Unit
*[RAM]: Random Access Memory

Imagine a computer that just computes using CPU and RAM.…
You had no way of getting data into the computer and no way of getting it out,
that would be pretty pointless.

Now think of the [Standards problem](https://xkcd.com/927/).
There is a whole lot of entirely different hardware out there.
You can't just be compatible to all hardware.
Period.
That is why I am introducing you to the concept of the Stack.

## The Stack

A stack (English: stack) is what happens when you want to go to bed and are too
tired to put your clothes somewhere and just throw them in the same corner
every night and take fresh ones in the morning.
This is about the same with computers just a little broader and occasionally
less high.

### Bottom

So at the bottom of the stack there is our hardware.
CPU, RAM, disks, peripherals and all the other nice things.

There are chips on your mainboard (the part that connects all of the other
things) that handle voltage of the other parts, make it possible to keep your
finger long on the power button to kill your computer and much more things.

There is also a chip containing a BIOS or UEFI.
Either of them is the bottom of the software stack.
I'll just assume a BIOS.

*[BIOS]: Basic Input and Output System
*[UEFI]: newer than BIOS, but not necessarily better.

The BIOS initialises devices and provides some way of configuring certain very
low-level (very deep down the stack) configuration options.
This can for example be "where to boot from".
If you just boot from the internal disk it will read the first 512 bytes from
the disk and interpret those.

#### Binary

Oh right.…
Some long time ago computer people decided they need to store data in some way.
The most hardwarish way to do that, as early computers were the size of a
house and did mostly consist of hard-wired logic, was to build some electronic
part that could store a simple signal:

| State | Number |
|-------|--------|
| Off   | 0      |
| On    | 1      |

This is what we call a "bit".
A bit is not very much.
So we just take eight of them and call it a "byte".
If you have a byte written out in numbers it would be between (inclusive)
`00000000` (lowest) and `11111111` (highest).
Now, if we count the number of different patterns we can store inside that we
will count exactly 256.

Memory, so both disks, RAM and everything else that stores data is just a long
array of bytes of which each one can be individually read and set.

More to be read on [Wikipedia](https://en.wikipedia.org/wiki/Binary_number).

### But back to the BIOS

So, the BIOS reads 512 bytes which it interprets.
These bytes are called the MBR.
The MBR can then again instruct the BIOS to do things like loading data from a
harddisk, store it in RAM.
It can even instruct the BIOS to jump to the location in RAM where it just
loaded data to and the data is then executed by the CPU.

*[MBR]: Master Boot Record

Okay, so we managed to get from the hardware all the way up to executing custom
code on the CPU.
This means this code now has full control over the entire computer.
What it does?
Well, the process of starting a computer is called "booting".
There are several parts involved in booting, including a "bootloader".

### Bootloader

The bootloader consists of at least two parts, the first part being the MBR.
As 512 bytes don't really give you a lot of opportunity to do something other
than loading stuff to memory and jumping to it the second part naturally is the
code being loaded to memory and executed.
We call it the second stage bootloader.

This bootloader has a lot more space at hand and can therefore do things such
as presenting a menu to you on screen and reading input from your keyboard to
assist in doing things.

Examples of bootloaders include:

- LiLo
- Grub
- Windows Bootloader
- syslinux

This second bootloader often is large enough to know how to properly read other
data than just "the first 512 byte" meaning it can already read data from the
disk that determines it's behaviour.
This usually means that you can already use configuration files or an
equivalent to instruct this part of the bootloader.

The bootloader then continues to load the first bit of your Operating System,
called the "kernel".

### Kernel

From here on things are quite different depending on your OS so I'll save it
for the next blog post, which will be on OSes.

