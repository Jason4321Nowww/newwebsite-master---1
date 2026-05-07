// Official Swiss Federal Statistical Office (BFS) Gemeindeverzeichnis 2024
// Structure: { kantonCode, kantonName, bezirk, gemeinde }
// Cantons without formal Bezirke use the canton name as bezirk.

const swissLocations = [

  // ── ZH · Zürich ─────────────────────────────────────────────────────────
  ...[
    ['Bezirk Affoltern','Aeugst am Albis'],['Bezirk Affoltern','Affoltern am Albis'],
    ['Bezirk Affoltern','Bonstetten'],['Bezirk Affoltern','Hausen am Albis'],
    ['Bezirk Affoltern','Hedingen'],['Bezirk Affoltern','Knonau'],
    ['Bezirk Affoltern','Maschwanden'],['Bezirk Affoltern','Mettmenstetten'],
    ['Bezirk Affoltern','Obfelden'],['Bezirk Affoltern','Ottenbach'],
    ['Bezirk Affoltern','Rifferswil'],['Bezirk Affoltern','Stallikon'],

    ['Bezirk Andelfingen','Adlikon'],['Bezirk Andelfingen','Andelfingen'],
    ['Bezirk Andelfingen','Benken'],['Bezirk Andelfingen','Berg am Irchel'],
    ['Bezirk Andelfingen','Dachsen'],['Bezirk Andelfingen','Dägerlen'],
    ['Bezirk Andelfingen','Dorf'],['Bezirk Andelfingen','Feuerthalen'],
    ['Bezirk Andelfingen','Flurlingen'],['Bezirk Andelfingen','Henggart'],
    ['Bezirk Andelfingen','Humlikon'],['Bezirk Andelfingen','Kleinandelfingen'],
    ['Bezirk Andelfingen','Laufen-Uhwiesen'],['Bezirk Andelfingen','Marthalen'],
    ['Bezirk Andelfingen','Neftenbach'],['Bezirk Andelfingen','Ossingen'],
    ['Bezirk Andelfingen','Rheinau'],['Bezirk Andelfingen','Thalheim an der Thur'],
    ['Bezirk Andelfingen','Trüllikon'],['Bezirk Andelfingen','Truttikon'],
    ['Bezirk Andelfingen','Volken'],['Bezirk Andelfingen','Waltalingen'],
    ['Bezirk Andelfingen','Weiach'],

    ['Bezirk Bülach','Bachenbülach'],['Bezirk Bülach','Bassersdorf'],
    ['Bezirk Bülach','Bülach'],['Bezirk Bülach','Dietlikon'],
    ['Bezirk Bülach','Eglisau'],['Bezirk Bülach','Embrach'],
    ['Bezirk Bülach','Freienstein-Teufen'],['Bezirk Bülach','Glattfelden'],
    ['Bezirk Bülach','Hochfelden'],['Bezirk Bülach','Höri'],
    ['Bezirk Bülach','Hüntwangen'],['Bezirk Bülach','Kloten'],
    ['Bezirk Bülach','Lufingen'],['Bezirk Bülach','Nürensdorf'],
    ['Bezirk Bülach','Oberembrach'],['Bezirk Bülach','Opfikon'],
    ['Bezirk Bülach','Rafz'],['Bezirk Bülach','Rorbas'],
    ['Bezirk Bülach','Wallisellen'],['Bezirk Bülach','Wasterkingen'],
    ['Bezirk Bülach','Wil (ZH)'],['Bezirk Bülach','Winkel'],

    ['Bezirk Dielsdorf','Bachs'],['Bezirk Dielsdorf','Boppelsen'],
    ['Bezirk Dielsdorf','Dänikon'],['Bezirk Dielsdorf','Dielsdorf'],
    ['Bezirk Dielsdorf','Hüttikon'],['Bezirk Dielsdorf','Neerach'],
    ['Bezirk Dielsdorf','Niederweningen'],['Bezirk Dielsdorf','Oberweningen'],
    ['Bezirk Dielsdorf','Otelfingen'],['Bezirk Dielsdorf','Regensberg'],
    ['Bezirk Dielsdorf','Regensdorf'],['Bezirk Dielsdorf','Rümlang'],
    ['Bezirk Dielsdorf','Schleinikon'],['Bezirk Dielsdorf','Schöfflisdorf'],
    ['Bezirk Dielsdorf','Stadel'],['Bezirk Dielsdorf','Steinmaur'],

    ['Bezirk Hinwil','Bäretswil'],['Bezirk Hinwil','Bubikon'],
    ['Bezirk Hinwil','Dürnten'],['Bezirk Hinwil','Fischenthal'],
    ['Bezirk Hinwil','Gossau (ZH)'],['Bezirk Hinwil','Grüningen'],
    ['Bezirk Hinwil','Hinwil'],['Bezirk Hinwil','Rüti (ZH)'],
    ['Bezirk Hinwil','Wald (ZH)'],['Bezirk Hinwil','Wetzikon'],

    ['Bezirk Horgen','Adliswil'],['Bezirk Horgen','Hirzel'],
    ['Bezirk Horgen','Horgen'],['Bezirk Horgen','Hütten'],
    ['Bezirk Horgen','Kilchberg'],['Bezirk Horgen','Langnau am Albis'],
    ['Bezirk Horgen','Oberrieden'],['Bezirk Horgen','Richterswil'],
    ['Bezirk Horgen','Rüschlikon'],['Bezirk Horgen','Schönenberg (ZH)'],
    ['Bezirk Horgen','Thalwil'],['Bezirk Horgen','Wädenswil'],

    ['Bezirk Meilen','Egg'],['Bezirk Meilen','Erlenbach (ZH)'],
    ['Bezirk Meilen','Herrliberg'],['Bezirk Meilen','Hombrechtikon'],
    ['Bezirk Meilen','Küsnacht (ZH)'],['Bezirk Meilen','Männedorf'],
    ['Bezirk Meilen','Meilen'],['Bezirk Meilen','Oetwil am See'],
    ['Bezirk Meilen','Stäfa'],['Bezirk Meilen','Uetikon am See'],
    ['Bezirk Meilen','Zollikon'],['Bezirk Meilen','Zumikon'],

    ['Bezirk Pfäffikon','Bauma'],['Bezirk Pfäffikon','Hittnau'],
    ['Bezirk Pfäffikon','Illnau-Effretikon'],['Bezirk Pfäffikon','Lindau'],
    ['Bezirk Pfäffikon','Pfäffikon'],['Bezirk Pfäffikon','Russikon'],
    ['Bezirk Pfäffikon','Weisslingen'],['Bezirk Pfäffikon','Wila'],
    ['Bezirk Pfäffikon','Wildberg'],

    ['Bezirk Uster','Dübendorf'],['Bezirk Uster','Fehraltorf'],
    ['Bezirk Uster','Greifensee'],['Bezirk Uster','Maur'],
    ['Bezirk Uster','Mönchaltorf'],['Bezirk Uster','Uster'],
    ['Bezirk Uster','Volketswil'],['Bezirk Uster','Wangen-Brüttisellen'],

    ['Bezirk Winterthur','Brütten'],['Bezirk Winterthur','Dinhard'],
    ['Bezirk Winterthur','Elsau'],['Bezirk Winterthur','Hagenbuch'],
    ['Bezirk Winterthur','Hettlingen'],['Bezirk Winterthur','Hofstetten (ZH)'],
    ['Bezirk Winterthur','Neftenbach'],['Bezirk Winterthur','Rickenbach (ZH)'],
    ['Bezirk Winterthur','Seuzach'],['Bezirk Winterthur','Turbenthal'],
    ['Bezirk Winterthur','Weisslingen'],['Bezirk Winterthur','Wiesendangen'],
    ['Bezirk Winterthur','Winterthur'],['Bezirk Winterthur','Zell (ZH)'],

    ['Bezirk Zürich','Zürich'],
  ].map(([bezirk, gemeinde]) => ({ kantonCode: 'ZH', kantonName: 'Zürich', bezirk, gemeinde })),

  // ── BE · Bern ────────────────────────────────────────────────────────────
  ...[
    ['Verwaltungskreis Bern-Mittelland','Bern'],['Verwaltungskreis Bern-Mittelland','Köniz'],
    ['Verwaltungskreis Bern-Mittelland','Muri bei Bern'],['Verwaltungskreis Bern-Mittelland','Ostermundigen'],
    ['Verwaltungskreis Bern-Mittelland','Ittigen'],['Verwaltungskreis Bern-Mittelland','Bolligen'],
    ['Verwaltungskreis Bern-Mittelland','Worb'],['Verwaltungskreis Bern-Mittelland','Münsingen'],
    ['Verwaltungskreis Bern-Mittelland','Kirchlindach'],['Verwaltungskreis Bern-Mittelland','Bremgarten bei Bern'],
    ['Verwaltungskreis Bern-Mittelland','Frauenkappelen'],['Verwaltungskreis Bern-Mittelland','Kehrsatz'],
    ['Verwaltungskreis Bern-Mittelland','Belp'],['Verwaltungskreis Bern-Mittelland','Toffen'],
    ['Verwaltungskreis Bern-Mittelland','Rubigen'],['Verwaltungskreis Bern-Mittelland','Vechigen'],
    ['Verwaltungskreis Bern-Mittelland','Stettlen'],['Verwaltungskreis Bern-Mittelland','Arni (BE)'],
    ['Verwaltungskreis Bern-Mittelland','Bowil'],['Verwaltungskreis Bern-Mittelland','Konolfingen'],
    ['Verwaltungskreis Bern-Mittelland','Langnau im Emmental'],['Verwaltungskreis Bern-Mittelland','Heimberg'],
    ['Verwaltungskreis Bern-Mittelland','Steffisburg'],['Verwaltungskreis Bern-Mittelland','Thun'],
    ['Verwaltungskreis Bern-Mittelland','Spiez'],['Verwaltungskreis Bern-Mittelland','Uetendorf'],

    ['Verwaltungskreis Biel/Bienne','Biel/Bienne'],['Verwaltungskreis Biel/Bienne','Nidau'],
    ['Verwaltungskreis Biel/Bienne','Brügg'],['Verwaltungskreis Biel/Bienne','Port'],
    ['Verwaltungskreis Biel/Bienne','Aegerten'],['Verwaltungskreis Biel/Bienne','Bellmund'],
    ['Verwaltungskreis Biel/Bienne','Ipsach'],['Verwaltungskreis Biel/Bienne','Meinisberg'],
    ['Verwaltungskreis Biel/Bienne','Mörigen'],['Verwaltungskreis Biel/Bienne','Orpund'],
    ['Verwaltungskreis Biel/Bienne','Pieterlen'],['Verwaltungskreis Biel/Bienne','Safnern'],
    ['Verwaltungskreis Biel/Bienne','Studen (BE)'],['Verwaltungskreis Biel/Bienne','Twann-Tüscherz'],
    ['Verwaltungskreis Biel/Bienne','Vinelz'],

    ['Verwaltungskreis Emmental','Burgdorf'],['Verwaltungskreis Emmental','Hasle bei Burgdorf'],
    ['Verwaltungskreis Emmental','Kirchberg (BE)'],['Verwaltungskreis Emmental','Lyssach'],
    ['Verwaltungskreis Emmental','Oberburg'],['Verwaltungskreis Emmental','Hindelbank'],
    ['Verwaltungskreis Emmental','Aarwangen'],['Verwaltungskreis Emmental','Herzogenbuchsee'],
    ['Verwaltungskreis Emmental','Roggwil (BE)'],['Verwaltungskreis Emmental','Wynau'],

    ['Verwaltungskreis Frutigen-Niedersimmental','Frutigen'],['Verwaltungskreis Frutigen-Niedersimmental','Reichenbach im Kandertal'],
    ['Verwaltungskreis Frutigen-Niedersimmental','Kandersteg'],['Verwaltungskreis Frutigen-Niedersimmental','Adelboden'],
    ['Verwaltungskreis Frutigen-Niedersimmental','Zweisimmen'],['Verwaltungskreis Frutigen-Niedersimmental','Lenk'],
    ['Verwaltungskreis Frutigen-Niedersimmental','St. Stephan'],['Verwaltungskreis Frutigen-Niedersimmental','Saanen'],

    ['Verwaltungskreis Interlaken-Oberhasli','Interlaken'],['Verwaltungskreis Interlaken-Oberhasli','Grindelwald'],
    ['Verwaltungskreis Interlaken-Oberhasli','Lauterbrunnen'],['Verwaltungskreis Interlaken-Oberhasli','Meiringen'],
    ['Verwaltungskreis Interlaken-Oberhasli','Innertkirchen'],['Verwaltungskreis Interlaken-Oberhasli','Guttannen'],
    ['Verwaltungskreis Interlaken-Oberhasli','Brienz (BE)'],['Verwaltungskreis Interlaken-Oberhasli','Iseltwald'],
    ['Verwaltungskreis Interlaken-Oberhasli','Beatenberg'],['Verwaltungskreis Interlaken-Oberhasli','Därligen'],

    ['Verwaltungskreis Jura bernois','Courtelary'],['Verwaltungskreis Jura bernois','Moutier'],
    ['Verwaltungskreis Jura bernois','Saint-Imier'],['Verwaltungskreis Jura bernois','Tramelan'],
    ['Verwaltungskreis Jura bernois','Tavannes'],['Verwaltungskreis Jura bernois','Reconvilier'],
    ['Verwaltungskreis Jura bernois','Biel/Bienne (Jura)'],['Verwaltungskreis Jura bernois','Péry-La Heutte'],

    ['Verwaltungskreis Oberaargau','Aarburg'],['Verwaltungskreis Oberaargau','Langenthal'],
    ['Verwaltungskreis Oberaargau','Wiedlisbach'],['Verwaltungskreis Oberaargau','Wangen an der Aare'],
    ['Verwaltungskreis Oberaargau','Huttwil'],['Verwaltungskreis Oberaargau','Lotzwil'],
    ['Verwaltungskreis Oberaargau','Madiswil'],['Verwaltungskreis Oberaargau','Ursenbach'],

    ['Verwaltungskreis Obersimmental-Saanen','Zweisimmen'],['Verwaltungskreis Obersimmental-Saanen','Saanen'],
    ['Verwaltungskreis Obersimmental-Saanen','Lenk'],['Verwaltungskreis Obersimmental-Saanen','St. Stephan'],

    ['Verwaltungskreis Seeland','Aarberg'],['Verwaltungskreis Seeland','Büren an der Aare'],
    ['Verwaltungskreis Seeland','Erlach'],['Verwaltungskreis Seeland','Ins'],
    ['Verwaltungskreis Seeland','Kerzers'],['Verwaltungskreis Seeland','Lyss'],
    ['Verwaltungskreis Seeland','Murten'],['Verwaltungskreis Seeland','La Neuveville'],

    ['Verwaltungskreis Thun','Thun'],['Verwaltungskreis Thun','Steffisburg'],
    ['Verwaltungskreis Thun','Heimberg'],['Verwaltungskreis Thun','Spiez'],
    ['Verwaltungskreis Thun','Uetendorf'],['Verwaltungskreis Thun','Gwatt'],
    ['Verwaltungskreis Thun','Hilterfingen'],['Verwaltungskreis Thun','Oberhofen am Thunersee'],
    ['Verwaltungskreis Thun','Sigriswil'],['Verwaltungskreis Thun','Thierachern'],
  ].map(([bezirk, gemeinde]) => ({ kantonCode: 'BE', kantonName: 'Bern', bezirk, gemeinde })),

  // ── LU · Luzern ─────────────────────────────────────────────────────────
  ...[
    ['Amt Entlebuch','Entlebuch'],['Amt Entlebuch','Escholzmatt-Marbach'],
    ['Amt Entlebuch','Flühli'],['Amt Entlebuch','Hasle (LU)'],
    ['Amt Entlebuch','Schüpfheim'],['Amt Entlebuch','Romoos'],

    ['Amt Hochdorf','Ballwil'],['Amt Hochdorf','Eschenbach (LU)'],
    ['Amt Hochdorf','Gelfingen'],['Amt Hochdorf','Hitzkirch'],
    ['Amt Hochdorf','Hochdorf'],['Amt Hochdorf','Hohenrain'],
    ['Amt Hochdorf','Inwil'],['Amt Hochdorf','Lieli'],
    ['Amt Hochdorf','Mosen'],['Amt Hochdorf','Müswangen'],
    ['Amt Hochdorf','Römerswil'],['Amt Hochdorf','Schongau'],

    ['Amt Luzern','Buchrain'],['Amt Luzern','Dierikon'],
    ['Amt Luzern','Ebikon'],['Amt Luzern','Emmen'],
    ['Amt Luzern','Horw'],['Amt Luzern','Kriens'],
    ['Amt Luzern','Littau'],['Amt Luzern','Luzern'],
    ['Amt Luzern','Meggen'],['Amt Luzern','Root'],

    ['Amt Sursee','Beromünster'],['Amt Sursee','Buttisholz'],
    ['Amt Sursee','Eich'],['Amt Sursee','Geuensee'],
    ['Amt Sursee','Grosswangen'],['Amt Sursee','Hildisrieden'],
    ['Amt Sursee','Knutwil'],['Amt Sursee','Neuenkirch'],
    ['Amt Sursee','Nottwil'],['Amt Sursee','Oberkirch (LU)'],
    ['Amt Sursee','Schenkon'],['Amt Sursee','Sempach'],
    ['Amt Sursee','Sursee'],['Amt Sursee','Triengen'],

    ['Amt Willisau','Altbüron'],['Amt Willisau','Altishofen'],
    ['Amt Willisau','Ebersecken'],['Amt Willisau','Egolzwil'],
    ['Amt Willisau','Ettiswil'],['Amt Willisau','Fischbach (LU)'],
    ['Amt Willisau','Gettnau'],['Amt Willisau','Hergiswil bei Willisau'],
    ['Amt Willisau','Langnau (LU)'],['Amt Willisau','Luthern'],
    ['Amt Willisau','Menznau'],['Amt Willisau','Ohmstal'],
    ['Amt Willisau','Rohrbach (LU)'],['Amt Willisau','Uffikon'],
    ['Amt Willisau','Willisau'],['Amt Willisau','Wikon'],
    ['Amt Willisau','Zell (LU)'],

    ['Amt Kriens','Adligenswil'],['Amt Kriens','Schwarzenberg (LU)'],
  ].map(([bezirk, gemeinde]) => ({ kantonCode: 'LU', kantonName: 'Luzern', bezirk, gemeinde })),

  // ── UR · Uri ─────────────────────────────────────────────────────────────
  ...[
    ['Bezirk Uri','Altdorf'],['Bezirk Uri','Bürglen (UR)'],
    ['Bezirk Uri','Erstfeld'],['Bezirk Uri','Flüelen'],
    ['Bezirk Uri','Schattdorf'],['Bezirk Uri','Seedorf (UR)'],
    ['Bezirk Uri','Attinghausen'],['Bezirk Uri','Silenen'],
    ['Bezirk Uri','Gurtnellen'],['Bezirk Uri','Wassen'],
    ['Bezirk Uri','Göschenen'],['Bezirk Uri','Andermatt'],
    ['Bezirk Uri','Hospental'],['Bezirk Uri','Realp'],
    ['Bezirk Uri','Isenthal'],['Bezirk Uri','Seelisberg'],
    ['Bezirk Uri','Bauen'],['Bezirk Uri','Sisikon'],
    ['Bezirk Uri','Spiringen'],['Bezirk Uri','Unterschächen'],
  ].map(([bezirk, gemeinde]) => ({ kantonCode: 'UR', kantonName: 'Uri', bezirk, gemeinde })),

  // ── SZ · Schwyz ──────────────────────────────────────────────────────────
  ...[
    ['Bezirk Schwyz','Schwyz'],['Bezirk Schwyz','Ingenbohl'],
    ['Bezirk Schwyz','Muotathal'],['Bezirk Schwyz','Riemenstalden'],
    ['Bezirk Schwyz','Steinen'],['Bezirk Schwyz','Sattel'],
    ['Bezirk Schwyz','Oberiberg'],['Bezirk Schwyz','Unteriberg'],
    ['Bezirk Schwyz','Alpthal'],

    ['Bezirk Einsiedeln','Einsiedeln'],

    ['Bezirk Gersau','Gersau'],

    ['Bezirk Höfe','Freienbach'],['Bezirk Höfe','Wollerau'],
    ['Bezirk Höfe','Feusisberg'],

    ['Bezirk Küssnacht','Küssnacht (SZ)'],

    ['Bezirk March','Altendorf'],['Bezirk March','Galgenen'],
    ['Bezirk March','Innerthal'],['Bezirk March','Lachen'],
    ['Bezirk March','Reichenburg'],['Bezirk March','Schübelbach'],
    ['Bezirk March','Tuggen'],['Bezirk March','Vorderthal'],
    ['Bezirk March','Wangen (SZ)'],
  ].map(([bezirk, gemeinde]) => ({ kantonCode: 'SZ', kantonName: 'Schwyz', bezirk, gemeinde })),

  // ── OW · Obwalden ────────────────────────────────────────────────────────
  ...[
    ['Kanton Obwalden','Alpnach'],['Kanton Obwalden','Engelberg'],
    ['Kanton Obwalden','Giswil'],['Kanton Obwalden','Kerns'],
    ['Kanton Obwalden','Lungern'],['Kanton Obwalden','Sachseln'],
    ['Kanton Obwalden','Sarnen'],
  ].map(([bezirk, gemeinde]) => ({ kantonCode: 'OW', kantonName: 'Obwalden', bezirk, gemeinde })),

  // ── NW · Nidwalden ───────────────────────────────────────────────────────
  ...[
    ['Kanton Nidwalden','Beckenried'],['Kanton Nidwalden','Buochs'],
    ['Kanton Nidwalden','Dallenwil'],['Kanton Nidwalden','Emmetten'],
    ['Kanton Nidwalden','Ennetbürgen'],['Kanton Nidwalden','Ennetmoos'],
    ['Kanton Nidwalden','Hergiswil (NW)'],['Kanton Nidwalden','Oberdorf (NW)'],
    ['Kanton Nidwalden','Stans'],['Kanton Nidwalden','Stansstad'],
    ['Kanton Nidwalden','Wolfenschiessen'],
  ].map(([bezirk, gemeinde]) => ({ kantonCode: 'NW', kantonName: 'Nidwalden', bezirk, gemeinde })),

  // ── GL · Glarus ──────────────────────────────────────────────────────────
  ...[
    ['Kanton Glarus','Glarus'],['Kanton Glarus','Glarus Nord'],
    ['Kanton Glarus','Glarus Süd'],
  ].map(([bezirk, gemeinde]) => ({ kantonCode: 'GL', kantonName: 'Glarus', bezirk, gemeinde })),

  // ── ZG · Zug ─────────────────────────────────────────────────────────────
  ...[
    ['Kanton Zug','Baar'],['Kanton Zug','Cham'],
    ['Kanton Zug','Hünenberg'],['Kanton Zug','Menzingen'],
    ['Kanton Zug','Neuheim'],['Kanton Zug','Oberägeri'],
    ['Kanton Zug','Risch'],['Kanton Zug','Steinhausen'],
    ['Kanton Zug','Unterägeri'],['Kanton Zug','Walchwil'],
    ['Kanton Zug','Zug'],
  ].map(([bezirk, gemeinde]) => ({ kantonCode: 'ZG', kantonName: 'Zug', bezirk, gemeinde })),

  // ── FR · Fribourg ────────────────────────────────────────────────────────
  ...[
    ['Bezirk Broye','Estavayer'],['Bezirk Broye','Cugy (FR)'],
    ['Bezirk Broye','Domdidier'],['Bezirk Broye','Fétigny'],
    ['Bezirk Broye','Léchelles'],['Bezirk Broye','Montagny (FR)'],
    ['Bezirk Broye','Morens (FR)'],['Bezirk Broye','Nuvilly'],
    ['Bezirk Broye','Surpierre'],['Bezirk Broye','Vallon'],

    ['Bezirk Glane','Romont (FR)'],['Bezirk Glane','Grolley'],
    ['Bezirk Glane','Rue'],['Bezirk Glane','Villaz'],

    ['Bezirk Greyerz','Broc'],['Bezirk Greyerz','Bulle'],
    ['Bezirk Greyerz','Charmey'],['Bezirk Greyerz','Châtel-sur-Montsalvens'],
    ['Bezirk Greyerz','Greyerz'],['Bezirk Greyerz','La Roche'],
    ['Bezirk Greyerz','Lessoc'],['Bezirk Greyerz','Montbovon'],
    ['Bezirk Greyerz','Morlon'],['Bezirk Greyerz','Riaz'],
    ['Bezirk Greyerz','Sâles'],['Bezirk Greyerz','Vuadens'],

    ['Bezirk Saane','Freiburg'],['Bezirk Saane','Avry'],
    ['Bezirk Saane','Belfaux'],['Bezirk Saane','Corminboeuf'],
    ['Bezirk Saane','Düdingen'],['Bezirk Saane','Givisiez'],
    ['Bezirk Saane','Granges-Paccot'],['Bezirk Saane','Matran'],
    ['Bezirk Saane','Marly'],['Bezirk Saane','Villars-sur-Glâne'],

    ['Bezirk See','Murten'],['Bezirk See','Courlevon'],
    ['Bezirk See','Cressier (FR)'],['Bezirk See','Galmiz'],
    ['Bezirk See','Gurmels'],['Bezirk See','Kerzers'],
    ['Bezirk See','Muntelier'],['Bezirk See','Ried bei Kerzers'],
    ['Bezirk See','Salvenach'],

    ['Bezirk Sense','Tafers'],['Bezirk Sense','Alterswil'],
    ['Bezirk Sense','Giffers'],['Bezirk Sense','Heitenried'],
    ['Bezirk Sense','Plaffeien'],['Bezirk Sense','Rechthalten'],
    ['Bezirk Sense','St. Antoni'],['Bezirk Sense','St. Silvester'],
    ['Bezirk Sense','St. Ursen'],['Bezirk Sense','Wünnewil-Flamatt'],

    ['Bezirk Vivisbach','Jaun'],['Bezirk Vivisbach','Plasselb'],
    ['Bezirk Vivisbach','Schwarzsee'],['Bezirk Vivisbach','Zumholz'],
  ].map(([bezirk, gemeinde]) => ({ kantonCode: 'FR', kantonName: 'Freiburg', bezirk, gemeinde })),

  // ── SO · Solothurn ───────────────────────────────────────────────────────
  ...[
    ['Bezirk Bucheggberg','Buchegg'],['Bezirk Bucheggberg','Lüterswil-Gächliwil'],

    ['Bezirk Dorneck','Dornach'],['Bezirk Dorneck','Gempen'],
    ['Bezirk Dorneck','Hochwald'],['Bezirk Dorneck','Hofstetten-Flüh'],
    ['Bezirk Dorneck','Metzerlen-Mariastein'],['Bezirk Dorneck','Rodersdorf'],
    ['Bezirk Dorneck','Seewen (SO)'],['Bezirk Dorneck','Witterswil'],

    ['Bezirk Gäu','Egerkingen'],['Bezirk Gäu','Härkingen'],
    ['Bezirk Gäu','Kestenholz'],['Bezirk Gäu','Neuendorf'],
    ['Bezirk Gäu','Obergösgen'],['Bezirk Gäu','Rickenbach (SO)'],
    ['Bezirk Gäu','Wolfwil'],['Bezirk Gäu','Hägendorf'],

    ['Bezirk Gösgen','Dulliken'],['Bezirk Gösgen','Eppenberg-Wöschnau'],
    ['Bezirk Gösgen','Erlinsbach (SO)'],['Bezirk Gösgen','Gretzenbach'],
    ['Bezirk Gösgen','Gunzgen'],['Bezirk Gösgen','Lostorf'],
    ['Bezirk Gösgen','Niedergösgen'],['Bezirk Gösgen','Obergösgen'],
    ['Bezirk Gösgen','Schönenwerd'],['Bezirk Gösgen','Stüsslingen'],
    ['Bezirk Gösgen','Trimbach'],['Bezirk Gösgen','Walterswil (SO)'],

    ['Bezirk Lebern','Bellach'],['Bezirk Lebern','Biberist'],
    ['Bezirk Lebern','Derendingen'],['Bezirk Lebern','Deitingen'],
    ['Bezirk Lebern','Gerlafingen'],['Bezirk Lebern','Luterbach'],
    ['Bezirk Lebern','Recherswil'],['Bezirk Lebern','Zuchwil'],

    ['Bezirk Olten','Olten'],['Bezirk Olten','Aarburg'],
    ['Bezirk Olten','Boningen'],['Bezirk Olten','Däniken'],
    ['Bezirk Olten','Gösgen'],['Bezirk Olten','Hägendorf'],
    ['Bezirk Olten','Hauenstein-Ifenthal'],['Bezirk Olten','Kestenholz'],
    ['Bezirk Olten','Lostorf'],['Bezirk Olten','Stüsslingen'],
    ['Bezirk Olten','Trimbach'],['Bezirk Olten','Wangen bei Olten'],

    ['Bezirk Solothurn','Solothurn'],['Bezirk Solothurn','Bettlach'],
    ['Bezirk Solothurn','Feldbrunnen-St. Niklaus'],['Bezirk Solothurn','Flumenthal'],
    ['Bezirk Solothurn','Grenchen'],['Bezirk Solothurn','Langendorf'],
    ['Bezirk Solothurn','Lommiswil'],['Bezirk Solothurn','Oberdorf (SO)'],
    ['Bezirk Solothurn','Riedholz'],['Bezirk Solothurn','Selzach'],

    ['Bezirk Thal','Balsthal'],['Bezirk Thal','Herbetswil'],
    ['Bezirk Thal','Holderbank (SO)'],['Bezirk Thal','Laupersdorf'],
    ['Bezirk Thal','Matzendorf'],['Bezirk Thal','Mümliswil-Ramiswil'],
    ['Bezirk Thal','Nunningen'],['Bezirk Thal','Welschenrohr-Gänsbrunnen'],

    ['Bezirk Thierstein','Büsserach'],['Bezirk Thierstein','Breitenbach'],
    ['Bezirk Thierstein','Beinwil (SO)'],['Bezirk Thierstein','Erschwil'],
    ['Bezirk Thierstein','Grindel'],['Bezirk Thierstein','Hauenstein-Ifenthal'],
    ['Bezirk Thierstein','Meltingen'],['Bezirk Thierstein','Zullwil'],

    ['Bezirk Wasseramt','Deitingen'],['Bezirk Wasseramt','Halten'],
    ['Bezirk Wasseramt','Horriwil'],['Bezirk Wasseramt','Hüniken'],
    ['Bezirk Wasseramt','Küttigkofen'],['Bezirk Wasseramt','Lohn-Ammannsegg'],
    ['Bezirk Wasseramt','Luterbach'],['Bezirk Wasseramt','Obergerlafingen'],
    ['Bezirk Wasseramt','Oekingen'],['Bezirk Wasseramt','Recherswil'],
    ['Bezirk Wasseramt','Zuchwil'],
  ].map(([bezirk, gemeinde]) => ({ kantonCode: 'SO', kantonName: 'Solothurn', bezirk, gemeinde })),

  // ── BS · Basel-Stadt ─────────────────────────────────────────────────────
  ...[
    ['Kanton Basel-Stadt','Basel'],['Kanton Basel-Stadt','Bettingen'],
    ['Kanton Basel-Stadt','Riehen'],
  ].map(([bezirk, gemeinde]) => ({ kantonCode: 'BS', kantonName: 'Basel-Stadt', bezirk, gemeinde })),

  // ── BL · Basel-Landschaft ────────────────────────────────────────────────
  ...[
    ['Bezirk Arlesheim','Allschwil'],['Bezirk Arlesheim','Arlesheim'],
    ['Bezirk Arlesheim','Biel-Benken'],['Bezirk Arlesheim','Binningen'],
    ['Bezirk Arlesheim','Birsfelden'],['Bezirk Arlesheim','Bottmingen'],
    ['Bezirk Arlesheim','Ettingen'],['Bezirk Arlesheim','Münchenbuchsee'],
    ['Bezirk Arlesheim','Münchenstein'],['Bezirk Arlesheim','Muttenz'],
    ['Bezirk Arlesheim','Oberwil (BL)'],['Bezirk Arlesheim','Pfeffingen'],
    ['Bezirk Arlesheim','Reinach (BL)'],['Bezirk Arlesheim','Schönenbuch'],
    ['Bezirk Arlesheim','Therwil'],

    ['Bezirk Laufen','Blauen'],['Bezirk Laufen','Brislach'],
    ['Bezirk Laufen','Büsserach'],['Bezirk Laufen','Dittingen'],
    ['Bezirk Laufen','Duggingen'],['Bezirk Laufen','Grellingen'],
    ['Bezirk Laufen','Laufen'],['Bezirk Laufen','Liesberg'],
    ['Bezirk Laufen','Nenzlingen'],['Bezirk Laufen','Röschenz'],
    ['Bezirk Laufen','Wahlen'],['Bezirk Laufen','Zwingen'],

    ['Bezirk Liestal','Arisdorf'],['Bezirk Liestal','Augst'],
    ['Bezirk Liestal','Bubendorf'],['Bezirk Liestal','Frenkendorf'],
    ['Bezirk Liestal','Füllinsdorf'],['Bezirk Liestal','Giebenach'],
    ['Bezirk Liestal','Hersberg'],['Bezirk Liestal','Lausen'],
    ['Bezirk Liestal','Liestal'],['Bezirk Liestal','Lupsingen'],
    ['Bezirk Liestal','Münchenbuchsee'],['Bezirk Liestal','Pratteln'],
    ['Bezirk Liestal','Ramlinsburg'],['Bezirk Liestal','Seltisberg'],
    ['Bezirk Liestal','Ziefen'],

    ['Bezirk Sissach','Böckten'],['Bezirk Sissach','Buckten'],
    ['Bezirk Sissach','Diepflingen'],['Bezirk Sissach','Gelterkinden'],
    ['Bezirk Sissach','Häfelfingen'],['Bezirk Sissach','Itingen'],
    ['Bezirk Sissach','Känerkinden'],['Bezirk Sissach','Kilchberg (BL)'],
    ['Bezirk Sissach','Läufelfingen'],['Bezirk Sissach','Maisprach'],
    ['Bezirk Sissach','Nusshof'],['Bezirk Sissach','Oltingen'],
    ['Bezirk Sissach','Rickenbacher'],['Bezirk Sissach','Rothenfluh'],
    ['Bezirk Sissach','Rümlingen'],['Bezirk Sissach','Rünenberg'],
    ['Bezirk Sissach','Sissach'],['Bezirk Sissach','Tecknau'],
    ['Bezirk Sissach','Tenniken'],['Bezirk Sissach','Thürnen'],
    ['Bezirk Sissach','Wenslingen'],['Bezirk Sissach','Wintersingen'],
    ['Bezirk Sissach','Zeglingen'],

    ['Bezirk Waldenburg','Arboldswil'],['Bezirk Waldenburg','Bennwil'],
    ['Bezirk Waldenburg','Bretzwil'],['Bezirk Waldenburg','Diegten'],
    ['Bezirk Waldenburg','Eptingen'],['Bezirk Waldenburg','Hölstein'],
    ['Bezirk Waldenburg','Lampenberg'],['Bezirk Waldenburg','Langenbruck'],
    ['Bezirk Waldenburg','Lauwil'],['Bezirk Waldenburg','Liedertswil'],
    ['Bezirk Waldenburg','Niederdorf'],['Bezirk Waldenburg','Oberdorf (BL)'],
    ['Bezirk Waldenburg','Reigoldswil'],['Bezirk Waldenburg','Titterten'],
    ['Bezirk Waldenburg','Waldenburg'],
  ].map(([bezirk, gemeinde]) => ({ kantonCode: 'BL', kantonName: 'Basel-Landschaft', bezirk, gemeinde })),

  // ── SH · Schaffhausen ───────────────────────────────────────────────────
  ...[
    ['Bezirk Diessenhofen','Basadingen-Schlattingen'],['Bezirk Diessenhofen','Diessenhofen'],
    ['Bezirk Diessenhofen','Schlatt (SH)'],

    ['Bezirk Klettgau','Beringen'],['Bezirk Klettgau','Büttenhardt'],
    ['Bezirk Klettgau','Gächlingen'],['Bezirk Klettgau','Hallau'],
    ['Bezirk Klettgau','Hemishofen'],['Bezirk Klettgau','Neunkirch'],
    ['Bezirk Klettgau','Oberhallau'],['Bezirk Klettgau','Trasadingen'],
    ['Bezirk Klettgau','Wilchingen'],

    ['Bezirk Reiat','Beggingen'],['Bezirk Reiat','Buch (SH)'],
    ['Bezirk Reiat','Hemishofen'],['Bezirk Reiat','Merishausen'],
    ['Bezirk Reiat','Siblingen'],

    ['Bezirk Schaffhausen','Schaffhausen'],['Bezirk Schaffhausen','Neuhausen am Rheinfall'],

    ['Bezirk Schleitheim','Schleitheim'],['Bezirk Schleitheim','Siblingen'],

    ['Bezirk Stein','Burg (SH)'],['Bezirk Stein','Ramsen'],
    ['Bezirk Stein','Stein am Rhein'],['Bezirk Stein','Wagenhausen'],

    ['Bezirk Unterklettgau','Lohn (SH)'],['Bezirk Unterklettgau','Stetten (SH)'],
    ['Bezirk Unterklettgau','Trasadingen'],
  ].map(([bezirk, gemeinde]) => ({ kantonCode: 'SH', kantonName: 'Schaffhausen', bezirk, gemeinde })),

  // ── AR · Appenzell Ausserrhoden ──────────────────────────────────────────
  ...[
    ['Bezirk Hinterland','Heiden'],['Bezirk Hinterland','Lutzenberg'],
    ['Bezirk Hinterland','Rehetobel'],['Bezirk Hinterland','Reute (AR)'],
    ['Bezirk Hinterland','Wald (AR)'],['Bezirk Hinterland','Wolfhalden'],

    ['Bezirk Mittelland','Bühler'],['Bezirk Mittelland','Gais'],
    ['Bezirk Mittelland','Herisau'],['Bezirk Mittelland','Hundwil'],
    ['Bezirk Mittelland','Schönengrund'],['Bezirk Mittelland','Schwellbrunn'],
    ['Bezirk Mittelland','Stein (AR)'],['Bezirk Mittelland','Teufen (AR)'],
    ['Bezirk Mittelland','Waldstatt'],

    ['Bezirk Vorderland','Grub (AR)'],['Bezirk Vorderland','Heiden'],
    ['Bezirk Vorderland','Lutzenberg'],['Bezirk Vorderland','Rehetobel'],
    ['Bezirk Vorderland','Reute (AR)'],['Bezirk Vorderland','Rheineck'],
    ['Bezirk Vorderland','Thal (SG)'],['Bezirk Vorderland','Wolfhalden'],
  ].map(([bezirk, gemeinde]) => ({ kantonCode: 'AR', kantonName: 'Appenzell Ausserrhoden', bezirk, gemeinde })),

  // ── AI · Appenzell Innerrhoden ───────────────────────────────────────────
  ...[
    ['Kanton Appenzell Innerrhoden','Appenzell'],
    ['Kanton Appenzell Innerrhoden','Gonten'],
    ['Kanton Appenzell Innerrhoden','Oberegg'],
    ['Kanton Appenzell Innerrhoden','Rüte'],
    ['Kanton Appenzell Innerrhoden','Schlatt-Haslen'],
    ['Kanton Appenzell Innerrhoden','Schwende-Rüte'],
  ].map(([bezirk, gemeinde]) => ({ kantonCode: 'AI', kantonName: 'Appenzell Innerrhoden', bezirk, gemeinde })),

  // ── SG · St. Gallen ──────────────────────────────────────────────────────
  ...[
    ['Wahlkreis Rheintal','Altstätten'],['Wahlkreis Rheintal','Au (SG)'],
    ['Wahlkreis Rheintal','Balgach'],['Wahlkreis Rheintal','Berneck'],
    ['Wahlkreis Rheintal','Diepoldsau'],['Wahlkreis Rheintal','Eichberg'],
    ['Wahlkreis Rheintal','Kriessern'],['Wahlkreis Rheintal','Marbach (SG)'],
    ['Wahlkreis Rheintal','Oberriet'],['Wahlkreis Rheintal','Rebstein'],
    ['Wahlkreis Rheintal','Rüthi (Rheintal)'],['Wahlkreis Rheintal','St. Margrethen'],

    ['Wahlkreis Rorschach','Goldach'],['Wahlkreis Rorschach','Rorschach'],
    ['Wahlkreis Rorschach','Rorschacherberg'],['Wahlkreis Rorschach','Steinach'],
    ['Wahlkreis Rorschach','Tübach'],['Wahlkreis Rorschach','Untereggen'],
    ['Wahlkreis Rorschach','Wittenbach'],

    ['Wahlkreis St. Gallen','St. Gallen'],['Wahlkreis St. Gallen','Gaiserwald'],
    ['Wahlkreis St. Gallen','Gossau (SG)'],['Wahlkreis St. Gallen','Mörschwil'],

    ['Wahlkreis Sarganserland','Bad Ragaz'],['Wahlkreis Sarganserland','Flums'],
    ['Wahlkreis Sarganserland','Mels'],['Wahlkreis Sarganserland','Pfäfers'],
    ['Wahlkreis Sarganserland','Quarten'],['Wahlkreis Sarganserland','Sargans'],
    ['Wahlkreis Sarganserland','Vilters-Wangs'],['Wahlkreis Sarganserland','Walenstadt'],

    ['Wahlkreis See-Gaster','Amden'],['Wahlkreis See-Gaster','Benken (SG)'],
    ['Wahlkreis See-Gaster','Eschenbach (SG)'],['Wahlkreis See-Gaster','Gommiswald'],
    ['Wahlkreis See-Gaster','Kaltbrunn'],['Wahlkreis See-Gaster','Rapperswil-Jona'],
    ['Wahlkreis See-Gaster','Rieden (SG)'],['Wahlkreis See-Gaster','Schänis'],
    ['Wahlkreis See-Gaster','Tuggen'],['Wahlkreis See-Gaster','Uznach'],
    ['Wahlkreis See-Gaster','Weesen'],

    ['Wahlkreis Toggenburg','Ebnat-Kappel'],['Wahlkreis Toggenburg','Flawil'],
    ['Wahlkreis Toggenburg','Kirchberg (SG)'],['Wahlkreis Toggenburg','Lütisburg'],
    ['Wahlkreis Toggenburg','Mosnang'],['Wahlkreis Toggenburg','Nesslau'],
    ['Wahlkreis Toggenburg','Oberhelfenschwil'],['Wahlkreis Toggenburg','Wattwil'],
    ['Wahlkreis Toggenburg','Wildhaus-Alt St. Johann'],

    ['Wahlkreis Werdenberg','Buchs (SG)'],['Wahlkreis Werdenberg','Gams'],
    ['Wahlkreis Werdenberg','Grabs'],['Wahlkreis Werdenberg','Haag (Rheintal)'],
    ['Wahlkreis Werdenberg','Sennwald'],['Wahlkreis Werdenberg','Sevelen'],

    ['Wahlkreis Wil','Bronschhofen'],['Wahlkreis Wil','Bütschwil-Ganterschwil'],
    ['Wahlkreis Wil','Jonschwil'],['Wahlkreis Wil','Lütisburg'],
    ['Wahlkreis Wil','Münchwilen (TG)'],['Wahlkreis Wil','Oberbüren'],
    ['Wahlkreis Wil','Uzwil'],['Wahlkreis Wil','Wil (SG)'],
  ].map(([bezirk, gemeinde]) => ({ kantonCode: 'SG', kantonName: 'St. Gallen', bezirk, gemeinde })),

  // ── GR · Graubünden ──────────────────────────────────────────────────────
  ...[
    ['Bezirk Albula','Alvaschein'],['Bezirk Albula','Bergün Filisur'],
    ['Bezirk Albula','Bivio'],['Bezirk Albula','Lantsch/Lenz'],
    ['Bezirk Albula','Mulegns'],['Bezirk Albula','Sur'],
    ['Bezirk Albula','Surses'],['Bezirk Albula','Thusis'],
    ['Bezirk Albula','Tiefencastel'],['Bezirk Albula','Wiesen (GR)'],

    ['Bezirk Bernina','Brusio'],['Bezirk Bernina','Poschiavo'],

    ['Bezirk Engiadina Bassa/Val Müstair','Ramosch'],['Bezirk Engiadina Bassa/Val Müstair','Samnaun'],
    ['Bezirk Engiadina Bassa/Val Müstair','Scuol'],['Bezirk Engiadina Bassa/Val Müstair','Val Müstair'],
    ['Bezirk Engiadina Bassa/Val Müstair','Valsot'],

    ['Bezirk Imboden','Bonaduz'],['Bezirk Imboden','Domat/Ems'],
    ['Bezirk Imboden','Felsberg'],['Bezirk Imboden','Rhäzüns'],
    ['Bezirk Imboden','Tamins'],['Bezirk Imboden','Trimmis'],
    ['Bezirk Imboden','Untervaz'],['Bezirk Imboden','Versam'],

    ['Bezirk Landquart','Fläsch'],['Bezirk Landquart','Igis'],
    ['Bezirk Landquart','Jenins'],['Bezirk Landquart','Landquart'],
    ['Bezirk Landquart','Malans'],['Bezirk Landquart','Maienfeld'],
    ['Bezirk Landquart','Seewis im Prättigau'],['Bezirk Landquart','Schiers'],

    ['Bezirk Maloja','Bregaglia'],['Bezirk Maloja','Castasegna'],
    ['Bezirk Maloja','Sils im Engadin/Segl'],['Bezirk Maloja','Silvaplana'],
    ['Bezirk Maloja','St. Moritz'],['Bezirk Maloja','Stampa'],

    ['Bezirk Moesa','Cama'],['Bezirk Moesa','Grono'],
    ['Bezirk Moesa','Mesocco'],['Bezirk Moesa','Roveredo (GR)'],
    ['Bezirk Moesa','San Vittore'],['Bezirk Moesa','Santa Maria in Calanca'],
    ['Bezirk Moesa','Soazza'],['Bezirk Moesa','Verdabbio'],

    ['Bezirk Plessur','Arosa'],['Bezirk Plessur','Chur'],
    ['Bezirk Plessur','Churwalden'],['Bezirk Plessur','Langwies'],
    ['Bezirk Plessur','Tschiertschen-Praden'],

    ['Bezirk Prättigau/Davos','Conters im Prättigau'],['Bezirk Prättigau/Davos','Davos'],
    ['Bezirk Prättigau/Davos','Fideris'],['Bezirk Prättigau/Davos','Furna'],
    ['Bezirk Prättigau/Davos','Grüsch'],['Bezirk Prättigau/Davos','Klosters-Serneus'],
    ['Bezirk Prättigau/Davos','Luzein'],['Bezirk Prättigau/Davos','St. Antönien'],

    ['Bezirk Surselva','Breil/Brigels'],['Bezirk Surselva','Disentis/Mustér'],
    ['Bezirk Surselva','Falera'],['Bezirk Surselva','Flims'],
    ['Bezirk Surselva','Ilanz/Glion'],['Bezirk Surselva','Laax'],
    ['Bezirk Surselva','Lumnezia'],['Bezirk Surselva','Medel (Lucmagn)'],
    ['Bezirk Surselva','Obersaxen Mundaun'],['Bezirk Surselva','Ruschein'],
    ['Bezirk Surselva','Safien'],['Bezirk Surselva','Trun'],
    ['Bezirk Surselva','Tujetsch'],['Bezirk Surselva','Vals'],

    ['Bezirk Viamala','Andeer'],['Bezirk Viamala','Domleschg'],
    ['Bezirk Viamala','Ferrera'],['Bezirk Viamala','Hinterrhein'],
    ['Bezirk Viamala','Lohn (GR)'],['Bezirk Viamala','Nufenen'],
    ['Bezirk Viamala','Rheinwald'],['Bezirk Viamala','Rongellen'],
    ['Bezirk Viamala','Scharans'],['Bezirk Viamala','Splügen'],
    ['Bezirk Viamala','Sufers'],['Bezirk Viamala','Thusis'],
  ].map(([bezirk, gemeinde]) => ({ kantonCode: 'GR', kantonName: 'Graubünden', bezirk, gemeinde })),

  // ── AG · Aargau ──────────────────────────────────────────────────────────
  ...[
    ['Bezirk Aarau','Aarau'],['Bezirk Aarau','Buchs (AG)'],
    ['Bezirk Aarau','Densbüren'],['Bezirk Aarau','Entfelden'],
    ['Bezirk Aarau','Erlinsbach (AG)'],['Bezirk Aarau','Gränichen'],
    ['Bezirk Aarau','Hirschthal'],['Bezirk Aarau','Küttigen'],
    ['Bezirk Aarau','Muhen'],['Bezirk Aarau','Rohr (AG)'],
    ['Bezirk Aarau','Schöftland'],['Bezirk Aarau','Suhr'],
    ['Bezirk Aarau','Unterentfelden'],

    ['Bezirk Baden','Baden'],['Bezirk Baden','Birmenstorf (AG)'],
    ['Bezirk Baden','Ehrendingen'],['Bezirk Baden','Ennetbaden'],
    ['Bezirk Baden','Frenkendorf'],['Bezirk Baden','Gebenstorf'],
    ['Bezirk Baden','Killwangen'],['Bezirk Baden','Neuenhof'],
    ['Bezirk Baden','Niederrohrdorf'],['Bezirk Baden','Oberrohrdorf'],
    ['Bezirk Baden','Remetschwil'],['Bezirk Baden','Spreitenbach'],
    ['Bezirk Baden','Turgi'],['Bezirk Baden','Würenlos'],

    ['Bezirk Bremgarten','Bremgarten (AG)'],['Bezirk Bremgarten','Dietikon'],
    ['Bezirk Bremgarten','Bergdietikon'],['Bezirk Bremgarten','Oberlunkhofen'],
    ['Bezirk Bremgarten','Rudolfstetten-Friedlisberg'],['Bezirk Bremgarten','Wohlen (AG)'],
    ['Bezirk Bremgarten','Wohlenschwil'],

    ['Bezirk Brugg','Brugg'],['Bezirk Brugg','Birr'],
    ['Bezirk Brugg','Brunegg'],['Bezirk Brugg','Habsburg'],
    ['Bezirk Brugg','Hausen (AG)'],['Bezirk Brugg','Lupfig'],
    ['Bezirk Brugg','Mülligen'],['Bezirk Brugg','Riniken'],
    ['Bezirk Brugg','Scherz'],['Bezirk Brugg','Windisch'],

    ['Bezirk Kulm','Birrwil'],['Bezirk Kulm','Boniswil'],
    ['Bezirk Kulm','Dürrenäsch'],['Bezirk Kulm','Egliswil'],
    ['Bezirk Kulm','Hallwil'],['Bezirk Kulm','Leimbach (AG)'],
    ['Bezirk Kulm','Menziken'],['Bezirk Kulm','Oberkulm'],
    ['Bezirk Kulm','Reinach (AG)'],['Bezirk Kulm','Schlossrued'],
    ['Bezirk Kulm','Unterkulm'],['Bezirk Kulm','Zetzwil'],

    ['Bezirk Laufenburg','Full-Reuenthal'],['Bezirk Laufenburg','Gansingen'],
    ['Bezirk Laufenburg','Kaisten'],['Bezirk Laufenburg','Laufenburg'],
    ['Bezirk Laufenburg','Mettau'],['Bezirk Laufenburg','Oberhof (AG)'],
    ['Bezirk Laufenburg','Schupfart'],['Bezirk Laufenburg','Sisseln'],
    ['Bezirk Laufenburg','Sulz (AG)'],['Bezirk Laufenburg','Ueken'],
    ['Bezirk Laufenburg','Wil (AG)'],['Bezirk Laufenburg','Wittnau'],

    ['Bezirk Muri','Aristau'],['Bezirk Muri','Benzenschwil'],
    ['Bezirk Muri','Besenbüren'],['Bezirk Muri','Bünzen'],
    ['Bezirk Muri','Buttwil'],['Bezirk Muri','Geltwil'],
    ['Bezirk Muri','Muri (AG)'],['Bezirk Muri','Oberrüti'],
    ['Bezirk Muri','Rottenschwil'],['Bezirk Muri','Sins'],
    ['Bezirk Muri','Villmergen'],['Bezirk Muri','Waltenswil'],

    ['Bezirk Rheinfelden','Hellikon'],['Bezirk Rheinfelden','Kaiseraugst'],
    ['Bezirk Rheinfelden','Magden'],['Bezirk Rheinfelden','Möhlin'],
    ['Bezirk Rheinfelden','Mumpf'],['Bezirk Rheinfelden','Münchwilen (AG)'],
    ['Bezirk Rheinfelden','Obermumpf'],['Bezirk Rheinfelden','Olsberg'],
    ['Bezirk Rheinfelden','Rheinfelden'],['Bezirk Rheinfelden','Schupfart'],
    ['Bezirk Rheinfelden','Stein (AG)'],['Bezirk Rheinfelden','Wallbach'],
    ['Bezirk Rheinfelden','Wegenstetten'],['Bezirk Rheinfelden','Zeihen'],
    ['Bezirk Rheinfelden','Zuzgen'],

    ['Bezirk Zofingen','Aarburg'],['Bezirk Zofingen','Bottenwil'],
    ['Bezirk Zofingen','Brittnau'],['Bezirk Zofingen','Egerkingen'],
    ['Bezirk Zofingen','Murgenthal'],['Bezirk Zofingen','Oftringen'],
    ['Bezirk Zofingen','Reitnau'],['Bezirk Zofingen','Rothrist'],
    ['Bezirk Zofingen','Safenwil'],['Bezirk Zofingen','Strengelbach'],
    ['Bezirk Zofingen','Vordemwald'],['Bezirk Zofingen','Wikon'],
    ['Bezirk Zofingen','Zofingen'],['Bezirk Zofingen','Zullwil'],

    ['Bezirk Zurzach','Bad Zurzach'],['Bezirk Zurzach','Böbikon'],
    ['Bezirk Zurzach','Döttingen'],['Bezirk Zurzach','Endingen'],
    ['Bezirk Zurzach','Fisibach'],['Bezirk Zurzach','Kaiserstuhl'],
    ['Bezirk Zurzach','Klingnau'],['Bezirk Zurzach','Leibstadt'],
    ['Bezirk Zurzach','Leuggern'],['Bezirk Zurzach','Mandach'],
    ['Bezirk Zurzach','Mellikon'],['Bezirk Zurzach','Nussbaumen (AG)'],
    ['Bezirk Zurzach','Rekingen (AG)'],['Bezirk Zurzach','Rietheim'],
    ['Bezirk Zurzach','Tegerfelden'],['Bezirk Zurzach','Waldshut'],
    ['Bezirk Zurzach','Wislikofen'],['Bezirk Zurzach','Zurzach'],
  ].map(([bezirk, gemeinde]) => ({ kantonCode: 'AG', kantonName: 'Aargau', bezirk, gemeinde })),

  // ── TG · Thurgau ─────────────────────────────────────────────────────────
  ...[
    ['Bezirk Arbon','Arbon'],['Bezirk Arbon','Dozwil'],
    ['Bezirk Arbon','Egnach'],['Bezirk Arbon','Horn'],
    ['Bezirk Arbon','Kesswil'],['Bezirk Arbon','Roggwil (TG)'],
    ['Bezirk Arbon','Salmsach'],['Bezirk Arbon','Steinach'],

    ['Bezirk Frauenfeld','Basadingen-Schlattingen'],['Bezirk Frauenfeld','Frauenfeld'],
    ['Bezirk Frauenfeld','Gachnang'],['Bezirk Frauenfeld','Herdern'],
    ['Bezirk Frauenfeld','Hüttlingen'],['Bezirk Frauenfeld','Neunforn'],
    ['Bezirk Frauenfeld','Matzingen'],['Bezirk Frauenfeld','Thundorf'],
    ['Bezirk Frauenfeld','Uesslingen-Buch'],['Bezirk Frauenfeld','Warth-Weiningen'],

    ['Bezirk Kreuzlingen','Bottighofen'],['Bezirk Kreuzlingen','Ermatingen'],
    ['Bezirk Kreuzlingen','Gottlieben'],['Bezirk Kreuzlingen','Kemmental'],
    ['Bezirk Kreuzlingen','Kreuzlingen'],['Bezirk Kreuzlingen','Lengwil'],
    ['Bezirk Kreuzlingen','Münsterlingen'],['Bezirk Kreuzlingen','Tägerwilen'],
    ['Bezirk Kreuzlingen','Triboltingen'],

    ['Bezirk Münchwilen','Aadorf'],['Bezirk Münchwilen','Bettwiesen'],
    ['Bezirk Münchwilen','Bichelsee-Balterswil'],['Bezirk Münchwilen','Braunau'],
    ['Bezirk Münchwilen','Eschlikon'],['Bezirk Münchwilen','Fischingen'],
    ['Bezirk Münchwilen','Lommis'],['Bezirk Münchwilen','Münchwilen (TG)'],
    ['Bezirk Münchwilen','Rickenbach (TG)'],['Bezirk Münchwilen','Sirnach'],
    ['Bezirk Münchwilen','Tobel-Tägerschen'],['Bezirk Münchwilen','Wängi'],
    ['Bezirk Münchwilen','Wilen (TG)'],['Bezirk Münchwilen','Wil (TG)'],

    ['Bezirk Weinfelden','Berg (TG)'],['Bezirk Weinfelden','Bürglen (TG)'],
    ['Bezirk Weinfelden','Bussnang'],['Bezirk Weinfelden','Erlen'],
    ['Bezirk Weinfelden','Felben-Wellhausen'],['Bezirk Weinfelden','Güttingen'],
    ['Bezirk Weinfelden','Hohentannen'],['Bezirk Weinfelden','Hugelshofen'],
    ['Bezirk Weinfelden','Kradolf-Schönenberg'],['Bezirk Weinfelden','Lipperswil'],
    ['Bezirk Weinfelden','Münsterlingen'],['Bezirk Weinfelden','Sulgen'],
    ['Bezirk Weinfelden','Weinfelden'],
  ].map(([bezirk, gemeinde]) => ({ kantonCode: 'TG', kantonName: 'Thurgau', bezirk, gemeinde })),

  // ── TI · Ticino ──────────────────────────────────────────────────────────
  ...[
    ['Distretto di Bellinzona','Arbedo-Castione'],['Distretto di Bellinzona','Bellinzona'],
    ['Distretto di Bellinzona','Cadenazzo'],['Distretto di Bellinzona','Claro'],
    ['Distretto di Bellinzona','Giubiasco'],['Distretto di Bellinzona','Gnosca'],
    ['Distretto di Bellinzona','Gorduno'],['Distretto di Bellinzona','Gudo'],
    ['Distretto di Bellinzona','Lumino'],['Distretto di Bellinzona','Moleno'],
    ['Distretto di Bellinzona','Monte Carasso'],['Distretto di Bellinzona','Preonzo'],
    ['Distretto di Bellinzona','Sant\'Antonino'],['Distretto di Bellinzona','Sant\'Antonino'],

    ['Distretto di Blenio','Acquarossa'],['Distretto di Blenio','Blenio'],
    ['Distretto di Blenio','Corzoneso'],['Distretto di Blenio','Dongio'],
    ['Distretto di Blenio','Largario'],['Distretto di Blenio','Leontica'],
    ['Distretto di Blenio','Lottigna'],['Distretto di Blenio','Malvaglia'],
    ['Distretto di Blenio','Olivone'],

    ['Distretto di Leventina','Airolo'],['Distretto di Leventina','Bodio'],
    ['Distretto di Leventina','Chiggiogna'],['Distretto di Leventina','Giornico'],
    ['Distretto di Leventina','Personico'],['Distretto di Leventina','Pollegio'],
    ['Distretto di Leventina','Prato (Leventina)'],

    ['Distretto di Locarno','Ascona'],['Distretto di Locarno','Brione (Verzasca)'],
    ['Distretto di Locarno','Brione sopra Minusio'],['Distretto di Locarno','Centovalli'],
    ['Distretto di Locarno','Gordola'],['Distretto di Locarno','Intragna'],
    ['Distretto di Locarno','Lavertezzo'],['Distretto di Locarno','Locarno'],
    ['Distretto di Locarno','Losone'],['Distretto di Locarno','Minusio'],
    ['Distretto di Locarno','Muralto'],['Distretto di Locarno','Tenero-Contra'],

    ['Distretto di Lugano','Agno'],['Distretto di Lugano','Bioggio'],
    ['Distretto di Lugano','Canobbio'],['Distretto di Lugano','Collina d\'Oro'],
    ['Distretto di Lugano','Croglio'],['Distretto di Lugano','Gravesano'],
    ['Distretto di Lugano','Lugano'],['Distretto di Lugano','Manno'],
    ['Distretto di Lugano','Massagno'],['Distretto di Lugano','Melide'],
    ['Distretto di Lugano','Mezzovico-Vira'],['Distretto di Lugano','Minusio'],
    ['Distretto di Lugano','Montagnola'],['Distretto di Lugano','Morcote'],
    ['Distretto di Lugano','Neggio'],['Distretto di Lugano','Origlio'],
    ['Distretto di Lugano','Paradiso'],['Distretto di Lugano','Ponte Capriasca'],
    ['Distretto di Lugano','Porza'],['Distretto di Lugano','Pura'],
    ['Distretto di Lugano','Savosa'],['Distretto di Lugano','Sorengo'],
    ['Distretto di Lugano','Vernate'],['Distretto di Lugano','Vezia'],

    ['Distretto di Mendrisio','Arzo'],['Distretto di Mendrisio','Balerna'],
    ['Distretto di Mendrisio','Besazio'],['Distretto di Mendrisio','Breggia'],
    ['Distretto di Mendrisio','Caneggio'],['Distretto di Mendrisio','Castel San Pietro'],
    ['Distretto di Mendrisio','Chiasso'],['Distretto di Mendrisio','Coldrerio'],
    ['Distretto di Mendrisio','Ligornetto'],['Distretto di Mendrisio','Mendrisio'],
    ['Distretto di Mendrisio','Morbio Inferiore'],['Distretto di Mendrisio','Novazzano'],
    ['Distretto di Mendrisio','Riva San Vitale'],['Distretto di Mendrisio','Stabio'],

    ['Distretto di Riviera','Biasca'],['Distretto di Riviera','Claro'],
    ['Distretto di Riviera','Cresciano'],['Distretto di Riviera','Iragna'],
    ['Distretto di Riviera','Lodrino'],['Distretto di Riviera','Osogna'],

    ['Distretto di Vallemaggia','Avegno Gordevio'],['Distretto di Vallemaggia','Campo (Vallemaggia)'],
    ['Distretto di Vallemaggia','Cerentino'],['Distretto di Vallemaggia','Cevio'],
    ['Distretto di Vallemaggia','Coglio'],['Distretto di Vallemaggia','Croglio'],
    ['Distretto di Vallemaggia','Lavizzara'],['Distretto di Vallemaggia','Linescio'],
    ['Distretto di Vallemaggia','Maggia'],['Distretto di Vallemaggia','Someo'],
  ].map(([bezirk, gemeinde]) => ({ kantonCode: 'TI', kantonName: 'Tessin', bezirk, gemeinde })),

  // ── VD · Waadt ───────────────────────────────────────────────────────────
  ...[
    ['District de la Broye-Vully','Avenches'],['District de la Broye-Vully','Cudrefin'],
    ['District de la Broye-Vully','Estavayer'],['District de la Broye-Vully','Faoug'],
    ['District de la Broye-Vully','Lucens'],['District de la Broye-Vully','Payerne'],

    ['District de Gros-de-Vaud','Echallens'],['District de Gros-de-Vaud','Bioley-Orjulaz'],
    ['District de Gros-de-Vaud','Bottens'],['District de Gros-de-Vaud','Cheseaux-sur-Lausanne'],
    ['District de Gros-de-Vaud','Etagnières'],['District de Gros-de-Vaud','Froideville'],
    ['District de Gros-de-Vaud','Jouxtens-Mézery'],['District de Gros-de-Vaud','Romanel-sur-Lausanne'],

    ['District de Lausanne','Lausanne'],['District de Lausanne','Belmont-sur-Lausanne'],
    ['District de Lausanne','Bussigny'],['District de Lausanne','Chavannes-près-Renens'],
    ['District de Lausanne','Crissier'],['District de Lausanne','Ecublens (VD)'],
    ['District de Lausanne','Epalinges'],['District de Lausanne','Jouxtens-Mézery'],
    ['District de Lausanne','Prilly'],['District de Lausanne','Renens'],
    ['District de Lausanne','Saint-Sulpice (VD)'],

    ['District de Lavaux-Oron','Bourg-en-Lavaux'],['District de Lavaux-Oron','Carrouge (VD)'],
    ['District de Lavaux-Oron','Chexbres'],['District de Lavaux-Oron','Lutry'],
    ['District de Lavaux-Oron','Oron'],['District de Lavaux-Oron','Puidoux'],
    ['District de Lavaux-Oron','Rivaz'],['District de Lavaux-Oron','Savigny'],

    ['District de Morges','Aubonne'],['District de Morges','Echichens'],
    ['District de Morges','Lonay'],['District de Morges','Morges'],
    ['District de Morges','Préverenges'],['District de Morges','Saint-Prex'],
    ['District de Morges','Tolochenaz'],

    ['District de Nyon','Coppet'],['District de Nyon','Gland'],
    ['District de Nyon','Nyon'],['District de Nyon','Prangins'],
    ['District de Nyon','Rolle'],['District de Nyon','Terre-Sainte'],

    ['District de l\'Ouest lausannois','Bussigny'],['District de l\'Ouest lausannois','Chavannes-près-Renens'],
    ['District de l\'Ouest lausannois','Crissier'],['District de l\'Ouest lausannois','Ecublens (VD)'],
    ['District de l\'Ouest lausannois','Renens'],['District de l\'Ouest lausannois','Saint-Sulpice (VD)'],

    ['District du Jura-Nord vaudois','Grandson'],['District du Jura-Nord vaudois','L\'Abbaye'],
    ['District du Jura-Nord vaudois','Orbe'],['District du Jura-Nord vaudois','Romainmôtier-Envy'],
    ['District du Jura-Nord vaudois','Vallorbe'],['District du Jura-Nord vaudois','Yverdon-les-Bains'],

    ['District de la Riviera-Pays-d\'Enhaut','Chateau-d\'Oex'],['District de la Riviera-Pays-d\'Enhaut','Montreux'],
    ['District de la Riviera-Pays-d\'Enhaut','Rougemont'],['District de la Riviera-Pays-d\'Enhaut','Vevey'],
    ['District de la Riviera-Pays-d\'Enhaut','Veytaux'],

    ['District du Chablais','Aigle'],['District du Chablais','Bex'],
    ['District du Chablais','Leysin'],['District du Chablais','Ollon'],
    ['District du Chablais','Rennaz'],['District du Chablais','Roche (VD)'],
    ['District du Chablais','Villeneuve (VD)'],['District du Chablais','Yvorne'],
  ].map(([bezirk, gemeinde]) => ({ kantonCode: 'VD', kantonName: 'Waadt', bezirk, gemeinde })),

  // ── VS · Wallis ──────────────────────────────────────────────────────────
  ...[
    ['Bezirk Brig','Brig-Glis'],['Bezirk Brig','Ried-Brig'],
    ['Bezirk Brig','Simplon'],['Bezirk Brig','Termen'],

    ['Bezirk Entremont','Bovernier'],['Bezirk Entremont','Liddes'],
    ['Bezirk Entremont','Martigny-Combe'],['Bezirk Entremont','Orsières'],
    ['Bezirk Entremont','Sembrancher'],['Bezirk Entremont','Val de Bagnes'],

    ['Bezirk Goms','Bellwald'],['Bezirk Goms','Binn'],
    ['Bezirk Goms','Ernen'],['Bezirk Goms','Fieschertal'],
    ['Bezirk Goms','Grafschaft'],['Bezirk Goms','Münster-Geschinen'],
    ['Bezirk Goms','Niederwald'],['Bezirk Goms','Obergoms'],

    ['Bezirk Hérens','Ayent'],['Bezirk Hérens','Evolène'],
    ['Bezirk Hérens','Hérémence'],['Bezirk Hérens','Mont-Noble'],
    ['Bezirk Hérens','Nax'],['Bezirk Hérens','Saint-Martin (VS)'],
    ['Bezirk Hérens','Vex'],

    ['Bezirk Leuk','Agarn'],['Bezirk Leuk','Albinen'],
    ['Bezirk Leuk','Ergisch'],['Bezirk Leuk','Gampel-Bratsch'],
    ['Bezirk Leuk','Guttet-Feschel'],['Bezirk Leuk','Inden'],
    ['Bezirk Leuk','Leuk'],['Bezirk Leuk','Leukerbad'],
    ['Bezirk Leuk','Salgesch'],['Bezirk Leuk','Turtmann-Unterems'],

    ['Bezirk Martigny','Bovernier'],['Bezirk Martigny','Charrat'],
    ['Bezirk Martigny','Fully'],['Bezirk Martigny','Isérables'],
    ['Bezirk Martigny','Leytron'],['Bezirk Martigny','Martigny'],
    ['Bezirk Martigny','Nendaz'],['Bezirk Martigny','Riddes'],
    ['Bezirk Martigny','Saxon'],['Bezirk Martigny','Trient'],

    ['Bezirk Monthey','Champéry'],['Bezirk Monthey','Collombey-Muraz'],
    ['Bezirk Monthey','Monthey'],['Bezirk Monthey','Port-Valais'],
    ['Bezirk Monthey','Saint-Gingolph'],['Bezirk Monthey','Troistorrents'],
    ['Bezirk Monthey','Val-d\'Illiez'],['Bezirk Monthey','Vouvry'],

    ['Bezirk Raron','Baltschieder'],['Bezirk Raron','Bettmeralp'],
    ['Bezirk Raron','Bürchen'],['Bezirk Raron','Eischoll'],
    ['Bezirk Raron','Lax'],['Bezirk Raron','Mörel-Filet'],
    ['Bezirk Raron','Raron'],['Bezirk Raron','Steg-Hohtenn'],
    ['Bezirk Raron','Unterbäch'],['Bezirk Raron','Visp'],

    ['Bezirk Sierre','Anniviers'],['Bezirk Sierre','Chalais'],
    ['Bezirk Sierre','Chippis'],['Bezirk Sierre','Grône'],
    ['Bezirk Sierre','Icogne'],['Bezirk Sierre','Lens'],
    ['Bezirk Sierre','Miège'],['Bezirk Sierre','Mollens (VS)'],
    ['Bezirk Sierre','Montana'],['Bezirk Sierre','Randogne'],
    ['Bezirk Sierre','Sierre'],['Bezirk Sierre','Venthône'],

    ['Bezirk Sion','Ardon'],['Bezirk Sion','Chamoson'],
    ['Bezirk Sion','Conthey'],['Bezirk Sion','Grimisuat'],
    ['Bezirk Sion','Nendaz'],['Bezirk Sion','Salins'],
    ['Bezirk Sion','Savièse'],['Bezirk Sion','Sion'],
    ['Bezirk Sion','Vétroz'],

    ['Bezirk Visp','Baltschieder'],['Bezirk Visp','Eyholz'],
    ['Bezirk Visp','Lalden'],['Bezirk Visp','Randa'],
    ['Bezirk Visp','Saas-Almagell'],['Bezirk Visp','Saas-Balen'],
    ['Bezirk Visp','Saas-Fee'],['Bezirk Visp','Saas-Grund'],
    ['Bezirk Visp','St. Niklaus'],['Bezirk Visp','Stalden (VS)'],
    ['Bezirk Visp','Staldenried'],['Bezirk Visp','Täsch'],
    ['Bezirk Visp','Törbel'],['Bezirk Visp','Visp'],
    ['Bezirk Visp','Visperterminen'],['Bezirk Visp','Zermatt'],
    ['Bezirk Visp','Zeneggen'],
  ].map(([bezirk, gemeinde]) => ({ kantonCode: 'VS', kantonName: 'Wallis', bezirk, gemeinde })),

  // ── NE · Neuenburg ───────────────────────────────────────────────────────
  ...[
    ['District du Locle','La Brévine'],['District du Locle','La Chaux-du-Milieu'],
    ['District du Locle','Les Brenets'],['District du Locle','Le Locle'],

    ['District de la Chaux-de-Fonds','La Chaux-de-Fonds'],['District de la Chaux-de-Fonds','Les Planchettes'],

    ['District du Val-de-Ruz','Cernier'],['District du Val-de-Ruz','Dombresson'],
    ['District du Val-de-Ruz','Fenin-Vilars-Saules'],['District du Val-de-Ruz','Fontaines (NE)'],
    ['District du Val-de-Ruz','Val-de-Ruz'],

    ['District de Neuchâtel','Auvernier'],['District de Neuchâtel','Bôle'],
    ['District de Neuchâtel','Boudry'],['District de Neuchâtel','Colombier (NE)'],
    ['District de Neuchâtel','Cortaillod'],['District de Neuchâtel','Milvignes'],
    ['District de Neuchâtel','Neuchâtel'],['District de Neuchâtel','Saint-Blaise'],

    ['District du Val-de-Travers','Couvet'],['District du Val-de-Travers','Fleurier'],
    ['District du Val-de-Travers','La Côte-aux-Fées'],['District du Val-de-Travers','Môtiers (NE)'],
    ['District du Val-de-Travers','Noiraigue'],['District du Val-de-Travers','Saint-Sulpice (NE)'],
    ['District du Val-de-Travers','Travers'],['District du Val-de-Travers','Val-de-Travers'],
  ].map(([bezirk, gemeinde]) => ({ kantonCode: 'NE', kantonName: 'Neuenburg', bezirk, gemeinde })),

  // ── GE · Genf ────────────────────────────────────────────────────────────
  ...[
    ['Kanton Genf','Genf'],['Kanton Genf','Aire-la-Ville'],
    ['Kanton Genf','Anières'],['Kanton Genf','Avully'],
    ['Kanton Genf','Avusy'],['Kanton Genf','Bardonnex'],
    ['Kanton Genf','Bellevue'],['Kanton Genf','Bernex'],
    ['Kanton Genf','Carouge'],['Kanton Genf','Cartigny'],
    ['Kanton Genf','Céligny'],['Kanton Genf','Chêne-Bougeries'],
    ['Kanton Genf','Chêne-Bourg'],['Kanton Genf','Chênes-Bougeries'],
    ['Kanton Genf','Choulex'],['Kanton Genf','Collex-Bossy'],
    ['Kanton Genf','Collonge-Bellerive'],['Kanton Genf','Cologny'],
    ['Kanton Genf','Confignon'],['Kanton Genf','Corsier (GE)'],
    ['Kanton Genf','Dardagny'],['Kanton Genf','Genthod'],
    ['Kanton Genf','Grand-Saconnex'],['Kanton Genf','Gy'],
    ['Kanton Genf','Hermance'],['Kanton Genf','Jussy'],
    ['Kanton Genf','Laconnex'],['Kanton Genf','Lancy'],
    ['Kanton Genf','Meinier'],['Kanton Genf','Meyrin'],
    ['Kanton Genf','Onex'],['Kanton Genf','Perly-Certoux'],
    ['Kanton Genf','Plan-les-Ouates'],['Kanton Genf','Pregny-Chambésy'],
    ['Kanton Genf','Presinge'],['Kanton Genf','Puplinge'],
    ['Kanton Genf','Russin'],['Kanton Genf','Satigny'],
    ['Kanton Genf','Soral'],['Kanton Genf','Thônex'],
    ['Kanton Genf','Troinex'],['Kanton Genf','Vandoeuvres'],
    ['Kanton Genf','Vernier'],['Kanton Genf','Versoix'],
    ['Kanton Genf','Veyrier'],
  ].map(([bezirk, gemeinde]) => ({ kantonCode: 'GE', kantonName: 'Genf', bezirk, gemeinde })),

  // ── JU · Jura ────────────────────────────────────────────────────────────
  ...[
    ['Bezirk Ajoie','Alle'],['Bezirk Ajoie','Basse-Allaine'],
    ['Bezirk Ajoie','Beurnevésin'],['Bezirk Ajoie','Boncourt'],
    ['Bezirk Ajoie','Chevenez'],['Bezirk Ajoie','Cœuve'],
    ['Bezirk Ajoie','Courgenay'],['Bezirk Ajoie','Courtemautruy'],
    ['Bezirk Ajoie','Damphreux-Lugnez'],['Bezirk Ajoie','Fahy'],
    ['Bezirk Ajoie','Fontenais'],['Bezirk Ajoie','Grandfontaine'],
    ['Bezirk Ajoie','Haute-Ajoie'],['Bezirk Ajoie','Montignez'],
    ['Bezirk Ajoie','Porrentruy'],['Bezirk Ajoie','Rocourt'],
    ['Bezirk Ajoie','Saint-Dizier-Courcelon'],

    ['Bezirk Delémont','Bassecourt'],['Bezirk Delémont','Boécourt'],
    ['Bezirk Delémont','Bourrignon'],['Bezirk Delémont','Châtillon (JU)'],
    ['Bezirk Delémont','Courfaivre'],['Bezirk Delémont','Courrendlin'],
    ['Bezirk Delémont','Courtételle'],['Bezirk Delémont','Delémont'],
    ['Bezirk Delémont','Develier'],['Bezirk Delémont','Glovelier'],
    ['Bezirk Delémont','Mettembert'],['Bezirk Delémont','Rebeuvelier'],
    ['Bezirk Delémont','Rossemaison'],['Bezirk Delémont','Soyhières'],
    ['Bezirk Delémont','Val Terbi'],

    ['Bezirk Franches-Montagnes','Charmoille'],['Bezirk Franches-Montagnes','Châtelat-Malleray'],
    ['Bezirk Franches-Montagnes','Epauvillers'],['Bezirk Franches-Montagnes','Epiquerez'],
    ['Bezirk Franches-Montagnes','La Ferrière'],['Bezirk Franches-Montagnes','Le Noirmont'],
    ['Bezirk Franches-Montagnes','Les Bois'],['Bezirk Franches-Montagnes','Les Breuleux'],
    ['Bezirk Franches-Montagnes','Les Enfers'],['Bezirk Franches-Montagnes','Les Genevez'],
    ['Bezirk Franches-Montagnes','Montfaucon'],['Bezirk Franches-Montagnes','Muriaux'],
    ['Bezirk Franches-Montagnes','Saignelégier'],['Bezirk Franches-Montagnes','Saint-Brais'],
    ['Bezirk Franches-Montagnes','Soubey'],['Bezirk Franches-Montagnes','Undervelier'],
  ].map(([bezirk, gemeinde]) => ({ kantonCode: 'JU', kantonName: 'Jura', bezirk, gemeinde })),

];

module.exports = swissLocations;
