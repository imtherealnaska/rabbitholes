---
title: Understanding Pinning in rust.
description: digging in Box::Pin and std::pin .
publicationDate: 2025-02-08
image: ../../whitesheep.jpg
---

Start with the fundamental problem Pinning solves:

Why self-referential structs are tricky
How async/await created a need for pinning
Memory movement problems


Real-world examples:
How Tokio uses Pin
Common patterns in async code
Where developers often get stuck


Deep dive areas:
Pin<P> vs Pin<&mut T>
Unpin trait and when to use it
Safety guarantees
PhantomPinned marker


Common gotchas:
Why Box::pin exists
Stream implementations
Stack pinning vs heap pinning

The rest of the post is mostly notes from [Jon Gjengset's video](https://www.youtube.com/watch?v=DkMwYxfSYNQ) on Pinning and other things I looked into.

- When you place something in `Pin` you promise not to move it. It should have been named `nail` hahahah .
- As long as the type is `Unpin` nothing really matters.
- Something about `!Unpin`
- _Why is moving something that is guaranteed to stay in place by `Pin` unsafe ?_
    `Pin` is like a guarantee saying that the value under pin will not be moved from the memory location, and the code follows that will have taken
    this into account.
    But when there is a move , or a swap (as in the eg.) the value cannot be used after that.
- And also Poll is an enum , Ready(val) if the task is finished and Pending if it is still going on .
- Box makes sure the value is in a stable position and Pin makes sure it cant be moved , unless it's Unpin.
