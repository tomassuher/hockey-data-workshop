# Hockey data workshop

Coderslab workshop (Python – Data Analysis, 2024): role analytika u nové sázkové kanceláře.

Z veřejných výsledků hokejových týmů ([Scrape This Site](https://www.scrapethissite.com/pages/forms/)) se stáhnou data, vyčistí se a z nich se navrhnou první kurzy.

## Spustit z GitHubu

Na github.com se notebook jen **zobrazí**. Spustit ho jde jedním klikem:

| | Analýza | Kurzy |
|---|---|---|
| **Colab** (rychlejší) | [Otevřít 03](https://colab.research.google.com/github/tomassuher/hockey-data-workshop/blob/main/notebooks/03_DataAnalysis.ipynb) | [Otevřít 04](https://colab.research.google.com/github/tomassuher/hockey-data-workshop/blob/main/notebooks/04_BusinessRecommendations.ipynb) |
| **Binder** (celé repo) | [Otevřít 03](https://mybinder.org/v2/gh/tomassuher/hockey-data-workshop/main?labpath=notebooks%2F03_DataAnalysis.ipynb) | [Otevřít 04](https://mybinder.org/v2/gh/tomassuher/hockey-data-workshop/main?labpath=notebooks%2F04_BusinessRecommendations.ipynb) |

[![Open in Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/tomassuher/hockey-data-workshop/blob/main/notebooks/04_BusinessRecommendations.ipynb)
[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/tomassuher/hockey-data-workshop/main)

V Colabu: Runtime → Run all. Data si notebook stáhne z tohoto repa.

`01` (Selenium) na webu nespouštěj — potřebuje prohlížeč. Stačí `03` a `04`.

## Notebooks

| Notebook | Krok |
|---|---|
| `notebooks/00_Intro.ipynb` | Zadání a struktura projektu |
| `notebooks/01_DataDownload.ipynb` | Stažení HTML (Selenium) |
| `notebooks/02_DataProcessing.ipynb` | Parsování do tabulek (BeautifulSoup) |
| `notebooks/03_DataAnalysis.ipynb` | EDA (pandas, matplotlib) |
| `notebooks/04_BusinessRecommendations.ipynb` | Skupiny A–D a návrh kurzů |

Hotová data jsou v `data/processed/hockey_teams.csv`.
