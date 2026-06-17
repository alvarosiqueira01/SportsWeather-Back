import "dotenv/config";

import mongoose from "mongoose";

import bcrypt from "bcrypt";

const CITIES = [
  { name: "Fortaleza", lat: -3.717, lon: -38.504 },
  { name: "Rio de Janeiro", lat: -22.906, lon: -43.172 },
  { name: "São Paulo", lat: -23.550, lon: -46.633 },
  { name: "Recife", lat: -8.047, lon: -34.877 },
  { name: "Salvador", lat: -12.971, lon: -38.501 },
  { name: "Brasília", lat: -15.797, lon: -47.891 },
  { name: "Belo Horizonte", lat: -19.916, lon: -43.934 },
  { name: "Florianópolis", lat: -27.595, lon: -48.548 },
  { name: "Porto Alegre", lat: -30.034, lon: -51.217 },
  { name: "Curitiba", lat: -25.428, lon: -49.267 },
];

const FAVORITE_PLACES = [
  { name: "Praia de Copacabana", city: "Rio de Janeiro", lat: -22.971, lon: -43.182 },
  { name: "Parque Ibirapuera", city: "São Paulo", lat: -23.587, lon: -46.657 },
  { name: "Praia de Ipanema", city: "Rio de Janeiro", lat: -22.983, lon: -43.190 },
  { name: "Avenida Paulista", city: "São Paulo", lat: -23.561, lon: -46.656 },
  { name: "Praia de Boa Viagem", city: "Recife", lat: -8.126, lon: -34.901 },
  { name: "Orla de Salvador", city: "Salvador", lat: -12.980, lon: -38.468 },
  { name: "Lagoa da Conceição", city: "Florianópolis", lat: -27.604, lon: -48.462 },
  { name: "Parque da Cidade", city: "Brasília", lat: -15.788, lon: -47.882 },
  { name: "Praia do Futuro", city: "Fortaleza", lat: -3.731, lon: -38.448 },
  { name: "Beira-Mar Norte", city: "Florianópolis", lat: -27.594, lon: -48.546 },
  { name: "Copacabana (sem coord)", city: "Rio de Janeiro", lat: -22.971, lon: -43.182 },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI!);
  const db = mongoose.connection.db;
  const hash = await bcrypt.hash("123456", 10);

  // Clean collections
  const collections = ["users", "user_preferences", "favorite_locations", "weather_cache", "weather_history", "user_search_history", "generated_reports", "system_logs"];
  for (const col of collections) {
    await db.collection(col).deleteMany({});
  }

  // Users
  const users = await db.collection("users").insertMany([
    { email: "athlete@test.com", username: "runner", passwordHash: hash, role: "user", status: "active", createdAt: new Date() },
    { email: "admin@test.com", username: "admin", passwordHash: hash, role: "admin", status: "active", createdAt: new Date() },
    { email: "joao@test.com", username: "joaociclista", passwordHash: hash, role: "user", status: "active", createdAt: new Date() },
    { email: "maria@test.com", username: "mariasurfista", passwordHash: hash, role: "user", status: "active", createdAt: new Date() },
    { email: "pedro@test.com", username: "pedrocalistenico", passwordHash: hash, role: "user", status: "active", createdAt: new Date() },
  ]);

  const athleteId = users.insertedIds["0"];
  const adminId = users.insertedIds["1"];
  const joaoId = users.insertedIds["2"];
  const mariaId = users.insertedIds["3"];
  const pedroId = users.insertedIds["4"];

  // User preferences
  await db.collection("user_preferences").insertMany([
    { userId: athleteId, sports: [{ name: "running", temperatureMin: 18, temperatureMax: 28, humidityMax: 80, windMax: 20 }] },
    { userId: joaoId, sports: [{ name: "running", temperatureMin: 15, temperatureMax: 32, humidityMax: 85, windMax: 25 }, { name: "cycling", temperatureMin: 18, temperatureMax: 35, humidityMax: 70, windMax: 30 }] },
    { userId: mariaId, sports: [{ name: "surf", temperatureMin: 20, temperatureMax: 35, humidityMax: 90, windMax: 40 }, { name: "kitesurf", temperatureMin: 22, temperatureMax: 38, humidityMax: 85, windMax: 50 }] },
    { userId: pedroId, sports: [{ name: "calisthenics", temperatureMin: 16, temperatureMax: 30, humidityMax: 75, windMax: 15 }] },
  ]);

  // Favorite locations (points)
  const favDocs = FAVORITE_PLACES.map((p, i) => ({
    userId: [athleteId, joaoId, mariaId, pedroId][i % 4],
    name: p.name,
    city: p.city,
    coordinates: { type: "Point", coordinates: [p.lon, p.lat] },
  }));
  await db.collection("favorite_locations").insertMany(favDocs);

  // Favorite locations (routes)
  const routes = [
    { userId: athleteId, name: "Orla de Fortaleza", city: "Fortaleza", route: [[-38.504, -3.717], [-38.490, -3.722], [-38.470, -3.728], [-38.448, -3.731]] },
    { userId: joaoId, name: "Ciclovia Rio Pinheiros", city: "São Paulo", route: [[-46.700, -23.560], [-46.690, -23.570], [-46.680, -23.580], [-46.670, -23.590]] },
    { userId: mariaId, name: "Praias do Rio", city: "Rio de Janeiro", route: [[-43.182, -22.971], [-43.175, -22.977], [-43.170, -22.983], [-43.165, -22.990], [-43.160, -22.996]] },
  ];
  await db.collection("favorite_locations").insertMany(routes);

  // Weather cache for main cities
  const cacheDocs = CITIES.map((c) => ({
    lat: c.lat,
    lon: c.lon,
    provider: "openmeteo",
    timestamp: new Date(),
    temperature: 25 + Math.random() * 10,
    humidity: 60 + Math.random() * 30,
    windSpeed: 10 + Math.random() * 20,
  }));
  await db.collection("weather_cache").insertMany(cacheDocs);

  // Weather history for multiple locations
  const weatherDocs: any[] = [];
  for (const c of CITIES) {
    for (let i = 0; i < 20; i++) {
      const daysAgo = Math.floor(Math.random() * 60);
      weatherDocs.push({
        location: { type: "Point", coordinates: [c.lon, c.lat] },
        capturedAt: new Date(Date.now() - daysAgo * 86400000),
        temperature: 20 + Math.random() * 15,
        humidity: 50 + Math.random() * 40,
        wind: 5 + Math.random() * 25,
        provider: "openmeteo",
      });
    }
  }
  await db.collection("weather_history").insertMany(weatherDocs);

  // Search history
  await db.collection("user_search_history").insertMany([
    { userId: athleteId, query: { city: "Fortaleza", coordinates: [-38.504, -3.717] }, searchedAt: new Date() },
    { userId: athleteId, query: { city: "Praia do Futuro", coordinates: [-38.448, -3.731] }, searchedAt: new Date(Date.now() - 86400000) },
    { userId: joaoId, query: { city: "São Paulo", coordinates: [-46.633, -23.550] }, searchedAt: new Date() },
    { userId: mariaId, query: { city: "Rio de Janeiro", coordinates: [-43.172, -22.906] }, searchedAt: new Date() },
    { userId: pedroId, query: { city: "Brasília", coordinates: [-47.891, -15.797] }, searchedAt: new Date() },
  ]);

  // Reports
  await db.collection("generated_reports").insertMany([
    { userId: athleteId, type: "weekly-report", s3Key: "reports/week1.pdf", createdAt: new Date() },
    { userId: joaoId, type: "monthly-report", s3Key: "reports/joao-mensal.pdf", createdAt: new Date() },
  ]);

  // Log
  await db.collection("system_logs").insertOne({
    service: "seed", level: "info", message: "Database populated with full seed", timestamp: new Date(),
  });

  console.log("Database populated with full seed data");
  console.log("Users: athlete@test.com, joao@test.com, maria@test.com, pedro@test.com (all: 123456)");
  process.exit(0);
}

seed();
