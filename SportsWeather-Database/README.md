- Executando

Suba o banco:

docker compose up -d

Depois:

cd seed

npm install

npm run seed

- Testando

Entrar:

docker exec -it mongo-weather mongosh

Logar como admin:

use admin
db.auth("admin", "admin123")

Selecionar:

use weather_app

Verificar:

show collections
db.users.find()
db.weather_history.countDocuments()

Caso queira testar com a base vazia, mas foi dado populate:

docker compose down -v

docker compose up -d