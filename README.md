# Hockey data workshop

Coderslab workshop (Python – Data Analysis, 2024): role analytika u nové sázkové kanceláře.

Z veřejných výsledků hokejových týmů ([Scrape This Site](https://www.scrapethissite.com/pages/forms/)) se stáhnou data, vyčistí se a z nich se navrhnou první kurzy.

## Notebooks

| Notebook | Krok |
|---|---|
| `notebooks/00_Intro.ipynb` | Zadání a struktura projektu |
| `notebooks/01_DataDownload.ipynb` | Stažení HTML (Selenium) |
| `notebooks/02_DataProcessing.ipynb` | Parsování do tabulek (BeautifulSoup) |
| `notebooks/03_DataAnalysis.ipynb` | EDA (pandas, matplotlib) |
| `notebooks/04_BusinessRecommendations.ipynb` | Skupiny A–D a návrh kurzů |

Hotová data jsou v `data/processed/hockey_teams.csv`. Analýzu a doporučení jde otevřít bez nového scrapingu.

## Spuštění

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
jupyter notebook notebooks
```

`01_DataDownload` potřebuje prohlížeč a Selenium. Pro prohlížení výsledků stačí `03` a `04`.
