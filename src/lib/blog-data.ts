export type BlogArtikelData = {
  slug: string;
  titel: string;
  datum: string;
  gewijzigd: string;
  leestijd: number;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  inhoud: string;
};

export const artikelen: BlogArtikelData[] = [
  {
    slug: "beschikbaarheidskalender-vakantiewoning",
    titel: "Beschikbaarheidskalender voor je vakantiewoning: zo pak je het goed aan",
    datum: "2026-03-10",
    gewijzigd: "2026-03-10",
    leestijd: 6,
    excerpt:
      "Wie zijn vakantiewoning op meerdere plekken verhuurt, kent het probleem: je moet overal bijhouden wanneer de woning vrij is. Een papieren agenda of Excel-blad werkt in het begin, maar al snel loop je tegen de grenzen aan.",
    metaTitle: "Beschikbaarheidskalender vakantiewoning: praktische gids",
    metaDescription:
      "Hoe beheer je de beschikbaarheid van je vakantiewoning digitaal? Praktische gids voor verhuurders die dubbele boekingen willen vermijden.",
    inhoud: `
<h2>Waarom een goede beschikbaarheidskalender het verschil maakt</h2>
<p>Wie zijn vakantiewoning op meerdere plekken verhuurt, kent het probleem: je moet overal bijhouden wanneer de woning vrij is. Een papieren agenda of Excel-blad werkt in het begin, maar al snel loop je tegen de grenzen aan. Je mist een boeking, je geeft iemand per ongeluk twee keer dezelfde week, of je ziet zelf niet meer hoe de zomer eruitziet.</p>
<p>Een digitale beschikbaarheidskalender lost dat op. Niet door het werk te automatiseren, want een groot deel blijft handwerk, maar door alles op één plek samen te brengen en altijd inzichtelijk te houden.</p>

<h2>Wat gaat er fout met papier en Excel</h2>
<p>Een schrift of een papieren agenda heeft één groot voordeel: iedereen begrijpt het. Maar het stopt daar ook. Je kunt het niet delen met een partner die ook boekingen opneemt. Je kunt het niet raadplegen op je gsm als je op pad bent. En als je de woning op drie platformen aanbiedt, houd je drie lijstjes bij die snel niet meer overeenkomen.</p>
<p>Excel gaat een stap verder. Je kunt een eigen overzicht maken per maand, kleuren toekennen, en het bestand delen via Google Drive. Voor één woning en één verhuurder werkt dat redelijk. Zodra er een tweede persoon meekijkt, of zodra je wilt synchroniseren met Airbnb, loopt het mis. Excel is niet gemaakt voor realtime samenwerking en zeker niet voor integratie met externe platforms.</p>
<p>De meest voorkomende gevolgen zijn dubbele boekingen (twee gasten op hetzelfde moment), het vergeten van opruimperiodes tussen verblijven, en gasten die een datum vragen waarvoor je geen onmiddellijk antwoord kunt geven omdat je agenda niet bij de hand is.</p>

<h2>Wat een digitale kalender wél biedt</h2>
<p>Een goede beschikbaarheidskalender voor je vakantiewoning doet een paar dingen goed:</p>
<ul>
  <li><strong>Overzicht per maand of week.</strong> Je ziet in één oogopslag wanneer de woning bezet is, wanneer er een optie loopt, en wanneer ze vrij is.</li>
  <li><strong>Toegang via telefoon en computer.</strong> Je kunt meteen antwoorden op vragen van geïnteresseerde gasten, ook als je niet achter je bureau zit.</li>
  <li><strong>Notities per boeking.</strong> Aankomsttijd, sleutelafspraak, bijzonderheden van de gast. Alles op één plek, zichtbaar zodra je de periode opent.</li>
  <li><strong>iCal-synchronisatie.</strong> Je kalender exporteert een iCal-link die externe platformen automatisch uitlezen. Zo is je beschikbaarheid op Airbnb, Booking.com en je eigen website tegelijk up-to-date.</li>
  <li><strong>Embed op je eigen website.</strong> Bezoekers van je website zien onmiddellijk welke periodes vrij zijn, zonder dat jij er iets voor moet doen.</li>
</ul>

<h2>Hoe je een beschikbaarheidskalender opzet</h2>
<p>Begin simpel. Je hebt geen uitgebreid systeem nodig om te starten. Een gratis tool zoals Verhuurplanner laat je binnen een paar minuten een kalender aanmaken voor je woning. Je geeft de kalender een naam, vult je eerste boekingen in, en je hebt onmiddellijk een overzicht.</p>
<p>Ga dan na welke platformen je gebruikt. Als je op Airbnb en Booking.com staat, zijn dat twee extra plaatsen waar je beschikbaarheid beheerd wordt. Door de iCal-link van je kalender in te stellen als exportfeed, hoef je wijzigingen maar op één plek door te voeren. De platformen halen de update automatisch op.</p>
<p>Zet daarna de embed in op je eigen website als je er één hebt. Gasten die rechtstreeks bij je informeren, zien zo meteen wat er vrij is. Dat spaart heen-en-weermails.</p>

<h2>Welke informatie houd je bij</h2>
<p>Wat je minimaal per boeking bijhoudt:</p>
<ul>
  <li>Naam van de gast</li>
  <li>Aankomst- en vertrekdatum</li>
  <li>Aantal personen</li>
  <li>Afgesproken prijs of verwijzing naar je offerte</li>
  <li>Betalingsstatus</li>
</ul>
<p>Afhankelijk van hoe je werkt, kun je ook aankomsttijd, sleutelinstructies of bijzondere afspraken toevoegen. Hoe meer je hier invult, hoe minder je in andere notities of aparte documenten hoeft te zoeken.</p>

<h2>Overstappen van een bestaand systeem</h2>
<p>Als je al een tijdje werkt met Excel of een ander systeem, hoef je niet alles in één keer over te zetten. Zet eerst de toekomstige boekingen in je nieuwe kalender. De historische boekingen blijven waar ze zijn; die heb je zelden nog nodig voor de dagelijkse werking.</p>
<p>Zorg dat de mensen die meekijken, ook de nieuwe tool kennen en kunnen gebruiken. Dat is vaak de grootste drempel bij een overstap: niet de technologie, maar de gewoonte.</p>

<h2>Veelgemaakte fouten bij het beheer van beschikbaarheid</h2>
<p>De meest gemaakte fout is het achteraf bijwerken. Je spreekt iets af via de telefoon, je zegt "ik schrijf dat zo in", en dan vergeet je het. Beter is om de kalender bij te houden terwijl je de gast spreekt, of meteen daarna.</p>
<p>Een tweede valkuil is het vergeten van tussendagen. Als de ene gast vertrekt op zondag en de volgende aankomt op maandag, heb je tussendoor schoonmaak nodig. Als je die dag niet blokkeert in je kalender, boek je per ongeluk iemand in terwijl je woning nog niet klaar is.</p>
<p>Zorg ook dat je bij het instellen van iCal-synchronisatie regelmatig controleert of de koppeling nog werkt. Platformen veranderen soms hun instellingen, waardoor een feed niet meer wordt gelezen. Dat merk je dan pas als er een dubbele boeking is.</p>

<h2>Aan de slag</h2>
<p>Een goede beschikbaarheidskalender kost je geen uren om op te zetten. Kies een tool die werkt op telefoon en computer, die iCal ondersteunt, en die het beschikbaarheidsrooster op je website kan tonen. Verhuurplanner is gratis voor één woning en werkt zonder technische kennis. Je maakt een account aan, vult je eerste boeking in, en je kalender staat klaar.</p>
<p>Gedetailleerd plannen begint met een goed overzicht. En dat overzicht begint met een beschikbaarheidskalender die je altijd en overal raadpleegt.</p>
    `,
  },
  {
    slug: "ical-synchronisatie-airbnb-booking",
    titel: "iCal synchronisatie met Airbnb en Booking.com: zo werkt het",
    datum: "2026-03-17",
    gewijzigd: "2026-03-17",
    leestijd: 7,
    excerpt:
      "Je vakantiewoning staat op Airbnb en Booking.com. Prima, meer bereik. Maar nu zijn er twee kalenders die je bij moet houden, en de kans op dubbele boekingen groeit met elke dag dat je vergeet een platform bij te werken. iCal synchronisatie lost dat op.",
    metaTitle: "iCal synchronisatie Airbnb Booking.com: stap-voor-stap uitleg",
    metaDescription:
      "Hoe synchroniseer je je vakantiewoning kalender met Airbnb en Booking.com via iCal? Stap-voor-stap uitleg en tips om dubbele boekingen te vermijden.",
    inhoud: `
<h2>Wat is iCal?</h2>
<p>Je vakantiewoning staat op Airbnb en Booking.com. Prima, meer bereik. Maar nu zijn er twee kalenders die je bij moet houden, en de kans op dubbele boekingen groeit met elke dag dat je vergeet een platform bij te werken. iCal synchronisatie lost dat op.</p>
<p>iCal (ook geschreven als iCalendar of .ics) is een standaardformaat voor kalendergegevens. Het bestaat al jaren en wordt gebruikt door Google Agenda, Apple Kalender, Outlook en nagenoeg alle boekingsplatformen. De bedoeling is eenvoudig: een agenda-applicatie publiceert zijn inhoud als een URL. Elke andere applicatie die die URL kent, kan de gegevens uitlezen en in de eigen kalender tonen.</p>
<p>Voor vakantieverhuurders betekent dat: je bezettingskalender van Airbnb is beschikbaar als iCal-link. Die link geef je aan Booking.com, zodat Booking.com automatisch weet welke datums bezet zijn. En omgekeerd. Zo hoef je maar op één plek een boeking in te voeren, en de rest past zich automatisch aan.</p>

<h2>Hoe werkt iCal synchronisatie in de praktijk</h2>
<p>Het principe is een feed: een URL die kalenderinformatie bevat in iCal-formaat. Die feed wordt regelmatig opgehaald door het platform dat hem heeft ingesteld als abonnement. "Regelmatig" betekent in de meeste gevallen elke 15 minuten tot enkele uren, afhankelijk van het platform.</p>
<p>Dat is een belangrijk detail. iCal synchronisatie is niet realtime. Als iemand om 10u een periode blokkeert op Airbnb, weet Booking.com dat pas als de volgende synchronisatiecyclus plaatsvindt. In de praktijk valt dat mee, maar bij heel populaire periodes kan het toch misgaan. Houd daar rekening mee.</p>
<p>De synchronisatie werkt in twee richtingen als je dat goed instelt:</p>
<ul>
  <li><strong>Export:</strong> jouw kalender deelt bezettingsdata via een URL die anderen kunnen inladen.</li>
  <li><strong>Import:</strong> jouw kalender laadt de bezettingsdata van een extern platform in, zodat je in één overzicht alles ziet.</li>
</ul>

<h2>iCal instellen op Airbnb</h2>
<p>Op Airbnb vind je de iCal-instellingen in je account onder "Agenda", daarna "Beschikbaarheid" en vervolgens "Synchroniseer kalenders". Hier zie je twee opties:</p>
<ol>
  <li><strong>Exporteren:</strong> Airbnb toont een URL die je kunt kopiëren en aan andere platforms of apps kunt doorgeven.</li>
  <li><strong>Importeren:</strong> Je geeft een externe iCal-URL op. Airbnb haalt die periodiek op en blokkeert de bezette periodes in je kalender.</li>
</ol>
<p>Kopieer de export-URL van Airbnb. Die heb je nodig om in Booking.com (of in Verhuurplanner) in te stellen.</p>

<h2>iCal instellen op Booking.com</h2>
<p>Op Booking.com ga je naar "Accommodatiepagina", vervolgens naar "Tarieven en beschikbaarheid" en dan "Beschikbaarheid". Hier vind je de optie om een iCal-link te exporteren (vanuit Booking.com) en een externe kalender te importeren.</p>
<p>Plak de Airbnb export-URL in het importveld van Booking.com. Booking.com leest de Airbnb-boekingen in en blokkeert die datums automatisch in je Booking.com kalender.</p>
<p>Doe dan hetzelfde in omgekeerde richting: kopieer de Booking.com export-URL en importeer die in Airbnb.</p>

<h2>iCal koppelen aan een centrale kalender</h2>
<p>Met twee platforms werkt de directe koppeling nog overzichtelijk. Zodra je op drie of meer platformen staat, of een eigen website hebt, wordt het al snel onoverzichtelijk. Een centrale kalender lost dat op.</p>
<p>Met Verhuurplanner maak je een centrale kalender aan voor je woning. Je importeert de iCal-feeds van alle platforms (Airbnb, Booking.com, Homeaway, ...) in die centrale kalender. Die centrale kalender geeft op zijn beurt een eigen iCal-URL terug, die je dan aan alle platforms doorgeeft als import.</p>
<p>Zo werkt het:</p>
<ol>
  <li>Verhuurplanner importeert Airbnb-boekingen en Booking.com-boekingen</li>
  <li>Verhuurplanner toont alle boekingen samen in één overzicht</li>
  <li>Verhuurplanner exporteert een gecombineerde iCal-URL</li>
  <li>Elk platform importeert die URL en weet zo de volledige bezetting</li>
</ol>

<h2>Veelgemaakte fouten bij iCal synchronisatie</h2>
<p><strong>De synchronisatie niet regelmatig controleren.</strong> iCal-feeds kunnen stuk gaan als een platform zijn URL-structuur wijzigt of als er een login-probleem is. Controleer je maandelijks even of de feeds nog werken door te testen met een recente boeking.</p>
<p><strong>Beide richtingen niet instellen.</strong> Het instellen van alleen een export of alleen een import is geen synchronisatie. Je moet beide kanten instellen om dubbele boekingen echt te vermijden.</p>
<p><strong>Rekening houden met vertraging.</strong> iCal is niet realtime. Bij de paasvakantie of andere topperiodes bestaat de kans op een dubbele boeking in het korte venster tussen twee synchronisatiecycli. Sommige verhuurders houden dan een handmatige controle bij, zeker in de eerste dagen na opening van een populaire periode.</p>
<p><strong>Blokkeerperiodes vergeten.</strong> Als je een week zelf in de woning verblijft of een schoonmaakperiode wilt inplannen, moet je die ook als bezet markeren. Anders blijven die periodes zichtbaar als beschikbaar op alle platformen.</p>

<h2>iCal en andere agenda-apps</h2>
<p>Naast de boekingsplatformen kun je de iCal-feed van je kalender ook koppelen aan Google Agenda, Apple Kalender of Outlook. Zo heb je je verhuurkalender geïntegreerd in de agenda die je toch al gebruikt. Handig als je op een mobiel apparaat snel wilt zien of een bepaalde week vrij is.</p>
<p>In Google Agenda voeg je een "Andere agenda" toe via URL. In Apple Kalender gebruik je "Abonneren op kalender". In Outlook kies je "Agenda toevoegen" en vervolgens "Via internet".</p>

<h2>Samenvatting: wat je nodig hebt</h2>
<ul>
  <li>De iCal export-URL van elk platform waarop je adverteert</li>
  <li>De iCal import-instelling op elk platform, ingevuld met de URL's van de andere platforms</li>
  <li>Of: een centrale kalender (zoals Verhuurplanner) die alle feeds samenvoegt en één gecombineerde URL aanlevert</li>
  <li>Een vaste controle elke maand of alle feeds nog werken</li>
</ul>
<p>iCal synchronisatie is geen perfecte oplossing voor elke situatie, maar het is verreweg de eenvoudigste manier om beschikbaarheid op meerdere platformen bij te houden zonder alles handmatig bij te werken.</p>
    `,
  },
  {
    slug: "beschikbaarheid-tonen-eigen-website",
    titel: "Beschikbaarheid van je vakantiewoning tonen op je eigen website",
    datum: "2026-03-24",
    gewijzigd: "2026-03-24",
    leestijd: 5,
    excerpt:
      "Gasten die direct bij jou informeren, zijn de meest waardevolle gasten. Ze bellen of mailen omdat ze je woning al kennen, ze vragen naar een specifieke periode, en als je snel en duidelijk kunt antwoorden, boeken ze. Een beschikbaarheidskalender op je eigen website maakt dat proces een stuk vlotter.",
    metaTitle: "Beschikbaarheid tonen op je eigen website vakantiewoning: complete uitleg",
    metaDescription:
      "Hoe toon je de beschikbaarheid van je vakantiewoning op je eigen website? Embed-code uitleg en de voordelen van directe boekingen.",
    inhoud: `
<h2>Waarom beschikbaarheid op je eigen website</h2>
<p>Gasten die direct bij jou informeren, zijn de meest waardevolle gasten. Ze bellen of mailen omdat ze je woning al kennen, ze vragen naar een specifieke periode, en als je snel en duidelijk kunt antwoorden, boeken ze. Een beschikbaarheidskalender op je eigen website maakt dat proces een stuk vlotter.</p>
<p>Als je alleen op Airbnb of Booking.com staat, betaal je voor elke boeking een commissie. Op je eigen website betaal je die commissie niet. Directe boekingen zijn dus goedkoper voor jou en soms ook voor de gast, als je bereid bent dat voordeel te delen.</p>
<p>Maar er is een praktisch obstakel: gasten willen weten of de woning vrij is voor hun gewenste periode, voordat ze je contacteren. Als ze op je website moeten raden wat er beschikbaar is, haken veel mensen af en gaan ze naar een platform dat die informatie wel toont.</p>

<h2>Hoe een embed-kalender werkt</h2>
<p>Een embed-kalender is een stukje code dat je op je website plaatst. Dat code-stukje laadt een iframe in, een venster binnen je website dat de inhoud van een externe bron toont. In dit geval je beschikbaarheidskalender.</p>
<p>De kalender die getoond wordt, is de publieke weergave van je Verhuurplanner-kalender. Die toont bezet, vrij en optie, maar geen namen of notities. Bezoekers van je website zien precies wat beschikbaar is, en niets meer.</p>
<p>Zodra je in Verhuurplanner een boeking aanpast, is die wijziging onmiddellijk zichtbaar op je website. Je hoeft daar niets extra voor te doen.</p>

<h2>Hoe je de embed instelt</h2>
<p>In Verhuurplanner ga je naar de instellingen van je kalender. Onder het tabblad "Embed" vind je een codefragment dat er zo uitziet:</p>
<pre><code>&lt;iframe src="https://app.verhuurplanner.be/embed/[jouw-kalender-id]" width="100%" height="480" frameborder="0"&gt;&lt;/iframe&gt;</code></pre>
<p>Dat codefragment kopieer je en plak je op de pagina van je website waar je de beschikbaarheid wilt tonen. Hoe je dat precies doet, hangt af van de tool die je gebruikt om je website te beheren:</p>
<ul>
  <li><strong>WordPress:</strong> Voeg een HTML-blok toe in de pagina-editor en plak de code daarin.</li>
  <li><strong>Wix:</strong> Gebruik het element "HTML insluiten" of "Embed-code" en plak de code in het vak.</li>
  <li><strong>Squarespace:</strong> Voeg een "Code"-blok toe aan je pagina.</li>
  <li><strong>Webflow:</strong> Gebruik het "Embed"-element in de editor.</li>
  <li><strong>Statische HTML:</strong> Plak de code direct in je HTML-bestand op de plek waar je de kalender wilt.</li>
</ul>

<h2>Waar zet je de kalender op je website</h2>
<p>De meest logische plek is de pagina van de woning zelf, of een aparte pagina "Beschikbaarheid" of "Kalender". Gasten die je website bezoeken, gaan op zoek naar foto's, beschrijving en beschikbaarheid. Als die drie zaken duidelijk aanwezig zijn, hebben ze alles wat ze nodig hebben om je te contacteren.</p>
<p>Overweeg ook om de kalender te plaatsen naast je contactformulier of je telefoonnummer. Zo kan een geïnteresseerde gast de beschikbaarheid checken en meteen contact opnemen op dezelfde pagina.</p>

<h2>De voordelen op een rij</h2>
<p>Een beschikbaarheidskalender op je eigen website heeft een aantal concrete voordelen ten opzichte van alleen vertrouwen op externe platformen:</p>
<ul>
  <li><strong>Geen commissie.</strong> Elke directe boeking levert je meer op dan een boeking via Airbnb of Booking.com.</li>
  <li><strong>Direct contact.</strong> Je communiceert rechtstreeks met je gast, zonder tussenkomst van een platform.</li>
  <li><strong>Minder heen-en-weermails.</strong> Gasten kunnen zelf zien wat vrij is, zonder te moeten vragen. Dat schept verwachting en spaart tijd.</li>
  <li><strong>Professionele uitstraling.</strong> Een website met actuele beschikbaarheid ziet er veel professioneler uit dan een website waar gasten in het donker tasten.</li>
  <li><strong>Geen platformrisico.</strong> Platformen kunnen beslissingen nemen die jouw verhuuractiviteit beïnvloeden: hogere commissies, gewijzigde regels, of tijdelijke opschorting. Een eigen website met directe boekingen geeft je meer controle.</li>
</ul>

<h2>Wat gasten zien</h2>
<p>De publieke kalender toont drie statussen: bezet (rood), optie (geel) en vrij (groen). Gastennamen en notities zijn nooit zichtbaar voor bezoekers. Zo bescherm je de privacy van je gasten en geef je tegelijk een duidelijk beeld van de beschikbaarheid.</p>
<p>De kalender past zich automatisch aan aan de schermgrootte. Op een telefoon is hij even overzichtelijk als op een computer.</p>

<h2>Combineren met iCal</h2>
<p>Als je beschikbaarheid ook gesynced is met Airbnb en Booking.com via iCal, dan is de embed-kalender op je website altijd in sync met de rest. Een boeking via Airbnb blokkeert automatisch de periode in je centrale kalender, en die geblokkeerde periode is meteen zichtbaar op je website. Je hoeft niets manueel bij te werken.</p>

<h2>Aan de slag</h2>
<p>Verhuurplanner biedt de embed-functie aan in het gratis plan. Je maakt een account aan, vult je kalender in, en kopieert de embed-code naar je website. Klaar. Je website toont beschikbaarheid en je gasten weten meteen wat er vrij is.</p>
    `,
  },
  {
    slug: "vakantiewoning-verhuren-belgie-tips",
    titel: "Vakantiewoning verhuren in België: praktische tips voor verhuurders",
    datum: "2026-04-01",
    gewijzigd: "2026-04-01",
    leestijd: 8,
    excerpt:
      "Een vakantiewoning verhuren in België klinkt eenvoudig. Je hebt een mooie woning, je zet hem op Airbnb, en de gasten komen vanzelf. Zo werkt het in de praktijk niet helemaal. Hier zijn de dingen die elke verhuurder vroeg of laat tegenkomt.",
    metaTitle: "Vakantiewoning verhuren België: praktische tips voor verhuurders",
    metaDescription:
      "Praktische tips voor wie zijn vakantiewoning in België verhuurt. Administratie, communicatie met gasten, beschikbaarheid beheren en handige tools.",
    inhoud: `
<h2>Starten met verhuren</h2>
<p>Een vakantiewoning verhuren in België klinkt eenvoudig. Je hebt een mooie woning, je zet hem op Airbnb, en de gasten komen vanzelf. Zo werkt het in de praktijk niet helemaal. Er zijn meer aspecten om rekening mee te houden: administratie, communicatie, onderhoud, prijszetting en beschikbaarheidsbeheer. Wie dat goed aanpakt, heeft minder stress en meer tevreden gasten.</p>

<h2>Administratie en regelgeving</h2>
<p>In België zijn de regels voor vakantieverhuur regionaal geregeld. Vlaanderen, Wallonië en Brussel hebben elk hun eigen wetgeving. Het is verstandig om bij te houden wat in jouw regio van toepassing is.</p>
<p>In Vlaanderen kun je je woning registreren als toeristische logies. Dat is niet altijd verplicht, maar het geeft je woning een officieel kader en kan bijdragen aan het vertrouwen van gasten. Kijk op de website van Toerisme Vlaanderen voor de actuele voorwaarden.</p>
<p>Voor de inkomsten uit verhuur gelden belastingregels. Inkomsten uit privéverhuur aan particulieren worden in België belast op basis van het kadastraal inkomen, niet op de werkelijke huurinkomsten, mits je de woning niet professioneel verhuurt. Bij professionele verhuur (regelmatig, meerdere woningen, hoge inkomsten) kan de fiscus dit anders beoordelen. Laat je bij twijfel adviseren door een boekhouder.</p>
<p>Vergeet ook de toeristenbelasting niet. Veel Belgische gemeenten heffen een verblijfstaks per nacht per persoon. Vaak regelt Airbnb dat voor je, maar bij directe verhuur moet je die zelf innen en afdragen.</p>

<h2>Je woning op de markt zetten</h2>
<p>Goede foto's zijn het allerbelangrijkste bij het adverteren van een vakantiewoning. Mensen beslissen op basis van beelden. Investeer in een fotosessie op een zonnige dag, of maak zelf foto's met een brede hoek en goede belichting. Toon de slaapkamers, badkamer, keuken, woonkamer en de tuin of terras.</p>
<p>Schrijf een beschrijving die de sfeer van de woning overbrengt. Vertel wat er in de buurt te doen is, hoe ver het is tot de dichtstbijzijnde supermarkt, wat je er als gast kunt doen op een regenachtige dag. Concrete, eerlijke informatie werkt beter dan een lijst met superlatieven.</p>
<p>Zet je woning op meerdere platformen: Airbnb, Booking.com en eventueel een Belgisch platform zoals Vakantiewoningen-in-belgie.be. Meer zichtbaarheid vergroot je kans op voldoende boekingen, zeker in de beginfase.</p>

<h2>Communicatie met gasten</h2>
<p>Snelle reactie op aanvragen maakt een groot verschil. Gasten die op meerdere plekken zoeken, kiezen voor de verhuurder die het snelst reageert en duidelijk communiceert. Streef naar een reactietijd van minder dan twee uur tijdens kantooruren.</p>
<p>Stuur een bevestiging zodra een boeking definitief is. Zet daarin: aankomstdatum en -tijd, vertrekdatum, sleutelinstructies, je telefoonnummer voor noodgevallen, en huisregels. Stuur een week voor aankomst een herinnering met praktische info: parkeermogelijkheden, dichtstbijzijnde winkel, hoe de verwarming werkt.</p>
<p>Na het verblijf is een kort bedankberichtje en een vraag om een beoordeling achter te laten een goede gewoonte. Beoordelingen zijn goud waard op platformen als Airbnb.</p>

<h2>Prijszetting</h2>
<p>Stel je prijzen in op basis van het seizoen. Zomer en schoolvakanties rechtvaardigen een hogere prijs. Tussenseizoenen en week-periodes zijn vaak minder gewild en vragen een lagere prijs of een kortingsstimulans. Kijk ook naar wat vergelijkbare woningen in jouw regio vragen.</p>
<p>Overweeg een minimale verblijfsduur in te stellen. Een minimum van twee of drie nachten vermijdt veel administratie voor korte verblijven die relatief weinig opbrengen maar evenveel werk geven als een week.</p>
<p>Last-minute kortingen kunnen ook werken. Als een week nog niet geboekt is en de vertrekdatum nadert, kun je de prijs verlagen om toch bezetting te krijgen. Doe dat wel met beleid: te veel last-minute kortingen ondermijnen je normale tarief.</p>

<h2>Beschikbaarheidsbeheer</h2>
<p>Een van de meest onderschatte aspecten van vakantieverhuur is het bijhouden van beschikbaarheid. Als je op meerdere platformen staat, loop je het risico op dubbele boekingen als je dit niet goed organiseert.</p>
<p>Gebruik een centrale kalender om alle boekingen bij te houden, ongeacht van welk platform ze komen. Synchroniseer die kalender met alle platformen via iCal. Zo wordt een boeking op Airbnb automatisch gereflecteerd op Booking.com en omgekeerd.</p>
<p>Blokkeer ook de schoonmaakdagen tussen gasten. Als een gast op zondag vertrekt en de volgende op maandag aankomt, heb je tussendoor tijd nodig voor schoonmaak en voorbereiding. Als die dag niet geblokkeerd staat in je kalender, kan er een boeking op worden gemaakt.</p>

<h2>Schoonmaak en onderhoud</h2>
<p>Schoonmaak is het aspect dat het meest invloed heeft op beoordelingen. Gasten verwachten een propere woning, en als dat niet het geval is, schrijven ze het op.</p>
<p>Als je zelf schoonmaakt, plan dat dan direct na het vertrek van de gasten in. Als je een schoonmaakbedrijf inschakelt, zorg dan dat zij precies weten hoe laat de vorige gast vertrekt en hoe laat de volgende aankomt. De marge daartussen is soms smal.</p>
<p>Doe ook regelmatig een onderhoudsinspectie: controleer of alles werkt, vul verbruiksartikelen aan (zeep, toiletpapier, afwasmiddel) en kijk of er kleine reparaties nodig zijn. Kleine problemen groeien snel tot grotere klachten als je ze niet tijdig aanpakt.</p>

<h2>Tools die helpen</h2>
<p>Een beschikbaarheidskalender is het meest basale hulpmiddel. Verhuurplanner geeft je een overzicht van alle boekingen in één kalender, met iCal-synchronisatie voor externe platformen en een embed-functie voor je eigen website.</p>
<p>Voor communicatie helpt het om vaste templates te hebben voor de meest voorkomende berichten: boekingsbevestiging, aankomstinfo, vertrekinstructies, bedankbericht. Dat spaart tijd en zorgt voor een consistente ervaring voor je gasten.</p>
<p>Voor je boekhouding kun je met een eenvoudig overzicht in Excel of een boekhoudprogramma al ver komen. Noteer per boeking: de inkomsten, de schoonmaakkosten, en eventuele andere kosten. Dat maakt het aangifte doen een stuk eenvoudiger.</p>

<h2>Wat de meeste verhuurders niet verwachten</h2>
<p>Verhuren kost meer tijd dan je denkt. Niet enkel de schoonmaak en de communicatie, maar ook het bijhouden van de kalender, het beheren van de profielen op platformen, het beantwoorden van vragen en het uitvoeren van kleine reparaties. Reken op een paar uur per week in het seizoen, meer bij drukke periodes.</p>
<p>Gasten zijn over het algemeen vriendelijk en respectvol. Maar soms is er schade, gaan er dingen stuk, of klagen gasten over iets wat je niet verwachtte. Zorg dat je daarvoor gedekt bent: controleer je verzekering of je vakantieverhuur dekt, en leg de huisregels duidelijk vast in de boekingsbevestiging.</p>
<p>Tot slot: vraag andere verhuurders om advies. Belgische verhuurdersgemeenschappen op Facebook of fora zijn een goede bron van praktische tips van mensen die de situatie in jouw regio kennen.</p>
    `,
  },
  {
    slug: "dubbele-boekingen-vermijden",
    titel: "Dubbele boekingen vermijden als je op meerdere platforms verhuurt",
    datum: "2026-04-10",
    gewijzigd: "2026-04-10",
    leestijd: 6,
    excerpt:
      "Een dubbele boeking is een verhuurder zijn nachtmerrie. Twee gasten die op hetzelfde moment aanspraak maken op dezelfde woning. Het gevolg: een teleurgesteld gezin dat ergens anders onderdak moet zoeken, en jij met een probleem dat moeilijk goed te praten is. Gelukkig zijn dubbele boekingen vermijdbaar.",
    metaTitle: "Dubbele boekingen vermijden vakantiewoning: praktische checklist",
    metaDescription:
      "Hoe vermijd je dubbele boekingen als je je vakantiewoning op meerdere platforms verhuurt? iCal sync, kalenderbeheer en een praktische checklist.",
    inhoud: `
<h2>Wat een dubbele boeking precies is</h2>
<p>Een dubbele boeking is een verhuurder zijn nachtmerrie. Twee gasten die op hetzelfde moment aanspraak maken op dezelfde woning. Het gevolg: een teleurgesteld gezin dat ergens anders onderdak moet zoeken, en jij met een probleem dat moeilijk goed te praten is. Platformen als Airbnb sanctioneren het, je reputatie lijdt eronder, en de gast is begrijpelijkerwijs woedend.</p>
<p>Dubbele boekingen gebeuren niet enkel door nalatigheid. Soms werkt een synchronisatie niet goed, soms reageer je op twee aanvragen tegelijk, soms zit er een vertraging in een kalenderupdate. Het is een systeemsprobleem net zo goed als een menselijk probleem.</p>

<h2>Hoe dubbele boekingen ontstaan</h2>
<p>De meest voorkomende oorzaken:</p>
<ul>
  <li><strong>Twee platforms open tegelijk, zonder synchronisatie.</strong> Je staat op Airbnb en Booking.com, maar de kalenders staan niet gekoppeld. Een gast boekt via Airbnb voor een week die al geboekt staat via Booking.com, of omgekeerd.</li>
  <li><strong>Vertraging in iCal-synchronisatie.</strong> iCal-feeds worden niet realtime bijgewerkt. Er zit een vertraging van tot soms een paar uur in. In drukke periodes kan een tweede boeking binnenkomen net voor de eerste is doorgesynchroniseerd.</li>
  <li><strong>Handmatige invoerfouten.</strong> Je bevestigt een boeking via telefoon en vergeet die in te voeren in je kalender. Later bevestig je via een platform een tweede boeking voor dezelfde periode.</li>
  <li><strong>Kalender niet geblokkeerd na annulatie.</strong> Een gast annuleert, maar de periode blijft per ongeluk geblokkeerd op het andere platform.</li>
  <li><strong>Schoonmaak- of onderhoudsdagen niet ingepland.</strong> Je vergeet de tussendag te blokkeren, en een gast boekt aan op de dag dat je schoonmaak hebt.</li>
</ul>

<h2>iCal synchronisatie als eerste verdedigingslinie</h2>
<p>De meest effectieve maatregel is een goede iCal-synchronisatie. Elk platform dat je gebruikt, ondersteunt het importeren en exporteren van iCal-feeds. Door de feeds onderling te koppelen of via een centrale kalender samen te brengen, worden boekingen op één platform automatisch geblokkeerd op alle andere.</p>
<p>Stel dit in als volgt:</p>
<ol>
  <li>Exporteer de iCal-URL van elk platform (Airbnb, Booking.com, enz.).</li>
  <li>Importeer elke URL in een centrale kalender, zoals Verhuurplanner.</li>
  <li>Exporteer de gecombineerde URL van Verhuurplanner.</li>
  <li>Importeer die gecombineerde URL in elk platform.</li>
</ol>
<p>Zo heeft elk platform een volledig beeld van alle boekingen, ongeacht op welk platform ze zijn gemaakt.</p>

<h2>Centrale kalender als coördinatiepunt</h2>
<p>Een centrale kalender is meer dan een technische koppeling. Het is je enige bron van waarheid. Alle boekingen, van elk platform en via directe contacten, komen samen in één overzicht. Zodra je een directe boeking bevestigt via telefoon of e-mail, voer je die meteen in de centrale kalender in. Zo blokkeert die periode automatisch op alle platformen.</p>
<p>Verhuurplanner doet precies dat: je voert alle boekingen handmatig of via iCal-import in, en exporteert een gecombineerde feed naar alle platformen. Het systeem geeft je altijd een volledig beeld van wat bezet en wat vrij is.</p>

<h2>Directe boekingen goed documenteren</h2>
<p>Directe boekingen, via telefoon, WhatsApp of e-mail, zijn de meest kwetsbare categorie. Ze lopen buiten de platformen om en worden dus niet automatisch gesynchroniseerd.</p>
<p>Maak het een gewoonte om elke mondeling of schriftelijk gemaakte afspraak onmiddellijk in te voeren in je kalender, nog voor je het gesprek of de mail afsluit. Niet "dadelijk", niet "straks", maar meteen. Dat klinkt overdreven, maar een vertraging van een uur is al genoeg om een tweede aanvraag voor dezelfde periode te bevestigen.</p>
<p>Zet ook altijd een schriftelijke bevestiging sturen naar directe gasten. Zo heb jij en de gast beiden bewijs van de afspraken.</p>

<h2>Geblokkeerde periodes goed beheren</h2>
<p>Blokkeer niet alleen boekingen, maar ook:</p>
<ul>
  <li><strong>Schoonmaakdagen.</strong> Als gasten op zondag vertrekken en de volgende pas op dinsdag aankomt, blokkeer dan ook maandag.</li>
  <li><strong>Eigen gebruik.</strong> Als jij of familie de woning gebruikt, zet die periode ook als bezet in de kalender.</li>
  <li><strong>Onderhoud en renovatie.</strong> Als je schilder- of reparatiewerk plant, blokkeer die weken tijdig.</li>
</ul>
<p>Een periode die in de kalender vrij staat, is een potentiële boeking. Als je niet wilt dat die periode geboekt wordt, moet je hem blokkeren.</p>

<h2>Wat doen bij een dubbele boeking</h2>
<p>Soms gaat het toch mis. Wat dan?</p>
<p>Contacteer meteen de gast die je niet kunt ontvangen. Doe dat persoonlijk, via telefoon als het kan. Leg uit wat er is misgegaan, bied je excuses aan, en probeer een oplossing voor te stellen. Een alternatieve woning in de buurt (via kennissen of andere platformen), een korting op een andere datum, of een volledige terugbetaling zijn gebruikelijke opties.</p>
<p>Geef de gast die je niet kunt ontvangen altijd voorrang op terugbetaling. Die persoon heeft niets fout gedaan en moet de dupe zijn van jouw fout. Snel en royaal handelen is de enige manier om de schade aan je reputatie te beperken.</p>
<p>Analyseer daarna hoe het is misgegaan en pas je werkwijze aan zodat het niet opnieuw kan gebeuren.</p>

<h2>Checklist: dubbele boekingen vermijden</h2>
<ul>
  <li>iCal-synchronisatie ingesteld op alle platformen</li>
  <li>Centrale kalender als enige bron van waarheid</li>
  <li>Directe boekingen onmiddellijk ingevoerd in de kalender</li>
  <li>Schoonmaakdagen en persoonlijk gebruik geblokkeerd</li>
  <li>Maandelijkse controle of iCal-feeds nog werken</li>
  <li>Bevestigingsmail naar elke gast, zodat beide partijen dezelfde informatie hebben</li>
  <li>Telefoon- of WhatsApp-contacten direct omgezet in kalenderinvoer</li>
</ul>
<p>Met deze maatregelen verklein je het risico op dubbele boekingen tot bijna nul. De enige resterende risicofactor is de vertraging in iCal-synchronisatie bij extreem drukke periodes. Wie dat wil vermijden, schakelt tijdens de piekperiodes over op handmatige goedkeuring in plaats van directe booking, zodat je elke aanvraag controleert voor je bevestigt.</p>
    `,
  },
];
