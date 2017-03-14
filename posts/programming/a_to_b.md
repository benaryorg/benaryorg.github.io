# My Way of Programming

Herein I will describe *my programming style* as well as my experience with
Haskell, as an example for purely functional programming.

I sometimes call my style of programming *a-to-b programming*.
To make this whole thing more practical I will just add a few examples written
in Haskell.

# *a-to-b*

What do I mean by *a-to-b*?
Every single application I know is basically just performing data
transformation.
You have some data *a* of which you make some data *b*.

## Application

This does not hold true for IO, which includes:

- storage applications
	- databases (PostgreSQL)
	- caches (varnish)
	- key-value stores (memcached)
- one-way communication

It does however hold true for applications which you might not expect to be
designed that way:

- generic web applications: `([DataBaseRow],Request) -> ([DataBaseModification],Response)`
- command line applications: `([CliParameter],StdIn) -> (ExitCode,StdOut)`

# Functional Programming

So how does all of that relate to functional programming (and Haskell)?
Imagine a complete web application which is structured into smaller parts each
doing one single thing (adhering to the UNIX philosophy).
One of these modules could be something along the lines:

```haskell
-- called with a "map" from path to image and the request
-- returns the response to be sent
handleRequest :: [(Path,Image)] -> Request -> Response
handleRequest images request =
	makeResponse
		(
			resizeImage 
				(getDimension request) 
				(lookup (getPath request) images)
		)

-- creates a response from an image (add headers and so on)
makeResponse :: Image -> Response
-- resize the image somehow
resizeImage :: Dimension -> Image -> Image
-- get the requested dimension from the request
getDimension :: Request -> Dimension
```

Dear Haskellers, please excuse me for leaving out the `Maybe` part of the
`lookup` function.
It's for readability.

Dear Non-Haskellers, believe me if I tell you that Haskell's type system kind
of pushes you into the right direction.

# Benefits

These benefits are applicable to both Functional Programming and the *a-to-b*
model:

## State

No state-keeping within your logic.
Have a look at the `handleRequest` function above.
It does not keep state at all.
If anything was to keep state it might just get one state as an argument and
return the new state.
The state-keeping would then be abstracted from your application.
If talking about web applications this could be your session, stored in
*memcached* transparently.
Combined with Haskell's laziness you'd probably end up not even requesting
unneeded state.

## Parallelisable

There will be no race conditions in this code.
You will be able to quickly scale out with more threads or even more hosts if
needed.
You get all this "for free".

## Reproducible

Oh noes, you found a bug.
Good luck reproducing this without full step-by-step instructions.
With functional programming you simply need to log your state and request as
soon as an error occurs and you have everything you need to reproduce it.
Debugging will be ridiculously easy.

## Side-Effect Free

If you have a high unit-test coverage then you have actually tested everything
that could go wrong because there are no side-effects in pure functions.

## Maintenance

You can easily replace a function that does not perform as it should and, once
it works, it probably keeps on working forever.

## Profiling

If you profile your application you see how long each function takes and how
often it's called.
This makes it easy to find a bad performing function and simply rewrite it, if
possible, or reduce it's usage or the way it's used.

## Shipping Features

Adding a feature is as easy as adding the new functions and putting a call to
them somewhere.
You cannot break any of the existing parts of the program if you do not touch
them due to the complete lack of side-effects.

