import arcjet, { fixedWindow } from "@arcjet/next";

export const aj = arcjet({
  key: process.env.ARCJET_KEY as string,
  characteristics: ["userId"],
  rules: [
    fixedWindow({
      mode: "LIVE",
      window: "10m",
      max: 10,
    }),
  ],
});
