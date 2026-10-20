---
layout: post.njk
title: Rent the Generalist, Own the Specialist
date: 2026-10-07
description: Where local AI fits in a company. For narrow, high-volume tasks, a small model you fine-tune yourself can match a frontier API on the job and cost less over its working life. The math, and what I've learned training them.
permalink: /blog/posts/{{ title | slug }}/index.html
tags:
    - ai
    - fine-tuning
    - local ai
    - open models
    - llm
    - ai strategy
---

At work I spend most of my time with frontier models. At ServicePros I build Claude workflows for the team and use Amazon Bedrock for the complex processes, like contract verification, where you want the most capable model you can get and the cost of a call is tiny next to the cost of a mistake.

Outside work I do the opposite. I fine-tune small open models on rented GPUs, build datasets, and publish all of it on [Hugging Face](https://huggingface.co/aimeri). The names are a little silly. The work is earnest.

Doing both has left me with a settled opinion about where local AI fits in a company: **rent the generalist, own the specialist.** Frontier models are the best general-purpose reasoners money can buy, and for open-ended work you should buy them. But for narrow, repetitive tasks, a small model you trained yourself can do the job as well or better. Training is a one-time cost spread across the model's whole working life, while API tokens are a cost you pay on every request forever. Past a certain volume, owning wins.

Here's the case, with the math, and with the caveats I learned the hard way.

## What "narrow" means

A task is narrow when:

- the input and output have a stable shape (a request comes in, a structured record goes out),
- "good" can be written down and checked,
- it runs a lot, and it will keep running for months.

Classification, routing, extraction, reformatting, drafting in a fixed template, tagging, cleaning up messy records. Most companies have dozens of these. Today they're either done by people, or done by sending a frontier model a long prompt full of instructions and examples, thousands of times a day.

For that second group, the frontier model is overqualified. You're paying for a model that can reason through tax law on every call that only needs to pick one of twelve categories.

## A small model can be better, not just cheaper

The cost argument only works if quality holds. What surprised me is how often it does more than hold.

The best-known evidence is Predibase's [LoRA Land report](https://arxiv.org/abs/2405.00732) from 2024. They fine-tuned 310 models (10 base models across 31 tasks) with small 4-bit LoRA adapters, and the fine-tuned models beat GPT-4 by 10 points on average on those tasks. Frontier models have improved a lot since, so I wouldn't count on that exact margin today. But the reason behind it hasn't changed: a model trained on thousands of examples of your exact task has seen more of that task than any prompt can show it.

My own projects show three ways this plays out.

**Format and register.** [Cardmaker](https://huggingface.co/aimeri/spoomplesmaxx-cardmaker-v2) turns a one-line idea into a complete character card for SillyTavern, a fixed multi-field format with rules about voice and point of view. I trained it from a *base* checkpoint rather than an instruct one on purpose, so the output is the card itself: no "Sure! Here's your character card…" preamble, no disclaimers, no sliding back into assistant voice halfway through. In my experience you can get a frontier model most of the way there with a long system prompt, but it still slips. With a fine-tune, the format is the model's whole world.

In a company the same idea applies to anything with a house format: the ticket schema, the report template, the tone your support team uses.

**Behaviors a prompt can't reach.** Some failures sit below the level instructions can fix. Models repeating themselves in long conversations is one. My [repremover-xl](https://huggingface.co/datasets/aimeri/repremover-xl) dataset cuts real conversations at the exact turn where a model started to loop and supplies a rewritten turn in its place, so training happens right at the decision point. Voice is another: [Olivia-Sys](https://huggingface.co/datasets/aimeri/Olivia-Sys) rewrites an entire chat dataset to drop the hedging, sycophantic assistant register. Prompting asks a model to stop doing these things. Training is how you make it stop.

**Knowledge the generalists don't have.** I've built corpora for [Ticuna](https://huggingface.co/datasets/aimeri/ticuna-spanish-portuguese), a tonal language isolate spoken around the Brazil–Colombia–Peru border, and for [Amazonian Kichwa](https://huggingface.co/datasets/aimeri/kichwa-spanish). Frontier models have seen very little of either, and for languages like these, training on a corpus is the only way to get real competence. The corporate version is less exotic but just as real: your internal codes, your product catalog, your abbreviations, the way your industry actually writes.

One caution: fine-tuning is good at teaching skills and formats, and bad at storing facts that change. Prices, inventory and policies belong in retrieval, not in the weights.

## The cost math

Now the part that matters to whoever signs the bills.

An API bill is variable. Every request costs money, the bill grows with usage, and it never stops. A model you own is mostly fixed: you pay once to build it and a flat rate to keep it running, and an extra request on hardware you're already paying for costs almost nothing. Fixed costs get spread over the model's working life. Per-token costs don't spread over anything.

To make it concrete, take a made-up but realistic workload: turning inbound service requests into structured tickets.

**Assumptions**

- 20,000 requests a day, about 600,000 a month.
- With a frontier API, each request carries a 1,500-token instruction prefix (rules plus a few examples) and 500 tokens of actual request, and returns 300 tokens. The prefix is cached, as it should be.
- The fine-tuned model doesn't need the instructions, because they're baked into its weights. Its prompt is just the 500-token request.
- API prices are Anthropic's [list prices](https://platform.claude.com/docs/en/about-claude/pricing) as of October 2026. Cloud marketplaces like Bedrock set their own prices.

**Renting**

| Model | Input / output per 1M tokens | Cost per request | Per month at 20,000/day |
|---|---|---|---|
| Claude Haiku 4.5 | $1 / $5 | $0.0022 | $1,290 |
| Claude Sonnet 5.5 | $2 / $10 | $0.0043 | $2,580 |
| Claude Opus 5.5 | $4 / $20 | $0.0083 | $4,980 |

**Owning**

- **Serving.** An 8B–14B model runs comfortably on a single 48 GB GPU with vLLM. Two L40S-class GPUs (one for redundancy) cost about $0.90 an hour each on GPU clouds, so roughly **$1,300 a month**.
- **Building.** The GPU time to train is the cheapest line on the bill. [Cardmaker v1](https://huggingface.co/aimeri/spoomplesmaxx-cardmaker-v1), a LoRA fine-tune of an 8B model, trained in about 4.6 hours. Even at H100 rental prices (around $2 an hour on marketplace clouds) that's about $10, and twenty experimental runs is a few hundred dollars. The real cost is people: building the dataset and the evaluation. Call it $10,000 all in, spread over an 18-month working life: about **$560 a month**.
- **Upkeep.** Retrain twice a year as your data drifts or better base models come out. At $2,000 a refresh, that's about **$330 a month**.

That's roughly **$2,200 a month**, and it barely moves with volume.

The break-even point is where those two lines cross:

```
break-even requests per day = (monthly fixed cost ÷ 30) ÷ API cost per request
```

| Compared with | Owning is cheaper above |
|---|---|
| Claude Haiku 4.5 | ~34,000 requests a day |
| Claude Sonnet 5.5 | ~17,000 requests a day |
| Claude Opus 5.5 | ~9,000 requests a day |

At 20,000 requests a day, owning beats Sonnet modestly, beats Opus clearly, and loses to Haiku. At 100,000 a day the API bills are five times larger ($6,450, $12,900 and $24,900 a month), while the owned model might need a third GPU.

Three things the table doesn't tell you:

1. **It only counts if quality holds.** The fair comparison is against the model you'd actually need to get acceptable results. If Haiku is good enough for the task, the bar for owning is high. If the task needs Opus-level results and a fine-tuned 8B model matches them on *this specific task*, owning wins at a few thousand requests a day. You find out which with an eval, not a spreadsheet.
2. **Batch pricing moves the line.** If nobody is waiting on the answer, Anthropic's Batch API halves the API prices, which doubles every break-even point.
3. **One GPU can host many specialists.** The LoRA Land team served 25 fine-tuned models from a single 80 GB A100, each a small adapter on one shared base model. Once you're paying for the GPU, the second, third and tenth narrow model ride along almost free, and the fixed cost per task keeps falling. That's where the amortization argument is strongest.

## How to do it without fooling yourself

Fine-tuning is easy to do badly, and it fails quietly. Here's what I've learned.

**Measure behavior, not loss.** Falling loss tells you the model is learning *something*. For Cardmaker, eval loss improved steadily, but the decision to ship came from a fixed battery of prompts testing what actually mattered: complete, parseable output; exact adherence to constraints; staying in register. For repetition I gate on a multi-turn test battery run at least six times, because a single run is noise. As the repremover-xl dataset card puts it: "Loss will look great either way."

**Keep your test set honest.** If near-duplicates of your training data leak into the test set, every number you get is optimistic. The Ticuna corpus splits by whole books of the Bible, so the same verse in two editions can never land on both sides. Do the equivalent with your data: split by customer, by month, or by document, never by row.

**Don't train on the narrow thing alone.** A small dataset aimed at one behavior can shift the model more broadly than you meant it to. When I train with repremover-xl, it makes up 25–35% of the mix, the rest is a replay of the main training data, the learning rate is several times lower than the original run, and it gets one short epoch.

**Use the frontier to build the specialist.** The two approaches work together. Olivia-Sys was made by running every response in the source dataset through a larger model with instructions to rewrite it. Frontier models are excellent at generating training data, labeling examples and judging outputs. Spend frontier tokens once to build the dataset, then stop paying them on every request.

**Pick the starting point deliberately.** A base model gives you the cleanest control over format, which is why Cardmaker starts from one. An instruct model keeps general chat skills you may want to keep. Check the license too: Apache 2.0 bases are simple, while others come with use restrictions your legal team will want to read.

**Make training cheap to interrupt.** I train on spot instances with checkpoints synced off the machine, so a preempted run picks up where it left off instead of starting over. Cardmaker v2, a full fine-tune of a 14B model, trained on a single 96 GB GPU using 8-bit optimizer states. You don't need a cluster for models this size.

**Ship it where it runs.** I publish quantized GGUF and MLX builds of my models. A quantized 14B model runs on a recent laptop with enough memory, which is the cheapest deployment there is, and the data never leaves the machine.

## Where it fits, and where it doesn't

Beyond cost, owning a model gives a company things an API can't:

- **Your data stays home.** Inputs never leave your infrastructure, which makes a lot of conversations with security and legal shorter.
- **Nothing changes under you.** The model behaves the same until you decide to change it. No surprise deprecations or behavior shifts in something your process depends on.
- **Predictable latency and cost.** Flat infrastructure, no rate limits, no per-token surprises at the end of the month.

It costs something too. Someone has to own the model, its eval, its serving stack and its on-call rotation. That's a real skill set, and a fine-tuned model nobody maintains is worse than an API.

Frontier models remain the right tool for:

- open-ended reasoning and judgment, like contract verification,
- agents and multi-step tool use,
- low-volume tasks, or tasks that change every month,
- anything where you can't yet write down what "good" looks like.

## A quick test

Before reaching for a fine-tune, I ask five questions:

1. Is the task narrow and stable, with the same shape of input and output for months?
2. Does it run thousands of times a day, or will it soon?
3. Can I write an eval the model must pass before it ships?
4. Do I have, or can I generate, a few thousand good examples?
5. Will someone own it after launch?

Five yeses: own the specialist. Any no: keep renting the generalist, and ask again when the answer changes.

The pattern I'd recommend is to start every new task on a frontier model, because that's the fastest way to learn what the task really is. The prompts and outputs from that phase become your training data. Once the volume is real and the shape has settled, a specialist takes over, and the frontier model moves on to the next problem that's still too new to be narrow.
