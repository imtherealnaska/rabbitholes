---
title: Memory Alignment
description: From CPU bus transactions to Rust struct padding, a deep dive into alignment.
publicationDate: 2026-04-14
image: ../../whitesheep.jpg
tags: ["rust", "systems", "memory"]
---

<!-- Q2: What misconception or "aha moment" do you want the reader to leave with? What did you not know before you dug into this? -->

---

## Foundations

<!-- Q3: What is a word, and why does the CPU care where in memory a value starts? Can you explain this without using the word "alignment" first? -->

<!-- Q4: What does "natural alignment" mean, and how does it relate to a type's size? -->

<!-- Q5: How does a CPU physically read memory — what is a bus transaction, and what actually happens when the address doesn't match the alignment requirement? -->

---

## Platform Behavior

<!-- Q6: How does x86/x64 handle a misaligned read — what does "two internal micro-ops and a merge" actually look like? Is there a way to observe the cost? -->

<!-- Q7: How does ARM differ — when does it silently slow down vs. when does it trap? -->

<!-- Q8: Can you give a concrete example of code that works fine on x86 but crashes on ARM or MIPS? -->

---

## Cache Lines

<!-- Q9: What is a cache line and what is its typical size? How does it relate to — but differ from — the CPU word size? -->

<!-- Q10: Why does a value that is correctly aligned still suffer if it crosses a cache line boundary? -->

<!-- Q11: What is "false sharing" and how does alignment interact with it in multi-threaded code? -->

---

## Rust Specifics

<!-- Q12: What guarantee does Rust give you by default, and how do size_of and align_of let you inspect it? -->

<!-- Q13: What does padding look like in a real struct — can you show before/after with actual byte counts? -->

<!-- Q14: What does #[repr(C)] change versus #[repr(Rust)] versus #[repr(packed)]? What does each cost you? -->

<!-- Q15: Why does Rust refuse to let you take a reference to a field inside a #[repr(packed)] struct? -->

<!-- Q16: When would you actually reach for read_unaligned — what real use cases justify it? -->

---

## Performance and Design

<!-- Q17: How do you measure the cost of misalignment — what benchmarking approach would you use, and what numbers can you cite? -->

<!-- Q18: What is the "largest field first" rule for struct layout, and does it always win? -->

<!-- Q19: How does alignment interact with Vec<T> and heap allocations — does the allocator respect it? -->

<!-- Q20: Where does SIMD change the stakes — why do vectorized operations care about alignment more than scalar ones? -->

---

## Closing

<!-- Q21: What is the one mental model you want readers to carry away? -->

<!-- Q22: What should a reader do right now — is there a size_of audit they can run on their own codebase? -->
