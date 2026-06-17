import bcrypt from "bcrypt";

import { UserRepository }
from "../repositories/user.repository";

const repo =
 new UserRepository();

export async function loginUser(

 email:string,

 password:string

){

 const user =
   await repo.findByEmail(
      email
   );

 if(!user){

   throw Error(
     "Invalid credentials"
   );

 }

 const valid =
   await bcrypt.compare(
      password,
      user.passwordHash
   );

 if(!valid){

   throw Error(
      "Invalid credentials"
   );

 }

 return user;

}

interface RegisterOptions {
  email: string;
  username: string;
  password: string;
  sports?: string[];
  preferencesMode?: "default" | "custom";
  customThresholds?: Array<{
    name: string;
    temperatureMin: number;
    temperatureMax: number;
    humidityMax: number;
    windMax: number;
  }>;
  favoriteLocations?: Array<{ name: string; coordinates?: { lat: number; lon: number } }>;
}

export async function registerUser({
  email,
  username,
  password,
  sports,
  preferencesMode,
  customThresholds,
  favoriteLocations,
}: RegisterOptions) {
  const existingEmail = await repo.findByEmail(email);
  if (existingEmail) {
    throw new Error("Email already in use");
  }

  const existingUsername = await repo.findByUsername(username);
  if (existingUsername) {
    throw new Error("Username already in use");
  }

  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = await repo.create({
    email,
    username,
    passwordHash,
    role: "user",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLogin: new Date(),
  });

  if (sports && sports.length > 0) {
    const sportDefaults: Record<string, any> = {
      running: { temperatureMin: 10, temperatureMax: 30, humidityMax: 85, windMax: 25 },
      cycling: { temperatureMin: 12, temperatureMax: 35, humidityMax: 75, windMax: 30 },
      calisthenics: { temperatureMin: 15, temperatureMax: 32, humidityMax: 80, windMax: 20 },
      surf: { temperatureMin: 18, temperatureMax: 32, humidityMax: 90, windMax: 35 },
      kitesurf: { temperatureMin: 20, temperatureMax: 35, humidityMax: 85, windMax: 45 },
    };

    const thresholds = sports.map((s) => {
      if (preferencesMode === "custom" && customThresholds) {
        const custom = customThresholds.find((t) => t.name === s);
        if (custom) return custom;
      }
      return { name: s, ...sportDefaults[s] };
    });

    const UserPreference = (await import("../models/UserPreference")).default;
    await UserPreference.findOneAndUpdate(
      { userId: newUser._id },
      { sports: thresholds },
      { upsert: true }
    );
  }

  if (favoriteLocations && favoriteLocations.length > 0) {
    const FavoriteLocation = (await import("../models/FavoriteLocation")).default;
    await FavoriteLocation.insertMany(
      favoriteLocations.map((loc) => ({
        userId: newUser._id,
        name: loc.name,
        city: loc.name,
        ...(loc.coordinates
          ? { coordinates: { type: "Point", coordinates: [loc.coordinates.lon, loc.coordinates.lat] } }
          : {}),
      }))
    );
  }

  return newUser;
}