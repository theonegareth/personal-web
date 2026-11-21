---
title: "Did protest anger on Twitter move the IHSG and the rupiah? Our ICCSCI paper on the 17+8 protests"
description: "We labelled about 80,000 Indonesian tweets from the 17+8 protests with GPT-5 and found daily net sentiment correlated with same-day IHSG returns (r = +0.36, p = 0.027) but not significantly with USD/IDR."
date: 2026-11-21
---

In late August 2025 protests broke out at the DPR building in Jakarta and grew into the 17+8 movement, named after the list of public demands. Over the same weeks the IHSG, Indonesia's composite stock index, fell and then recovered. With five co-authors at BINUS ASO School of Engineering, led by first author Seline Loewel, I co-wrote a paper on one question: did the emotion people posted on Twitter move together with the stock market and the rupiah during that crisis? The ICCSCI slides name me as presenter.

The paper is titled "Public Emotion Analysis on Social Media and Short-horizon Stock Market and Rupiah Exchange Rate Movements: A Case Study of the 17+8 Protests". The slides shorten it slightly and drop the word "Analysis".

I presented it at ICCSCI 2026, the 11th International Conference on Computer Science and Computational Intelligence, held at BINUS @ Medan on 18–19 June 2026. I gave the talk online, in Parallel Session 2 (online Room 2) on Thursday 18 June, 15:30–17:30 WIB.

## The question

The protests were an outside political shock to the market. If public emotion moves markets, it should show up as co-movement in exactly this kind of window. So we asked: did Twitter sentiment co-move with the IHSG and with the USD/IDR exchange rate during the protests, and did that change before, during and after them?

## Data

We scraped tweets for 42 Indonesian keywords over the full window from 1 August to 30 September 2025, 61 calendar days. Nineteen keywords track the protest itself (for example *demo DPR*, *tolak tunjangan*, *affan Kurniawan*, *17+8 tuntutan rakyat*) and 23 track the market (*IHSG*, *anjlok*, *panic selling*, *kurs rupiah*, *Bank Indonesia*). The point of the mix was to catch both the political story and the financial reaction. The scrape came to 90 CSV files and, after deduplication and cleaning, about 80,000 tweets.

We split the window into three periods: Before Demo (1–24 August), Demo (25 August–8 September) and After Demo (9–30 September). On the market side we used daily closes of the IHSG and of USD/IDR. Without weekends and the 5 September Maulid Nabi holiday, the window holds 42 trading days. Of those, 39 also had sentiment data, and dropping the first day (which has no previous close to compute a return from) leaves 38 paired days.

Those 38 days are the sample on the slides I presented, and the method and figures below come from the slides. The paper's text works on 31 trading days. It reports the same IHSG correlation of about +0.36, but about −0.17 for USD/IDR where the slides show −0.25.

## Method

![Method pipeline: about 80,000 tweets from 42 keywords are labelled Anger, Fear or Other by GPT-5, aggregated into daily net sentiment, merged with daily IHSG and USD/IDR returns on 38 trading days, and tested with Pearson r, a Fisher z confidence interval and Spearman rho; IHSG r = +0.36 (p = 0.027), USD/IDR r = −0.25 (p = 0.133)](/blog/iccsci-2026-protest-emotions-markets/method.svg)

**Emotion labels.** Each tweet went to GPT-5 through an OpenRouter-compatible API with a fixed prompt asking for exactly one of three labels: Anger, Fear or Other. "Other" is the catch-all for neutral, factual, joking, supportive or unrelated tweets. We kept the taxonomy at three classes because Indonesian tweets often carry sarcasm and implicit emotion that a plain positive/negative split would get wrong. We benchmarked models on 440 labelled Indonesian tweets from a COVID-19 PPKM dataset: GPT-5's best run scored 87.05% on sentiment and 76.59% on emotion, the best of the five models we tried. That benchmark is on the slides only: the paper reports no benchmark or accuracy figures for the labeller.

**Daily net sentiment.** For each day we took the share of tweets labelled Other minus the share labelled Anger or Fear. The result sits between −1 and +1 and does not depend on how many tweets were posted that day. Over the 38 paired days it averaged −0.14 with a standard deviation of 0.23, so on a typical day anger and fear outweighed everything else. The paper defines its index differently, as a composite of the standardized daily anger and fear shares.

**Market returns and the test.** Returns are the daily percentage change in each closing price. We merged them with net sentiment on trading dates and computed the same-day Pearson correlation, a 95% confidence interval through the Fisher z transform, and Spearman's ρ as a rank-based check. Before trusting Pearson we checked the three series: three normality tests (Shapiro-Wilk, Jarque-Bera, D'Agostino-Pearson) did not reject normality for any of them, ADF and KPSS agreed all three were stationary, and an IQR plus z-score screen flagged only three outlier days.

## Findings

**The IHSG moved with sentiment.** Over the full period, daily net sentiment and same-day IHSG returns correlated at r = +0.36 (p = 0.027), with a 95% confidence interval of +0.04 to +0.61 that excludes zero. Spearman's ρ was +0.27, in the same direction. In plain terms, a one-standard-deviation rise in net sentiment (about +0.23) went with roughly a 0.30% higher IHSG return that day.

**It held after the protests.** Split by period, the IHSG correlation was +0.18 before the protests (n = 14, p = 0.53), +0.37 during them (n = 9, p = 0.329) and +0.53 after them (n = 15, p = 0.043). Only the After Demo window is significant on its own. The relationship did not spike and fade with the protests; it was strongest once they were over.

**The rupiah did not, at least not significantly.** For USD/IDR the full-period correlation was r = −0.25 (p = 0.133, 95% CI −0.53 to +0.08), with Spearman's ρ = −0.34. The sign points the expected way, since a rising USD/IDR means a weaker rupiah, and it is negative in all three windows, but none of them reaches significance. Exchange rates answer to interest rates, trade flows and the global dollar; public emotion is at most one weak signal among them.

**The outliers are real days and do not drive the IHSG result.** The three flagged days were 29 August (net sentiment −0.663, the day the IHSG plunged at peak protest intensity), a 2.44% IHSG rally on 12 August and a −0.86% USD/IDR move on 14 August. Dropping all three moves the IHSG correlation from 0.359 (p = 0.027) to 0.371 (p = 0.024).

## Limits

- **One event, one country.** It needs replicating on other protests and other emerging markets.
- **Correlation, not cause.** A same-day correlation cannot show that sentiment drives returns. The paper's Granger causality tests found only a marginal IHSG signal at a two-day lag.
- **Small samples.** The Demo window has only nine trading days. Even the full period is modest: by our own power analysis, detecting r = 0.36 with 80% power needs about 57 days, and at 38 we had about 65% power.
- **Twitter is not the public.** Its users skew urban, educated and politically active.
- **The labeller was not validated on this corpus.** The benchmark (87.05% on sentiment, 76.59% on the emotion task we actually use) comes from COVID-19 policy tweets; we did not measure human agreement on the protest tweets themselves, and prompt wording and temperature can shift GPT-5's labels.
- **Anger and fear are merged.** Net sentiment folds both into one negative class, which suits a question about direction but loses nuance.

In the paper's Granger tests, on 31 trading days, net sentiment at a two-day lag gave F = 2.638 for IHSG returns, with p = 0.092: significant only at the 10% level. The one-day and three-day lags (p = 0.551 and 0.174) and every USD/IDR lag were not significant.

## Credits

Authors, in the order on the title slide: Seline Loewel, Gareth Aurelius Harrison, Alleina Felisa Widjaya, Belvareia Reva Utamandarya, Benedictus Rahardjo and Evaristus Didik Madyatmadja, all at BINUS ASO School of Engineering, BINUS University. The title slide names me as presenter.

The code is public at [theonegareth/twitter_sentiment_analysis](https://github.com/theonegareth/twitter_sentiment_analysis). I wrote the IHSG and USD/IDR data download, the tweet cleaning, the GPT-5 labelling pipeline, the correlation and Granger analysis, and the charts for the slides. Its Granger table is the one in the paper.

## Publication

The paper is presented, not yet published.

