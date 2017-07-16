# How to build a RegEx

I see people abusing regexes just about every day.
If you're really good at regexes then you will certainly feel some sort of pain
as soon as you see `.*` or similar constructs in inappropriate places.

So here is my guide to doing it the right way.

## Notes

I'm going to use PCRE all over the place.
My preferred syntax is `m{something}` and `s{a}{b}g` so I'll stick with those.

You can try all examples using:

```bash
# for searches, just start typing, quit using ^D
perl -ne 'm{a(.)c} && print "$1\n"'
# for replacements
perl -pe 's{a.c}{abc}g'
```

## Why not use `.*`?

You're looking for a needle in a haystack.
A practical example: you look for your favourite plushie in your room.

A nice regex for that would be `m{\bplushie\b}`.
It looks for your plushie as one word, meaning that it will match only if on
each side the word ends.
See also [word
boundaries](http://www.regular-expressions.info/wordboundaries.html).

What I see people do, which is completely ridiculous, is
`m{^.*\bplushie\b.*$}`.

Let me explain:

* They match the beginning of the line even though they don't need it.
* They match the end of the line.
* They let their parser go through all of the characters, even though they
  already found what they were looking for.

If you look for an occurrence somewhere, that does not need to be anywhere
specific then why are you looking at everything else?
You don't walk into your room and start looking from one side sequentially to
the other.
What you do is look in your room, see the plushie sitting on the bed and take
it.

## Complex Examples

Let's choose *fail2ban* as an example.
We want to block every IP sending more than 1000 HTTP requests per five
seconds.
I'll ignore how to configure *fail2ban* as it's not relevant to the regex
thing.

First try, without even looking at the format of the logs: `m{^.*<HOST>.*$}`

You probably messed up very hard here.
To explain why you've messed up so hard, let's look at one line of logs:

```text
10.0.0.1 - - [16/Jul/2017:15:38:54 +0200] "GET /robots.txt HTTP/1.0" 404 319 "-" "Mozilla/5.0 (compatible; AhrefsBot/5.2; +http://ahrefs.com/robot/)" "-"
```

I took that line out of my server, the *10.0.0.1* is the part that we want
(please ignore that it's an internal IP).

`m{.*}` does greedy matching, so the above regex will be very easy to break.
Just put an IP in the User Agent.
The User Agent contains spaces as you might have noticed, which is fine as the
string is quoted (and *nginx* does some escaping on the contained string).
Now what'll happen if I put an IP address in the User Agent?
Right, due to greedy matching the rightmost `<HOST>` will match.
This will of course result in some serious problems.

As a malicious hacker I could:

* Circumvent *fail2ban* altogether by putting `127.0.0.1` into my User Agent.
  That will effectively turn off *fail2ban* for my requests as long as
  `127.0.0.1` is whitelisted. If that IP is not whitelisted, you've got
  problems a lot worse (assuming *fail2ban* uses *iptables*, this will break at
  least half of your server's software, think of accessing *MySQL* on
  *localhost*).
* Block arbitrary IPs from accessing your website in much the same way.

So how are we going to construct a Regex that will match **only** what we're
looking for here?

Well, the IP is right at the start, so we'll take `m{^<HOST>.*$}` right?

Wrong.
That regex would again match everything after the IP, but *we really don't care
about that*.

What we should do is a simple `m{^<HOST>}`.
This works as intended and it does only look at the first few characters.
If you want to make sure that it's followed by a space, go ahead, please.

So we end up with a fool-proof regex: `m{^<HOST>\s}`.
This will for sure fulfill all our needs.

To be honest, this example is kind of easy as the IP is right at the start.
Let's assume some other format so we can work out a more general way for this
to work.

### Copy, Paste, Replace

We are going to perform CPR on a line of text.
As said above, this time we want to get something that is *not* right at the
start.
We'll look at the following line:

```text
[16/Jul/2017:16:27:41 +0200] openbsd.cloud.bsocat.net - - 66.133.109.36 "GET /.well-known/acme-challenge/tTRnUGY9gZEVz2llGWqn1m3mHznMDOFH3zCXsgelh7w HTTP/1.1" 200 87
```

This is a slightly modified OpenBSD httpd log-format.
By *slightly* I mean:

* date and time moved to the front
* host moved a bit backwards

Now let's do this:

```text
# copy the line, verbatim
[16/Jul/2017:16:27:41 +0200] openbsd.cloud.bsocat.net - - 66.133.109.36 "GET /.well-known/acme-challenge/tTRnUGY9gZEVz2llGWqn1m3mHznMDOFH3zCXsgelh7w HTTP/1.1" 200 87
# remove everything after the needle (except for the delimiter), we don't need it
[16/Jul/2017:16:27:41 +0200] openbsd.cloud.bsocat.net - - 66.133.109.36\s
# add needed meta-characters (start of line)
^[16/Jul/2017:16:27:41 +0200] openbsd.cloud.bsocat.net - - 66.133.109.36\s
# escape all the characters that need escaping
^\[16/Jul/2017:16:27:41 \+0200\] openbsd\.cloud\.bsocat\.net - - 66\.133\.109\.36\s
# replace the host
^\[16/Jul/2017:16:27:41 \+0200\] openbsd\.cloud\.bsocat\.net - - <HOST>\s
# replace everything that is not static by their possible values
# this requires a lot of in depth knowledge about the log format
# let's do this the easy way and just replace using dots for the date
^\[../.../....:..:..:.. .....\] openbsd\.cloud\.bsocat\.net - - <HOST>\s
# for the other fields we just specify them to "not contain spaces" as these
# are used for delimiting, so they will not occur in the fields
^\[../.../....:..:..:.. .....\] [^\s]+ [^\s]+ [^\s]+ <HOST>\s
# fail2ban needs spaces escaped I think
^\[../.../....:..:..:..\s.....\]\s[^\s]+\s[^\s]+\s[^\s]+\s<HOST>\s
```

### How do we check?

If it's *fail2ban*, just run that.
For everything else:

```bash
perl -ne 'm{^\[../.../....:..:..:..\s.....\]\s[^\s]+\s[^\s]+\s[^\s]+\s([^\s]+)\s} && print "$1\n"'
```

This should output only the IP we were looking for.

