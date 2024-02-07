# Link Layer

The title of this section is misleading.
I'm not going to talk a lot about *Link Layer*.
I'll be talking about how *Network Layer* uses *Link Layer*.

No, that doesn't sound right either.
And now that I'm putting these inner-monologue-sentences in here I'm pretty sure I've lost at least half of my readers.
Off to a great start.
Guess we'll have to clarify what I'm talking about first.
Everyone who's been in tech for a while will recognize that next title and a sense of dread will probably start to bubble up.
I'm sorry, but we just *have* to take a second and talk about

## Terminology

There, I said it.

So what *are* we talking about?
What is this *Link Layer* even?
Are we talking ISO *OSI* model?
**No.**
No we are *not* talking OSI model.

That's a start, that's a thread we can follow.
So what are we talking about if not OSI?
Let's talk about the [Internet Protocol suite](https://en.wikipedia.org/wiki/Internet_protocol_suite) or *TCP/IP*.

You've heard that one before, haven't you?\
*Editor's note: imagine the boykisser meme here*

### OSI vs. TCP/IP

I have stopped talking about Layer 2 and 3 and 4 a few years ago when I was writing a draft document for a customer.
It's not that they aren't descriptive enough – they aren't, but Link-Layer isn't that much better – it's simply that we're using like seven out of the nine layers and only seven out of the nine are in OSI, and they're not the ones we use.
In case you forgot here are the layers:

1. physical
1. data-link
1. network
1. transport
1. session (not in practical use)
1. presentation (not in practical use)
1. application
1. ~~financial~~ (not in OSI)
1. ~~political~~ (not in OSI)

Those last two are important; but nobody really knows why they aren't standardized, it would make explanations so much easier.
Jokes aside, those last two are always present and you'll never *really* be able to shake them, however when we're talking about tech and specifications and networking we can ignore them for the time.

So let's talk about what is included in TCP/IP and how it differs from OSI:

- link
- internet
- transport
- application

By switching model we got rid of those pesky session and presentation layers that some people argue fit HTTP and HTML pretty well, but at the end of the day we know that every application sets some funny HTTP headers that are required for functionality so it's all just one big application layer soup.
We also got rid of physical.
Now that's bound to annoy a bunch of people.
Those cable muncher gremlins and the WiFi reply guys are going to get me, aren't they?
Well, let me state my case first before they strangle me with their WiFi cables.

### Why Physical Doesn't Matter

If you remember the [Networking Introduction](./index.md) you will hopefully recall the bridge device I setup all those years back.
Now if we look at how a container is connected to such a bridge then we'll see a *veth* pair; a virtual Ethernet pair.
One side connects to the bridge, the other sits in the container.

TODO: finish this
