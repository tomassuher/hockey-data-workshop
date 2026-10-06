# Beach 3D Viz

Interaktivní stylizovaná 3D vizualizace postavy podle referenčních fotek z pláže.

## Spuštění

```bash
cd visualization
python3 -m http.server 8765
```

Otevři [http://localhost:8765](http://localhost:8765).

## Ovládání

- **Tažení myší** — otáčení kamery
- **Kolečko** — zoom
- **Stoj / Výhled / Sed** — pózy podle fotek
- **Auto-otáčení** — pomalá rotace
- Miniatury vpravo (pokud jsou lokálně `refs/`) přepínají úhel kamery

## Poznámka

Toto **není** fotogrammetrický sken tváře. Jde o stylizovaný 3D model inspirovaný proporcemi, barvami a pózy z fotek. Osobní fotky patří do `refs/` a jsou v `.gitignore`.
