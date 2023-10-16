# ZIT_blog

To je preprost projekt za upravljanje in objavljanje spletnega dnevnika ali bloga.

## Vzpostavitvena dokumentacija
- Prenesite projekt na svoj racunalnik z ukazom:
```bash
git clone git@github.com:rokrozman321/ZIT_blog.git
```
- Odprite terminal v mapi server in amestite vse potrebne module z ukazom:
```bash
npm install
```
- Isto storite v mapi client
- V mapi server ustvarite datoteko .env, ki naj zgleda takole:
```
PORT=
MONGODB_URL=
JWT_SECRET=
```
- Odprite terminal v mapi server in vpisite ukaz da pozenete server
```bash
npm start
```
- Odprite terminal v mapi client in vpisite ukaz za pogon vmesnika
```bash
npm start
```
- Ko koncate s temi koraki se vam avtomatsko odpre nov zavihek z vmenikom in lahko pricnete z uporabo projekta.

## Funkcionalnosti

- Dodajanje novega uporabnika 
- Vpis uporabnika
- Izpis uporabnika
- Ustvarjanje objav
- Urejanje obstojece objave
- Brisanje objav
- Vseckanje objav
- Komentiranje objav
- Filtriranje prikaza objav
- Brisanje komentarjev
- Vseckanje komentarjev
