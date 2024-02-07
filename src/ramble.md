# Ramble

This is the mandatory ramble section I guess.
Here I'll explain some of my background and what this is all about.

I'm currently typing this on my semi-freshly acquired `aarch64` tablet convertible.
The device is nice, it's basically a portable Linux device which I can use for typing stuff on the go, or with some tinkering maybe even play games on the go.
The crux is however is that computers are mind-bogglingly stupid[^h2g2-ref-1].

Contrary to the popular opinion of "the computer deleted my file" or "the computer keeps downloading files to the wrong directory" we did not actually make sand *think*, not yet anyway.
All a computer ever does is what someone told it to do, specifically, in a structured format that the computer can follow; this applies to all computers regardless of whether it's a physical device, some emulator, or even the JVM – or any byte code interpreter for that matter.
They are incredibly single-minded if you can even call it that.
The problems that people have with computers are usually one of three things (IMHO, YMMV): hardware failure, interoperability, and "someone told this computer to do something I don't like".
The first one is unavoidable to some extent.
The second one is usually some vendor lock-in or some hardware standards thing, often caused by [NIH](https://en.wikipedia.org/wiki/Not_invented_here) link, or some other [enshittification](https://en.wikipedia.org/wiki/Enshittification) thing, avoidable to some extent, but also historical baggage more often than not.
The last one.… well, this includes everything from hardware, via firmware, to software, up to and including settings, presets, etc., and it's one of the primary reasons why [FOSS](https://en.wikipedia.org/wiki/Free_and_open-source_software) came into existence.
So when someone says "the computer keeps downloading files to the wrong directory" what the underlying message is "someone configured the software on this computer to download files to a different directory than I want them in".
I am *not* blaming the person who is using the computer.
Sure, they *may* have explicitly set the wrong directory in their browsers preferences, but with the amount of software we shove into these boxes it may also be the complex interaction of three pieces of software all of which have different conventions and configurations.
*Someone* configured those, either explicitly as a user, or implicitly through defaults shipped by your upstream vendor, or the defaults set in the software, or straight out "defaults" in terms of the way the code is written in.
If the code of a software never checks the configuration setting you are setting despite it being the way to set things as per documentation then yes, someone forgot to tell the computer to ask you for your opinion (and you're just giving your opinion to the void).
Right here and right now it is important to say that yes, there's always a person to point at, but no, you shouldn't actually do that.
All of these "configuration choices" happen for a reason, and rarely is it just a simple mistake.

- often because software follows a standard (like the XDG specs for your desktop)
- sometimes because people didn't know the standard (when someone uses public IPv4 addresses in their private network because they didn't know about [RFC 1918](https://datatracker.ietf.org/doc/html/rfc1918))
- time or other resource constraints (like how my infrastructure is largely not available via Legacy IP[^legacy-ip] because it's just not worth it for me)
- unfortunately also because companies don't give a flying duck about making something configurable or even *usable* for a user (go ask Nintendo what [that big warning notice on the 3DS update history](https://web.archive.org/web/20240207134431/https://en-americas-support.nintendo.com/app/answers/detail/a_id/667/~/nintendo-3ds-system-update-history) is all about)

And in this case – a Chromebook – someone at Google thought of a really fancy way to boot this device with some custom (largely?) Open Source firmware and whatnot to enable a very fast and verified boot, with signatures and such, to prevent intrusions.
I don't know why it was necessary to optimize the boot times of the bootloader of all things, but hey, at least the source code is available and the documentation is actually usable.
The intentions here aren't really relevant right now, suffice to say getting mainline Linux to boot on these devices requires packing of the kernel and initrd in a special format ([Depthcharge](https://chromium.googlesource.com/chromiumos/platform/depthcharge/)) to get the device to recognize this (not to mention persisting dev mode and tinkering with firmware write protection to disable verified boot).
Okay, so far so good, this isn't the most complex computer thing I've done before.
Why am I telling you all this?
Well, first of all, this is the ramble section, what did you expect?
Second, and much more importantly, because in trying to change something about this I had to learn a hard lesson — again.
What I was trying to do is deploy [*Das U-Boot*](https://docs.u-boot.org/en/latest/index.html) as a *kpart* image (like the kernel) so I could teach this device to just boot from a partition, which would have made testing and updating kernels much easier.
There is even a documentation section on this exact thing, except it's for the device codenamed *snow* with *jerry* being listed as an alternative.
I am writing this on *krane* however.

Now comes the relevant part that I've been meaning to get to; I'm a network engineer.
I love routing packets from one device to the next.
That's what I do at home.
I also tinker with my software a bit, but usually nothing that nobody's done before.
That thing however?
No dice.
The Linux kernel has [DTBs](https://en.wikipedia.org/wiki/Devicetree) for my device (and the entire family), heck [*mobile-nixos*](https://mobile.nixos.org/) has this entire device family covered including the *kpart* generation using *depthcharge*.
U-Boot has none of that.
No DTBs – okay, I can copy those off of the Linux build.
No defconfig – okay, I used to compile my own kernels shouldn't be that hard.
Nothing on the internet on what I need for this device type and the closest in the U-Boot tree with a defconfig was a single device with an *mt8183* that didn't quite match my hardware.
This is where I get stuck.

I – as a sysadmin-ish hybrid developer networking person – require documentation to base my stuff off of, and whenever something diverges from my – admittedly very broad – experience I get stuck.
This entire blog is about writing down whatever I know so that I can reference it and so that other people can try and build stuff off of whatever I do.
That is if I can actually keep up the writing, something I wouldn't bet on, but you never know what life throws at you, eh?

[^h2g2-ref-1]: I can't promise that this was the last H₂G₂ reference.

[^legacy-ip]: When I say *Legacy IP* I refer to IPv4. I don't like IPv4, and I'd rather we fully commit to IPv6 already.

