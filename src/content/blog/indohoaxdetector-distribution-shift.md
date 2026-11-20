---
title: "Indonesian hoax detection: 99.7% accuracy on our corpus, chance on someone else's"
description: "IndoBERT reached 99.71% accuracy on a 62,934-text Indonesian hoax corpus, then scored 45% on a 600-article external benchmark, below the 62% you get by always guessing the majority class."
date: 2026-11-20
---

IndoHoaxDetector compares four classical text classifiers with IndoBERT on one job: telling Indonesian hoax texts apart from factual news. It started as a project for my Data Science and Algorithms course and became a paper, *IndoHoaxDetector: A Comparative Evaluation of Classical Machine Learning and IndoBERT for Indonesian Mixed Corpus Hoax Detection*, presented at ICDEES 2026. The interesting number in it is not the 99.71% accuracy. It is what happened when we gave the same models Indonesian news from a dataset they had never seen.

## The problem

Indonesian hoax datasets are usually built by joining several news publishers and fact-checking organisations. Each one has its own style, templates, topics and class balance. A model can therefore score well by learning *who wrote a text* instead of *whether its claim is false*. Our question was simple: when accuracy is near perfect on a random split, how much of it is hoax detection and how much is source recognition?

## The data

After cleaning, the corpus has 62,934 documents: 33,597 factual (53.4%) and 29,337 hoax-labelled (46.6%), from nine source files in four public datasets. The factual side is CNN Indonesia, Detik.com, Kompas.com and Tempo.co. The hoax side is TurnBackHoax, the fact-checking service run by MAFINDO, and the Komdigi government hoax registry. Each source file holds only one class, so for a model, "where this text came from" and "what its label is" are almost the same question. Hoax texts are also much shorter: a median of 33 processed tokens against 131.

The first version of this study reported 99.40% accuracy for IndoBERT and 98.30% for SVM. A reviewer called those numbers suspiciously high, and was right. 99.3% of the hoax documents began with the fact-checker's verdict tag, such as `[SALAH]` or `[HOAKS]`, against 0.06% of the factual ones. A one-line rule that reads only that tag, with no training, scored 99.64% weighted F1, higher than our submitted IndoBERT. The clue was already in our own feature-importance chart: the strongest hoax term was "referensi", with "link counter" third; both are template fields of TurnBackHoax and Komdigi records.

So the corpus is now sanitised before any modelling: verdict tags, fact-check template sections, verdict and explanation sentences, and URLs are removed, and documents left with fewer than three tokens are dropped. That cuts 45.7% of an average hoax document and 2.2% of a factual one. Every result below was recomputed on the sanitised text.

## The pipeline

![Pipeline in five steps: 62,934 texts from nine single-class sources, sanitised and split 80:20, classical TF-IDF models and IndoBERT, in-distribution accuracy from 93.04% to 99.71%, then 45 to 46% on a 600-article external benchmark against a 62% majority baseline](/blog/indohoaxdetector-distribution-shift/pipeline.svg)

A stratified 80:20 split gives 50,347 training and 12,587 test documents. Then the pipeline forks. For the classical models, text is lowercased, URLs and non-alphabetic characters are removed, Indonesian stopwords are filtered, and words are stemmed with Sastrawi before TF-IDF extraction with one- to three-word n-grams. IndoBERT gets the sanitised text with no stopword removal and no stemming, so its tokenizer sees natural Indonesian. In a controlled comparison, stemming lowered IndoBERT's weighted F1 from 99.61% to 99.06%.

## The models

The classical models are Logistic Regression, a linear SVM, Random Forest (200 trees) and Naive Bayes. They were tuned by stratified five-fold cross-validation on the training split, with up to 10,000 TF-IDF terms. IndoBERT is the `indobenchmark/indobert-base-p1` checkpoint, fine-tuned with 128 tokens, batch size 16 and three epochs, and run with three random seeds. Every model is scored on the same held-out test set, and pairs are compared with McNemar's test and Holm correction. Training times and the seed-42 run come from a laptop with an RTX 3050 Ti Laptop GPU; the other IndoBERT runs used a separate GPU machine.

## In-distribution results

On the random split, every model looks strong:

| Model | Accuracy | Training time | Size on disk |
|---|---|---|---|
| IndoBERT (3 seeds) | 99.71% ± 0.05 | 2,190 s | 498.7 MB |
| Logistic Regression | 97.62% | 22.1 s | 0.48 MB |
| SVM | 97.62% | 23.5 s | 0.48 MB |
| Random Forest | 96.50% | 30.1 s | 156.3 MB |
| Naive Bayes | 93.04% | 10.0 s | 0.71 MB |

IndoBERT's seed-42 run makes 32 errors on 12,587 test documents; Logistic Regression and SVM make about 300 each. Logistic Regression and SVM are statistically tied (adjusted p = 1.000), so we withdrew the first version's claim that SVM is the best classical model. IndoBERT's lead has a price: compared with SVM it trains about 93 times longer, is about 1,000 times larger, and is about 650 times slower per document on a CPU.

## Where it breaks

First, the checks that did not change much. Only 0.83% of test documents have a training neighbour with cosine similarity of 0.90 or more, and removing every test document above 0.80 changes macro-F1 by less than 0.1 point. Holding out whole topic clusters costs SVM about 1.0 point and IndoBERT 0.1.

Publishers are a different story. Trained on CNN Indonesia, Kompas and TurnBackHoax and tested on Detik, Tempo and Komdigi, SVM's weighted F1 drops from 97.6% to 88.4%, and IndoBERT's from 99.71% to 86.03 ± 2.96%. Withholding any single source from training lowers recall on that source, most of all for Tempo.

The strongest test was an external benchmark: the 600 Indonesian news articles of Pratiwi et al. (2017), 38% hoax, labelled by a majority vote of three human annotators. We applied the trained models without retraining. Logistic Regression scored 46.17%, SVM 45.33%, and IndoBERT 45.00% averaged over three seeds. Always guessing "not a hoax" would score 62%. ROC-AUC was about 0.50 for all three, which means the models rank hoaxes no better than a coin.

The benchmark itself is not the problem. An SVM trained and cross-validated on those same 600 articles reaches 0.83 ROC-AUC, and only 3 of them have a near-duplicate in our corpus. The failure is distribution shift: our models learned the publishers in our corpus. One detail shows it well. Some hoax-labelled documents carry the fact-checker's own "BENAR" (true) verdict, and the SVM still predicts "hoax" for 89% of them in the test set. It follows the publisher, not the verdict.

## What this means

- On a multi-source corpus where each source holds one class, random-split scores describe that corpus. They are not evidence of hoax detection that works on other sources.
- IndoBERT's in-distribution lead is real and statistically significant, but it disappears on unseen publishers, where its spread across seeds (84.3% to 89.4% weighted F1) is larger than its gap to SVM.
- Where retraining is frequent and there is no GPU, a linear TF-IDF model is still a reasonable choice.
- Better benchmarks need source-balanced data and tests across datasets and over time. We did not try domain adaptation; that is the obvious next experiment.

## Credits

This is joint work with Seline Loewel (Business Engineering) and Enrico Ethan (Automotive and Robotics Engineering), supervised by Benedictus Rahardjo, all at BINUS ASO School of Engineering, Bina Nusantara University. I am the paper's first author. Per the paper's author statement, I ran the experiments: data processing, model training, evaluation and the robustness analyses, with technical support from Enrico. Seline led the writing, and we both refined the manuscript. In the recorded talk, Seline presented the motivation and data, I presented the pipeline through the external benchmark (slides 6 to 14), and Enrico presented the error analysis and conclusions.

The course project before the paper was a group of five: Enrico Ethan, Bryan Wilberd Lo, Jancent, Samuel Justus Tan and me. That version aimed at X.com posts and ended with a Gradio demo on Hugging Face Spaces.

As the paper's acknowledgment says, Claude (Anthropic) helped during manuscript preparation and revision, with experiment reruns, figure preparation, grammar checking and manuscript refinement.

## Links

- [Live demo on Hugging Face Spaces](https://huggingface.co/spaces/theonegareth/IndoHoaxDetector) (an earlier SVM, trained before the leak fix)
- [Code and every result file](https://github.com/theonegareth/IndoHoaxDetector) (the `icdees2026/` folder)
- [Project summary](/projects/indohoaxdetector/)

