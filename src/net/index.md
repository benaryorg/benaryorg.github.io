# Networking

It's been a few years since I dove head first into networking.
Thinking back to the first server I ever managed myself, a cheap 5€/month server, I did what every respectable sysadmin did on their first server around the year 2012.
I took every single piece of software and installed it right on the host and somehow got everything to work together.
In retrospect that was a huge mistake, it was a huge pain, and when eventually the HDD in that server died one day, which I noticed while sitting in school trying to access my emails – stored on that server – it was high time I did something about this.

During that all-nighter I did a few things; first of all I stopped putting everything on hat single machine directly and instead opted for containers.
Not Docker, which got traction and the time, oh no.
You see, I had a vague idea of what namespaces were, something fancy that emerged at the time, so I looked around whether there was something other than LXC, something that didn't.… like.… have to build templates on the fly when creating containers.
I found LXD[^lxd-incus] pretty quickly.
Not only did it offer creating containers from upstream built templates, it also integrated with both storage and networking.

This is when I first learned about something that is known as a *bridge device*.
At the time I didn't care much because the server had just crashed and I needed to pull some backups – which were incomplete and corrupt – to at least get email back up.
I didn't know about *Link Layer* and *Network Layer* and I didn't know how DHCP worked.
Okay that's actually wrong, we learned about that in school.
I think *everyone* who's formally learned about how DHCP works will find that practically introducing that one or any adjacent technologies is not quite like the dry theory.
The theory isn't wrong.
On the contrary it is usually based on the RFCs and since it's been in use for decades with a wide range of implementations and a bunch of features on top it's not exactly a moving target or something with a lot of unknowns.
However there comes a time when you create your first bridge – or rather the first time you look at a bridge – and you see the following in your route table (`ip r`):

```text
192.0.2.0/24 dev foo proto kernel scope link src 192.0.2.1
```

Okay so what does this mean?
What is the difference between that and my default route?

```text
default via 192.0.2.254 dev foo proto static
```

You see, when I set up my system back then I had a single public IPv4 address and I didn't exactly know too much about IPv6 at the time.
Didn't help that my hosting provider told me I had a single `/128` either, they still do tell me that despite actually giving me a `/64` on all my servers, they just don't expose the extra rDNS records via the API, but that's a story for another time.

So what did I do?
I told the hypervisor (Incus) to put a managed IPv4 bridge there and do DHCP and DNS for me.
I didn't know that all it did was run *dnsmasq* under the hood, and I didn't know that *dnsmasq* does provide local DNS simply by using the hostnames and IPs exchanged in DHCP.
I certainly didn't know that this only works for IPv6 if IPv4 is used too, I learned that *years* later.
All I had was my bridge with the internal addresses, and then I ran some port forwarding for SMTP and IMAP, exposed the certificates to the containers via bind-mounts and ran nginx on the host to terminate TLS for all HTTP services.
It wasn't ideal, but it worked.
Moral of the story: it's easier to deploy your first network than you think, and being able to deploy it doesn't mean you'll understand what's happening.
This is what this section is for; going step by step through networking, IPv4 and IPv6, with practical examples and Linux-based explanations of what's going on.

[^lxd-incus]: If you want to use this today have a look at [Incus](https://linuxcontainers.org/incus/) instead. I will refer to the software as Incus from now on even when I refer to using LXD at the time. It's a political thing, don't worry too much about it.

