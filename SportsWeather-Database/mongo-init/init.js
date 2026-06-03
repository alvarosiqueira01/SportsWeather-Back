// O MongoDB se conecta inicialmente ao banco definido em MONGO_INITDB_DATABASE
db = db.getSiblingDB('weather_app');

// 1. Criação do usuário da aplicação (item 5 do seu planejamento)
db.createUser({
  user: "weather_user",
  pwd: "weather_pass",
  roles: [
    {
      role: "readWrite",
      db: "weather_app"
    }
  ]
});

// 2. Criação de índices para a coleção 'users'
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });

// 3. Criação de índices para 'user_preferences'
db.user_preferences.createIndex({ userId: 1 }, { unique: true });

// 4. Criação de índice geoespacial para 'favorite_locations'
db.favorite_locations.createIndex({ coordinates: "2dsphere" });

// 5. Criação de índice TTL para 'weather_cache' (Expira em 1 hora)
db.weather_cache.createIndex({ timestamp: 1 }, { expireAfterSeconds: 3600 });

// 6. Criação de índices para 'weather_history'
db.weather_history.createIndex({ capturedAt: -1 });
db.weather_history.createIndex({ location: "2dsphere" });

// 7. Criação de índice TTL opcional para 'user_search_history' (Expira em ~180 dias)
db.user_search_history.createIndex({ searchedAt: 1 }, { expireAfterSeconds: 15552000 });

// 8. Criação de índice TTL para 'system_logs' (Expira em 30 dias)
db.system_logs.createIndex({ timestamp: 1 }, { expireAfterSeconds: 2592000 });

print("Inicialização do banco weather_app e criação de índices concluída com sucesso!");